"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Box,
  CheckCircle,
  ChevronDown,
  Download,
  Filter,
  Flower2,
  Globe,
  Monitor,
  Package,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GradientOrb } from "@/components/interactive";
import { CoverAmbience } from "@/components/interactive/CoverAmbience";
import { cn } from "@/lib/utils";

const platformFilters = [
  { id: "all", label: "All Platforms" },
  { id: "windows", label: "Windows" },
  { id: "android", label: "Android" },
  { id: "linux", label: "Linux" },
  { id: "macos", label: "macOS" },
  { id: "web", label: "Web" },
];

const licenseColors: Record<string, string> = {
  free: "bg-success/20 text-success",
  freemium: "bg-accent-blue/20 text-accent-blue",
  paid: "bg-accent-purple/20 text-accent-purple",
  "open-source": "bg-accent-cyan/20 text-accent-cyan",
};

const categoryNames: Record<string, string> = {
  "desktop-app": "Desktop App",
  automation: "Automation",
  "ai-tool": "AI Tool",
  "web-app": "Web App",
  utility: "Utility",
};

const platformNames: Record<string, string> = {
  windows: "Windows",
  android: "Android",
  linux: "Linux",
  macos: "macOS",
  web: "Web",
};

const platformIcons: Record<string, any> = {
  windows: Monitor,
  android: Smartphone,
  linux: Terminal,
  macos: Monitor,
  web: Globe,
};

/** D1 stores features/platforms as a JSON string; tolerate arrays too. */
function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // Malformed JSON — fall back to no values.
    }
  }
  return [];
}

// Public download data is loaded from the API at runtime — no fabricated values here.
type DownloadAsset = {
  id: string;
  platform: string | null;
  architecture: string | null;
  fileType: string | null;
  fileSize: number;
  sha256: string | null;
  minOsVersion: string | null;
  /** Real installer URL from the asset (e.g. /api/download/clipper). */
  downloadUrl: string;
};
type DownloadRelease = {
  id: string;
  version: string;
  releaseDate: string;
  status: string;
  isLatest: boolean;
  releaseNotes: string;
  assets: DownloadAsset[];
};
type DownloadProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo: string | null;
  category: string;
  licenseType: string;
  features: string[];
  supportedPlatforms: string[];
  isFeatured: boolean;
  releases: DownloadRelease[];
  /** Stable installer endpoint used when there is no published release asset. */
  downloadHref: string;
};

/**
 * The one REAL product, seeded so the page always shows something true even
 * when the API has no published release. Every field below is existing product
 * copy from this site — no version, rating, price or download count is invented.
 */
const fallbackProducts: DownloadProduct[] = [
  {
    id: "snu-automation",
    slug: "snu-automation",
    name: "SNU Automation",
    tagline: "Bulk downloads, Facebook scheduling, and visual workflows in one app",
    description:
      "One Windows app for bulk video downloads, Facebook Page scheduling, and visual automation workflows — with an AI assistant that acts on real services, safely and with you in control.",
    logo: "/images/snu-logo.png",
    category: "desktop-app",
    licenseType: "freemium",
    features: [
      "Bulk video downloading",
      "Facebook Page scheduling",
      "Visual workflow builder",
    ],
    supportedPlatforms: ["windows"],
    isFeatured: true,
    releases: [],
    downloadHref: "/api/download/direct",
  },
];

const DIRECT_DOWNLOAD_HREF = "/api/download/direct";

