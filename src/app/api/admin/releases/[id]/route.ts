import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { releases, releaseAssets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

type Ctx = { params: Promise<{ id: string }> };

const RELEASE_FIELDS = [
  "productId",
  "version",
  "releaseNotes",
  "changelog",
  "status",
  "releaseDate",
] as const;

const ASSET_FIELDS = [
  "platform",
  "architecture",
  "fileType",
  "downloadUrl",
  "fileSize",
  "sha256",
  "minOsVersion",
] as const;

function errorResponse(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

// GET /api/admin/releases/[id] — single release with assets (admin only)
export async function GET(request: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { id } = await params;
    const db = await getDbAsync();
    if (!db) return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
    const rows = await db.select().from(releases).where(eq(releases.id, id)).limit(1);
    if (!rows[0]) return errorResponse("Release not found", "NOT_FOUND", 404);
    const assets = await db.select().from(releaseAssets).where(eq(releaseAssets.releaseId, id));
    return NextResponse.json({ ...rows[0], assets });
  } catch (error) {
    console.error("Release fetch error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// PUT /api/admin/releases/[id] — update a release (and optionally its first asset)
export async function PUT(request: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let db: Awaited<ReturnType<typeof getDbAsync>>;
  try {
    db = await getDbAsync();
  } catch (error) {
    console.error("Releases DB init error:", error);
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }
  if (!db) {
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }

  try {
    const { id } = await params;

    let body: any;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", "INVALID_BODY", 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse("Invalid request body", "INVALID_BODY", 400);
    }

    const existing = await db
      .select()
      .from(releases)
      .where(eq(releases.id, id))
      .limit(1);
    if (existing.length === 0) {
      return errorResponse("Release not found", "NOT_FOUND", 404);
    }

    const now = new Date().toISOString();
    const releaseUpdate: Record<string, any> = {};
    for (const key of RELEASE_FIELDS) {
      if (key in body) releaseUpdate[key] = body[key];
    }
    if ("isLatest" in body) releaseUpdate.isLatest = Boolean(body.isLatest);
    releaseUpdate.updatedAt = now;

    await db.update(releases).set(releaseUpdate).where(eq(releases.id, id));

    // Optionally update the first asset belonging to this release.
    if (ASSET_FIELDS.some((key) => key in body)) {
      const assetRows = await db
        .select()
        .from(releaseAssets)
        .where(eq(releaseAssets.releaseId, id))
        .limit(1);
      const asset = assetRows[0];
      if (asset) {
        const assetUpdate: Record<string, any> = {};
        for (const key of ASSET_FIELDS) {
          if (key in body) {
            assetUpdate[key] = key === "fileSize" ? Number(body[key]) || null : body[key];
          }
        }
        await db
          .update(releaseAssets)
          .set(assetUpdate)
          .where(eq(releaseAssets.id, asset.id));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Release update error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// DELETE /api/admin/releases/[id] — delete a release and its assets (admin only)
export async function DELETE(request: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let db: Awaited<ReturnType<typeof getDbAsync>>;
  try {
    db = await getDbAsync();
  } catch (error) {
    console.error("Releases DB init error:", error);
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }
  if (!db) {
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }

  try {
    const { id } = await params;

    const existing = await db
      .select()
      .from(releases)
      .where(eq(releases.id, id))
      .limit(1);
    if (existing.length === 0) {
      return errorResponse("Release not found", "NOT_FOUND", 404);
    }

    // Cascade may be enforced by D1, but delete explicitly to be safe.
    await db.delete(releaseAssets).where(eq(releaseAssets.releaseId, id));
    await db.delete(releases).where(eq(releases.id, id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Release delete error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
