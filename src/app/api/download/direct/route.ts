import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Stable internal direct-download link. No DB lookup — always serves the real installer.
const DIRECT_DOWNLOAD_URL =
  "https://github.com/nizam1-11/snu-automation-releases/releases/latest/download/SNU-Automation-Setup-2.6.10.exe";

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
// Counting is best-effort: a DB failure never blocks the download.
export async function GET(request: NextRequest) {
  try {
    const db = await getDbAsync();
    if (db) await bumpDownloadCount(db);
  } catch (e) {
    console.error("counter init failed", e);
  }
  return NextResponse.redirect(new URL(DIRECT_DOWNLOAD_URL, request.url), 302);
}
