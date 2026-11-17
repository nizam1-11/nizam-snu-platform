"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface FormSuccessSparkleProps {
  className?: string;
}

/** Eight short outward bursts, expressed as end offsets from centre. */
const PARTICLES = [
  { x: -20, y: -16 },
  { x: 0, y: -24 },
  { x: 20, y: -16 },
  { x: 24, y: 4 },
  { x: 16, y: 22 },
  { x: -16, y: 22 },
  { x: -24, y: 4 },
  { x: 8, y: -26 },
] as const;

/**
 * Decorative success affordance: a gold check drawn with Motion `pathLength`
 * plus a one-shot burst of tiny gold sparkles. Purely presentational —
 * aria-hidden and pointer-events-none. Reduced motion shows a static check
 * only (no particles, no path draw).
 */
export function FormSuccessSparkle({ className }: FormSuccessSparkleProps) {
  const reduce = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative inline-grid h-10 w-10 place-items-center",
        className
      )}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
        <motion.path
          d="M13 25 L20 32 L36 15"
          stroke="rgb(var(--rgb-accent-electric))"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>

      {!reduce &&
        PARTICLES.map((particle, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-accent-electric"
            style={{ marginLeft: -2, marginTop: -2 }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{ duration: 0.6, delay: 0.12 + i * 0.015, ease: "easeOut" }}
          />
        ))}
    </span>
  );
}
