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

// GET /api/files/[...key] — serve an installer from R2 as a forced download
// (public; no admin auth). Catch-all is required because keys contain a folder
// segment, e.g. installers/<uuid>.exe.
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
      !key.startsWith("installers/") ||
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

    // Use only the sanitized basename for the download filename.
    const rawName = key.split("/").pop() || "download";
    const filename = rawName.replace(/[^a-zA-Z0-9._-]/g, "_") || "download";

    const headers: Record<string, string> = {
      "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    };
    const contentLength = obj.size ?? obj.httpMetadata?.contentLength;
    if (typeof contentLength === "number" && Number.isFinite(contentLength)) {
      headers["Content-Length"] = String(contentLength);
    }

    return new Response(body, { headers });
  } catch (error) {
    console.error("File fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
