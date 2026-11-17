"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type MotionStyle,
} from "motion/react";
import { cn } from "@/lib/utils";
import { usePointerCapabilities } from "@/components/motion/TiltCard";

const SPRING = { stiffness: 260, damping: 20, mass: 0.4 } as const;
const MAX_OFFSET = 8;

export interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** Pull factor applied to the pointer offset. Default 0.25. */
  strength?: number;
}

const clamp = (value: number) =>
  Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, value));

/**
 * Wraps any control and pulls it toward the pointer on hover, springing back
 * on leave. Transform only (no layout shift), children keep their own hover
 * styles because they remain the actual pointer targets. Touch / coarse
 * pointers and reduced motion users get a plain, listener-free div.
 */
export function Magnetic({ children, className, strength = 0.25 }: MagneticProps) {
  const { interactive } = usePointerCapabilities();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, SPRING);
  const smoothY = useSpring(y, SPRING);

  if (!interactive) {
    return <div className={cn(className)}>{children}</div>;
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(clamp(dx * strength));
    y.set(clamp(dy * strength));
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const style: MotionStyle = { x: smoothX, y: smoothY, willChange: "transform" };

  return (
    <motion.div
      className={cn("inline-block", className)}
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}
