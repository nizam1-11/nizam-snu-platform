import { NextRequest, NextResponse } from "next/server";

// Resolve the real installer URL at request time from GitHub's latest release.
// Never hardcode a version/filename — match the asset by name pattern instead.
const GITHUB_API =
  "https://api.github.com/repos/nizam1-11/snu-clipper/releases/latest";
// Fallback only if the GitHub API fails: a pinned known-good current asset.
const FALLBACK_URL =
  "https://github.com/nizam1-11/snu-clipper/releases/latest/download/SNU-Clipper-Setup-v1.19.3.exe";

async function resolveInstallerUrl(): Promise<string> {
  try {
    const res = await fetch(GITHUB_API, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "snu-portfolio" },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) return FALLBACK_URL;
    const data: any = await res.json();
    const assets: any[] = Array.isArray(data?.assets) ? data.assets : [];
    const exe = assets.find(
      (a) =>
        typeof a?.name === "string" &&
        /^SNU-Clipper-Setup-.*\.exe$/i.test(a.name) &&
        !/blockmap/i.test(a.name)
    );
    if (exe?.browser_download_url) return exe.browser_download_url;
    return FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

// GET /api/download/clipper — 302 straight to the real installer, works with zero releases.
// URL resolution is DB-independent; no counter is tracked for this app.
export async function GET(request: NextRequest) {
  const url = await resolveInstallerUrl();
  return NextResponse.redirect(new URL(url, request.url), 302);
}
