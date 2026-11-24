import { NextRequest, NextResponse } from "next/server";
import { getLatestRelease } from "@/lib/github-latest";

// Fallback only if GitHub resolution fails: a pinned known-good current asset.
const FALLBACK_URL =
  "https://github.com/nizam1-11/snu-clipper/releases/download/v1.19.4/SNU-Clipper-Setup-v1.19.4.exe";

// GET /api/download/clipper — 302 straight to the real installer, works with zero releases.
// URL resolution is DB-independent; no counter is tracked for this app.
export async function GET(request: NextRequest) {
  const latest = await getLatestRelease("clipper");
  const url = latest?.url ?? FALLBACK_URL;
  return NextResponse.redirect(new URL(url, request.url), 302);
}
