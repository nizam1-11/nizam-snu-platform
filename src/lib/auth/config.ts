import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/db";

// better-auth configuration
// Database adapter is configured lazily to avoid build-time issues

let _auth: any = null;

export function getAuth() {
  if (_auth) return _auth;

  const db = getDb();
  if (!db) {
    return null;
  }

  _auth = betterAuth({
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

  return _auth;
}

export type Auth = any;