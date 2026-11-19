"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  Monitor,
  Package,
  Shield,
  Smartphone,
  Terminal,
  Zap,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import {
  DeviceMockup,
  GradientOrb,
  ImageReveal,
  SpotlightCard,
} from "@/components/interactive";
import { cn } from "@/lib/utils";

// Placeholder product data (will be loaded from DB)
const productData: Record<string, any> = {
  "ai-task-automator": {
    name: "AI Task Automator",
    tagline: "Automate repetitive tasks with natural language",
    description:
      "An AI-powered desktop application that automates repetitive business tasks using natural language instructions. Simply describe what you want done, and the AI handles the rest.",
    longDescription: `
## What is AI Task Automator?

AI Task Automator is a desktop application that bridges the gap between human intent and computer execution. Instead of writing scripts or learning complex automation tools, you simply describe what you want done in plain English, and the AI figures out how to do it.

## How It Works

1. **Describe Your Task** — Type what you want to accomplish in natural language
2. **AI Plans** — The AI breaks down your request into actionable steps
3. **Review & Execute** — Review the plan and let the AI execute it
4. **Get Results** — Receive the output and any generated files

## Use Cases

- Data processing and transformation
- File organization and renaming
- Report generation
- Email automation
- Web scraping and data collection
    `,
    category: "AI Tool",
    licenseType: "freemium",
    features: [
      "Natural language task description",
      "Multi-step workflow execution",
      "Integration with common business tools",
      "Error handling and retry logic",
      "Progress tracking and reporting",
      "Offline mode support",
      "Export results to CSV/JSON",
      "Scheduled task execution",
    ],
    systemRequirements: {
      "OS": "Windows 10+, macOS 12+, or Linux (Ubuntu 20.04+)",
      "RAM": "4 GB minimum, 8 GB recommended",
      "Storage": "500 MB free space",
      "Processor": "Intel/AMD 64-bit or Apple Silicon",
      "Network": "Required for AI features",
    },
    supportedPlatforms: ["windows", "macos", "linux"],
    installationGuide: `
## Windows Installation

1. Download the installer (.exe) from the Download Center
2. Run the installer and follow the prompts
3. Launch "AI Task Automator" from the Start Menu
4. Sign in or create an account

## macOS Installation

1. Download the .dmg file
2. Open the DMG and drag the app to Applications
3. Launch from Applications folder
4. Allow the app in System Preferences if prompted

## Linux Installation

1. Download the .AppImage or .deb package
2. For .deb: \`sudo dpkg -i ai-task-automator.deb\`
3. For .AppImage: chmod +x and run
4. Launch from your applications menu
    `,
    documentationUrl: "#",
    supportInfo:
      "For support, email nizam14010@gmail.com or visit the Support Center.",
    latestVersion: "1.2.0",
    latestReleaseDate: "2026-11-10",
    releases: [
      {
        id: "r1",
        version: "1.2.0",
        releaseDate: "2026-11-10",
        status: "stable",
        releaseNotes:
          "Major update with improved AI accuracy, new workflow templates, and bug fixes.",
        changelog: `
## v1.2.0 (2026-11-10)
### Added
- New workflow templates for common business tasks
- Improved natural language understanding
- Export results to CSV and JSON

### Fixed
- Fixed crash when processing large files
- Fixed memory leak in long-running tasks
- Improved error messages

### Changed
- Updated AI model to latest version
- Improved UI responsiveness
        `,
        assets: [
          {
            platform: "windows",
            architecture: "x64",
            fileType: "exe",
            fileSize: 45200000,
            downloadUrl: "#",
            sha256:
              "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
            minOsVersion: "Windows 10",
          },
          {
            platform: "windows",
            architecture: "arm64",
            fileType: "exe",
            fileSize: 43100000,
            downloadUrl: "#",
            sha256:
              "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
            minOsVersion: "Windows 11",
          },
          {
            platform: "linux",
            architecture: "x64",
            fileType: "AppImage",
            fileSize: 52300000,
            downloadUrl: "#",
            sha256:
              "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
            minOsVersion: "Ubuntu 20.04+",
          },
        ],
      },
      {
        id: "r2",
        version: "1.1.0",
        releaseDate: "2026-10-15",
        status: "stable",
        releaseNotes: "Bug fixes and performance improvements.",
        changelog: "## v1.1.0\n### Fixed\n- Fixed memory leak\n### Improved\n- Better error handling",
        assets: [],
      },
    ],
    screenshots: [],
  },
};

