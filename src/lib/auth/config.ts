import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDbAsync } from "@/lib/db";

// better-auth configuration — lazily created with an async DB resolver so the
// same code works with local SQLite (dev) and Cloudflare D1 (production).

let _authPromise: Promise<any> | null = null;

export async function getAuthAsync() {
  if (_authPromise) return _authPromise;

  _authPromise = (async () => {
    const db = await getDbAsync();
    if (!db) return null;

    return betterAuth({
      database: drizzleAdapter(db, {
        provider: "sqlite",
      }),
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5,
        },
      },
      rateLimit: {
        window: 60,
        max: 5,
      },
      trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      ],
    });
  })();

  return _authPromise;
}

export type Auth = any;
