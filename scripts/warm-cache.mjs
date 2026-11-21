/**
 * Warm the Cloudflare edge cache after a deploy.
 * First request to each page can be slow (cache miss / cold start). Hitting
 * every route once fills the edge cache so real visitors get fast responses.
 *
 * Usage:
 *   node scripts/warm-cache.mjs
 *   SMOKE_BASE_URL=https://... node scripts/warm-cache.mjs
 */
const BASE = process.env.SMOKE_BASE_URL || "https://nizam-snu-platform.nizam-snu-platform.workers.dev";

const PAGES = [
  "/", "/about", "/services", "/projects", "/products", "/download",
  "/whats-new", "/blog", "/contact", "/faq", "/support", "/showcase",
  "/products/snu-automation", "/projects/snu-automation",
  "/blog/safe-facebook-page-automation", "/blog/bulk-video-downloading-organized",
  "/blog/visual-workflow-builder-guide",
  "/robots.txt", "/sitemap.xml", "/llms.txt",
];

let ok = 0;
for (const p of PAGES) {
  try {
    const r = await fetch(BASE + p, { headers: { "User-Agent": "snu-cache-warmer" } });
    // Drain the body so the connection is released.
    await r.arrayBuffer();
    if (r.ok) ok++;
    console.log(`${r.ok ? "PASS" : "FAIL"} ${p} (${r.status})`);
  } catch (e) {
    console.log(`FAIL ${p} ${String(e).slice(0, 80)}`);
  }
}
console.log(`\nWarmed ${ok}/${PAGES.length} pages on ${BASE}`);