/** Map the public API payload into the exact shape the card expects. */
function mapApiProduct(api: any): DownloadProduct {
  const fallback = fallbackProducts[0];
  const releases: DownloadRelease[] = (Array.isArray(api.releases) ? api.releases : []).map(
    (release: any) => ({
      id: release.id,
      version: release.version ?? "",
      releaseDate:
        typeof release.releaseDate === "string"
          ? release.releaseDate.slice(0, 10)
          : release.releaseDate ?? "",
      status: release.status ?? "stable",
      isLatest: Boolean(release.isLatest),
      releaseNotes: release.releaseNotes ?? "",
      assets: (Array.isArray(release.assets) ? release.assets : [])
        .filter((asset: any) => asset.isAvailable !== false)
        .map((asset: any) => ({
          id: asset.id,
          platform: asset.platform,
          architecture: asset.architecture,
          fileType: asset.fileType,
          fileSize: Number(asset.fileSize) || 0,
          sha256: asset.sha256,
          minOsVersion: asset.minOsVersion,
          downloadUrl: typeof asset.downloadUrl === "string" ? asset.downloadUrl : "",
        })),
    })
  );

  const latest = releases.find((r) => r.isLatest) || releases[0];
  const primaryAsset = latest?.assets[0];
  // Prefer a real internal installer endpoint (e.g. /api/download/clipper);
  // otherwise keep the asset-id endpoint (which counts + redirects) as before.
  const primaryAssetHref =
    primaryAsset &&
    typeof primaryAsset.downloadUrl === "string" &&
    primaryAsset.downloadUrl.startsWith("/api/download/")
      ? primaryAsset.downloadUrl
      : primaryAsset
      ? `/api/download/${primaryAsset.id}`
      : DIRECT_DOWNLOAD_HREF;
  const apiFeatures = parseStringArray(api.features);
  const apiPlatforms = parseStringArray(api.supportedPlatforms);
  const assetPlatforms = Array.from(
    new Set(
      releases.flatMap((r) =>
        r.assets.map((a) => a.platform).filter((p): p is string => Boolean(p))
      )
    )
  );

  return {
    id: api.id ?? fallback.id,
    slug: api.slug ?? fallback.slug,
    name: api.name ?? fallback.name,
    tagline: api.tagline ?? fallback.tagline,
    description: api.description ?? fallback.description,
    logo: api.logoUrl ?? fallback.logo,
    category: api.category ?? fallback.category,
    licenseType: api.licenseType ?? fallback.licenseType,
    features: apiFeatures.length > 0 ? apiFeatures.slice(0, 3) : fallback.features,
    supportedPlatforms:
      apiPlatforms.length > 0
        ? apiPlatforms
        : assetPlatforms.length > 0
        ? assetPlatforms
        : fallback.supportedPlatforms,
    isFeatured:
      api.isFeatured === undefined ? fallback.isFeatured : Boolean(api.isFeatured),
    releases,
    // A real internal installer URL wins; otherwise use the asset-id endpoint,
    // and fall back to the stable installer link when there is no published asset.
    downloadHref: primaryAssetHref,
  };
}

const THANKS_SPARKLES = [
  { x: -30, y: -20, size: 3, rotate: -40, delay: 0.06, duration: 0.86 },
  { x: 0, y: -32, size: 4, rotate: 25, delay: 0.12, duration: 0.96 },
  { x: 30, y: -20, size: 3, rotate: -20, delay: 0.09, duration: 0.82 },
  { x: -36, y: 8, size: 2, rotate: 35, delay: 0.16, duration: 0.92 },
  { x: 36, y: 8, size: 3, rotate: -30, delay: 0.14, duration: 1.0 },
  { x: -20, y: 26, size: 4, rotate: 45, delay: 0.2, duration: 0.88 },
  { x: 20, y: 26, size: 2, rotate: -50, delay: 0.18, duration: 0.94 },
  { x: -12, y: -24, size: 2, rotate: 60, delay: 0.24, duration: 0.78 },
  { x: 12, y: -24, size: 3, rotate: -60, delay: 0.22, duration: 0.9 },
  { x: 0, y: 28, size: 2, rotate: 30, delay: 0.26, duration: 0.84 },
  { x: -38, y: -4, size: 2, rotate: -35, delay: 0.28, duration: 0.94 },
  { x: 38, y: -4, size: 3, rotate: 40, delay: 0.3, duration: 0.9 },
] as const;

/**
 * Prominent GET control. Clicking plays a short thank-you bloom first, then
 * navigates to the installer endpoint (a 302 to the real GitHub release).
 * It is a real <button> so Enter/Space work, and the thank-you state keeps a
 * plain <a> fallback in case JS navigation is blocked.
 */
