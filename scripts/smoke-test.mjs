/**
 * Read-only smoke test for a deployed Nizam — SNU Automation Platform site.
 *
 * Usage:
 *   node scripts/smoke-test.mjs
 *   SMOKE_BASE_URL=https://your-deployment.workers.dev node scripts/smoke-test.mjs
 *
 * Prints one PASS/FAIL line per check and exits 1 if any check failed.
 * Uses only Node built-ins (global fetch, process.env, AbortSignal).
 * Makes NO writes to D1/R2 and never uses the real admin password: the write
 * gate and login are probed with missing / deliberately wrong credentials only.
 */

const BASE = (
  process.env.SMOKE_BASE_URL || "https://nizam-snu-platform.nizam-snu-platform.workers.dev"
).replace(/\/+$/, "");

const TIMEOUT_MS = 15000;

let passed = 0;
let failed = 0;

/** Central fetch wrapper: base URL + hard timeout so a dead host fails, not hangs. */
function req(path, options = {}) {
  return fetch(`${BASE}${path}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...options,
  });
}

function assertStatus(res, expected) {
  if (res.status !== expected) {
    throw new Error(`expected HTTP ${expected}, got ${res.status}`);
  }
}

/** Run one check, print a compact line, and tally the result. */
async function check(name, fn) {
  try {
    const detail = await fn();
    passed++;
    console.log(`PASS  ${name}${detail ? `  (${detail})` : ""}`);
  } catch (err) {
    failed++;
    const msg = err && err.message ? err.message : String(err);
    console.log(`FAIL  ${name}  (${msg})`);
  }
}

/** Shared assertion for the public list APIs that return { [key]: [...] }. */
async function checkList(name, path, key) {
  await check(name, async () => {
    const res = await req(path);
    assertStatus(res, 200);
    const data = await res.json();
    if (!data || !Array.isArray(data[key])) {
      throw new Error(`response missing "${key}" array`);
    }
    return `${key}=${data[key].length}`;
  });
}

console.log(`Smoke test → ${BASE}`);

// 1. Home page
await check("GET /", async () => {
  const res = await req("/");
  assertStatus(res, 200);
  return `status ${res.status}`;
});

// 2. Login page
await check("GET /login", async () => {
  const res = await req("/login");
  assertStatus(res, 200);
  return `status ${res.status}`;
});

// 3. Admin area must not be reachable without a session cookie
await check("GET /admin (no cookie) does not expose admin area", async () => {
  const res = await req("/admin", { redirect: "manual" });
  const location = res.headers.get("location") || "";
  if (res.status >= 300 && res.status < 400) {
    if (location.includes("/login")) return `${res.status} → ${location}`;
    throw new Error(`redirect ${res.status} to unexpected location "${location}"`);
  }
  if (res.url && res.url.includes("/login")) return `final url ${res.url}`;
  // Some runtimes serve a 200 shell for client-side redirects. The security
  // property that matters is that no admin content leaks without a session.
  const body = await res.text();
  if (/WORKSPACE|Welcome back|Admin.?Dashboard/i.test(body)) {
    throw new Error("admin dashboard content leaked without authentication");
  }
  return `status ${res.status}, no admin content in body`;
});

// 4-7. Public content list APIs
await checkList("GET /api/announcements", "/api/announcements", "announcements");
await checkList("GET /api/blog", "/api/blog", "posts");
await checkList("GET /api/projects", "/api/projects", "projects");
await checkList("GET /api/products", "/api/products", "products");

// 8. Write gate: unauthenticated POST to a content API must be rejected
await check("POST /api/blog (no auth) is blocked", async () => {
  const res = await req("/api/blog", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "smoke-probe", slug: "smoke-probe", content: "" }),
  });
  assertStatus(res, 401);
  return `status ${res.status}`;
});

// 9. Login validates credentials: a wrong password must be rejected
await check("POST /api/admin/login (wrong password) returns 401", async () => {
  const res = await req("/api/admin/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: "definitely-wrong-password-smoke-probe" }),
  });
  assertStatus(res, 401);
  return `status ${res.status}`;
});

// 10. Public product detail API
await check("GET /api/products/snu-automation", async () => {
  const res = await req("/api/products/snu-automation");
  assertStatus(res, 200);
  const data = await res.json();
  if (!data || !data.product || typeof data.product !== "object") {
    throw new Error('response missing "product" object');
  }
  return `slug=${data.product.slug || data.product.id || "?"}`;
});

// 11. Public project detail API
await check("GET /api/projects/snu-automation", async () => {
  const res = await req("/api/projects/snu-automation");
  assertStatus(res, 200);
  const data = await res.json();
  if (!data || !data.project || typeof data.project !== "object") {
    throw new Error('response missing "project" object');
  }
  return `slug=${data.project.slug || data.project.id || "?"}`;
});

// 12. Path-traversal probe on the image proxy must never expose a file
await check("GET /api/images traversal is rejected", async () => {
  // Encoded traversal avoids URL path normalization so the probe reaches the guard.
  const res = await req("/api/images/..%2F..%2Fetc%2Fpasswd");
  if (res.status === 200) throw new Error("traversal returned HTTP 200 (file exposed)");
  if (res.status !== 400 && res.status !== 404) {
    throw new Error(`expected HTTP 400 or 404, got ${res.status}`);
  }
  return `status ${res.status}`;
});

// 13. Public FAQ list API (content API health)
await checkList("GET /api/faq", "/api/faq", "faqs");

const total = passed + failed;
console.log(`\n${passed}/${total} passed`);
process.exit(failed ? 1 : 0);
