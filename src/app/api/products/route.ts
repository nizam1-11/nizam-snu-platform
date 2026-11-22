import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { productSchema } from "@/lib/validators/product";
import { getDbAsync } from "@/lib/db";
import { products, productScreenshots, releases, releaseAssets } from "@/lib/db/schema";
import { eq, desc, like, and, inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

// GET /api/products — List published products (public); admin=1 lists all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "1";
    if (isAdmin) {
      const guard = await requireAdmin(request);
      if (guard) return guard;
    }
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || (isAdmin ? "100" : "20"));
    const offset = (page - 1) * limit;

    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }

    // Build query conditions (admins see drafts + published; public sees published only)
    const conditions = isAdmin ? [] : [eq(products.status, "published")];
    if (category && category !== "all") {
      conditions.push(eq(products.category, category));
    }
    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }

    const results = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.isFeatured), desc(products.publishedAt))
      .limit(limit)
      .offset(offset);

    // Best-effort: attach releases (with assets) so the client needs only ONE
    // request instead of N per-product detail fetches. If the release lookup
    // fails, still return the products with empty releases — never break the listing.
    const byProduct = new Map<string, any[]>();
    try {
      const ids = results.map((p: any) => p.id);
      if (ids.length > 0) {
        const rels = await db
          .select()
          .from(releases)
          .where(inArray(releases.productId, ids))
          .orderBy(desc(releases.releaseDate));
        const assets = rels.length
          ? await db
              .select()
              .from(releaseAssets)
              .where(inArray(releaseAssets.releaseId, rels.map((r: any) => r.id)))
          : [];

        for (const r of rels) {
          const list = byProduct.get(r.productId) || [];
          list.push({ ...r, assets: assets.filter((a: any) => a.releaseId === r.id) });
          byProduct.set(r.productId, list);
        }
      }
    } catch (releaseError) {
      console.error("Products list: releases lookup failed:", releaseError);
      // Fall back to empty releases for all products.
    }

    return NextResponse.json(
      {
        products: results.map((p: any) => ({
          ...p,
          releases: byProduct.get(p.id) || [],
        })),
        page,
        limit,
      },
      {
        headers: {
          "Cache-Control": isAdmin
            ? "no-store"
            : "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Products list error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products — Create product (admin only)
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    // TODO: Check auth session + admin role
    // const session = await auth.api.getSession({ headers: request.headers });
    // if (!session || session.user.role !== "admin") { return 403 }

    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", code: "VALIDATION_ERROR", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;
    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const status = body.status === "published" ? "published" : "draft";

    await db.insert(products).values({
      id,
      slug: data.slug,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      longDescription: data.longDescription,
      category: data.category,
      features: JSON.stringify(data.features),
      systemRequirements: data.systemRequirements ? JSON.stringify(data.systemRequirements) : null,
      supportedPlatforms: JSON.stringify(data.supportedPlatforms),
      installationGuide: data.installationGuide,
      documentationUrl: data.documentationUrl || null,
      supportInfo: data.supportInfo,
      licenseType: data.licenseType,
      isFeatured: data.isFeatured,
      status,
      publishedAt: status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id, message: "Product created" }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}