"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  Hash,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GradientOrb } from "@/components/interactive";
import { cn } from "@/lib/utils";

type Announcement = {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string | null;
  coverImageUrl: string | null;
  relatedProductId: string | null;
  version: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const categoryStyles: Record<string, string> = {
  launch: "border-accent-violet/30 bg-accent-violet/15 text-accent-violet",
  update: "border-accent-blue/30 bg-accent-blue/15 text-accent-blue",
  security: "border-success/30 bg-success/15 text-success",
  feature: "border-accent-electric/30 bg-accent-electric/15 text-accent-electric",
  announcement: "border-white/15 bg-white/[0.06] text-text-secondary",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Deterministic UTC formatting avoids SSR/client hydration mismatches. */
function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/**
 * Hardcoded real announcements used as the initial data source and as a
 * fallback whenever the API is empty or unavailable, so the feed never
 * looks empty. (Mirrors the 3 real entries in scripts/seed-announcements.ts.)
 */
const fallbackAnnouncements: Announcement[] = [
  {
    id: "fallback-snu-automation-portfolio-launch",
    slug: "snu-automation-portfolio-launch",
    title: "SNU Automation is now on the portfolio",
    content:
      "The main app is live on the site. One Windows tool that brings together bulk video downloading, Facebook Page scheduling with safety pacing, and a visual workflow builder — driven by an AI assistant that works with the real queue and workflow services.\n\nExplore the project page for the full breakdown of features and how it works.",
    category: "launch",
    coverImageUrl: "/images/snu-logo.png",
    relatedProductId: null,
    version: "1.0",
    publishedAt: "2026-11-18T00:00:00.000Z",
    createdAt: "2026-11-18T00:00:00.000Z",
    updatedAt: "2026-11-18T00:00:00.000Z",
  },
  {
    id: "fallback-snu-clips-in-development",
    slug: "snu-clips-in-development",
    title: "SNU Clips is in development",
    content:
      "The next tool is on the way: turn long videos and livestreams into ready-to-post clips. Think video-to-clips, livestream-to-clips, a move-to-clip flow, and 100 caption templates. More details will be shared here as it takes shape.",
    category: "announcement",
    coverImageUrl: "/images/snu-logo.png",
    relatedProductId: null,
    version: null,
    publishedAt: "2026-11-18T00:00:00.000Z",
    createdAt: "2026-11-18T00:00:00.000Z",
    updatedAt: "2026-11-18T00:00:00.000Z",
  },
  {
    id: "fallback-roadmap-more-platform-workflows",
    slug: "roadmap-more-platform-workflows",
    title: "On the roadmap: more platform workflows",
    content:
      "Planned updates for SNU Automation — not shipped yet: TikTok uploading workflows, Instagram automation, and YouTube workflow automation. More platform workflows will be added over time. Follow this space for real updates as they land.",
    category: "feature",
    coverImageUrl: null,
    relatedProductId: null,
    version: null,
    publishedAt: "2026-11-18T00:00:00.000Z",
    createdAt: "2026-11-18T00:00:00.000Z",
    updatedAt: "2026-11-18T00:00:00.000Z",
  },
];

export default function WhatsNewPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    fallbackAnnouncements
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch("/api/announcements", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data: { announcements?: Announcement[] }) => {
        const fromApi = Array.isArray(data.announcements) ? data.announcements : [];
        // Keep the hardcoded real announcements when the API returns nothing.
        setAnnouncements(fromApi.length > 0 ? fromApi : fallbackAnnouncements);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAnnouncements(fallbackAnnouncements);
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary">
      {/* Ambient background layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-atmosphere opacity-70" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <GradientOrb
          color="violet"
          size={440}
          opacity={0.2}
          blur={90}
          float
          className="absolute -left-40 top-16"
        />
        <GradientOrb
          color="cyan"
          size={420}
          opacity={0.16}
          blur={90}
          float
          className="absolute -right-40 top-1/3"
        />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
          <div className="section-container text-center">
            <Reveal>
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-accent-electric backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                PRODUCT UPDATES
              </div>
              <h1 className="mb-6 text-4xl font-heading font-bold tracking-tight sm:text-5xl">
                What&apos;s <span className="text-gradient-primary">New</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
                The latest releases, features, and improvements — all in one
                place. Stay up to date with everything we&apos;ve been building.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 pb-24">
          <div className="section-container max-w-4xl">
            {/* Loading */}
            {loading && (
              <div className="space-y-6" aria-busy="true" aria-live="polite">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="glass gradient-border rounded-2xl p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="skeleton-shimmer h-6 w-24 rounded-full" />
                      <span className="skeleton-shimmer h-6 w-16 rounded-full" />
                      <span className="skeleton-shimmer ml-auto h-4 w-28 rounded-full" />
                    </div>
                    <span className="skeleton-shimmer mb-3 block h-6 w-2/3 rounded-lg" />
                    <span className="skeleton-shimmer mb-2 block h-3 w-full rounded-full" />
                    <span className="skeleton-shimmer block h-3 w-4/5 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <Reveal>
                <div className="glass gradient-border rounded-2xl px-6 py-16 text-center">
                  <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-error/20 bg-error/10">
                    <AlertCircle className="h-6 w-6 text-error" />
                  </span>
                  <h2 className="mb-2 font-heading text-xl font-bold text-text-primary">
                    Couldn&apos;t load updates
                  </h2>
                  <p className="mx-auto mb-6 max-w-sm text-sm text-text-secondary">
                    Something went wrong while fetching the latest announcements.
                    Please try again.
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => setReloadKey((key) => key + 1)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="shine relative mx-auto inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-10px_rgb(var(--rgb-accent-blue)/0.9)]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="relative z-10">Try Again</span>
                  </motion.button>
                </div>
              </Reveal>
            )}

            {/* Empty */}
            {!loading && !error && announcements.length === 0 && (
              <Reveal>
                <div className="glass gradient-border rounded-2xl px-6 py-20 text-center">
                  <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-accent-blue/20 bg-accent-blue/10 glow-blue">
                    <Bell className="h-7 w-7 text-accent-electric" />
                  </span>
                  <h2 className="mb-2 font-heading text-xl font-bold text-text-primary">
                    No updates yet
                  </h2>
                  <p className="mx-auto max-w-sm text-sm text-text-secondary">
                    New releases and announcements will appear here as soon as
                    they&apos;re published. Check back soon.
                  </p>
                </div>
              </Reveal>
            )}

            {/* Release timeline */}
            {!loading && !error && announcements.length > 0 && (
              <div className="relative space-y-6 pl-6 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-gradient-to-b before:from-accent-blue/60 before:via-accent-purple/40 before:to-transparent">
                <Stagger>
                  {announcements.map((item, index) => {
                    const category = item.category || "announcement";
                    const isLatest = index === 0;
                    return (
                      <StaggerItem key={item.id}>
                        <div className="relative">
                          <span
                            className={cn(
                              "absolute -left-[23px] top-7 h-3.5 w-3.5 rounded-full border-2 border-bg-base",
                              isLatest
                                ? "bg-accent-blue glow-blue"
                                : "bg-accent-purple/70"
                            )}
                          />
                          <motion.article
                            whileHover={{ y: -4 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 24,
                            }}
                            className={cn(
                              "gradient-border rounded-2xl p-6",
                              isLatest ? "glass-strong glow-blue" : "glass"
                            )}
                          >
                            {/* Meta row */}
                            <div className="mb-4 flex flex-wrap items-center gap-2.5">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                                  categoryStyles[category] ||
                                    categoryStyles.announcement
                                )}
                              >
                                <Tag className="h-3 w-3" />
                                {category}
                              </span>
                              {item.version && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-accent-electric">
                                  <Hash className="h-3 w-3" />
                                  {item.version}
                                </span>
                              )}
                              {item.publishedAt && (
                                <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-text-secondary">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  {formatDate(item.publishedAt)}
                                </span>
                              )}
                            </div>

                            {/* Title + content */}
                            <h2 className="mb-3 font-heading text-xl font-bold text-text-primary">
                              {item.title}
                            </h2>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                              {item.content}
                            </p>
                          </motion.article>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
