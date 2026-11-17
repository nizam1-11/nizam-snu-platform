"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GradientOrb } from "@/components/interactive/GradientOrb";
import { cn } from "@/lib/utils";

/**
 * CSS-only hero visual — used pre-hydration and when WebGL is unavailable.
 * Gold radial glows layered over near-black so unsupported devices still look
 * premium. All colors come from the gold-mapped tokens / GradientOrb palette.
 */
function AtmosphereFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden bg-atmosphere",
        className
      )}
    >
      <div className="hero-ambient-glow" />
      <div className="absolute inset-0 grid-overlay" />
      <GradientOrb
        color="gold"
        size={440}
        blur={48}
        opacity={0.5}
        float
        className="absolute -left-24 -top-28"
      />
      <GradientOrb
        color="purple"
        size={400}
        blur={52}
        opacity={0.42}
        float
        className="absolute -right-24 top-8"
      />
      <GradientOrb
        color="cyan"
        size={320}
        blur={56}
        opacity={0.28}
        className="absolute -bottom-24 left-1/3"
      />
      <div className="absolute inset-0 noise-overlay" />
    </div>
  );
}

const HeroSceneDynamic = dynamic(
  () => import("@/components/3d/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false, loading: () => <AtmosphereFallback /> }
);

/** Feature-detect WebGL without leaving a live context behind. */
function supportsWebGL() {
  try {
    if (typeof window === "undefined" || !window.WebGLRenderingContext) {
      return false;
    }
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!context) return false;
    (context as WebGLRenderingContext)
      .getExtension("WEBGL_lose_context")
      ?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function HeroSceneWrapper() {
  // null → keep the SSR output identical to the pre-hydration fallback.
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    // Defer to the next frame so detection never blocks hydration.
    const raf = requestAnimationFrame(() => setWebgl(supportsWebGL()));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (webgl === false) return <AtmosphereFallback />;
  return <HeroSceneDynamic />;
}
