"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Subtle gold ambient glow that trails the pointer.
 * - Disabled entirely on touch/coarse pointers and prefers-reduced-motion.
 * - Position is written to CSS custom properties only (no inline rgba);
 *   the gold radial itself is token-driven in globals.css (.cursor-spotlight).
 * - Kept deliberately faint so it reads as atmosphere, not a flashlight.
 */
export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (coarse.matches || reduced.matches) return;

    setEnabled(true);

    let rafId = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const paint = () => {
      rafId = 0;
      const el = spotlightRef.current;
      if (!el) return;
      el.style.setProperty("--spotlight-x", `${x}px`);
      el.style.setProperty("--spotlight-y", `${y}px`);
    };

    const handleMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      setVisible(true);
      if (!rafId) rafId = requestAnimationFrame(paint);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      className={cn(
        "cursor-spotlight pointer-events-none fixed inset-0 z-[1] mix-blend-screen",
        "transition-opacity duration-700 ease-out",
        visible ? "opacity-90" : "opacity-0"
      )}
    />
  );
}
