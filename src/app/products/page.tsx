"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Download, Filter, Shield, Star, Zap } from "lucide-react";
import { TiltCard } from "@/components/motion/TiltCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import {
  SpotlightCard,
  DeviceMockup,
  GradientOrb,
} from "@/components/interactive";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Products" },
  { id: "ai-tool", label: "AI Tools" },
  { id: "automation", label: "Automation" },
  { id: "desktop-app", label: "Desktop Apps" },
  { id: "web-app", label: "Web Apps" },
  { id: "utility", label: "Utilities" },
];

// Hardcoded products used as the initial data source and API fallback.
const fallbackProducts = [
  {
    id: "1",
    slug: "ai-task-automator",
    name: "AI Task Automator",
    tagline: "Automate repetitive tasks with natural language",
    description:
      "An AI-powered desktop application that automates repetitive business tasks using natural language instructions.",
    category: "ai-tool",
    licenseType: "freemium",
    isFeatured: true,
    supportedPlatforms: ["windows", "linux"],
    latestVersion: "1.2.0",
    downloadCount: 1234,
  },
  {
    id: "2",
    slug: "workflow-builder",
    name: "Workflow Builder",
    tagline: "Visual drag-and-drop workflow automation",
    description:
      "Build complex automation workflows with a visual drag-and-drop interface. Connect APIs, databases, and services.",
    category: "automation",
    licenseType: "free",
    isFeatured: true,
    supportedPlatforms: ["web"],
    latestVersion: "2.0.1",
    downloadCount: 5678,
  },
  {
    id: "3",
    slug: "data-sync-pro",
    name: "Data Sync Pro",
    tagline: "Keep your data in sync across platforms",
    description:
      "Cross-platform tool for synchronizing data between different business systems, databases, and cloud services.",
    category: "desktop-app",
    licenseType: "paid",
    isFeatured: false,
    supportedPlatforms: ["windows", "macos", "linux"],
    latestVersion: "1.0.0",
    downloadCount: 890,
  },
];

type Product = (typeof fallbackProducts)[number];

/** Defensively parse a value that may be a JSON string (D1) or an array. */
function parseStringArray(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Malformed JSON — fall back.
    }
  }
  return fallback;
}

const licenseColors: Record<string, string> = {
  free: "bg-success/20 text-success",
  freemium: "bg-accent-blue/20 text-accent-blue",
  paid: "bg-accent-purple/20 text-accent-purple",
  "open-source": "bg-accent-cyan/20 text-accent-cyan",
};

const platformIcons: Record<string, string> = {
  windows: "🪟",
  android: "🤖",
  linux: "🐧",
  macos: "🍎",
  web: "🌐",
};

/** Pick a decorative device frame from the product's real platforms. */
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

