import { drizzle } from "drizzle-orm/d1";
import { createRequire } from "node:module";
import * as schema from "./schema";

// Cloudflare D1 binding type
type D1Database = any;

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

// `createRequire` resolves native modules correctly inside Next's server
// bundle (a plain require() is intercepted by the bundler and fails for
// native addons like better-sqlite3).
const nodeRequire = createRequire(import.meta.url);

export function getDb(d1Binding?: D1Database) {
  if (d1Binding) {
    return drizzle(d1Binding, { schema });
  }

  if (!db) {
    try {
      const sqliteModule = nodeRequire("better-sqlite3");
      // CJS interop: the constructor may be the module itself, .Database, or .default
      const Sqlite = sqliteModule.Database || sqliteModule.default || sqliteModule;
      const { drizzle: drizzleSqlite } = nodeRequire("drizzle-orm/better-sqlite3");
      const sqlite = new Sqlite("./local.db");
      db = drizzleSqlite(sqlite, { schema });
    } catch (e: any) {
      // Build/edge runtime (Cloudflare Workers) — no native sqlite available.
      console.warn("better-sqlite3 unavailable, using null DB:", e?.message || e);
      return null as any;
    }
  }

  return db;
}

export type Database = ReturnType<typeof getDb>;
export { schema };