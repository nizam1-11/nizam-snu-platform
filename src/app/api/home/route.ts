import { NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { products, projects, settings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCached, setCached } from "@/lib/server-cache";

const DOWNLOAD_COUNT_KEY = "download_count";
const DISPLAY_BASE = 1000;
const cacheKey = "home:public";
const publicHeaders = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };

// GET /api/home — Single consolidated public payload for the home page.
// Returns { products, projects, downloads } so the client needs only ONE
// HTTP connection instead of four on mount. Best-effort: a failed sub-query
// falls back to empty data rather than failing the whole endpoint.
export async function GET() {
  try {
    const hit = getCached<any>(cacheKey);
    if (hit) return NextResponse.json(hit, { headers: publicHeaders });

    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }

    // Published products only — exact filter/order/limit from /api/products.
    // Home does not render releases/assets, so skip that lookup entirely.
    let productRows: any[] = [];
    try {
      productRows = await db
        .select()
        .from(products)
        .where(eq(products.status, "published"))
        .orderBy(desc(products.isFeatured), desc(products.publishedAt))
        .limit(20)
        .offset(0);
    } catch (error) {
      console.error("Home: products query failed:", error);
    }

    // Published projects only — exact filter/order/limit from /api/projects.
    let projectRows: any[] = [];
    try {
      projectRows = await db
        .select()
        .from(projects)
        .where(eq(projects.isPublished, true))
        .orderBy(desc(projects.isFeatured), desc(projects.publishedAt))
        .limit(20)
        .offset(0);
    } catch (error) {
      console.error("Home: projects query failed:", error);
    }

    // Real download count + display base — exact logic from /api/stats/downloads.
    let downloads = { real: 0, display: DISPLAY_BASE };
    try {
      const rows = await db
        .select()
        .from(settings)
        .where(eq(settings.key, DOWNLOAD_COUNT_KEY))
        .limit(1);
      const real = Number(rows[0]?.value ?? 0) || 0;
      downloads = { real, display: DISPLAY_BASE + real };
    } catch (error) {
      console.error("Home: downloads query failed:", error);
    }

    const payload = {
      products: productRows,
      projects: projectRows,
      downloads,
    };

    setCached(cacheKey, payload);
    return NextResponse.json(payload, { headers: publicHeaders });
  } catch (error) {
    console.error("Home aggregate error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
