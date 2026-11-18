"use client";

import { useEffect } from "react";
import { usePointerCapabilities } from "@/components/motion/TiltCard";

const RIPPLE_SELECTOR = 'button, a.btn, a[class*="bg-gradient"], [data-ripple]';
const MAX_RIPPLES = 8;
const DURATION = 500;

/**
 * Global click ripple. A capture-phase `pointerdown` listener drops a short-
 * lived, gold radial-gradient span at the click point of any button / primary
 * link / [data-ripple] element. The ripple is pure decoration: pointer-events
 * none, no preventDefault/stopPropagation, so navigation and forms are
 * untouched. Works on tap (pointerdown fires for touch) as well as click.
 * Node count is capped and every node/timer is cleaned up.
 * Disabled entirely (no listener, renders null) only for reduced motion.
 */
export function RippleEffect() {
  const { interactive } = usePointerCapabilities();

  useEffect(() => {
    if (!interactive) return;

    const ripples: HTMLSpanElement[] = [];
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const removeRipple = (node: HTMLSpanElement) => {
      node.remove();
      const index = ripples.indexOf(node);
      if (index !== -1) ripples.splice(index, 1);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      const element =
        target instanceof Element ? target.closest(RIPPLE_SELECTOR) : null;
      if (!element || element.matches(":disabled")) return;

      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height, 80) * 2;
      const ripple = document.createElement("span");
      ripple.setAttribute("aria-hidden", "true");
      Object.assign(ripple.style, {
        position: "absolute",
        left: `${event.clientX + window.scrollX - size / 2}px`,
        top: `${event.clientY + window.scrollY - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "9999px",
        pointerEvents: "none",
        zIndex: "9998",
        background:
          "radial-gradient(circle, rgb(var(--rgb-accent-electric) / 0.55) 0%, rgb(var(--rgb-accent-blue) / 0.28) 38%, transparent 70%)",
        transform: "scale(0)",
        opacity: "0.95",
        willChange: "transform, opacity",
        transition: `transform ${DURATION}ms var(--ease-premium), opacity ${DURATION}ms ease-out`,
      });

      document.body.appendChild(ripple);
      ripples.push(ripple);
      if (ripples.length > MAX_RIPPLES) removeRipple(ripples[0]);

      // Force a style flush so the initial scale(0) is committed before the
      // transition to scale(1) / opacity 0.
      void ripple.offsetWidth;
      ripple.style.transform = "scale(1)";
      ripple.style.opacity = "0";

      const timer = setTimeout(() => {
        removeRipple(ripple);
        timers.delete(timer);
      }, DURATION + 60);
      timers.add(timer);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      timers.forEach(clearTimeout);
      timers.clear();
      ripples.slice().forEach(removeRipple);
    };
  }, [interactive]);

  return null;
}
