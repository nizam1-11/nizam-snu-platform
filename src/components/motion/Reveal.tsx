"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";
/** Cinematic ease-out-expo — matches --ease-out-expo in globals.css. */
const EASE = [0.19, 1, 0.22, 1] as const;

/**
 * `useReducedMotion()` is null during SSR but resolves on the client. Using it
 * to switch the rendered element during render caused hydration mismatches.
 * This hook keeps the server and first client render identical (no animation
 * props) and only enables motion after mount — reduced-motion users stay static.
 */
function useAnimateEnabled() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduceMotion;
}

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  /** Travel direction. Overrides x/y when supplied. */
  direction?: Direction;
  className?: string;
  once?: boolean;
}

/** Scroll-triggered entrance using Motion (no ScrollTrigger ownership overlap). */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.6,
  direction,
  className,
  once = true,
}: RevealProps) {
  const animate = useAnimateEnabled();
  const distance = Math.abs(y) || Math.abs(x) || 24;
  const initialX =
    direction === "left" ? distance : direction === "right" ? -distance : x;
  const initialY =
    direction === "up" ? distance : direction === "down" ? -distance : y;

  return (
    <motion.div
      className={cn(className)}
      initial={animate ? { opacity: 0, x: initialX, y: initialY, scale: 0.985 } : false}
      whileInView={animate ? { opacity: 1, x: 0, y: 0, scale: 1 } : undefined}
      viewport={animate ? { once, amount: 0.15 } : undefined}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
  once?: boolean;
}

/** Parent orchestrator — pair with <StaggerItem> children. */
export function Stagger({
  children,
  stagger = 0.08,
  className,
  once = true,
}: StaggerProps) {
  const animate = useAnimateEnabled();

  return (
    <motion.div
      className={cn(className)}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "show" : undefined}
      viewport={animate ? { once, amount: 0.12 } : undefined}
      variants={
        animate
          ? {
              hidden: {},
              show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Child of <Stagger>. Inherits the hidden/show variants from its parent. */
export function StaggerItem({
  children,
  className,
  delay = 0,
}: StaggerItemProps) {
  const animate = useAnimateEnabled();

  return (
    <motion.div
      className={cn(className)}
      variants={
        animate
          ? {
              hidden: { opacity: 0, y: 22, scale: 0.97 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.55, delay, ease: EASE },
              },
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
