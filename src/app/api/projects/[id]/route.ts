import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/projects/[id] — Get a single project (admin only)
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
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return NextResponse.json({ project: rows[0] ?? null });
  } catch (error) {
    console.error("Project detail error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] — Update a project (admin only)
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
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updateObj: Record<string, any> = {};

    for (const key of [
      "slug",
      "title",
      "description",
      "longDescription",
      "coverImageUrl",
      "demoVideoUrl",
      "category",
      "status",
      "projectUrl",
      "githubUrl",
    ]) {
      if (key in body) updateObj[key] = body[key];
    }
    for (const key of ["techStack", "features"]) {
      if (key in body) {
        updateObj[key] = typeof body[key] === "string" ? body[key] : JSON.stringify(body[key]);
      }
    }
    if ("isFeatured" in body) updateObj.isFeatured = Boolean(body.isFeatured);
    if ("isPublished" in body) updateObj.isPublished = Boolean(body.isPublished);

    if ("publishedAt" in body) {
      updateObj.publishedAt = body.publishedAt;
    } else if ("isPublished" in body) {
      updateObj.publishedAt = body.isPublished ? now : null;
    }

    updateObj.updatedAt = now;

    await db.update(projects).set(updateObj).where(eq(projects.id, id));

    const updated = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return NextResponse.json({ ok: true, item: updated[0] ?? null });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] — Delete a project (admin only)
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
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
