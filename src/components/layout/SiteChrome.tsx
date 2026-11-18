"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { CustomCursor, RippleEffect } from "@/components/interactive";
import { MotionToggle } from "@/components/interactive/MotionToggle";

/**
 * Fixed 2px gold reading-progress bar pinned to the very top of the viewport.
 * - Motion `useScroll` drives scaleX; `useSpring` softens it for a premium feel.
 * - Reduced-motion users get the raw scroll value (no spring animation).
 * - Decorative, non-interactive, and layered above the header.
 */
function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const progress = reduceMotion ? scrollYProgress : smooth;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 bg-accent-blue/10"
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-accent-blue via-accent-electric to-accent-cyan"
        style={{ scaleX: progress }}
      />
    </div>
  );
}

/**
 * Single source of truth for which "shell" wraps a route.
 * - /admin/* renders children ONLY — admin supplies its own sidebar/chrome.
 * - everything else gets the atmospheric public shell + transitions.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {/* Global pointer affordances — mounted once, applied site-wide.
          They self-disable on touch / coarse pointers and reduced motion. */}
      <CustomCursor />
      <RippleEffect />
      <MotionToggle />

      {isAdmin ? (
        children
      ) : (
        <SmoothScroll>
          {/* Fixed gold scroll-progress bar — above every other layer */}
          <ScrollProgress />

          {/* Ambient background layers — decorative, non-interactive */}
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-atmosphere" />
            <div className="absolute inset-0 hero-ambient-glow" />
            <div className="absolute inset-0 noise-overlay" />
            <div className="absolute inset-0 grid-overlay" />
          </div>

          {/* Keyboard users can jump straight to content */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface-elevated focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-primary focus:shadow-lg focus:ring-2 focus:ring-accent-electric"
          >
            Skip to content
          </a>

          <Header />

          <main id="main-content" className="relative z-10 pt-16">
            <PageTransition>{children}</PageTransition>
          </main>

          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}
