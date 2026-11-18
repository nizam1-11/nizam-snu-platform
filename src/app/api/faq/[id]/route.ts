import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { faqs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/faq/[id] — Get a single FAQ (admin only)
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
      .from(faqs)
      .where(eq(faqs.id, id))
      .limit(1);

    return NextResponse.json({ faq: rows[0] ?? null });
  } catch (error) {
    console.error("FAQ detail error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// PUT /api/faq/[id] — Update a FAQ (admin only)
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
      .from(faqs)
      .where(eq(faqs.id, id))
      .limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const updateObj: Record<string, any> = {};

    for (const key of ["question", "answer", "category"]) {
      if (key in body) updateObj[key] = body[key];
    }
    if ("sortOrder" in body) updateObj.sortOrder = body.sortOrder;
    if ("isPublished" in body) updateObj.isPublished = Boolean(body.isPublished);

    updateObj.updatedAt = new Date().toISOString();

    await db.update(faqs).set(updateObj).where(eq(faqs.id, id));

    const updated = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, id))
      .limit(1);

    return NextResponse.json({ ok: true, item: updated[0] ?? null });
  } catch (error) {
    console.error("FAQ update error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE /api/faq/[id] — Delete a FAQ (admin only)
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
      .from(faqs)
      .where(eq(faqs.id, id))
      .limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FAQ delete error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
