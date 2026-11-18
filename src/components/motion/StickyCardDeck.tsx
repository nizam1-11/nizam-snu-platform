"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface StickyCardDeckProps {
  /** One React node per card. Each node becomes a single deck level on lg+. */
  children: ReactNode[];
  className?: string;
}

/** Sticky pin offset from the top of the viewport (px), plus a small per-card step. */
const TOP_BASE = 96;
const TOP_STEP = 10;

/**
 * Hydration-safe capability gate. Server and first client render are identical
 * (plain grid); the sticky stack is only enabled after mount on large screens
 * with motion allowed. Matches the mounted-gate pattern used by Reveal/TiltCard.
 */
function useStickyDeckEnabled() {
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
 *   no pinning, no scroll listeners, no transforms.
 *
 * The deck wrapper itself is a plain, transform-free element: ancestor
 * transforms break position:sticky, so this component deliberately avoids
 * wrapping the deck in Reveal/Stagger/motion.div.
 */
export function StickyCardDeck({ children, className }: StickyCardDeckProps) {
  const enabled = useStickyDeckEnabled();
  const items = Children.toArray(children);

  if (!enabled) {
    return (
      <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>
        {items.map((child, index) => (
          <div key={index} className="h-full">
            {child}
          </div>
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
