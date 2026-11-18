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
  /** One React node per card. Each node becomes a single deck level when motion is allowed. */
  children: ReactNode[];
  className?: string;
}

/**
 * Sticky pin offsets from the top of the viewport (px), plus a small per-card
 * step. Small screens use tighter values so later cards don't stack off-screen
 * and the topmost card stays fully readable on a ~390px-wide viewport.
 */
const TOP_BASE_DESKTOP = 96;
const TOP_STEP_DESKTOP = 10;
const TOP_BASE_MOBILE = 72;
const TOP_STEP_MOBILE = 8;
const MOBILE_BREAKPOINT = 640;

/** Cinematic ease-out-expo — matches the entrance used by Reveal/Stagger. */
const ENTRANCE_EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Hydration-safe capability gate. Server and first client render are identical
 * (plain grid); the sticky stack is only enabled after mount whenever motion is
 * allowed — on ALL viewport widths now (the width gate was removed so mobile
 * gets the same premium stack as desktop). Matches the mounted-gate pattern
 * used by Reveal/TiltCard.
 */
function useStickyDeckEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!reduce.matches);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  return enabled;
}

interface DeckTop {
  base: number;
  step: number;
}

/** Desktop offsets by default; tighter offsets once below the breakpoint. */
function getDeckTop(): DeckTop {
  if (typeof window === "undefined" || window.innerWidth >= MOBILE_BREAKPOINT) {
    return { base: TOP_BASE_DESKTOP, step: TOP_STEP_DESKTOP };
  }
  return { base: TOP_BASE_MOBILE, step: TOP_STEP_MOBILE };
}

/**
 * Pin offsets recomputed on resize so a live orientation change / rotation
 * adapts the stack. Only rendered after the mounted gate, so the client-only
 * values never cause a hydration mismatch. Listener is cleaned up on unmount.
 */
function useDeckTop(): DeckTop {
  const [top, setTop] = useState<DeckTop>(() => ({
    base: TOP_BASE_DESKTOP,
    step: TOP_STEP_DESKTOP,
  }));

  useEffect(() => {
    const update = () =>
      setTop((prev) => {
        const next = getDeckTop();
        return prev.base === next.base && prev.step === next.step ? prev : next;
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return top;
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
  base: number;
  step: number;
}

/**
 * A single sticky level. The OUTER element owns position:sticky and stays
 * transform-free (a transform here is safe, but keeping it clean avoids any
 * containing-block surprises). Scroll-driven scale/dim live on an INNER
 * motion.div so they can never interfere with the sticky positioning.
 */
function StickyCard({ children, index, base, step }: StickyCardProps) {
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
        top: `${base + index * step}px`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        className="relative rounded-2xl bg-[#15161f]/95 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/5"
        style={{ scale, opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Services deck:
 * - Any width with motion allowed: single-column sticky stack; each card pins
 *   at an incremental top offset with an increasing z-index so later cards
 *   layer on top of earlier ones (a small sliver of each earlier card remains
 *   visible). Offsets tighten on small screens (72 + index*8px) versus desktop
 *   (96 + index*10px) so the stack stays on-screen and the top card is readable.
 * - prefers-reduced-motion: plain responsive grid (1 col / 2 col at md), no
 *   pinning, no scroll listeners, completely static cards with no inline
 *   transform/opacity.
 *
 * The deck wrapper itself is a plain, transform-free element: ancestor
 * transforms break position:sticky, so the entrance wrapper is applied ONLY to
 * the fallback grid — never to the sticky cards.
 */
export function StickyCardDeck({ children, className }: StickyCardDeckProps) {
  const enabled = useStickyDeckEnabled();
  const top = useDeckTop();
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
        <StickyCard
          key={index}
          index={index}
          base={top.base}
          step={top.step}
        >
          {child}
        </StickyCard>
      ))}
    </div>
  );
}
