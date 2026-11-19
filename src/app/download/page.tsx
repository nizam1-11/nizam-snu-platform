"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  ChevronDown,
  Download,
  Filter,
  Globe,
  Loader2,
  Monitor,
  Package,
  Search,
  Shield,
  Smartphone,
  Terminal,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GradientOrb } from "@/components/interactive";
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

// Public download data is loaded from the API at runtime — no fabricated values here.
type DownloadAsset = {
  id: string;
  platform: string | null;
  architecture: string | null;
  fileType: string | null;
  fileSize: number;
  sha256: string | null;
  minOsVersion: string | null;
  downloadCount: number;
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
  licenseType: string;
  latestVersion: string;
  releases: DownloadRelease[];
};

const fallbackProducts: DownloadProduct[] = [];

/** Map the public API payload into the exact shape the existing JSX expects. */
function mapApiProduct(api: any): DownloadProduct {
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
          downloadCount: Number(asset.downloadCount) || 0,
        })),
    })
  );

  const latest = releases.find((r) => r.isLatest) || releases[0];

  return {
    id: api.id,
    slug: api.slug ?? "snu-automation",
    name: api.name ?? "",
    tagline: api.tagline ?? "",
    licenseType: api.licenseType ?? "",
    latestVersion: latest?.version ?? "",
    releases,
  };
}

/** Status-driven download control — the real href navigation is never blocked. */
function DownloadButton({ assetId }: { assetId: string }) {
  const [state, setState] = useState<"idle" | "preparing" | "started">("idle");

  useEffect(() => {
    if (state !== "preparing") return;
    const timer = window.setTimeout(() => setState("started"), 700);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <motion.a
      href={`/api/download/${assetId}`}
      onClick={() => setState("preparing")}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "shine relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-lg px-4 py-2 text-sm font-medium text-white",
        state === "started"
          ? "bg-gradient-to-r from-success to-accent-electric"
          : "bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_8px_24px_-10px_rgb(var(--rgb-accent-blue)/0.9)]"
      )}
    >
      {state === "preparing" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "started" ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="relative z-10">
        {state === "preparing"
          ? "Preparing"
          : state === "started"
          ? "Started"
          : "Download"}
      </span>
    </motion.a>
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

export default function DownloadCenterPage() {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<DownloadProduct[]>(() => fallbackProducts);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/products/snu-automation", {
          cache: "no-store",
        });
        if (!res.ok) return; // API error — keep the empty fallback.
        const data = await res.json();
        if (cancelled || !data?.product) return;
        const mapped = mapApiProduct(data.product);
        // Only render products that actually have releases; otherwise the
        // existing empty-state markup below does the talking.
        setProducts(mapped.releases.length > 0 ? [mapped] : []);
      } catch {
        // Network error — keep the empty fallback (no fabricated data).
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform =
      platformFilter === "all" ||
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
                Download the latest releases of SNU Automation. Each release includes
                its version, release notes, and download details where available.
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
              {filteredProducts.map((product) => {
                const latestRelease =
                  product.releases.find((r) => r.isLatest) ||
                  product.releases[0];
                const isExpanded = expandedProduct === product.id;

                return (
                  <StaggerItem key={product.id}>
                    <div className="glass gradient-border overflow-hidden rounded-2xl">
                      {/* Product Header */}
                      <div
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpandedProduct(isExpanded ? null : product.id)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setExpandedProduct(isExpanded ? null : product.id);
                          }
                        }}
                        className="group flex cursor-pointer items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-electric"
                      >
                        <div className="flex items-center gap-4">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple shadow-[0_8px_24px_-10px_rgb(var(--rgb-accent-blue))]">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-bold text-text-primary transition-colors group-hover:text-accent-electric">
                              {product.name}
                            </h3>
                            <p className="text-sm text-text-secondary">
                              {product.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {product.licenseType && (
                            <span
                              className={cn(
                                "hidden rounded-full px-2.5 py-1 text-xs font-medium capitalize sm:inline-block",
                                licenseColors[product.licenseType]
                              )}
                            >
                              {product.licenseType}
                            </span>
                          )}
                          {product.latestVersion && (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-text-secondary">
                              v{product.latestVersion}
                            </span>
                          )}
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-flex text-text-secondary"
                          >
                            <ChevronDown className="h-5 w-5" />
                          </motion.span>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && latestRelease && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: {
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                              },
                              opacity: { duration: 0.25 },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border px-6 pb-6 pt-6">
                              {/* Release Info */}
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

                              {/* Download Assets */}
                              <div className="mb-6 space-y-3">
                                <h4 className="text-sm font-semibold text-text-primary">
                                  Available Downloads
                                </h4>
                                {latestRelease.assets
                                  .filter(
                                    (a) =>
                                      platformFilter === "all" ||
                                      a.platform === platformFilter
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
                                              {asset.architecture &&
                                                `(${asset.architecture})`}
                                            </div>
                                            <div className="text-xs text-text-secondary">
                                              {asset.fileType?.toUpperCase()} •{" "}
                                              {asset.fileSize > 0
                                                ? `${(asset.fileSize / 1000000).toFixed(1)} MB`
                                                : "Web App"}{" "}
                                              {asset.minOsVersion &&
                                                `• ${asset.minOsVersion}+`}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                          {asset.downloadCount > 0 && (
                                            <span className="text-xs text-text-secondary">
                                              {asset.downloadCount.toLocaleString()}{" "}
                                              downloads
                                            </span>
                                          )}
                                          <DownloadButton assetId={asset.id} />
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>

                              {/* Release Notes */}
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

                              {/* SHA-256 Checksums */}
                              {latestRelease.assets.some((a) => a.sha256) && (
                                <div>
                                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                                    <Shield className="h-4 w-4 text-accent-electric" />
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

                              {/* Previous Versions */}
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

                              {/* View Product Page Link */}
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
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            {filteredProducts.length === 0 && (
              <div className="glass gradient-border rounded-2xl py-16 text-center">
                <Search className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                <p className="text-text-secondary">
                  No products found matching your criteria.
                </p>
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
