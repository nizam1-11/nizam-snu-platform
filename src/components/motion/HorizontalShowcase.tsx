"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

export interface HorizontalShowcaseItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
}

export interface HorizontalShowcaseProps {
  items: HorizontalShowcaseItem[];
  className?: string;
}

/* Register once on the client — mirrors src/hooks/useScrollReveal.ts. */
let registered = false;
function registerGsap() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/**
 * Hydration-safe capability gate. Server and first client render are identical
 * (the non-pinned fallback); pinning is switched on only after mount on large
 * screens when motion is allowed — mirrors StickyCardDeck/Reveal/TiltCard.
 */
function usePinnedEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(lg.matches && !reduce.matches);
    update();
    lg.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}

/** A single showcase card, shared by the pinned and fallback layouts. */
function ShowcaseCard({
  item,
  className,
}: {
  item: HorizontalShowcaseItem;
  className?: string;
}) {
  return (
    <TiltCard
      className={cn(
        "glass gradient-border group relative flex w-[82vw] max-w-[26rem] shrink-0 flex-col overflow-hidden rounded-2xl",
        // Drop the cap on lg so three cards always overflow a desktop viewport.
        "lg:w-[38vw] lg:max-w-none",
        className
      )}
    >
      {/* Gradient cover */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-accent-blue/20 via-accent-purple/10 to-transparent">
        <div className="absolute inset-0 grid-overlay opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-electric/60 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full glass px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">
          {item.category}
        </span>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl glass-strong text-3xl shadow-lg shadow-accent-blue/20">
          <span aria-hidden="true">🚀</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-heading text-xl font-bold text-text-primary">
          {item.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-text-secondary">
          {item.description}
        </p>
        <div className="mb-6 mt-auto flex flex-wrap gap-2">
          {item.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-surface-elevated/70 px-2 py-1 text-xs text-text-secondary ring-1 ring-inset ring-white/5"
            >
              {tech}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${item.slug}`}
          className="group/link inline-flex items-center gap-1 self-start text-sm font-medium text-accent-electric transition-colors hover:text-accent-blue"
        >
          View Details
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </TiltCard>
  );
}

/**
 * Horizontal scroll showcase.
 *
 * - lg+ with motion allowed: the OUTER section is pinned by ScrollTrigger while
 *   the inner flex track translates on `x` from 0 to
 *   `-(track.scrollWidth - viewportWidth)` with a smooth scrub. Distance and
 *   end are function-based + `invalidateOnRefresh` so they survive resizes.
 * - <lg OR prefers-reduced-motion (and pre-mount on every viewport): a plain
 *   snap-scrolling overflow row with all cards reachable — no pin, no listeners.
 *
 * The enable decision lives behind a mounted gate so SSR and the first client
 * render produce identical markup; only CSS classes differ after mount.
 */
export function HorizontalShowcase({
  items,
  className,
}: HorizontalShowcaseProps) {
  const enabled = usePinnedEnabled();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled || items.length < 2) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const hint = hintRef.current;
    if (!section || !track) return;

    registerGsap();

    // Horizontal travel needed to bring the final card's trailing edge into view.
    const getDistance = () =>
      Math.max(0, track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Decorative hint fades out over the first third of the scroll.
            if (hint) {
              hint.style.opacity = String(1 - Math.min(1, self.progress * 3));
            }
          },
        },
      });
    }, section);

    return () => {
      ctx.revert();
      if (hint) hint.style.opacity = "";
    };
  }, [enabled, items.length]);

  const header = (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-accent-electric">
          <Sparkles className="h-3.5 w-3.5" />
          Spotlight
        </div>
        <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
          Featured <span className="text-gradient-primary">Work</span>
        </h2>
      </div>
      <span
        ref={hintRef}
        aria-hidden="true"
        className="flex items-center gap-2 text-sm text-text-secondary"
      >
        Scroll to explore
        <ArrowRight className="h-4 w-4 text-accent-electric" />
      </span>
    </div>
  );

  if (enabled) {
    return (
      <section
        ref={sectionRef}
        aria-label="Featured projects showcase"
        className={cn(
          "relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-bg-base py-16",
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
        <div className="section-container relative z-10">{header}</div>
        <div
          ref={trackRef}
          className="relative z-10 flex w-max gap-8 px-6 pb-4 will-change-transform lg:gap-12 lg:px-[6vw]"
        >
          {items.map((item) => (
            <ShowcaseCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Featured projects showcase"
      className={cn("relative w-full py-16", className)}
    >
      <div className="section-container">{header}</div>
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 sm:px-6 lg:px-8 [scrollbar-width:thin]">
        {items.map((item) => (
          <ShowcaseCard key={item.slug} item={item} className="snap-start" />
        ))}
      </div>
    </section>
  );
}
