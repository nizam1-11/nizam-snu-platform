import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Resolve the real installer URL at request time from GitHub's latest release.
// Never hardcode a version/filename — match the asset by name pattern instead.
const GITHUB_API =
  "https://api.github.com/repos/nizam1-11/snu-automation-releases/releases/latest";
// Fallback only if the GitHub API fails: a pinned known-good current asset.
const FALLBACK_URL =
  "https://github.com/nizam1-11/snu-automation-releases/releases/download/v2.6.11/SNU-Automation-Setup-2.6.11.exe";

async function resolveInstallerUrl(): Promise<string> {
  try {
    const res = await fetch(GITHUB_API, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "snu-portfolio" },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) return FALLBACK_URL;
    const data: any = await res.json();
    const assets: any[] = Array.isArray(data?.assets) ? data.assets : [];
    const exe = assets.find(
      (a) =>
        typeof a?.name === "string" &&
        /^SNU-Automation-Setup-.*\.exe$/i.test(a.name) &&
        !/blockmap/i.test(a.name)
    );
    if (exe?.browser_download_url) return exe.browser_download_url;
    return FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

// Real download counter is stored in the settings key/value table; the display
// base is added by the public stats endpoint (see /api/stats/downloads).
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

// GET /api/download/direct — 302 straight to the real installer, works with zero releases.
// URL resolution is DB-independent; counting is best-effort and never blocks the download.
export async function GET(request: NextRequest) {
  try {
    const db = await getDbAsync();
    if (db) await bumpDownloadCount(db);
  } catch (e) {
    console.error("counter init failed", e);
  }
  const url = await resolveInstallerUrl();
  return NextResponse.redirect(new URL(url, request.url), 302);
}
