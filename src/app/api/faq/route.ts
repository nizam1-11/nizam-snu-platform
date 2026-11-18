import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { faqs } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/faq — List published FAQs (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const conditions = [eq(faqs.isPublished, true)];
    if (category) {
      conditions.push(eq(faqs.category, category));
    }

    const results = await db
      .select()
      .from(faqs)
      .where(eq(faqs.isPublished, true))
      .orderBy(asc(faqs.sortOrder), asc(faqs.createdAt));

    // Filter by category if provided
    const filtered = category
      ? results.filter((f: any) => f.category === category)
      : results;

    return NextResponse.json({ faqs: filtered });
  } catch (error) {
    console.error("FAQ list error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// POST /api/admin/faq — Create FAQ (admin only)
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

    await db.insert(faqs).values({
      id,
      question: body.question,
      answer: body.answer,
      category: body.category || "general",
      sortOrder: body.sortOrder || 0,
      isPublished: body.isPublished ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id, message: "FAQ created" }, { status: 201 });
  } catch (error) {
    console.error("FAQ create error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}