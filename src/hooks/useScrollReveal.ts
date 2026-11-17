"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function registerGsap() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  markers?: boolean;
  once?: boolean;
  /** Optional selector to animate descendants instead of direct children. */
  selector?: string;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const ref = useRef<HTMLElement>(null);

  const {
    y = 60,
    x = 0,
    opacity = 0,
    duration = 1,
    delay = 0,
    stagger = 0.1,
    ease = "power3.out",
    start = "top 85%",
    markers = false,
    once = true,
    selector,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const targets: Element[] = selector
        ? Array.from(element.querySelectorAll(selector))
        : element.children.length > 0
          ? Array.from(element.children)
          : [element];

      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { y, x, opacity },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease,
          scrollTrigger: {
            trigger: element,
            start,
            markers,
            once,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [
    y,
    x,
    opacity,
    duration,
    delay,
    stagger,
    ease,
    start,
    markers,
    once,
    selector,
  ]);

  return ref;
}
