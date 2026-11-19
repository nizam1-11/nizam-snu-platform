import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { releases, releaseAssets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

function errorResponse(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

// GET /api/admin/releases — list every release with its assets (admin only)
export async function GET(request: NextRequest) {
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
    const rows = await db.select().from(releases).orderBy(desc(releases.createdAt));

    const withAssets = await Promise.all(
      rows.map(async (release: any) => {
        const assets = await db
          .select()
          .from(releaseAssets)
          .where(eq(releaseAssets.releaseId, release.id));
        return { ...release, assets };
      })
    );

    return NextResponse.json({ releases: withAssets });
  } catch (error) {
    console.error("Releases read error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// POST /api/admin/releases — create a release (and optionally one asset)
export async function POST(request: NextRequest) {
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

  let body: any;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", "INVALID_BODY", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Invalid request body", "INVALID_BODY", 400);
  }

  for (const field of ["productId", "version", "downloadUrl"]) {
    if (typeof body[field] !== "string" || body[field].trim() === "") {
      return errorResponse(`Missing or invalid ${field}`, "VALIDATION_ERROR", 400);
    }
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await db.insert(releases).values({
      id,
      productId: body.productId,
      version: body.version,
      releaseDate: now,
      releaseNotes: body.releaseNotes ?? null,
      changelog: body.changelog ?? null,
      status: body.status || "stable",
      isLatest: Boolean(body.isLatest),
      createdAt: now,
      updatedAt: now,
    });

    let assetId: string | null = null;
    if (body.platform && body.downloadUrl) {
      assetId = crypto.randomUUID();
      await db.insert(releaseAssets).values({
        id: assetId,
        releaseId: id,
        platform: body.platform,
        architecture: body.architecture ?? null,
        fileType: body.fileType ?? null,
        fileSize: Number(body.fileSize) || null,
        downloadUrl: body.downloadUrl,
        sha256: body.sha256 ?? null,
        minOsVersion: body.minOsVersion ?? null,
        isAvailable: true,
        createdAt: now,
      });
    }

    return NextResponse.json(
      {
        id,
        releaseId: id,
        assetId,
        message: "Release created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Release create error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
