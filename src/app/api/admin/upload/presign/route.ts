import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// POST /api/admin/upload/presign — Get presigned R2 upload URL
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    // TODO: Check auth session + admin role

    const body = await request.json();
    const { filename, contentType, folder } = body;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "application/pdf",
      "application/zip",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "File type not allowed", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for images, 50MB for documents)
    const maxSize = contentType.startsWith("image/") ? 10 * 1024 * 1024 : 50 * 1024 * 1024;

    // Generate unique key
    const key = `${folder || "uploads"}/${crypto.randomUUID()}-${filename}`;

    // TODO: Generate presigned URL using R2 SDK
    // const { url } = await r2.getSignedUrl("putObject", {
    //   Bucket: process.env.R2_BUCKET_NAME,
    //   Key: key,
    //   ContentType: contentType,
    //   Expires: 3600, // 1 hour
    // });

    // Placeholder response
    return NextResponse.json({
      key,
      uploadUrl: `https://placeholder.r2.cloudflarestorage.com/${key}`,
      publicUrl: `${process.env.R2_PUBLIC_URL || "https://files.yourdomain.com"}/${key}`,
      maxSize,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}