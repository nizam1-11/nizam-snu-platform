import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  // Notes:
  // - Fonts are self-hosted via next/font, so font-src 'self' is sufficient;
  //   data:/https: are allowed for future design assets.
  // - blob: is needed by three.js / R3F workers and generated textures.
  // - inline styles are required by Motion/GSAP and CSS-in-JS from libraries.
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' blob: https://*.cloudflare.com https://*.r2.cloudflarestorage.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ") + ";"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Admin route protection (basic - full auth check in API routes)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Auth check happens client-side and in API routes
    // This is a placeholder; full auth middleware would check session
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths (including /admin and /api) except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
