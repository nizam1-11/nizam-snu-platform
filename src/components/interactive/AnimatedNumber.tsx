"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedNumberProps {
  value: string | number;
  className?: string;
}

const CHAR_STYLE = {
  width: "0.66em",
  height: "1em",
  lineHeight: 1,
  verticalAlign: "bottom",
  textAlign: "center",
} as const;

/** Scramble digits, then settle on the real one. */
const sequenceFor = (digit: string) => ["9", "5", "2", digit];

/**
 * Odometer-style stat reveal. Each digit briefly rolls 9 → 5 → 2 → itself;
 * other characters fade/scale in. Every character occupies a fixed box so
 * nothing reflows. When the roll ends the final DOM text is exactly the input
 * `value`, and an `aria-label` keeps the accessible name stable throughout.
 * Reduced motion renders plain text immediately (no observer, no listeners).
 */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const [rolling, setRolling] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const firedRef = useRef(false);
  const text = String(value);

  useEffect(() => {
    firedRef.current = false;
    setRolling(false);
    if (reduce) return;

    const node = ref.current;
    if (!node) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || firedRef.current) return;
        firedRef.current = true;
        setRolling(true);
        timer = setTimeout(() => setRolling(false), 1200);
        observer.disconnect();
      },
      { threshold: 0.6 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [reduce, value]);

  // NOTE: do not render a different HTML shape for reduced-motion users —
  // `useReducedMotion()` is null on the server but true on the client, which
  // would cause a hydration mismatch (React #418). Keep the same char-span
  // structure in both cases; the effect above simply skips the roll when
  // reduced motion is preferred, so the digits stay at their final value.

  const chars = Array.from(text);

  return (
    <span ref={ref} className={cn("inline-block", className)} aria-label={text}>
      {chars.map((char, index) => {
        const isDigit = /^[0-9]$/.test(char);

        if (!isDigit || !rolling) {
          return rolling ? (
            <motion.span
              key={index}
              aria-hidden="true"
              className="inline-block"
              style={CHAR_STYLE}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
            >
              {char}
            </motion.span>
          ) : (
            <span key={index} className="inline-block" style={CHAR_STYLE}>
              {char}
            </span>
          );
        }

        const sequence = sequenceFor(char);
        return (
          <span
            key={index}
            aria-hidden="true"
            className="relative inline-block overflow-hidden"
            style={CHAR_STYLE}
          >
            <motion.span
              className="absolute left-0 top-0 flex w-full flex-col"
              initial={{ y: "0%" }}
              animate={{ y: ["0%", "-25%", "-50%", "-75%"] }}
              transition={{
                duration: 0.85,
                times: [0, 0.42, 0.68, 1],
                ease: "easeOut",
                delay: index * 0.05,
              }}
            >
              {sequence.map((digit, i) => (
                <span
                  key={i}
                  className="block text-center"
                  style={{ height: "1em", lineHeight: 1 }}
                >
                  {digit}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
