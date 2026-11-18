"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface StickyCardDeckProps {
  /** One React node per card. Each node becomes a single deck level on lg+. */
  children: ReactNode[];
  className?: string;
}

/** Sticky pin offset from the top of the viewport (px), plus a small per-card step. */
const TOP_BASE = 96;
const TOP_STEP = 10;

/** Cinematic ease-out-expo — matches the entrance used by Reveal/Stagger. */
const ENTRANCE_EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Hydration-safe capability gate. Server and first client render are identical
 * (plain grid); the sticky stack is only enabled after mount on large screens
 * with motion allowed. Matches the mounted-gate pattern used by Reveal/TiltCard.
 */
function useStickyDeckEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // 640px instead of 1024px so the stacked deck still activates when the
    // browser is zoomed (e.g. 150% on a 1366px screen = ~910px CSS width).
    const lg = window.matchMedia("(min-width: 640px)");
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

interface FallbackCardProps {
  children: ReactNode;
  index: number;
  animate: boolean;
}

/**
 * Card wrapper for the non-sticky fallback grid.
 *
 * Server + first client render (and reduced motion) return a plain, style-free
 * <div> so SSR/first-client output is byte-identical. Once mounted with motion
 * allowed we swap to a FRESH motion.div node — a new node reads `initial` on
 * mount, so whileInView produces a real staggered fade + slide-up. (Merely
 * flipping `initial` from false to an object on an existing node does nothing:
 * Motion caches its visual state at first render.)
 */
function FallbackCard({ children, index, animate }: FallbackCardProps) {
  if (!animate) {
    return <div className="h-full">{children}</div>;
  }

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4),
        ease: ENTRANCE_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

interface StickyCardProps {
  children: ReactNode;
  index: number;
}

/**
 * A single sticky level. The OUTER element owns position:sticky and stays
 * transform-free (a transform here is safe, but keeping it clean avoids any
 * containing-block surprises). Scroll-driven scale/dim live on an INNER
 * motion.div so they can never interfere with the sticky positioning.
 */
function StickyCard({ children, index }: StickyCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle depth: ease in/out as a card travels through the viewport.
  // Only transform + opacity are animated — no layout-affecting properties.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{
        top: `${TOP_BASE + index * TOP_STEP}px`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        className="relative rounded-2xl bg-[#14120f]/95 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/5"
        style={{ scale, opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Services deck:
 * - lg+ with motion allowed: single-column sticky stack; each card pins at an
 *   incremental top offset with an increasing z-index so later cards layer on
 *   top of earlier ones (a 10px sliver of each earlier card remains visible).
 * - <lg OR prefers-reduced-motion: plain responsive grid (1 col / 2 col at md),
 *   no pinning, no scroll listeners. Cards get a light staggered fade + slide-up
 *   entrance as they scroll into view (motion allowed only). Reduced-motion
 *   users get completely static cards with no inline transform/opacity.
 *
 * The deck wrapper itself is a plain, transform-free element: ancestor
 * transforms break position:sticky, so the entrance wrapper is applied ONLY to
 * the fallback grid — never to the desktop sticky cards.
 */
export function StickyCardDeck({ children, className }: StickyCardDeckProps) {
  const enabled = useStickyDeckEnabled();
  const reduce = useReducedMotion();
  // Hydration-safe entrance gate. `useReducedMotion()` is null during SSR but
  // resolves on the client, so gating the DOM shape on it during render would
  // mismatch. Server and first client render are identical (plain divs); only
  // after mount do motion-allowed users get the entrance wrapper.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const animateFallback = mounted && !reduce;
  const items = Children.toArray(children);

  if (!enabled) {
    return (
      <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>
        {items.map((child, index) => (
          <FallbackCard key={index} index={index} animate={animateFallback}>
            {child}
          </FallbackCard>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {items.map((child, index) => (
        <StickyCard key={index} index={index}>
          {child}
        </StickyCard>
      ))}
    </div>
  );
}
