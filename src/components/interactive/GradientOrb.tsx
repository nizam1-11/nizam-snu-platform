import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type OrbColor = "blue" | "purple" | "cyan" | "violet" | "auto" | "gold";

export interface GradientOrbProps {
  /**
   * Gold-family tint. Legacy names are preserved and re-mapped to gold so all
   * existing usages stay consistent: blue→primary gold, purple→bronze,
   * cyan→bright gold, violet→champagne, gold→primary gold, auto→gold blend.
   */
  color?: OrbColor;
  /** Number = pixels, string = any CSS length (e.g. "40vw"). */
  size?: number | string;
  className?: string;
  /** Blur radius in pixels. */
  blur?: number;
  /** Overall opacity (0–1). */
  opacity?: number;
  /** Gentle CSS-only vertical drift. Auto-disabled for reduced motion. */
  float?: boolean;
}

/**
 * Literal gold-family colors (matching the globals.css tokens) keep the orb
 * self-contained and correct even in the pre-hydration fallback.
 *   #D4AF37 primary gold · #C99A3B bronze · #F5D67B bright gold · #E8C66A champagne
 */
const TINT: Record<Exclude<OrbColor, "auto">, string> = {
  blue: "rgba(212, 175, 55, 0.9)", // #D4AF37
  purple: "rgba(201, 154, 59, 0.9)", // #C99A3B
  cyan: "rgba(245, 214, 123, 0.85)", // #F5D67B
  violet: "rgba(232, 198, 106, 0.9)", // #E8C66A
  gold: "rgba(212, 175, 55, 0.9)", // #D4AF37 alias
};

const AUTO_GRADIENT = `radial-gradient(circle at 34% 32%, ${TINT.cyan} 0%, ${TINT.gold} 34%, ${TINT.violet} 68%, transparent 74%)`;

/**
 * Ambient depth primitive. Pure CSS, non-interactive, screen-reader invisible.
 * The float animation is declared locally so the component is self-contained;
 * the global reduced-motion rule neutralises it automatically.
 */
export function GradientOrb({
  color = "auto",
  size = 320,
  className,
  blur = 40,
  opacity = 0.5,
  float = false,
}: GradientOrbProps) {
  const dimension = typeof size === "number" ? `${size}px` : size;
  const gradient =
    color === "auto"
      ? AUTO_GRADIENT
      : `radial-gradient(circle, ${TINT[color]} 0%, transparent 68%)`;

  const style: CSSProperties = {
    width: dimension,
    height: dimension,
    opacity,
    filter: `blur(${blur}px)`,
    background: gradient,
    animation: float ? "gradient-orb-float 9s ease-in-out infinite" : undefined,
    willChange: float ? "transform" : undefined,
  };

  return (
    <>
      {float && (
        <style>{`@keyframes gradient-orb-float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-14px,0)}}@media(prefers-reduced-motion:reduce){.gradient-orb-float{animation:none!important}}`}</style>
      )}
      <div
        aria-hidden="true"
        className={cn(
          "gradient-orb-float pointer-events-none select-none rounded-full",
          className
        )}
        style={style}
      />
    </>
  );
}
