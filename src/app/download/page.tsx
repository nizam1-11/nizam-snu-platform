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

// Placeholder data (will be loaded from DB)
const productsWithReleases = [
  {
    id: "1",
    slug: "ai-task-automator",
    name: "AI Task Automator",
    tagline: "Automate repetitive tasks with natural language",
    licenseType: "freemium",
    latestVersion: "1.2.0",
    releases: [
      {
        id: "r1",
        version: "1.2.0",
        releaseDate: "2026-11-10",
        status: "stable",
        isLatest: true,
        assets: [
          {
            id: "a1",
            platform: "windows",
            architecture: "x64",
            fileType: "exe",
            fileSize: 45200000,
            sha256: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
            minOsVersion: "Windows 10",
            downloadCount: 892,
          },
          {
            id: "a2",
            platform: "windows",
            architecture: "arm64",
            fileType: "exe",
            fileSize: 43100000,
            sha256: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
            minOsVersion: "Windows 11",
            downloadCount: 234,
          },
          {
            id: "a3",
            platform: "linux",
            architecture: "x64",
            fileType: "AppImage",
            fileSize: 52300000,
            sha256: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
            minOsVersion: "Ubuntu 20.04+",
            downloadCount: 567,
          },
        ],
      },
      {
        id: "r2",
        version: "1.1.0",
        releaseDate: "2026-10-15",
        status: "stable",
        isLatest: false,
        releaseNotes: "Bug fixes and performance improvements.",
        assets: [],
      },
    ],
  },
  {
    id: "2",
    slug: "workflow-builder",
    name: "Workflow Builder",
    tagline: "Visual drag-and-drop workflow automation",
    licenseType: "free",
    latestVersion: "2.0.1",
    releases: [
      {
        id: "r3",
        version: "2.0.1",
        releaseDate: "2026-11-08",
        status: "stable",
        isLatest: true,
        releaseNotes: "Major update with new workflow templates and improved UI.",
        assets: [
          {
            id: "a4",
            platform: "web",
            architecture: "universal",
            fileType: "web",
            fileSize: 0,
            sha256: null,
            minOsVersion: null,
            downloadCount: 3421,
          },
        ],
      },
    ],
  },
];

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

  const filteredProducts = productsWithReleases.filter((product) => {
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
                VERIFIED DISTRIBUTION
              </div>
              <h1 className="mb-6 text-4xl font-heading font-bold tracking-tight sm:text-5xl">
                Download <span className="text-gradient-primary">Center</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
                Download the latest versions of all software products. Every release
                includes version info, release notes, and SHA-256 checksums for
                verification.
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
                const latestRelease = product.releases.find((r) => r.isLatest);
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
                          <span
                            className={cn(
                              "hidden rounded-full px-2.5 py-1 text-xs font-medium capitalize sm:inline-block",
                              licenseColors[product.licenseType]
                            )}
                          >
                            {product.licenseType}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-text-secondary">
                            v{product.latestVersion}
                          </span>
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
                                      platformIcons[asset.platform] || Monitor;
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
                                              {platformNames[asset.platform]}{" "}
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
                                            {platformNames[asset.platform]} (
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
                      All downloads are verified and include SHA-256 checksums. We
                      recommend verifying your download before installation.
                    </p>
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      {[
                        "SHA-256 checksums on every file",
                        "Virus-scanned binaries",
                        "Version history preserved",
                        "No bundled adware or spyware",
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
