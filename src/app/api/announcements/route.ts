import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/announcements — List published announcements (public); admin=1 lists all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "1";
    if (isAdmin) {
      const guard = await requireAdmin(request);
      if (guard) return guard;
    }
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || (isAdmin ? "100" : "20"));

    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const results = await db
      .select()
      .from(announcements)
      .where(isAdmin ? undefined : eq(announcements.isPublished, true))
      .orderBy(desc(announcements.publishedAt))
      .limit(limit);

    const filtered = category
      ? results.filter((a: any) => a.category === category)
      : results;

    return NextResponse.json({ announcements: filtered });
  } catch (error) {
    console.error("Announcements list error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// POST /api/admin/announcements — Create announcement (admin only)
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
    const isPublished = body.isPublished === true;

    await db.insert(announcements).values({
      id,
      slug: body.slug,
      title: body.title,
      content: body.content,
      category: body.category || "announcement",
      coverImageUrl: body.coverImageUrl,
      relatedProductId: body.relatedProductId,
      version: body.version,
      isPublished,
      publishedAt: isPublished ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id, message: "Announcement created" }, { status: 201 });
  } catch (error) {
    console.error("Announcement create error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}