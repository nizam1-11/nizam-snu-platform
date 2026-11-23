import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getCached, setCached } from "@/lib/server-cache";

const DOWNLOAD_COUNT_KEY = "download_count";
const DISPLAY_BASE = 1000;

// GET /api/stats/downloads — PUBLIC read of the real download count.
// Returns the stored real count plus a display base for the admin/dashboard.
export async function GET(request: NextRequest) {
  try {
    const cacheKey = `downloads:${request.nextUrl.search}`;
    const publicHeaders = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };

    const hit = getCached<any>(cacheKey);
    if (hit) return NextResponse.json(hit, { headers: publicHeaders });

    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ real: 0, display: DISPLAY_BASE });
    }

    const rows = await db
      .select()
      .from(settings)
      .where(eq(settings.key, DOWNLOAD_COUNT_KEY))
      .limit(1);
    const real = Number(rows[0]?.value ?? 0) || 0;

    const payload = { real, display: DISPLAY_BASE + real };
    setCached(cacheKey, payload);
    return NextResponse.json(payload, { headers: publicHeaders });
  } catch (error) {
    console.error("Download stats read error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
