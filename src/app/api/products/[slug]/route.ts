import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { products, productScreenshots, releases, releaseAssets } from "@/lib/db/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

type Ctx = { params: Promise<{ slug: string }> };

// Resolves either a slug or a UUID id so public pages and admin share one route.
async function findProduct(db: any, key: string) {
  const rows = await db
    .select()
    .from(products)
    .where(or(eq(products.slug, key), eq(products.id, key)))
    .limit(1);
  return rows[0] ?? null;
}

// GET /api/products/[slug] — public product detail (also accepts id)
export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const { slug } = await params;
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }

    const product = await findProduct(db, slug);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const screenshots = await db
      .select()
      .from(productScreenshots)
      .where(eq(productScreenshots.productId, product.id));

    const productReleases = await db
      .select()
      .from(releases)
      .where(eq(releases.productId, product.id))
      .orderBy(desc(releases.releaseDate));

    const releasesWithAssets = await Promise.all(
      productReleases.map(async (release: any) => {
        const assets = await db
          .select()
          .from(releaseAssets)
          .where(eq(releaseAssets.releaseId, release.id));
        return { ...release, assets };
      })
    );

    return NextResponse.json({
      product: { ...product, screenshots, releases: releasesWithAssets },
    });
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[slug] — admin only; accepts slug or id
export async function PUT(request: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { slug } = await params;
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

    const existing = await findProduct(db, slug);
    if (!existing) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    const now = new Date().toISOString();
    const updateObj: Record<string, any> = {};
    for (const key of [
      "slug",
      "name",
      "tagline",
      "description",
      "longDescription",
      "logoUrl",
      "heroBannerUrl",
      "category",
      "documentationUrl",
      "supportInfo",
      "licenseType",
    ]) {
      if (key in body) updateObj[key] = body[key];
    }
    for (const key of ["features", "systemRequirements", "supportedPlatforms"]) {
      if (key in body) {
        updateObj[key] = typeof body[key] === "string" ? body[key] : JSON.stringify(body[key]);
      }
    }
    if ("isFeatured" in body) updateObj.isFeatured = Boolean(body.isFeatured);
    if ("status" in body) updateObj.status = body.status;
    if ("publishedAt" in body) {
      updateObj.publishedAt = body.publishedAt;
    } else if ("status" in body) {
      updateObj.publishedAt = body.status === "published" ? now : null;
    }
    updateObj.updatedAt = now;

    await db.update(products).set(updateObj).where(eq(products.id, existing.id));
    const updated = await db.select().from(products).where(eq(products.id, existing.id)).limit(1);
    return NextResponse.json({ ok: true, item: updated[0] ?? null });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[slug] — admin only; accepts slug or id
export async function DELETE(request: NextRequest, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const { slug } = await params;
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const existing = await findProduct(db, slug);
    if (!existing) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    await db.delete(products).where(eq(products.id, existing.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
