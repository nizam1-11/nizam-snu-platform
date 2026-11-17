"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds before the reveal starts once in view. Default 0. */
  delay?: number;
  /** Edge the wipe travels from. Default "up". */
  direction?: "up" | "left" | "right";
}

const HIDDEN_CLIP: Record<NonNullable<ImageRevealProps["direction"]>, string> = {
  // inset(top right bottom left): 100% on a side hides the image from that edge.
  up: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Cinematic clip-path wipe + subtle scale-down reveal. The outer element is
 * `relative` and takes the caller's sizing classes, so a next/image `fill`
 * child still fills correctly; an inner full-size layer carries the scale so
 * the child's own absolute/relative styles are untouched. Reduced motion gets
 * a plain static wrapper with no clip or transform.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ImageRevealProps) {
  const reduce = useReducedMotion();
  // `useReducedMotion()` is null during SSR but resolves on the client. Deciding
  // the DOM shape from it during render causes a hydration mismatch (React #418),
  // so keep the same motion.div tree on the server and first client render, and
  // only switch to the static state after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isReduced = mounted && !!reduce;

  const transition = {
    duration: 0.95,
    delay,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <motion.div
      className={cn("relative", className)}
      initial={isReduced ? false : { clipPath: HIDDEN_CLIP[direction] }}
      whileInView={isReduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={transition}
    >
      <motion.div
        className="relative h-full w-full"
        initial={isReduced ? false : { scale: 1.06 }}
        whileInView={isReduced ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ ...transition, duration: 1.15 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
