import { MetadataRoute } from "next";
import { and, eq } from "drizzle-orm";
import { getDbAsync } from "@/lib/db";
import { blogPosts, products, projects } from "@/lib/db/schema";

const FALLBACK_URL =
  "https://nizam-snu-platform.nizam-snu-platform.workers.dev";

/** Never fabricate a date: use the real DB timestamp, default only if absent/invalid. */
function toDate(value: string | null | undefined): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || FALLBACK_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/showcase`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/download`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/whats-new`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Legal pages
  const legalPages: MetadataRoute.Sitemap = [
    "privacy",
    "terms",
    "cookies",
    "disclaimer",
    "eula",
    "refund",
    "download-policy",
    "ip",
    "acceptable-use",
    "third-party",
    "security-reporting",
  ].map((page) => ({
    url: `${baseUrl}/legal/${page}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const staticList: MetadataRoute.Sitemap = [...staticPages, ...legalPages];

  // DB is optional at build/edge time — never let it break the sitemap.
  let db: any;
  try {
    db = await getDbAsync();
  } catch {
    return staticList;
  }
  if (!db) return staticList;

  try {
    const [publishedPosts, publishedProducts, publishedProjects] = await Promise.all([
      db
        .select({
          slug: blogPosts.slug,
          updatedAt: blogPosts.updatedAt,
          publishedAt: blogPosts.publishedAt,
        })
        .from(blogPosts)
        .where(and(eq(blogPosts.status, "published"))),
      db
        .select({
          slug: products.slug,
          updatedAt: products.updatedAt,
          publishedAt: products.publishedAt,
        })
        .from(products)
        .where(eq(products.status, "published")),
      db
        .select({
          slug: projects.slug,
          updatedAt: projects.updatedAt,
          publishedAt: projects.publishedAt,
        })
        .from(projects)
        .where(eq(projects.isPublished, true)),
    ]);

    const blogUrls: MetadataRoute.Sitemap = publishedPosts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: toDate(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const productUrls: MetadataRoute.Sitemap = publishedProducts.map(
      (product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: toDate(product.updatedAt || product.publishedAt),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );

    const projectUrls: MetadataRoute.Sitemap = publishedProjects.map(
      (project: any) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: toDate(project.updatedAt || project.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );

    return [...staticList, ...blogUrls, ...productUrls, ...projectUrls];
  } catch {
    // Any query failure falls back to the static list.
    return staticList;
  }
}
