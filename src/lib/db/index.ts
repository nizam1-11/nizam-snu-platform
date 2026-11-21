import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type D1Database = any;

/**
 * Resolve the database for the current runtime:
 * - On Cloudflare Workers (production): use the D1 binding via OpenNext's
 *   getCloudflareContext(). Imported dynamically so local dev (which has no
 *   Cloudflare context) never loads the Cloudflare-only module.
 * - Locally: use better-sqlite3 against ./local.db, loaded via createRequire
 *   so Next's bundler doesn't intercept the native addon.
 */
// Module-level cache of the resolved D1-backed db. `getCloudflareContext` can
// intermittently fail during cold starts (the binding is not ready yet), so we
// retry a few times and then remember the result for the lifetime of the
// isolate. This removes random 503s caused by a transient context failure.
let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function getDbAsync(d1Binding?: D1Database) {
  if (d1Binding) return drizzle(d1Binding, { schema });
  if (cachedDb) return cachedDb;

  // Cloudflare Workers: D1 binding is available via OpenNext's context.
  // Try unconditionally (CF_PAGES is not set on Workers). Retry briefly to
  // survive the cold-start window where the context is not ready yet.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const { env } = await getCloudflareContext({ async: true });
      if (env?.DB) {
        cachedDb = drizzle(env.DB as D1Database, { schema });
        return cachedDb;
      }
    } catch {
      // Not ready yet (or not in a CF context) — retry, then fall through.
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, 25 * (attempt + 1)));
  }

  return getDbLocal();
}

let localDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDbLocal() {
  if (!localDb) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createRequire } = require("node:module");
      const nodeRequire = createRequire(import.meta.url);
      const sqliteModule = nodeRequire("better-sqlite3");
      const Sqlite = sqliteModule.Database || sqliteModule.default || sqliteModule;
      const { drizzle: drizzleSqlite } = nodeRequire("drizzle-orm/better-sqlite3");
      const sqlite = new Sqlite("./local.db");
      localDb = drizzleSqlite(sqlite, { schema });
    } catch (e: any) {
      console.warn("better-sqlite3 unavailable, using null DB:", e?.message || e);
      return null as any;
    }
  }
  return localDb;
}

/** Synchronous DB accessor — local SQLite only. For Cloudflare use getDbAsync. */
export function getDb(d1Binding?: D1Database) {
  if (d1Binding) return drizzle(d1Binding, { schema });
  return getDbLocal();
}

export type Database = ReturnType<typeof getDb>;
export { schema };