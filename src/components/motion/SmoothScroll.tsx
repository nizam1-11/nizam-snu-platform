"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Native scrolling (and the reduced-motion CSS override) is the accessible default.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      anchors: true, // in-page #links stay smooth and in sync with Lenis
      autoRaf: false, // we drive the loop explicitly below
    });

    // Keep GSAP ScrollTrigger in sync with Lenis-driven scrolling (needed by
    // the pinned horizontal project showcase and scroll-linked reveals).
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    // Neutralize any native `scroll-behavior: smooth` while Lenis is active.
    const root = document.documentElement;
    root.classList.add("lenis-active");

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onLenisScroll);
      root.classList.remove("lenis-active");
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