/** Decorative, data-neutral app surface rendered inside each device frame. */
function MockupScreen({ product }: { product: Product }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple shadow-[0_0_18px_-4px_rgb(var(--rgb-accent-blue)/0.8)]" />
        <span className="h-2 w-24 rounded-full bg-text-primary/50" />
        <span className="ml-auto h-2 w-10 rounded-full bg-text-muted/30" />
      </div>
      <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-accent-electric/60 to-accent-blue/20" />
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg border border-white/5 bg-white/[0.03] p-2"
          >
            <span
              className={cn(
                "mb-2 block h-1.5 w-6 rounded-full",
                i === 0
                  ? "bg-accent-blue/70"
                  : i === 1
                  ? "bg-accent-purple/70"
                  : "bg-accent-electric/70"
              )}
            />
            <span className="block h-1 w-full rounded-full bg-text-muted/25" />
            <span className="mt-1.5 block h-1 w-2/3 rounded-full bg-text-muted/15" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <span className="h-6 flex-1 rounded-md bg-gradient-to-r from-accent-blue/25 to-accent-purple/25" />
        <span className="h-6 w-12 rounded-md border border-white/10 bg-white/5" />
      </div>
      <span className="sr-only">{product.name} preview</span>
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products", { signal: controller.signal })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error("Products request failed"))
      )
      .then((data: { products?: Record<string, unknown>[] }) => {
        const fromApi = Array.isArray(data.products) ? data.products : [];
        const mapped: Product[] = fromApi
          .map((item) => {
            const licenseType = String(item.licenseType || "free");
            return {
              id: String(item.id || item.slug || ""),
              slug: String(item.slug || ""),
              name: String(item.name || "Untitled"),
              tagline: String(item.tagline || ""),
              description: String(item.description || ""),
              // Normalize to lowercase so the existing category filter keeps working.
              category: String(item.category || "utility").toLowerCase(),
              licenseType: licenseColors[licenseType] ? licenseType : "free",
              isFeatured: item.isFeatured === true || item.isFeatured === 1,
              supportedPlatforms: parseStringArray(item.supportedPlatforms).map(
                (platform) => platform.toLowerCase()
              ),
              // The products table has no version/download-count columns; use
              // neutral defaults so the existing markup keeps its shape.
              latestVersion: String(item.latestVersion || "1.0"),
              downloadCount:
                typeof item.downloadCount === "number" ? item.downloadCount : 0,
            };
          })
          .filter((product) => product.slug.length > 0);
        // Keep the hardcoded products when the API returns nothing.
        if (mapped.length > 0) setProducts(mapped);
      })
      .catch(() => {
        // Keep the hardcoded products as the fallback.
      });
    return () => controller.abort();
  }, []);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary">
      {/* Ambient background layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-atmosphere opacity-70" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <GradientOrb
          color="blue"
          size={420}
          opacity={0.22}
          blur={80}
          float
          className="absolute -left-32 top-10"
        />
        <GradientOrb
          color="purple"
          size={460}
          opacity={0.2}
          blur={90}
          float
          className="absolute -right-40 top-1/3"
        />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="relative max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-accent-electric backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-electric opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-electric" />
                </span>
                THE MARKETPLACE
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6 tracking-tight">
                Software{" "}
                <span className="text-gradient-primary">Products</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Professional software products and tools I&apos;ve built. Download,
                install, and start using them today. Free and paid options available.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Category Filter */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="section-container">
            <Reveal y={14}>
              <div className="glass gradient-border rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-accent-electric" />
                  <span className="text-sm font-medium text-text-secondary">
                    Filter by category
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      className={cn(
                        "relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300",
                        activeCategory === cat.id
                          ? "shine bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-[0_8px_24px_-10px_rgb(var(--rgb-accent-blue)/0.9)]"
                          : "glass text-text-secondary hover:text-text-primary hover:border-white/20"
                      )}
                    >
                      <span className="relative z-10">{cat.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 pb-24">
          <div className="section-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <StaggerItem key={product.id} className="h-full">
                      <Link
                        href={`/products/${product.slug}`}
                        className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
                      >
                        <SpotlightCard className="h-full">
                          <TiltCard
                            intensity={5}
                            glare={false}
                            className="glass gradient-border overflow-hidden rounded-2xl h-full flex flex-col"
                          >
                            {/* Device-mockup cover */}
                            <div className="relative h-48 overflow-hidden border-b border-white/10 bg-gradient-to-br from-surface-deep via-surface-card to-bg-secondary">
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 transition-opacity duration-500 group-hover:opacity-0"
                              />
                              {product.isFeatured && (
                                <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full border border-accent-violet/30 bg-accent-purple/20 px-2.5 py-1 text-xs font-medium text-accent-violet backdrop-blur glow-purple">
                                  <Star className="h-3 w-3" /> Featured
                                </div>
                              )}
                              <div className="absolute inset-x-0 top-4 z-10 flex justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1">
                                <div className="w-[190%] origin-top scale-50">
                                  <DeviceMockup
                                    variant={mockupVariant(
                                      product.supportedPlatforms
                                    )}
                                    title={product.name}
                                  >
                                    <MockupScreen product={product} />
                                  </DeviceMockup>
                                </div>
                              </div>
                              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-card/80 to-transparent" />
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                              {/* License badge + version pill */}
                              <div className="mb-3 flex items-center gap-2">
                                <span
                                  className={cn(
                                    "relative overflow-hidden rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium capitalize",
                                    licenseColors[product.licenseType]
                                  )}
                                >
                                  {product.licenseType}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-text-secondary">
                                  <Zap className="h-3 w-3 text-accent-electric" />
                                  v{product.latestVersion}
                                </span>
                              </div>

                              <h3 className="mb-2 text-xl font-heading font-bold text-text-primary transition-colors duration-300 group-hover:text-accent-electric">
                                {product.name}
                              </h3>
                              <p className="mb-2 text-sm font-medium text-accent-electric">
                                {product.tagline}
                              </p>
                              <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-2">
                                {product.description}
                              </p>

                              {/* Platforms */}
                              <div className="mb-4 flex items-center gap-2">
                                {product.supportedPlatforms.map((p) => (
                                  <span
                                    key={p}
                                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-base transition-transform duration-300 hover:-translate-y-0.5"
                                    title={p}
                                  >
                                    {platformIcons[p] || "📦"}
                                  </span>
                                ))}
                              </div>

                              {/* Download count + animated CTA */}
                              <div className="flex items-center justify-between border-t border-border pt-4">
                                <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                                  <Download className="h-3.5 w-3.5" />
                                  {product.downloadCount.toLocaleString()} downloads
                                </span>
                                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-blue transition-colors duration-300 group-hover:text-accent-electric">
                                  View Details
                                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                              </div>
                            </div>
                          </TiltCard>
                        </SpotlightCard>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </motion.div>
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <div className="glass gradient-border rounded-2xl py-16 text-center">
                <Shield className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                <p className="text-text-secondary">
                  No products in this category yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
