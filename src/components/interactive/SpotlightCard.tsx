"use client";

import { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionStyle,
} from "motion/react";
import { cn } from "@/lib/utils";
import { usePointerCapabilities } from "@/components/motion/TiltCard";

const TILT_SPRING = { stiffness: 260, damping: 24, mass: 0.4 } as const;
const MAX_TILT = 7;

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Reuse the restrained pointer tilt in addition to the light. */
  withTilt?: boolean;
}

/**
 * Premium card with a cursor-following radial light, a 1px border highlight
 * and a faint sheen. Pointer position is written to CSS vars only — no React
 * re-renders on move. Touch / reduced-motion users get a plain static card.
 */
export function SpotlightCard({
  children,
  className,
  withTilt = false,
}: SpotlightCardProps) {
  const { interactive } = usePointerCapabilities();
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, TILT_SPRING);
  const rotateY = useSpring(rawY, TILT_SPRING);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);

      if (withTilt) {
        rawY.set((px - 0.5) * MAX_TILT * 2);
        rawX.set((0.5 - py) * MAX_TILT * 2);
      }
    },
    [withTilt, rawX, rawY]
  );

  const handleEnter = useCallback(() => setHovered(true), []);
  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  }, [rawX, rawY]);

  if (!interactive) {
    return <div className={cn(className)}>{children}</div>;
  }

  const tiltStyle: MotionStyle | undefined = withTilt
    ? {
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        rotateX,
        rotateY,
      }
    : undefined;

  const lightOpacity = hovered ? 1 : 0;
  const sheenTransform = hovered
    ? "translateX(320%) skewX(-20deg)"
    : "translateX(0%) skewX(-20deg)";

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative isolate", className)}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={tiltStyle}
    >
      {children}

      {/* Cursor-following radial light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: lightOpacity,
          transition: "opacity 0.35s var(--ease-premium)",
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--rgb-accent-blue) / 0.18) 0%, rgb(var(--rgb-accent-electric) / 0.09) 42%, transparent 72%)",
        }}
      />

      {/* 1px border highlight that tracks the pointer (mask-composite ring) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
        style={{
          opacity: lightOpacity,
          transition: "opacity 0.35s var(--ease-premium)",
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--rgb-accent-electric) / 0.75), transparent 72%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />

      {/* Faint moving sheen — transform only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            transform: sheenTransform,
            transition: "transform 0.75s var(--ease-premium)",
            background:
              "linear-gradient(100deg, transparent, rgb(var(--rgb-accent-electric) / 0.14), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}
