import { cookies } from "next/headers";

export const ADMIN_COOKIE = "snu_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Resolve the single admin password secret.
 * - Cloudflare Workers: the `ADMIN_PASSWORD` worker secret via OpenNext context.
 * - Local dev: `process.env.ADMIN_PASSWORD`, else a convenience default.
 * - Production with no secret: returns undefined so every gate FAILS CLOSED.
 */
export async function getAdminSecret(): Promise<string | undefined> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    // CloudflareEnv does not declare ADMIN_PASSWORD yet; narrow via a cast.
    const cfEnv = env as unknown as Record<string, unknown> | undefined;
    if (cfEnv?.ADMIN_PASSWORD) return String(cfEnv.ADMIN_PASSWORD);
  } catch {
    // Not in a Cloudflare context (local dev) — expected.
  }

  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "dev-admin-password";
  return undefined; // FAIL CLOSED in production
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

/** Constant-time-ish comparison: accumulate differences across all chars. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload = String(Date.now() + MAX_AGE_SECONDS * 1000); // expiry in ms
  const encoded = toBase64Url(new TextEncoder().encode(payload));
  const signature = await hmacSign(payload, secret);
  return `${encoded}.${signature}`;
}

async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token || token.length > 512) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  let payload: string;
  try {
    payload = new TextDecoder().decode(fromBase64Url(payloadB64));
  } catch {
    return false;
  }

  const exp = parseInt(payload, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = await hmacSign(payload, secret);
  return safeEqual(expected, signature);
}

/** Server-component / layout guard using Next's async cookie store. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = await getAdminSecret();
  if (!secret) return false;
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value, secret);
}

/** Route-handler guard: returns a Response to short-circuit, or null when OK. */
export async function requireAdmin(request: Request): Promise<Response | null> {
  const secret = await getAdminSecret();
  if (!secret) {
    return Response.json(
      {
        error: "ADMIN_UNAVAILABLE",
        message: "Admin password is not configured.",
      },
      { status: 503 }
    );
  }

  const cookieHeader = request.headers.get("cookie") || "";
  let token: string | undefined;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === ADMIN_COOKIE) {
      token = part.slice(idx + 1).trim();
      break;
    }
  }

  if (!(await verifySessionToken(token, secret))) {
    return Response.json(
      { error: "UNAUTHORIZED", message: "Admin login required." },
      { status: 401 }
    );
  }

  return null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
