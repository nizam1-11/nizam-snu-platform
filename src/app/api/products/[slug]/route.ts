import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products, productScreenshots, releases, releaseAssets } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET /api/products/[slug] — Get product detail (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = getDb();

    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .get();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // Get screenshots
    const screenshots = await db
      .select()
      .from(productScreenshots)
      .where(eq(productScreenshots.productId, product.id));

    // Get releases with assets
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
      product: {
        ...product,
        screenshots,
        releases: releasesWithAssets,
      },
    });
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] — Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const db = getDb();

    const existing = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    await db
      .update(products)
      .set({
        ...body,
        updatedAt: now,
      })
      .where(eq(products.id, existing.id));

    return NextResponse.json({ message: "Product updated" });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] — Archive product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = getDb();

    await db
      .update(products)
      .set({ status: "archived", updatedAt: new Date().toISOString() })
      .where(eq(products.slug, slug));

    return NextResponse.json({ message: "Product archived" });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}