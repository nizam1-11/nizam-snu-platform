import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { releaseAssets, settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getLatestRelease } from "@/lib/github-latest";

// Resolve the real installer URL at request time from GitHub's stable atom feed.
// Used when there is no published R2 release, the requested asset does not
// exist, or the database is unavailable. No GitHub API call (rate-limited).
const FALLBACK_URL =
  "https://github.com/nizam1-11/snu-automation-releases/releases/download/v2.6.15/SNU-Automation-Setup-2.6.15.exe";

async function resolveInstallerUrl(): Promise<string> {
  const latest = await getLatestRelease("automation");
  return latest?.url ?? FALLBACK_URL;
}

// Global counter key stored in the settings key/value table. The public stats
// endpoint adds DISPLAY_BASE (1000) to this real count when displaying it.
const DOWNLOAD_COUNT_KEY = "download_count";

async function bumpDownloadCount(db: any) {
  try {
    const rows = await db
      .select()
      .from(settings)
      .where(eq(settings.key, DOWNLOAD_COUNT_KEY))
      .limit(1);
    const current = Number(rows[0]?.value ?? 0) || 0;
    const next = String(current + 1);
    const now = new Date().toISOString();
    if (rows[0]) {
      await db
        .update(settings)
        .set({ value: next, updatedAt: now })
        .where(eq(settings.key, DOWNLOAD_COUNT_KEY));
    } else {
      await db
        .insert(settings)
        .values({ key: DOWNLOAD_COUNT_KEY, value: next, updatedAt: now });
    }
  } catch (e) {
    console.error("counter failed", e);
  }
}

// GET /api/download/[assetId] — public lookup + 302 redirect to the asset URL
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;

    // Stable alias: always serves the real installer. Count it like any other
    // download (best-effort) — a DB failure must never block the redirect.
    if (assetId === "direct") {
      try {
        const aliasDb = await getDbAsync();
        if (aliasDb) await bumpDownloadCount(aliasDb);
      } catch (e) {
        console.error("counter init failed", e);
      }
      const url = await resolveInstallerUrl();
      return NextResponse.redirect(new URL(url, request.url), 302);
    }

    const db = await getDbAsync();
    if (!db) {
      // A DB failure must never block the download — serve the real installer.
      // Still attempt a best-effort count via a fresh handle in case the first
      // lookup was transiently unavailable.
      try {
        const fallbackDb = await getDbAsync();
        if (fallbackDb) await bumpDownloadCount(fallbackDb);
      } catch (e) {
        console.error("counter init failed", e);
      }
      const url = await resolveInstallerUrl();
      return NextResponse.redirect(new URL(url, request.url), 302);
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
      await bumpDownloadCount(db);
      const url = await resolveInstallerUrl();
      return NextResponse.redirect(new URL(url, request.url), 302);
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

    // Also count this download in the global counter read by /api/stats/downloads.
    await bumpDownloadCount(db);

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
