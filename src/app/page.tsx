"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Box, Download, Layers, Sparkles, Star } from "lucide-react";

import { HeroSceneWrapper } from "@/components/3d/HeroSceneWrapper";
import { PhotoDistortionWrapper } from "@/components/3d/PhotoDistortionWrapper";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import {
  GradientOrb,
  Magnetic,
  AnimatedNumber,
  ImageReveal,
  SpotlightCard,
} from "@/components/interactive";
import { CoverAmbience } from "@/components/interactive/CoverAmbience";
import { cn } from "@/lib/utils";

type HomeProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  category: string;
  features: string[];
  licenseType: string;
  isFeatured: boolean;
};

type HomeProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  coverImageUrl: string | null;
};

const licenseColors: Record<string, string> = {
  free: "bg-success/20 text-success",
  freemium: "bg-accent-blue/20 text-accent-blue",
  paid: "bg-accent-purple/20 text-accent-purple",
  "open-source": "bg-accent-cyan/20 text-accent-cyan",
};

/**
 * One real product used only as the initial/fallback data source, so the
 * section is never empty while the API is loading or unavailable.
 */
const fallbackProduct: HomeProduct = {
  id: "snu-automation",
  slug: "snu-automation",
  name: "SNU Automation",
  tagline: "Bulk downloads, Facebook scheduling and workflows in one app",
  description:
    "One Windows app for bulk video downloads, Facebook Page scheduling, and visual automation workflows — with an AI assistant that acts on real services, safely and with you in control.",
  logoUrl: "/images/snu-logo.png",
  category: "automation",
  features: [
    "Bulk video downloading",
    "Facebook Page scheduling",
    "Visual workflow builder",
    "AI assistant",
  ],
  licenseType: "freemium",
  isFeatured: true,
};

/** D1 stores features as a JSON string; tolerate arrays too. */
function parseFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).slice(0, 3);
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed))
        return parsed.map(String).filter(Boolean).slice(0, 3);
    } catch {
      // Malformed JSON — fall back to no chips.
    }
  }
  return [];
}

/** Keep card copy short — a tagline is at most a single compact line. */
function truncateWords(text: string, maxWords = 12): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")}…` : text;
}

function truncateChars(text: string, maxChars = 140): string {
  return text.length > maxChars ? `${text.slice(0, maxChars).trimEnd()}…` : text;
}

function ProductLogo({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);

  return (
    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-lg shadow-black/30">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${name} logo`}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <Box className="h-9 w-9 text-accent-electric" aria-hidden="true" />
      )}
    </div>
  );
}

