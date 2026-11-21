import { NextRequest, NextResponse } from "next/server";

// Stable internal direct-download link. No DB lookup — always serves the real installer.
const DIRECT_DOWNLOAD_URL =
  "https://github.com/nizam1-11/snu-automation-releases/releases/latest/download/SNU-Automation-Setup-2.6.10.exe";

// GET /api/download/direct — 302 straight to the real installer, works with zero releases.
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL(DIRECT_DOWNLOAD_URL, request.url), 302);
}
