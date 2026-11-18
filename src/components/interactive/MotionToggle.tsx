"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __nizamSetMotion?: (on: boolean) => void;
  }
}

/**
 * Small floating gold toggle that lets visitors opt out of motion.
 * Animations are ON by default for everyone — this only exposes the opt-out.
 *
 * Hydration safety: state starts `true` on BOTH the server and the first client
 * render (identical markup). The persisted value is read in `useEffect` only
 * after mount, so there is no SSR/client mismatch. Clicking delegates to the
 * inline script's `window.__nizamSetMotion`, which persists the choice and
 * reloads so the global matchMedia patch is rebuilt with the new value.
 */
export function MotionToggle() {
  const [motionOn, setMotionOn] = useState(true);

  useEffect(() => {
    try {
      setMotionOn(localStorage.getItem("nizam-motion") !== "off");
    } catch {
      // localStorage unavailable — keep the default (motion on).
    }
  }, []);

  const toggle = () => {
    const next = !motionOn;
    if (typeof window.__nizamSetMotion === "function") {
      window.__nizamSetMotion(next);
    }
    setMotionOn(next); // optimistic; __nizamSetMotion reloads the page anyway
  };

  const label = motionOn ? "Motion On" : "Motion Off";
  const action = motionOn ? "off" : "on";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${label}. Click to turn motion ${action}.`}
      aria-pressed={motionOn}
      title={`${label} — click to turn motion ${action}`}
      className="glass-strong pointer-events-auto fixed bottom-4 right-4 z-[150] inline-flex items-center gap-1.5 rounded-full border border-accent-electric/20 px-3 py-2 text-[11px] font-medium text-accent-electric shadow-lg shadow-accent-blue/20 transition-colors hover:border-accent-electric/50 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base sm:bottom-6 sm:right-6 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
    >
      <SparkleIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

/** Decorative four-point sparkle; inherits the gold `currentColor`. */
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9L12 2.5z"
        fill="currentColor"
      />
      <path
        d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
