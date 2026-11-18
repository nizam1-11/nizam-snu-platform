import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminSecret,
  safeEqual,
  sessionCookieOptions,
} from "@/lib/admin-auth";

// Best-effort per-isolate rate limiting: max 10 attempts / 60s per IP.
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";
  if (!checkRateLimit(ip)) {
    return Response.json({ error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    password?: unknown;
  };
  const password = typeof body?.password === "string" ? body.password : "";

  const secret = await getAdminSecret();
  if (!secret) {
    return Response.json({ error: "ADMIN_UNAVAILABLE" }, { status: 503 });
  }

  if (!safeEqual(password, secret)) {
    return Response.json({ error: "INVALID_PASSWORD" }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const opts = sessionCookieOptions();
  const secure = opts.secure ? "; Secure" : "";
  const setCookie = `${ADMIN_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${opts.maxAge}${secure}`;

  return Response.json({ ok: true }, { headers: { "Set-Cookie": setCookie } });
}
