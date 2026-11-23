import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { blogPosts, blogCategories } from "@/lib/db/schema";
import { eq, desc, like, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import { getCached, setCached } from "@/lib/server-cache";

// GET /api/blog — List published blog posts (public); admin=1 lists all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "1";
    const cacheKey = `blog:${request.nextUrl.search}`;
    if (isAdmin) {
      const guard = await requireAdmin(request);
      if (guard) return guard;
    }
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || (isAdmin ? "100" : "10"));
    const offset = (page - 1) * limit;

    const publicHeaders = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };

    if (!isAdmin) {
      const hit = getCached<any>(cacheKey);
      if (hit) return NextResponse.json(hit, { headers: publicHeaders });
    }

    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const conditions = isAdmin ? [] : [eq(blogPosts.status, "published")];
    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }
    if (search) {
      conditions.push(like(blogPosts.title, `%${search}%`));
    }

    const results = await db
      .select()
      .from(blogPosts)
      .where(and(...conditions))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset);

    const payload = { posts: results, page, limit };
    if (!isAdmin) setCached(cacheKey, payload);
    return NextResponse.json(payload, {
      headers: isAdmin ? { "Cache-Control": "no-store" } : publicHeaders,
    });
  } catch (error) {
    console.error("Blog list error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog — Create blog post (admin only)
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const body = await request.json();
    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Calculate reading time (rough estimate: 200 words/min)
    const wordCount = (body.content || "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    const status = body.status === "published" ? "published" : "draft";

    await db.insert(blogPosts).values({
      id,
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      coverImageUrl: body.coverImageUrl,
      category: body.category,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      authorId: body.authorId,
      status,
      publishedAt: status === "published" ? now : null,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      ogImageUrl: body.ogImageUrl,
      readingTime,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id, message: "Blog post created" }, { status: 201 });
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
