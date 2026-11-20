import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://nizam-snu-platform.nizam-snu-platform.workers.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // Explicitly welcome AI search crawlers while keeping admin/API private.
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
