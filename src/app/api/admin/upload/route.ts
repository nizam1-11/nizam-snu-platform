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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_INSTALLER_SIZE = 500 * 1024 * 1024; // 500MB

// Installer MIME types, plus a set of "generic" types that fall back to the
// original filename's extension. Extensions are derived from the filename for
// installers ONLY and are strictly whitelisted.
const ALLOWED_INSTALLER_MIMES = new Set([
  "application/octet-stream",
  "application/x-msdownload",
  "application/vnd.microsoft.portable-executable",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-msi",
]);
const GENERIC_INSTALLER_MIMES = new Set(["", "application/octet-stream"]);
const ALLOWED_INSTALLER_EXTS = new Set(["exe", "msi", "zip"]);

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

// POST /api/admin/upload — Upload an image or installer to R2 (admin only)
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  try {
    const formData = await request.formData();

    // Optional destination folder: "blog" (default, image) or "installers".
    const rawFolder = formData.get("folder");
    let folder: "blog" | "installers";
    if (rawFolder === null || rawFolder === "") {
      folder = "blog";
    } else if (rawFolder === "blog" || rawFolder === "installers") {
      folder = rawFolder;
    } else {
      return NextResponse.json(
        { error: "Invalid folder", code: "INVALID_FOLDER" },
        { status: 400 }
      );
    }
    const isInstaller = folder === "installers";

    const raw = formData.get("file");

    // A string means the field was not a File; null means it was absent.
    if (!raw || typeof raw === "string") {
      return NextResponse.json(
        { error: "No file provided", code: "NO_FILE" },
        { status: 400 }
      );
    }

    const file = raw as File;
    let ext: string;

    if (isInstaller) {
      // Derive the extension from the ORIGINAL filename only for installers:
      // take the last extension, lowercase it, and strictly whitelist it.
      const name = file.name || "";
      const dot = name.lastIndexOf(".");
      const nameExt = dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
      const mime = file.type || "";
      const mimeOk =
        ALLOWED_INSTALLER_MIMES.has(mime) || GENERIC_INSTALLER_MIMES.has(mime);

      if (!mimeOk || !ALLOWED_INSTALLER_EXTS.has(nameExt)) {
        return NextResponse.json(
          { error: "File type not allowed", code: "INVALID_FILE_TYPE" },
          { status: 400 }
        );
      }
      ext = nameExt;
    } else {
      if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
        return NextResponse.json(
          { error: "File type not allowed", code: "INVALID_FILE_TYPE" },
          { status: 400 }
        );
      }
      // Never trust the user-supplied filename for images — derive from MIME.
      ext = EXT_BY_MIME[file.type];
    }

    const maxSize = isInstaller ? MAX_INSTALLER_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
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

    const key = `${folder}/${crypto.randomUUID()}.${ext}`;

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
      {
        url: (isInstaller ? "/api/files/" : "/api/images/") + key,
        key,
        size: file.size,
        mime: file.type,
        folder,
      },
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