function DownloadButton({ href, name }: { href: string; name: string }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "thanks">("idle");
  const navigating = useRef(false);

  useEffect(() => {
    if (phase !== "thanks") return;
    const timer = window.setTimeout(() => {
      if (navigating.current) return;
      navigating.current = true;
      window.location.href = href;
    }, reduce ? 180 : 1350);
    return () => window.clearTimeout(timer);
  }, [phase, href, reduce]);

  if (phase === "thanks") {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={reduce ? false : { opacity: 0, scale: 0.96, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative inline-flex min-h-[3.4rem] flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-accent-electric/30 bg-surface-deep/80 px-5 py-3 text-text-primary shadow-[0_18px_44px_-22px_rgb(var(--rgb-accent-electric)/0.45)] backdrop-blur"
      >
        {/* Gentle copper radial glow pulsing behind the message */}
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background:
                "radial-gradient(70% 140% at 22% 50%, rgb(var(--rgb-accent-electric) / 0.22), transparent 72%)",
            }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: [0, 0.95, 0.5, 0.85], scale: [0.94, 1.06, 1, 1.02] }}
            transition={{
              duration: 1.25,
              times: [0, 0.35, 0.7, 1],
              ease: "easeInOut",
            }}
          />
        )}

        {!reduce && (
          <span aria-hidden="true" className="relative grid h-8 w-8 shrink-0 place-items-center">
            {/* Bloom behind the flower */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--rgb-accent-electric) / 0.4), transparent 70%)",
              }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.3, 1], opacity: [0, 0.9, 0.35] }}
              transition={{ duration: 0.9, times: [0, 0.5, 1], ease: "easeOut" }}
            />

            {/* Flower blooms, tilts, then yields to the final check */}
            <motion.span
              className="relative inline-flex"
              initial={{ rotate: -25, scale: 0.5, opacity: 0, y: 4 }}
              animate={{
                rotate: [-25, 8, 0, 0],
                scale: [0.5, 1.12, 1, 0.9],
                opacity: [0, 1, 1, 0],
                y: [4, 0, 0, -2],
              }}
              transition={{
                duration: 1.35,
                times: [0, 0.3, 0.78, 1],
                ease: "easeOut",
              }}
            >
              <Flower2 className="h-6 w-6 text-accent-electric" />
            </motion.span>

            {/* Staggered sparkle dust — float, rotate, fade, scale-in */}
            {THANKS_SPARKLES.map((sparkle, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full bg-accent-electric"
                style={{
                  width: sparkle.size,
                  height: sparkle.size,
                  marginLeft: -sparkle.size / 2,
                  marginTop: -sparkle.size / 2,
                }}
                initial={{ x: 0, y: 6, opacity: 0, scale: 0, rotate: 0 }}
                animate={{
                  x: sparkle.x,
                  y: [6, sparkle.y - 4, sparkle.y, sparkle.y - 2],
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0.4],
                  rotate: sparkle.rotate,
                }}
                transition={{
                  duration: sparkle.duration,
                  delay: sparkle.delay,
                  times: [0, 0.25, 0.7, 1],
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Two tiny Sparkles glyphs drift in for extra delight */}
            <motion.span
              className="absolute -left-1.5 -top-1.5 text-accent-electric/90"
              initial={{ scale: 0, opacity: 0, rotate: -40, y: 4 }}
              animate={{
                scale: [0, 1, 1, 0.5],
                opacity: [0, 1, 1, 0],
                rotate: [-40, -30, -25, -20],
                y: [4, -2, -5, -8],
              }}
              transition={{
                duration: 1.0,
                delay: 0.18,
                times: [0, 0.3, 0.7, 1],
                ease: "easeOut",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
            </motion.span>
            <motion.span
              className="absolute -bottom-1.5 -right-1.5 text-accent-electric/80"
              initial={{ scale: 0, opacity: 0, rotate: 30, y: -2 }}
              animate={{
                scale: [0, 1, 1, 0.5],
                opacity: [0, 1, 1, 0],
                rotate: [30, 22, 18, 15],
                y: [-2, 1, 3, -4],
              }}
              transition={{
                duration: 1.05,
                delay: 0.26,
                times: [0, 0.3, 0.7, 1],
                ease: "easeOut",
              }}
            >
              <Sparkles className="h-3 w-3" />
            </motion.span>

            {/* Final micro-beat: expanding ring + golden check right before navigation */}
            <motion.span
              className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-electric/60"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.9], opacity: [0.9, 0] }}
              transition={{ delay: 1.02, duration: 0.5, ease: "easeOut" }}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
              initial={{ scale: 0, opacity: 0, rotate: -30 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1], rotate: [-30, 10, 0] }}
              transition={{
                delay: 1.02,
                duration: 0.38,
                times: [0, 0.6, 1],
                ease: "easeOut",
              }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--rgb-accent-electric) / 0.35), transparent 70%)",
                }}
              />
              <CheckCircle className="relative h-7 w-7 text-accent-electric" />
            </motion.span>
          </span>
        )}

        <span className="relative z-10 flex flex-col gap-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-medium">I promise I will save your time.</span>
            <a
              href={href}
              className="text-xs underline underline-offset-4 transition-colors hover:text-accent-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
            >
              Start download now
            </a>
          </span>
          {!reduce && (
            <span className="flex items-center gap-2" aria-hidden="true">
              <span className="text-[11px] font-medium tracking-wide text-accent-electric/80">
                Preparing your download…
              </span>
              <span className="relative h-1 w-24 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-blue to-accent-electric"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.15, delay: 0.12, ease: "easeInOut" }}
                />
              </span>
            </span>
          )}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => setPhase("thanks")}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      aria-label={`Download ${name}`}
      className={cn(
        "shine group relative inline-flex min-h-[3.4rem] shrink-0 items-center gap-3 overflow-hidden rounded-xl px-6 py-3",
        "bg-gradient-to-r from-accent-purple via-accent-blue to-accent-electric",
        "text-white ring-1 ring-inset ring-white/15",
        "shadow-[0_16px_38px_-14px_rgb(var(--rgb-accent-blue)/0.95)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      )}
    >
      <Download className="relative z-10 h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="relative z-10 flex flex-col items-start leading-none">
        <span className="text-lg font-bold tracking-wide">GET</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
          Download
        </span>
      </span>
    </motion.button>
  );
}