const platformIcons: Record<string, any> = {
  windows: Monitor,
  android: Smartphone,
  linux: Terminal,
  macos: Monitor,
  web: Globe,
};

const platformNames: Record<string, string> = {
  windows: "Windows",
  android: "Android",
  linux: "Linux",
  macos: "macOS",
  web: "Web",
};

function mockupVariant(
  platforms: string[]
): "browser" | "desktop" | "phone" {
  if (platforms.includes("web")) return "browser";
  const hasDesktop = platforms.some((p) =>
    ["windows", "macos", "linux"].includes(p)
  );
  if (!hasDesktop && platforms.includes("android")) return "phone";
  return "desktop";
}

/** Decorative hero surface built only from the product's existing data. */
function HeroMockup({ product }: { product: any }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple shadow-[0_0_28px_-8px_rgb(var(--rgb-accent-blue))]">
          <Zap className="h-5 w-5 text-white" />
        </span>
        <div className="space-y-1.5">
          <span className="block h-2.5 w-40 rounded-full bg-text-primary/70" />
          <span className="block h-1.5 w-24 rounded-full bg-accent-electric/60" />
        </div>
        <span className="ml-auto h-7 w-20 rounded-lg bg-gradient-to-r from-accent-blue/30 to-accent-purple/30" />
      </div>
      <div className="h-px w-full bg-white/10" />
      <div className="grid gap-2 sm:grid-cols-2">
        {product.features.slice(0, 4).map((feature: string, i: number) => (
          <div
            key={feature}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] p-2.5"
          >
            <CheckCircle
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                i % 2 === 0 ? "text-accent-blue" : "text-accent-violet"
              )}
            />
            <span className="truncate text-[10px] text-text-secondary">
              {feature}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-7 flex-1 rounded-lg bg-gradient-to-r from-accent-blue/25 via-accent-purple/20 to-transparent" />
        <span className="h-7 w-16 rounded-lg border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}

/** Native <details> disclosure with a Motion-driven chevron. */
function ChangelogDisclosure({ changelog }: { changelog: string }) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="group"
      onToggle={(event) =>
        setOpen((event.currentTarget as HTMLDetailsElement).open)
      }
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-accent-electric transition-colors hover:text-accent-blue">
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
        View Changelog
      </summary>
      <div className="mt-4 rounded-xl border border-white/10 bg-surface-deep/80 p-4 font-mono text-sm leading-relaxed text-text-secondary whitespace-pre-line">
        {changelog}
      </div>
    </details>
  );
}

/** SHA-256 value with a functional copy-to-clipboard control. */
function ChecksumBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <div className="flex items-stretch gap-2 rounded-xl border border-white/10 bg-surface-deep/70 p-2">
      <code className="min-w-0 flex-1 break-all px-2 py-1.5 font-mono text-xs leading-relaxed text-accent-electric">
        {value}
      </code>
      <motion.button
        type="button"
        onClick={handleCopy}
        whileTap={{ scale: 0.94 }}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
          copied
            ? "border-success/40 bg-success/15 text-success"
            : "border-white/10 bg-white/5 text-text-secondary hover:border-accent-blue/40 hover:text-accent-blue"
        )}
        aria-label={copied ? "Copied" : "Copy SHA-256 checksum"}
      >
        {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </motion.button>
    </div>
  );
}

