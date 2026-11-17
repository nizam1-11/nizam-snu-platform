"use client";

import { Fragment } from "react";
import type { ElementType, CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  /** Preferred API: <TextReveal text="..." /> */
  text?: string;
  /** Backwards-compatible API: <TextReveal>some text</TextReveal> */
  children?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  delay?: number;
  stagger?: number;
  type?: "words" | "chars" | "lines";
  once?: boolean;
}

/**
 * Cinematic text reveal.
 *
 * Words/chars are revealed with a pure CSS keyframe animation (see
 * `[data-reveal-word]` in globals.css). CSS owns the animation so there is no
 * GSAP/ScrollTrigger race on above-the-fold heroes — the words can never be
 * left stuck at translateY(110%) inside their overflow-hidden wrappers.
 *
 * `once` / `type="lines"` are kept in the API for compatibility; the CSS
 * animation is deterministic and reduced-motion safe via the global override.
 */
export function TextReveal({
  text,
  children,
  className,
  as = "p",
  delay = 0,
  stagger = 0.05,
  type = "words",
}: TextRevealProps) {
  const content =
    typeof text === "string" ? text : typeof children === "string" ? children : null;
  const Tag = as as ElementType;

  if (content === null) {
    return <Tag className={cn(className)}>{children}</Tag>;
  }

  const words = content.split(" ");
  let charIndex = 0;

  return (
    <Tag className={cn(className)}>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.08em]">
            {type === "chars" ? (
              Array.from(word).map((char) => {
                const style: CSSProperties = {
                  animationDelay: `${delay + charIndex++ * 0.012}s`,
                };
                return (
                  <span key={charIndex} data-reveal-word className="inline-block" style={style}>
                    {char}
                  </span>
                );
              })
            ) : (
              <span
                data-reveal-word
                className="inline-block"
                style={{ animationDelay: `${delay + wordIndex * stagger}s` }}
              >
                {word}
              </span>
            )}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export default TextReveal;