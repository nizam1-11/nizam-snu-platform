import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Resolve the R2 bucket binding for the current runtime.
 * - Cloudflare Workers: `STORAGE` via OpenNext's getCloudflareContext().
 * - Local dev / fallback: (process.env as any).STORAGE if provided.
 */
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

// POST /api/admin/upload — Upload an image to R2 (admin only)
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  try {
    const formData = await request.formData();
    const raw = formData.get("file");

    // A string means the field was not a File; null means it was absent.
    if (!raw || typeof raw === "string") {
      return NextResponse.json(
        { error: "No file provided", code: "NO_FILE" },
        { status: 400 }
      );
    }

    const file = raw as File;

    if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
      return NextResponse.json(
        { error: "File type not allowed", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { error: "No file provided", code: "NO_FILE" },
        { status: 400 }
      );
    }

    // Never trust the user-supplied filename — derive the key from MIME + UUID.
    const ext = EXT_BY_MIME[file.type];
    const key = `blog/${crypto.randomUUID()}.${ext}`;

    const bucket = await getStorageBucket();
    if (!bucket) {
      return NextResponse.json(
        { error: "Storage unavailable", code: "STORAGE_UNAVAILABLE" },
        { status: 503 }
      );
    }

    await bucket.put(key, file, {
      httpMetadata: { contentType: file.type },
      customMetadata: { uploadedAt: new Date().toISOString() },
    });

    return NextResponse.json(
      { url: "/api/images/" + key, key },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
