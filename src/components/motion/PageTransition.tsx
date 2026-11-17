"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

/** Cinematic ease-out-expo, shared with Reveal / globals.css. */
const EASE = [0.19, 1, 0.22, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={
          reduceMotion
            ? { opacity: 1 }
            : {
                opacity: 0,
                y: 14,
                // Warm-gold wash on entry that dissolves to transparent.
                backgroundColor: "rgba(212, 175, 55, 0.05)",
              }
        }
        animate={{ opacity: 1, y: 0, backgroundColor: "rgba(212, 175, 55, 0)" }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
