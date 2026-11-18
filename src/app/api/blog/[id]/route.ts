import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/blog/[id] — Get a single blog post (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { id } = await params;
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }

    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    return NextResponse.json({ post: rows[0] ?? null });
  } catch (error) {
    console.error("Blog detail error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] — Update a blog post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { id } = await params;

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }

    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }

    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updateObj: Record<string, any> = {};

    for (const key of [
      "slug",
      "title",
      "excerpt",
      "content",
      "coverImageUrl",
      "category",
      "authorId",
      "seoTitle",
      "seoDescription",
      "ogImageUrl",
    ]) {
      if (key in body) updateObj[key] = body[key];
    }
    if ("tags" in body) {
      updateObj.tags = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags);
    }
    if ("readingTime" in body) updateObj.readingTime = body.readingTime;
    if ("status" in body) updateObj.status = body.status;

    if ("publishedAt" in body) {
      updateObj.publishedAt = body.publishedAt;
    } else if ("status" in body) {
      if (body.status === "published") updateObj.publishedAt = now;
      else if (body.status === "draft") updateObj.publishedAt = null;
    }

    updateObj.updatedAt = now;

    await db.update(blogPosts).set(updateObj).where(eq(blogPosts.id, id));

    const updated = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    return NextResponse.json({ ok: true, item: updated[0] ?? null });
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] — Delete a blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { id } = await params;
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }

    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
