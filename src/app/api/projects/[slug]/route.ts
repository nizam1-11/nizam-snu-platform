import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

type Ctx = { params: Promise<{ slug: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function dbUnavailable() {
  return NextResponse.json(
    { error: "Database unavailable", code: "DB_UNAVAILABLE" },
    { status: 503 }
  );
}

// GET /api/projects/[slug] — public detail by slug (published only);
// by id (UUID) it requires admin auth so drafts can be edited in admin.
export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const { slug: key } = await params;
    const byId = UUID_RE.test(key);
    if (byId) {
      const guard = await requireAdmin(request);
      if (guard) return guard;
    }
    const db = await getDbAsync();
    if (!db) return dbUnavailable();

    const where = byId
      ? eq(projects.id, key)
      : and(eq(projects.slug, key), eq(projects.isPublished, true));
    const rows = await db.select().from(projects).where(where).limit(1);
    if (!rows[0]) {
      return NextResponse.json(
        { error: "Project not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }
    return NextResponse.json({ project: rows[0] });
  } catch (error) {
    console.error("Project detail error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[slug] — admin only; accepts slug or id.
export async function PUT(request: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { slug: key } = await params;
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
    if (!db) return dbUnavailable();

    const existing = await db
      .select()
      .from(projects)
      .where(or(eq(projects.id, key), eq(projects.slug, key)))
      .limit(1);
    if (!existing[0]) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    const now = new Date().toISOString();
    const updateObj: Record<string, any> = {};
    for (const k of [
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
      if (k in body) updateObj[k] = body[k];
    }
    for (const k of ["techStack", "features"]) {
      if (k in body) {
        updateObj[k] = typeof body[k] === "string" ? body[k] : JSON.stringify(body[k]);
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

    await db.update(projects).set(updateObj).where(eq(projects.id, existing[0].id));
    const updated = await db
      .select()
      .from(projects)
      .where(eq(projects.id, existing[0].id))
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

// DELETE /api/projects/[slug] — admin only; accepts slug or id.
export async function DELETE(request: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { slug: key } = await params;
    const db = await getDbAsync();
    if (!db) return dbUnavailable();
    const existing = await db
      .select()
      .from(projects)
      .where(or(eq(projects.id, key), eq(projects.slug, key)))
      .limit(1);
    if (!existing[0]) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    await db.delete(projects).where(eq(projects.id, existing[0].id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
