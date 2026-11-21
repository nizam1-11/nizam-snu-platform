import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { releaseAssets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Real installer fallback. Used when there is no published R2 release, the
// requested asset does not exist, or the database is unavailable.
const DIRECT_DOWNLOAD_URL =
  "https://github.com/nizam1-11/snu-automation-releases/releases/latest/download/SNU-Automation-Setup-2.6.10.exe";

// GET /api/download/[assetId] — public lookup + 302 redirect to the asset URL
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;

    // Stable alias: never touches the DB, always serves the real installer.
    if (assetId === "direct") {
      return NextResponse.redirect(new URL(DIRECT_DOWNLOAD_URL, request.url), 302);
    }

    const db = await getDbAsync();
    if (!db) {
      // A DB failure must never block the download — serve the real installer.
      return NextResponse.redirect(new URL(DIRECT_DOWNLOAD_URL, request.url), 302);
    }

    const rows = await db
      .select()
      .from(releaseAssets)
      .where(eq(releaseAssets.id, assetId))
      .limit(1);
    const asset = rows[0];

    // A real asset explicitly marked unavailable is respected (404, no redirect).
    if (asset && asset.isAvailable === false) {
      return NextResponse.json(
        { error: "Asset not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // No published release for this id — give the user the real installer instead of a 404.
    if (!asset) {
      return NextResponse.redirect(new URL(DIRECT_DOWNLOAD_URL, request.url), 302);
    }

    // Increment the real download counter (best-effort; never block the download).
    try {
      await db
        .update(releaseAssets)
        .set({ downloadCount: (asset.downloadCount || 0) + 1 })
        .where(eq(releaseAssets.id, assetId));
    } catch (counterError) {
      console.error("Download counter update failed:", counterError);
    }

    // Works for absolute URLs (GitHub/R2) and for relative /api/files/... paths.
    return NextResponse.redirect(new URL(asset.downloadUrl, request.url), 302);
  } catch (error) {
    console.error("Download lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
