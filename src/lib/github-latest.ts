import { getCached, setCached } from "./server-cache";

export type LatestRelease = { version: string; tag: string; url: string; size?: number };

const APPS = {
  automation: {
    atom: "https://github.com/nizam1-11/snu-automation-releases/releases.atom",
    yml: "https://github.com/nizam1-11/snu-automation-releases/releases/latest/download/latest.yml",
    repo: "nizam1-11/snu-automation-releases",
  },
  clipper: {
    atom: "https://github.com/nizam1-11/snu-clipper/releases.atom",
    repo: "nizam1-11/snu-clipper",
  },
} as const;

export async function getLatestRelease(app: keyof typeof APPS): Promise<LatestRelease | null> {
  const cacheKey = `github-latest:${app}`;
  const hit = getCached<LatestRelease | null>(cacheKey);
  if (hit !== undefined) return hit;

  const cfg = APPS[app];
  try {
    const res = await fetch(cfg.atom, {
      cache: "no-store",
      headers: { "User-Agent": "snu-portfolio" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`atom ${res.status}`);
    const xml = await res.text();
    const entry = xml.match(/<entry>[\s\S]*?<\/entry>/)?.[0] ?? "";
    const tag =
      entry.match(/<link[^>]+href="[^"]*\/tag\/([^"]+)"/)?.[1] ??
      entry.match(/<id>[^<]*\/([^/<]+)<\/id>/)?.[1];
    if (!tag) throw new Error("no tag in atom feed");
    const version = tag.replace(/^v/, "");

    let path: string | undefined;
    let size: number | undefined;
    if (app === "automation") {
      try {
        const y = await fetch((cfg as { yml?: string }).yml!, {
          cache: "no-store",
          headers: { "User-Agent": "snu-portfolio" },
          signal: AbortSignal.timeout(6000),
        });
        if (y.ok) {
          const yml = await y.text();
          path = yml.match(/^path:\s*(.+)$/m)?.[1]?.trim();
          const s = yml.match(/^size:\s*(\d+)$/m)?.[1];
          if (s) size = Number(s);
        }
      } catch { /* size/path are optional */ }
    }
    if (!path) path = app === "automation"
      ? `SNU-Automation-Setup-${version}.exe`
      : `SNU-Clipper-Setup-${tag}.exe`;

    const result: LatestRelease = {
      version,
      tag,
      url: `https://github.com/${cfg.repo}/releases/download/${tag}/${path}`,
      size,
    };
    setCached(cacheKey, result, 10 * 60 * 1000);
    return result;
  } catch {
    setCached(cacheKey, null, 60 * 1000); // short negative cache, retry soon
    return null;
  }
}
