import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/announcements — List published announcements (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    const db = getDb();
    const results = await db
      .select()
      .from(announcements)
      .where(eq(announcements.isPublished, true))
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
  try {
    const body = await request.json();
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.insert(announcements).values({
      id,
      slug: body.slug,
      title: body.title,
      content: body.content,
      category: body.category || "announcement",
      coverImageUrl: body.coverImageUrl,
      relatedProductId: body.relatedProductId,
      version: body.version,
      isPublished: false,
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