/** Defensively parse a JSON string field coming from D1 (may arrive pre-parsed). */
function parseJson(value: any, fallback: any) {
  if (Array.isArray(value) || (value && typeof value === "object")) return value;
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapApiRelease(release: any) {
  return {
    id: release.id,
    version: release.version,
    releaseDate:
      typeof release.releaseDate === "string"
        ? release.releaseDate.slice(0, 10)
        : release.releaseDate,
    status: release.status,
    releaseNotes: release.releaseNotes,
    changelog: release.changelog,
    assets: (Array.isArray(release.assets) ? release.assets : []).map((asset: any) => ({
      id: asset.id,
      platform: asset.platform,
      architecture: asset.architecture,
      fileType: asset.fileType,
      fileSize: Number(asset.fileSize) || 0,
      downloadUrl: asset.downloadUrl,
      sha256: asset.sha256,
      minOsVersion: asset.minOsVersion,
    })),
  };
}

/** Map the public API payload into the exact shape the existing JSX expects. */
function mapApiProduct(api: any, fallback: any) {
  const mapped = (Array.isArray(api.releases) ? api.releases : []).map(mapApiRelease);
  // Guarantee at least one release so the existing `product.releases[0]` reads stay safe.
  const releases =
    mapped.length > 0
      ? mapped
      : fallback?.releases?.length
      ? fallback.releases
      : [
          {
            id: "none",
            version: fallback?.latestVersion ?? "",
            releaseDate: fallback?.latestReleaseDate ?? "",
            status: "stable",
            releaseNotes: "",
            changelog: "",
            assets: [],
          },
        ];
  const latest = releases[0];
  const features = parseJson(api.features, []);
  const platforms = parseJson(api.supportedPlatforms, []);
  const requirements = parseJson(api.systemRequirements, {});

  return {
    name: api.name ?? fallback?.name,
    tagline: api.tagline ?? fallback?.tagline,
    description: api.description ?? fallback?.description,
    longDescription: api.longDescription ?? fallback?.longDescription,
    category: api.category ?? fallback?.category,
    licenseType: api.licenseType ?? fallback?.licenseType,
    features: Array.isArray(features) ? features : [],
    systemRequirements:
      requirements && typeof requirements === "object" && !Array.isArray(requirements)
        ? requirements
        : {},
    supportedPlatforms: Array.isArray(platforms) ? platforms : [],
    installationGuide: api.installationGuide ?? fallback?.installationGuide,
    documentationUrl: api.documentationUrl ?? fallback?.documentationUrl,
    supportInfo: api.supportInfo ?? fallback?.supportInfo,
    screenshots: Array.isArray(api.screenshots) ? api.screenshots : [],
    releases,
    latestVersion: latest?.version ?? fallback?.latestVersion,
    latestReleaseDate: latest?.releaseDate ?? fallback?.latestReleaseDate,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any>(() => productData[slug] ?? null);

  useEffect(() => {
    // Reset to this slug's hardcoded fallback on mount/navigation (no-op on mount).
    setProduct(productData[slug] ?? null);
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        if (!res.ok) return; // 404 / server error — keep hardcoded fallback.
        const data = await res.json();
        if (!cancelled && data?.product) {
          setProduct(mapApiProduct(data.product, productData[slug]));
        }
      } catch {
        // Network error — keep hardcoded fallback.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!product) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-bg-base px-4 text-text-primary">
        <div className="absolute inset-0 bg-atmosphere opacity-70" />
        <div className="relative text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-text-muted" />
          <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-accent-electric transition-colors hover:text-accent-blue"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const latestRelease = product.releases[0];

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary">
      {/* Ambient background layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-atmosphere opacity-70" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <GradientOrb
          color="blue"
          size={460}
          opacity={0.2}
          blur={90}
          float
          className="absolute -left-40 top-24"
        />
        <GradientOrb
          color="violet"
          size={420}
          opacity={0.18}
          blur={90}
          float
          className="absolute -right-40 top-1/2"
        />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="relative z-10">
        {/* Back Navigation */}
        <div className="section-container pt-8">
          <Reveal y={10}>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Products
            </Link>
          </Reveal>
        </div>

        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="section-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: Info */}
            <Reveal>
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full border border-accent-blue/30 bg-accent-blue/15 px-3 py-1 text-sm font-medium text-accent-blue">
                    {product.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border border-white/10 px-3 py-1 text-sm font-medium capitalize",
                      product.licenseType === "free"
                        ? "bg-success/20 text-success"
                        : product.licenseType === "freemium"
                        ? "bg-accent-blue/20 text-accent-blue"
                        : product.licenseType === "paid"
                        ? "bg-accent-purple/20 text-accent-purple"
                        : "bg-accent-electric/20 text-accent-electric"
                    )}
                  >
                    {product.licenseType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-sm font-medium text-success glow-blue">
                    <Shield className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>

                <h1 className="mb-4 text-4xl font-heading font-bold tracking-tight sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mb-6 text-xl text-gradient-electric">
                  {product.tagline}
                </p>
                <p className="mb-8 leading-relaxed text-text-secondary">
                  {product.description}
                </p>

                {/* Quick Info */}
                <div className="mb-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-text-secondary">
                    <Zap className="h-4 w-4 text-accent-electric" />
                    v{product.latestVersion}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-text-secondary">
                    <Clock className="h-4 w-4 text-accent-violet" />
                    {product.latestReleaseDate}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-text-secondary">
                    <Monitor className="h-4 w-4 text-accent-blue" />
                    {product.supportedPlatforms
                      .map((p: string) => platformNames[p])
                      .join(" · ")}
                  </span>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <h3 className="mb-3 text-sm font-semibold text-text-primary">
                    Download {product.name}
                  </h3>
                  {latestRelease.assets.map((asset: any) => {
                    const Icon = platformIcons[asset.platform] || Monitor;
                    return (
                      <motion.a
                        key={asset.id || asset.platform + asset.architecture}
                        href={asset.downloadUrl}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                        className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-accent-blue/40 hover:bg-accent-blue/[0.06] hover:glow-blue"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent-blue/20 bg-accent-blue/10">
                            <Icon className="h-5 w-5 text-accent-blue" />
                          </span>
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {platformNames[asset.platform]}{" "}
                              {asset.architecture && `(${asset.architecture})`}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {asset.fileType?.toUpperCase()} •{" "}
                              {(asset.fileSize / 1000000).toFixed(1)} MB
                              {asset.minOsVersion && ` • ${asset.minOsVersion}+`}
                            </div>
                          </div>
                        </div>
                        <Download className="h-5 w-5 text-accent-electric transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-blue" />
                      </motion.a>
                    );
                  })}
                  {latestRelease.assets.length === 0 && (
                    <p className="text-sm text-text-secondary">
                      No downloads available yet. Check back soon.
                    </p>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Right: Cinematic hero mockup */}
            <Reveal delay={0.12} x={24} className="min-h-[320px]">
              <ImageReveal
                className="relative h-full w-full"
                direction="up"
              >
                <SpotlightCard withTilt className="relative">
                  <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-accent-blue/20 via-accent-purple/10 to-transparent blur-2xl" />
                  <DeviceMockup
                    variant={mockupVariant(product.supportedPlatforms)}
                    title={`${product.name} — v${product.latestVersion}`}
                  >
                    <HeroMockup product={product} />
                  </DeviceMockup>
                </SpotlightCard>
              </ImageReveal>
            </Reveal>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="section-container">
            <Reveal>
              <h2 className="mb-12 text-center text-2xl font-heading font-bold sm:text-3xl">
                Key <span className="text-gradient-primary">Features</span>
              </h2>
            </Reveal>
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {product.features.map((feature: string) => (
                <StaggerItem key={feature}>
                  <div className="card-interactive gradient-border h-full rounded-xl bg-surface-card/50 p-4">
                    <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg border border-success/20 bg-success/10">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-sm leading-relaxed text-text-secondary">
                      {feature}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Description + System Requirements */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="section-container grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Long Description */}
            <Reveal className="lg:col-span-2">
              <div>
                <h2 className="mb-6 text-2xl font-heading font-bold">
                  About {product.name}
                </h2>
                <div className="prose prose-invert max-w-none leading-relaxed text-text-secondary whitespace-pre-line">
                  {product.longDescription}
                </div>

                {/* Installation Guide */}
                <div className="mt-12">
                  <h2 className="mb-6 text-2xl font-heading font-bold">
                    Installation Guide
                  </h2>
                  <div className="rounded-2xl border border-white/10 bg-surface-deep/60 p-6 font-mono text-sm leading-relaxed text-text-secondary whitespace-pre-line">
                    {product.installationGuide}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Sidebar */}
            <Reveal delay={0.1} className="space-y-6">
              <div>
                {/* System Requirements */}
                <div className="gradient-border glass rounded-2xl p-6">
                  <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-text-primary">
                    <Terminal className="h-4 w-4 text-accent-electric" />
                    System Requirements
                  </h3>
                  <dl className="space-y-3">
                    {Object.entries(product.systemRequirements).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                        >
                          <dt className="text-xs font-semibold uppercase tracking-wide text-accent-blue">
                            {key}
                          </dt>
                          <dd className="mt-0.5 text-sm text-text-secondary">
                            {value as string}
                          </dd>
                        </div>
                      )
                    )}
                  </dl>
                </div>

                {/* Resources */}
                <div className="glass gradient-border mt-6 space-y-3 rounded-2xl p-6">
                  <h3 className="mb-4 font-heading text-lg font-bold text-text-primary">
                    Resources
                  </h3>
                  {product.documentationUrl &&
                    product.documentationUrl !== "#" && (
                      <a
                        href={product.documentationUrl}
                        className="group flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        <FileText className="h-4 w-4 text-accent-violet" />
                        Documentation
                        <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </a>
                    )}
                  <Link
                    href="/support"
                    className="group flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <Shield className="h-4 w-4 text-accent-blue" />
                    Get Support
                    <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <ExternalLink className="h-4 w-4 text-accent-electric" />
                    Report an Issue
                    <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </a>
                </div>

                {/* Support Info */}
                <div className="glass mt-6 rounded-2xl p-6">
                  <h3 className="mb-4 font-heading text-lg font-bold text-text-primary">
                    Support
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {product.supportInfo}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Changelog / Release History */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="section-container max-w-4xl">
            <Reveal>
              <h2 className="mb-12 text-center text-2xl font-heading font-bold sm:text-3xl">
                Release <span className="text-gradient-primary">History</span>
              </h2>
            </Reveal>
            <div className="relative space-y-6 pl-6 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-gradient-to-b before:from-accent-blue/60 before:via-accent-purple/40 before:to-transparent">
              {product.releases.map((release: any) => {
                const isLatest = release.version === product.latestVersion;
                return (
                  <Reveal key={release.id} y={18}>
                    <div className="relative">
                      <span
                        className={cn(
                          "absolute -left-[23px] top-6 h-3.5 w-3.5 rounded-full border-2 border-bg-base",
                          isLatest
                            ? "bg-accent-blue glow-blue"
                            : "bg-accent-purple/70"
                        )}
                      />
                      <div
                        className={cn(
                          "gradient-border rounded-2xl p-6",
                          isLatest
                            ? "glass-strong glow-blue"
                            : "glass"
                        )}
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-heading text-lg font-bold text-text-primary">
                              v{release.version}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-1 text-xs font-medium",
                                release.status === "stable"
                                  ? "bg-success/20 text-success"
                                  : release.status === "beta"
                                  ? "bg-warning/20 text-warning"
                                  : "bg-accent-purple/20 text-accent-purple"
                              )}
                            >
                              {release.status}
                            </span>
                            {isLatest && (
                              <span className="rounded-full border border-accent-blue/30 bg-accent-blue/15 px-2.5 py-1 text-xs font-medium text-accent-blue">
                                Latest
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-text-secondary">
                            {release.releaseDate}
                          </span>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                          {release.releaseNotes}
                        </p>
                        {release.changelog && (
                          <ChangelogDisclosure changelog={release.changelog} />
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* SHA-256 Verification Section */}
        {latestRelease.assets.length > 0 && latestRelease.assets[0].sha256 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 pb-24">
            <div className="section-container max-w-4xl">
              <Reveal>
                <h2 className="mb-8 text-center text-2xl font-heading font-bold sm:text-3xl">
                  Verify Your <span className="text-gradient-electric">Download</span>
                </h2>
                <div className="glass gradient-border rounded-2xl p-6 sm:p-8">
                  <p className="mb-5 flex items-center gap-2 text-sm text-text-secondary">
                    <Hash className="h-4 w-4 text-accent-electric" />
                    After downloading, verify the file integrity using SHA-256
                    checksum:
                  </p>
                  <div className="space-y-4">
                    {latestRelease.assets.map((asset: any) => (
                      <div key={asset.platform + asset.architecture} className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
                          {platformNames[asset.platform]} ({asset.architecture})
                        </div>
                        <ChecksumBlock value={asset.sha256} />
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-xs leading-relaxed text-text-secondary">
                    <strong className="text-text-primary">Windows:</strong> Open
                    PowerShell and run:{" "}
                    <code className="rounded border border-white/10 bg-surface-deep px-2 py-1 font-mono text-accent-electric">
                      Get-FileHash -Algorithm SHA256 filename.exe
                    </code>
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