/** Logo with a graceful lucide fallback if the real image fails to load. */
function ProductLogo({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);

  if (!src || failed) {
    return (
      <span className="relative z-10 grid h-20 w-20 place-items-center rounded-2xl border border-accent-blue/30 bg-surface-deep/80 shadow-[0_10px_30px_-12px_rgb(var(--rgb-accent-blue)/0.9)]">
        <Box className="h-9 w-9 text-accent-electric" aria-hidden="true" />
      </span>
    );
  }

  return (
    // Plain img is intentional: the logo comes from a public static path.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name} logo`}
      onError={() => setFailed(true)}
      className="relative z-10 h-20 w-20 rounded-2xl border border-white/10 bg-surface-deep/70 object-cover shadow-[0_10px_30px_-12px_rgb(var(--rgb-accent-blue)/0.9)]"
    />
  );
}

/** Small pulsing stable/beta status badge. */
function StatusBadge({ status }: { status: string }) {
  const stable = status === "stable";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        stable
          ? "bg-success/15 text-success"
          : "bg-warning/15 text-warning"
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            stable ? "bg-success" : "bg-warning"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            stable ? "bg-success" : "bg-warning"
          )}
        />
      </span>
      {status}
    </span>
  );
}

/** One marketplace-style product card. Real releases add expandable details. */
function ProductCard({
  product,
  platformFilter,
}: {
  product: DownloadProduct;
  platformFilter: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const latestRelease =
    product.releases.find((r) => r.isLatest) || product.releases[0];

  return (
    <article className="glass gradient-border overflow-hidden rounded-2xl">
      {/* Cover — the real logo, framed by the site's butterfly/mote ambience */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-surface-deep via-surface-card to-bg-secondary">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10"
        />
        <CoverAmbience />
        <div
          aria-hidden="true"
          className="absolute h-28 w-28 animate-pulse rounded-full bg-accent-electric/15 blur-3xl"
        />
        {product.isFeatured && (
          <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full border border-accent-violet/30 bg-accent-purple/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-accent-violet backdrop-blur glow-purple">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Featured
          </span>
        )}
        <ProductLogo src={product.logo} name={product.name} />
      </div>

      {/* Product details */}
      <div className="p-6 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium tracking-wide text-text-secondary">
            {categoryNames[product.category] ?? product.category}
          </span>
          {product.licenseType && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium capitalize",
                licenseColors[product.licenseType] || "bg-white/10 text-text-secondary"
              )}
            >
              {product.licenseType}
            </span>
          )}
          {product.supportedPlatforms.includes("windows") && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-text-secondary">
              <Monitor className="h-3 w-3" aria-hidden="true" /> Windows
            </span>
          )}
        </div>

        <h3 className="font-heading text-2xl font-bold text-text-primary sm:text-[1.7rem]">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-accent-electric/90">
          {product.tagline}
        </p>
        {product.description && product.description !== product.tagline && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {product.description}
          </p>
        )}

        {product.features.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {product.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary"
              >
                <CheckCircle className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Prominent, direct download CTA */}
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <DownloadButton href={product.downloadHref} name={product.name} />
          <span className="text-xs leading-relaxed text-text-secondary">
            Starts the official installer download.
          </span>
        </div>

        {latestRelease && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="mt-5 inline-flex items-center gap-1.5 rounded text-sm text-accent-electric transition-colors hover:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
          >
            {expanded ? "Hide release details" : "Release details"}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex"
            >
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          </button>
        )}
      </div>

      {/* Expanded release details — only real API release data is shown here */}
      <AnimatePresence initial={false}>
        {expanded && latestRelease && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.25 },
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-6 pb-6 pt-6">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <span className="text-sm text-text-secondary">
                  Latest Release:{" "}
                  <span className="font-medium text-text-primary">
                    v{latestRelease.version}
                  </span>
                </span>
                <span className="text-sm text-text-secondary">
                  {latestRelease.releaseDate}
                </span>
                <StatusBadge status={latestRelease.status} />
              </div>

              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-semibold text-text-primary">
                  Available Downloads
                </h4>
                {latestRelease.assets
                  .filter(
                    (a) =>
                      platformFilter === "all" || a.platform === platformFilter
                  )
                  .map((asset) => {
                    const Icon =
                      platformIcons[asset.platform ?? "unknown"] || Monitor;
                    return (
                      <div
                        key={asset.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/5 bg-surface-deep/60 p-4 transition-colors hover:border-accent-blue/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent-blue/20 bg-accent-blue/10">
                            <Icon className="h-5 w-5 text-accent-blue" />
                          </span>
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {platformNames[asset.platform ?? "unknown"]}{" "}
                              {asset.architecture && `(${asset.architecture})`}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {asset.fileType?.toUpperCase()} •{" "}
                              {asset.fileSize > 0
                                ? `${(asset.fileSize / 1000000).toFixed(1)} MB`
                                : "Web App"}{" "}
                              {asset.minOsVersion && `• ${asset.minOsVersion}+`}
                            </div>
                          </div>
                        </div>

                        <DownloadButton
                          href={
                            asset.downloadUrl.startsWith("/api/download/")
                              ? asset.downloadUrl
                              : `/api/download/${asset.id}`
                          }
                          name={`${product.name} (${platformNames[asset.platform ?? "unknown"]})`}
                        />
                      </div>
                    );
                  })}
              </div>

              {latestRelease.releaseNotes && (
                <div className="mb-6">
                  <h4 className="mb-2 text-sm font-semibold text-text-primary">
                    Release Notes
                  </h4>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {latestRelease.releaseNotes}
                  </p>
                </div>
              )}

              {latestRelease.assets.some((a) => a.sha256) && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Shield className="h-4 w-4 text-accent-electric" aria-hidden="true" />
                    SHA-256 Checksums
                  </h4>
                  <div className="space-y-3">
                    {latestRelease.assets
                      .filter((a) => a.sha256)
                      .map((asset) => (
                        <div key={asset.id} className="space-y-1.5">
                          <div className="text-xs font-medium text-text-secondary">
                            {platformNames[asset.platform ?? "unknown"]} (
                            {asset.architecture})
                          </div>
                          <code className="block break-all rounded-lg border border-white/5 bg-surface-deep/80 p-3 font-mono text-xs leading-relaxed text-accent-electric">
                            {asset.sha256}
                          </code>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {product.releases.length > 1 && (
                <div className="mt-6 border-t border-border pt-6">
                  <h4 className="mb-3 text-sm font-semibold text-text-primary">
                    Previous Versions
                  </h4>
                  <div className="space-y-2">
                    {product.releases
                      .filter((r) => !r.isLatest)
                      .map((release) => (
                        <div
                          key={release.id}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-text-primary">
                              v{release.version}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {release.releaseDate}
                            </span>
                          </div>
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-xs text-accent-electric transition-colors hover:text-accent-blue"
                          >
                            View Details
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-6 border-t border-border pt-6">
                <Link
                  href={`/products/${product.slug}`}
                  className="group inline-flex items-center gap-2 text-sm text-accent-electric transition-colors hover:text-accent-blue"
                >
                  View Full Product Page
                  <ChevronDown className="h-4 w-4 -rotate-90 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function DownloadCenterPage() {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<DownloadProduct[]>(() => fallbackProducts);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // The public list endpoint now returns published products WITH their
        // releases (and each release's real assets) in one response, so the
        // cards are built from this single request — no per-product round trips.
        const res = await fetch("/api/products");
        if (!res.ok) return; // API error — keep the real fallback card.
        const data = await res.json();
        const list = Array.isArray(data?.products) ? data.products : [];
        if (cancelled || list.length === 0) return;

        const withReleases = list
          .map((item: any) => mapApiProduct(item))
          .filter(
            (product: DownloadProduct): product is DownloadProduct =>
              Boolean(product && product.releases.length > 0)
          );
        // Show every published product with a real release. On error/empty,
        // keep the real fallback card pointing at the stable installer link.
        if (withReleases.length > 0) setProducts(withReleases);
      } catch {
        // Network error — keep the real fallback card (no fabricated data).
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.tagline.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesPlatform =
      platformFilter === "all" ||
      product.supportedPlatforms.includes(platformFilter) ||
      product.releases.some((r) =>
        r.assets.some((a) => a.platform === platformFilter)
      );

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary">
      {/* Ambient background layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-atmosphere opacity-70" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <GradientOrb
          color="cyan"
          size={420}
          opacity={0.18}
          blur={90}
          float
          className="absolute -right-36 -top-20"
        />
        <GradientOrb
          color="purple"
          size={460}
          opacity={0.18}
          blur={90}
          float
          className="absolute -left-40 top-1/2"
        />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-accent-electric backdrop-blur">
                <Download className="h-3.5 w-3.5" />
                DOWNLOAD CENTER
              </div>
              <h1 className="mb-6 text-4xl font-heading font-bold tracking-tight sm:text-5xl">
                Download <span className="text-gradient-primary">Center</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
                Download the latest releases of SNU Automation and SNU Clipper. Each
                release includes its version, release notes, and download details where available.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Search + Filter */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="section-container">
            <Reveal y={14}>
              <div className="glass gradient-border rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col gap-5">
                  {/* Search */}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search products"
                      className="w-full rounded-xl border border-white/10 bg-surface-deep/70 py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-secondary transition-shadow focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                    />
                  </div>

                  {/* Platform Filter */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-accent-electric" />
                      <span className="text-sm font-medium text-text-secondary">
                        Platform
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {platformFilters.map((filter) => {
                        const Icon = platformIcons[filter.id] || Globe;
                        const active = platformFilter === filter.id;
                        return (
                          <motion.button
                            key={filter.id}
                            type="button"
                            onClick={() => setPlatformFilter(filter.id)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                              active
                                ? "border-accent-blue/40 bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-[0_8px_24px_-10px_rgb(var(--rgb-accent-blue)/0.9)]"
                                : "border-white/10 bg-white/[0.04] text-text-secondary hover:border-white/20 hover:text-text-primary"
                            )}
                          >
                            {filter.id === "all" ? (
                              <Package className="h-3.5 w-3.5" />
                            ) : (
                              <Icon className="h-3.5 w-3.5" />
                            )}
                            {filter.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Products List */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 pb-24">
          <div className="section-container">
            <Stagger className="space-y-6">
              {filteredProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} platformFilter={platformFilter} />
                </StaggerItem>
              ))}
            </Stagger>

            {filteredProducts.length === 0 && (
              <div className="glass gradient-border rounded-2xl py-16 text-center">
                <Search className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                <p className="text-text-secondary">No products match those filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPlatformFilter("all");
                  }}
                  className="mt-4 rounded-lg border border-accent-blue/30 bg-accent-blue/10 px-4 py-2 text-sm font-medium text-accent-electric transition-colors hover:bg-accent-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Verification Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 pb-24">
          <div className="section-container max-w-4xl">
            <Reveal>
              <div className="glass gradient-border rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-success/20 bg-success/10 glow-blue">
                    <Shield className="h-7 w-7 text-success" />
                  </span>
                  <div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">
                      Download Safety
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-text-secondary">
                      Download installers only from this official page. Where a
                      checksum or release note is provided, it is shown with the release.
                    </p>
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      {[
                        "Official download links",
                        "Release notes where provided",
                        "Version history preserved",
                        "Checksums shown when available",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                        >
                          <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                          <span className="text-text-secondary">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
