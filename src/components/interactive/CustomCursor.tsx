"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePointerCapabilities } from "@/components/motion/TiltCard";

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-cursor]';
const RING_SPRING = { stiffness: 260, damping: 26, mass: 0.5 } as const;

/**
 * Gold dot + trailing ring cursor. The native cursor is deliberately kept
 * (no `cursor: none`) for usability/accessibility. The dot snaps to the
 * pointer via a raw motion value; the ring follows through a spring. Only
 * transform + opacity are animated. Coarse pointers (touch) and reduced
 * motion users render nothing and register no listeners — a fake cursor on a
 * touch screen is useless.
 */
export function CustomCursor() {
  const { interactive, finePointer } = usePointerCapabilities();
  // Motion allowed AND a real (fine) pointer — no fake cursor on touch screens.
  const cursorEnabled = interactive && finePointer;
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const visibleRef = useRef(false);
  const hoveredRef = useRef(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, RING_SPRING);
  const ringY = useSpring(dotY, RING_SPRING);

  useEffect(() => {
    if (!cursorEnabled) return;

    const onMove = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const target = event.target;
      const overInteractive =
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
      if (overInteractive !== hoveredRef.current) {
        hoveredRef.current = overInteractive;
        setHovered(overInteractive);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
      hoveredRef.current = false;
      setHovered(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [cursorEnabled, dotX, dotY]);

  if (!cursorEnabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-accent-electric"
        style={{ left: -3, top: -3, x: dotX, y: dotY, willChange: "transform" }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="absolute h-[34px] w-[34px] rounded-full border"
        style={{
          left: -17,
          top: -17,
          x: ringX,
          y: ringY,
          borderColor: "rgb(var(--rgb-accent-blue) / 0.7)",
          willChange: "transform",
        }}
        animate={{ opacity: visible ? 1 : 0, scale: hovered ? 1.75 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* Glow layer: opacity-only so hover stays GPU-cheap. */}
        <motion.span
          className="absolute inset-[-1px] rounded-full border"
          style={{
            borderColor: "rgb(var(--rgb-accent-electric) / 0.95)",
            boxShadow:
              "0 0 18px rgb(var(--rgb-accent-electric) / 0.55), 0 0 36px rgb(var(--rgb-accent-blue) / 0.35)",
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>
    </div>
  );
}
