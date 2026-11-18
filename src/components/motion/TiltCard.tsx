"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Shared capability gate.
 * `interactive` = motion is mounted and allowed. The global Motion toggle is
 * reflected through `useReducedMotion`, so that is the only opt-out. It is
 * deliberately NOT gated on coarse pointers: tap/drag work on touch, so the
 * pointer effects stay on there too. `finePointer` is exposed for the single
 * effect that is meaningless on touch (the fake cursor).
 */
export function usePointerCapabilities() {
  const reduce = useReducedMotion();
  const [coarse, setCoarse] = useState(false);
  // `useReducedMotion()` is null during SSR but resolves on the client's first
  // render. Without a mounted gate the capability result differs between the
  // two, causing hydration mismatches for every consumer of this hook.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return {
    interactive: mounted && !reduce,
    reduce: Boolean(reduce),
    coarse,
    /** True only when the primary pointer is fine (not touch/coarse). */
    finePointer: !coarse,
  };
}

const SPRING = { stiffness: 260, damping: 24, mass: 0.4 } as const;
/** Restrained tilt ceiling for touch drag/tap (degrees). */
const TOUCH_MAX_TILT = 7;

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees per axis (default 7). Overrides legacy maxTilt. */
  intensity?: number;
  /** @deprecated use `intensity`. Kept for backwards compatibility. */
  maxTilt?: number;
  /** Render the pointer-follow highlight. Default true. */
  glare?: boolean;
  /** CSS perspective in pixels. Default 1000. */
  perspective?: number;
  /** Any CSS color used as the glare core. Defaults to warm gold. */
  glowColor?: string;
}

/**
 * Restrained pointer tilt with a spring back to rest. Touch taps/drags tilt
 * with a smaller ceiling and spring back on release; only reduced motion (the
 * global Motion toggle) disables it. Only transform + opacity are animated —
 * no layout shift.
 */
export function TiltCard({
  children,
  className,
  intensity,
  maxTilt = 8,
  glare = true,
  perspective = 1000,
  glowColor = "rgba(245, 214, 123, 0.22)",
}: TiltCardProps) {
  const { interactive } = usePointerCapabilities();
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, SPRING);
  const rotateY = useSpring(rawY, SPRING);
  const glareRef = useRef<HTMLDivElement>(null);

  const max = intensity ?? maxTilt ?? 7;

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      // Touch uses a smaller ceiling so a tap/drag never swings too far;
      // values are clamped and further damped by the spring.
      const angle =
        event.pointerType === "touch" ? Math.min(max, TOUCH_MAX_TILT) : max;
      rawY.set((px - 0.5) * angle * 2);
      rawX.set((0.5 - py) * angle * 2);

      const surface = glareRef.current;
      if (surface) {
        surface.style.setProperty("--gx", `${px * 100}%`);
        surface.style.setProperty("--gy", `${py * 100}%`);
      }
    },
    [max, rawX, rawY]
  );

  const handleEnter = useCallback(() => setHovered(true), []);
  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  }, [rawX, rawY]);

  // A tap may not emit a pointermove before pointerup — position once on
  // pointerdown, then always spring back on release/cancel so nothing sticks.
  const handleTouchDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "touch") return;
      handleMove(event);
      setHovered(true);
    },
    [handleMove]
  );
  const handleTouchEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "touch") return;
      rawX.set(0);
      rawY.set(0);
      setHovered(false);
    },
    [rawX, rawY]
  );

  // Plain card only for reduced-motion — zero overhead, zero layout shift.
  if (!interactive) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("relative", className)}
      onPointerMove={handleMove}
      onPointerDown={handleTouchDown}
      onPointerUp={handleTouchEnd}
      onPointerCancel={handleTouchEnd}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: perspective,
        rotateX,
        rotateY,
      }}
      animate={{ scale: hovered ? 1.015 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
      {glare && (
        <motion.div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), ${glowColor} 0%, transparent 58%)`,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}
