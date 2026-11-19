import { NextRequest, NextResponse } from "next/server";

/** Characters permitted in a stored object key. */
const KEY_PATTERN = /^[a-zA-Z0-9/_\-.]+$/;

async function getStorageBucket(): Promise<any | undefined> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    if (env?.STORAGE) return env.STORAGE;
  } catch {
    // Not in a Cloudflare context (local dev) — expected.
  }
  return (process.env as any).STORAGE;
}

// GET /api/images/[...key] — serve a stored image (public; no admin auth).
// Catch-all is required because keys contain a folder segment, e.g. blog/<uuid>.png.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: segments } = await params;
    let key: string;
    try {
      key = decodeURIComponent(segments.join("/"));
    } catch {
      return NextResponse.json(
        { error: "Invalid key", code: "INVALID_KEY" },
        { status: 400 }
      );
    }

    if (
      !KEY_PATTERN.test(key) ||
      !key.startsWith("blog/") ||
      key.includes("..") ||
      key.includes("\\")
    ) {
      return NextResponse.json(
        { error: "Invalid key", code: "INVALID_KEY" },
        { status: 400 }
      );
    }

    const bucket = await getStorageBucket();
    if (!bucket) {
      return NextResponse.json(
        { error: "Storage unavailable", code: "STORAGE_UNAVAILABLE" },
        { status: 503 }
      );
    }

    const obj = await bucket.get(key);
    if (!obj) {
      return NextResponse.json(
        { error: "Not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const body = obj.body ?? (await obj.arrayBuffer());
    return new Response(body, {
      headers: {
        "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
