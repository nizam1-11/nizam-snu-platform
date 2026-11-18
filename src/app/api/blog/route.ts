import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { blogPosts, blogCategories } from "@/lib/db/schema";
import { eq, desc, like, and } from "drizzle-orm";

// GET /api/blog — List published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const conditions = [eq(blogPosts.status, "published")];
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

    return NextResponse.json({ posts: results, page, limit });
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
      status: "draft",
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