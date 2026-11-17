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
 * Shared capability gate: fine pointer + motion allowed.
 * Exported so the interactive components can disable effects identically.
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
    interactive: mounted && !reduce && !coarse,
    reduce: Boolean(reduce),
    coarse,
  };
}

const SPRING = { stiffness: 260, damping: 24, mass: 0.4 } as const;

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
 * Restrained pointer tilt with a spring back to rest.
 * Touch / reduced-motion users get a plain, static card (no listeners, no glare).
 * Only transform + opacity are animated — no layout shift.
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

      // Clamp to [-max, max]; MovementX/Y values are damped by the spring.
      rawY.set((px - 0.5) * max * 2);
      rawX.set((0.5 - py) * max * 2);

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

  // Plain card for touch / reduced-motion — zero overhead, zero layout shift.
  if (!interactive) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("relative", className)}
      onPointerMove={handleMove}
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
