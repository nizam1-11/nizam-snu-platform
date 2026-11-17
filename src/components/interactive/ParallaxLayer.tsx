"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { usePointerCapabilities } from "@/components/motion/TiltCard";

export interface ParallaxLayerProps {
  children: React.ReactNode;
  /** 0 = static, 1 = strongest drift. Clamped to [0, 1]. Default 0.5. */
  depth?: number;
  className?: string;
}

/**
 * Lightweight pointer + scroll parallax. Scroll drives Y, pointer drives X/Y;
 * both are spring-smoothed and combined into a single transform.
 * Touch / reduced-motion users get a plain, completely static wrapper.
 */
export function ParallaxLayer({
  children,
  depth = 0.5,
  className,
}: ParallaxLayerProps) {
  const { interactive } = usePointerCapabilities();
  const ref = useRef<HTMLDivElement>(null);
  const level = Math.min(1, Math.max(0, depth));

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.6 });
  const smoothY = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.6 });

  const scrollRange = level * 60;
  const pointerRange = level * 18;

  const scrollTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    [scrollRange, -scrollRange]
  );
  const x = useTransform(smoothX, [-1, 1], [-pointerRange, pointerRange]);
  const pointerY = useTransform(smoothY, [-1, 1], [-pointerRange, pointerRange]);
  const y = useTransform<number, number>(
    [scrollTranslate, pointerY],
    ([a, b]) => a + b
  );

  useEffect(() => {
    if (!interactive) return;

    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const reset = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      document.removeEventListener("mouseleave", reset);
    };
  }, [interactive, rawX, rawY]);

  if (!interactive) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{ x, y, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