function ProjectCover({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);

  return (
    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-lg shadow-black/30">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${title} cover`}
          onError={() => setFailed(true)}
          className="h-full w-full rounded-lg object-cover"
        />
      ) : (
        <Layers className="h-8 w-8 text-accent-violet" aria-hidden="true" />
      )}
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<HomeProduct[]>([fallbackProduct]);
  const [productCount, setProductCount] = useState(1);
  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState<HomeProject[]>([]);
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/projects", { signal: controller.signal }).then((r) => (r.ok ? r.json() : { projects: [] })),
      fetch("/api/products", { signal: controller.signal }).then((r) => (r.ok ? r.json() : { products: [] })),
    ])
      .then(([projectData, productData]) => {
        const projects = Array.isArray(projectData?.projects) ? projectData.projects : [];
        setProjectCount(projects.length);
        setProjects(
          projects.map((item: Record<string, unknown>) => ({
            id: String(item.id || item.slug || ""),
            slug: String(item.slug || ""),
            title: String(item.title || "Untitled"),
            description: String(item.description || ""),
            category: String(item.category || "project"),
            techStack: parseFeatures(item.techStack),
            coverImageUrl:
              typeof item.coverImageUrl === "string" && item.coverImageUrl
                ? item.coverImageUrl
                : null,
          }))
        );
        let downloads = 0;
        for (const product of Array.isArray(productData?.products) ? productData.products : []) {
          for (const release of Array.isArray(product?.releases) ? product.releases : []) {
            for (const asset of Array.isArray(release?.assets) ? release.assets : []) {
              const n = Number(asset?.downloadCount);
              if (Number.isFinite(n) && n > 0) downloads += n;
            }
          }
        }
        setDownloadCount(downloads);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

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
        const mapped: HomeProduct[] = fromApi
          .map((item) => {
            const licenseType = String(item.licenseType || "free");
            return {
              id: String(item.id || item.slug || ""),
              slug: String(item.slug || ""),
              name: String(item.name || "Untitled"),
              tagline: String(item.tagline || ""),
              description: String(item.description || ""),
              logoUrl:
                typeof item.logoUrl === "string" && item.logoUrl
                  ? item.logoUrl
                  : null,
              category: String(item.category || "utility"),
              features: parseFeatures(item.features),
              licenseType: licenseColors[licenseType] ? licenseType : "free",
              isFeatured: item.isFeatured === true || item.isFeatured === 1,
            };
          })
          .filter((product) => product.slug.length > 0);

        if (mapped.length > 0) {
          setProducts(mapped);
          setProductCount(mapped.length);
        } else {
          // API responded successfully but has no published products yet.
          setProducts([]);
          setProductCount(0);
        }
      })
      .catch(() => {
        // Keep the real SNU Automation fallback on load/error.
      });
    return () => controller.abort();
  }, []);

  const featuredProducts = products.filter((product) => product.isFeatured);
  const displayedProducts = (
    featuredProducts.length > 0 ? featuredProducts : products
  ).slice(0, 3);

  const stats = [
    { label: "Projects", value: String(projectCount) },
    { label: "Products", value: String(productCount) },
    { label: "Downloads", value: String(downloadCount) },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Preserve the existing 3D / atmosphere background */}
        <HeroSceneWrapper />

        <div className="relative z-10 w-full section-container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* ── Left: cinematic copy ── */}
            <div className="text-center lg:text-left">
              <Reveal y={16}>
                <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 shadow-lg shadow-accent-blue/10">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-electric opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-electric glow-electric" />
                  </span>
                  <span className="text-xs font-medium tracking-wide text-text-secondary sm:text-sm">
                    WELCOME TO SNU AUTOMATION · AI DEVELOPER
                  </span>
                </div>
              </Reveal>

              {/*
                GSAP word reveal. The scoped rule below paints only the 3rd
                word ("AI-Powered") with the primary gradient — TextReveal
                renders one wrapper <span> per word in source order.
              */}
              <style>{`
                .hero-headline > span > [data-reveal-word] { -webkit-text-fill-color: currentColor; }
                .hero-headline > span:nth-of-type(3) > [data-reveal-word] {
                  background: linear-gradient(120deg, #b5794a, #d8a46b);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                  -webkit-text-fill-color: transparent;
                }
              `}</style>
              <TextReveal
                as="h1"
                text="I Build AI-Powered Tools & Smart Automation"
                className="hero-headline mt-7 font-heading text-4xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
              />

              <Reveal delay={0.15}>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg lg:mx-0">
                  I&apos;m Syed Nizam Uddin, an independent developer building
                  AI applications, automation systems, and digital products
                  that turn complex tasks into simpler, smarter experiences.
                  Explore the tools I&apos;ve built, browse my projects, or
                  download something useful — there&apos;s more on the way.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                  <Magnetic>
                    <Link
                      href="/projects"
                      className="shine group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-blue/25 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-accent-blue/40"
                    >
                      Explore My Work
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2.5 rounded-xl glass px-8 py-4 text-base font-semibold text-text-primary transition-colors duration-300 hover:bg-surface-light hover:glow-electric"
                    >
                      <Download className="h-5 w-5" />
                      Discover My Software
                    </Link>
                  </Magnetic>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-6 flex flex-col items-center gap-3 lg:items-start">
                  <p className="text-sm text-text-muted">
                    Have an idea worth building?{" "}
                    <Link
                      href="/contact"
                      className="font-medium text-accent-electric transition-colors duration-300 hover:text-accent-blue"
                    >
                      Let&apos;s make it real.
                    </Link>
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    {[
                      "AI Applications",
                      "Business Automation",
                      "Software Products",
                      "Digital Innovation",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full glass px-3 py-1 text-[10px] font-medium tracking-wide text-text-muted sm:text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Stats as refined metric cards */}
              <Stagger className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-3 sm:gap-4 lg:mx-0">
                {stats.map((stat) => (
                  <StaggerItem key={stat.label}>
                    <div className="rounded-2xl glass px-3 py-5 text-center transition-colors duration-300 hover:border-accent-blue/40">
                      <div className="font-heading text-2xl font-bold text-gradient-primary sm:text-3xl">
                        <AnimatedNumber value={stat.value} />
                      </div>
                      <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-text-muted sm:text-xs">
                        {stat.label}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* ── Right: premium profile card ──
                Visible at every width now. On <lg the grid stacks this below the
                copy and it renders as a compact portrait; at lg+ the original
                sizing/positioning is unchanged (lg:mt-0 + lg:max-w-sm). */}
            <div className="relative mt-4 lg:mt-0">
              <GradientOrb
                color="purple"
                size={420}
                blur={70}
                opacity={0.4}
                float
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <Reveal direction="left" delay={0.1}>
                <div className="relative mx-auto w-full max-w-[220px] sm:max-w-[280px] lg:max-w-sm">
                  {/* Concentric glow rings */}
                  <div className="absolute -inset-8 rounded-[3rem] border border-accent-blue/10" />
                  <div className="absolute -inset-4 rounded-[2.75rem] border border-accent-purple/20" />
                  <div className="relative rounded-[2rem] glass-strong gradient-border p-3 glow-blue">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-surface-deep">
                      <ImageReveal className="relative h-full w-full" direction="up">
                        <PhotoDistortionWrapper />
                      </ImageReveal>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent" />
                      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-25" />
                      <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                        Profile
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products — real published products from the API */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-electric">
                The Marketplace
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
                Featured <span className="text-gradient-primary">Products</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                Software products and tools I&apos;ve built. Download, use, and
                provide feedback.
              </p>
            </div>
          </Reveal>

          {displayedProducts.length === 0 ? (
            <Reveal delay={0.1}>
              <div className="mx-auto mt-12 max-w-md">
                <div className="glass gradient-border rounded-2xl py-16 text-center">
                  <Box className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                  <p className="text-text-secondary">Products coming soon.</p>
                </div>
              </div>
            </Reveal>
          ) : (
            <Stagger className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6">
              {displayedProducts.map((product) => (
                <StaggerItem
                  key={product.id}
                  className="w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <SpotlightCard className="h-full">
                    <TiltCard
                      intensity={5}
                      glare={false}
                      className="glass gradient-border group flex h-full flex-col overflow-hidden rounded-2xl"
                    >
                      {/* Cover — icon first, with butterflies, motes and a soft bloom */}
                      <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-surface-deep via-surface-card to-bg-secondary">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10"
                        />
                        <CoverAmbience />
                        <div
                          aria-hidden="true"
                          className="absolute h-24 w-24 animate-pulse rounded-full bg-accent-electric/20 blur-2xl"
                        />
                        <Star
                          aria-hidden="true"
                          className="absolute left-7 top-6 h-3 w-3 animate-pulse text-accent-electric/80"
                          style={{ animationDelay: "250ms" }}
                        />
                        <Star
                          aria-hidden="true"
                          className="absolute bottom-7 right-8 h-2 w-2 animate-pulse text-accent-violet/80"
                          style={{ animationDelay: "700ms" }}
                        />
                        {product.isFeatured && (
                          <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full border border-accent-violet/30 bg-accent-purple/20 px-2.5 py-1 text-[10px] font-medium text-accent-violet backdrop-blur glow-purple">
                            <Star className="h-3 w-3" /> Featured
                          </span>
                        )}
                        <ProductLogo src={product.logoUrl} name={product.name} />
                      </div>

                      <div className="flex flex-1 flex-col p-5 text-center">
                        {/* License + category badges */}
                        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                          <span
                            className={cn(
                              "rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium capitalize",
                              licenseColors[product.licenseType] ||
                                "bg-white/10 text-text-secondary"
                            )}
                          >
                            {product.licenseType}
                          </span>
                          {product.category && (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] capitalize text-text-secondary">
                              {product.category.replace(/-/g, " ")}
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading text-lg font-bold text-text-primary transition-colors duration-300 group-hover:text-accent-electric">
                          {product.name}
                        </h3>
                        {product.tagline && (
                          <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-accent-electric">
                            {truncateWords(product.tagline)}
                          </p>
                        )}

                        {product.features.length > 0 && (
                          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={`${feature}-${index}`}
                                className="animate-pulse rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-text-muted"
                                style={{ animationDuration: "3.5s" }}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto flex items-center justify-center gap-2 border-t border-border pt-4">
                          <Link
                            href={`/products/${product.slug}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-accent-blue/20 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
                          >
                            View
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </Link>
                          <Link
                            href="/download"
                            className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-1.5 text-xs font-medium text-text-primary transition-colors duration-300 hover:bg-surface-light hover:glow-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </Link>
                        </div>
                      </div>
                    </TiltCard>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* Featured Projects — real projects from the API */}
      <section className="relative bg-surface/50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-violet">
                Selected Work
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
                Featured <span className="text-gradient-primary">Projects</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                A selection of my automation systems, applications, and
                experiments.
              </p>
            </div>
          </Reveal>

          {projects.length === 0 ? (
            <Reveal delay={0.1}>
              <div className="mx-auto mt-12 max-w-md">
                <div className="glass gradient-border rounded-2xl py-16 text-center">
                  <Layers className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                  <p className="text-text-secondary">Projects coming soon.</p>
                </div>
              </div>
            </Reveal>
          ) : (
            <Stagger className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6">
              {projects.map((project) => (
                <StaggerItem
                  key={project.id}
                  className="w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <SpotlightCard className="h-full">
                    <TiltCard
                      intensity={5}
                      glare={false}
                      className="glass gradient-border group flex h-full flex-col overflow-hidden rounded-2xl"
                    >
                      <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-surface-deep via-surface-card to-bg-secondary">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-accent-electric/10"
                        />
                        <CoverAmbience />
                        <div
                          aria-hidden="true"
                          className="absolute h-24 w-24 animate-pulse rounded-full bg-accent-purple/20 blur-2xl"
                        />
                        <Star
                          aria-hidden="true"
                          className="absolute left-7 top-6 h-3 w-3 animate-pulse text-accent-violet/80"
                          style={{ animationDelay: "300ms" }}
                        />
                        <ProjectCover
                          src={project.coverImageUrl}
                          title={project.title}
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-5 text-center">
                        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                          <span className="rounded-full border border-accent-violet/30 bg-accent-purple/20 px-2.5 py-1 text-[10px] font-medium capitalize text-accent-violet">
                            {project.category.replace(/-/g, " ")}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-text-primary transition-colors duration-300 group-hover:text-accent-electric">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-text-secondary">
                            {truncateChars(project.description)}
                          </p>
                        )}

                        {project.techStack.length > 0 && (
                          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                            {project.techStack.slice(0, 3).map((tech, index) => (
                              <span
                                key={`${tech}-${index}`}
                                className="animate-pulse rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-text-muted"
                                style={{
                                  animationDuration: "3.5s",
                                  animationDelay: `${index * 250}ms`,
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto flex justify-center border-t border-border pt-4">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-accent-purple/20 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
                          >
                            View Details
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </TiltCard>
                  </SpotlightCard>
                </StaggerItem>
              ))}

              {/* Tasteful teaser — no invented details */}
              <StaggerItem className="w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-accent-electric/30 bg-gradient-to-br from-accent-purple/[0.06] to-accent-blue/[0.06] p-6 text-center">
                  <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-electric/20 bg-accent-electric/10">
                    <Sparkles className="h-6 w-6 animate-pulse text-accent-electric" />
                  </div>
                  <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-accent-electric">
                    Surprise — Coming Soon
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-text-muted">
                    Something new is on the way.
                  </p>
                </div>
              </StaggerItem>
            </Stagger>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-strong card-interactive px-6 py-14 text-center glow-blue">
              <GradientOrb
                color="blue"
                size={380}
                blur={70}
                opacity={0.25}
                className="absolute -top-28 left-1/2 -translate-x-1/2"
              />
              <div className="relative z-10">
                <Sparkles className="mx-auto mb-5 h-6 w-6 text-accent-electric" />
                <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
                  Let&apos;s Build Something Together
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                  Interested in AI automation, custom software, or workflow
                  solutions? Get in touch and let&apos;s discuss your project.
                </p>
                <Link
                  href="/contact"
                  className="shine group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-blue/25 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Contact Me
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
