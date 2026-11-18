"use client";

import Link from "next/link";
import { Home, RotateCw } from "lucide-react";
import { useEffect } from "react";

/**
 * Shared per-route error panel.
 *
 * Must be a Client Component because it is rendered by `error.tsx` files,
 * which Next.js implements as React Error Boundaries. Raw error details are
 * logged for diagnostics only and are never shown to end users.
 */
export interface RouteErrorProps {
  error: Error & { digest?: string };
  /** Clears the error state and re-renders the segment (Next.js error boundary API). */
  reset: () => void;
}

export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    // Log to the console / error reporting service — never surface to users.
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-2/3 -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[120px]"
      />

      <div className="glass-strong gradient-border relative z-10 w-full max-w-lg rounded-2xl p-8 text-center sm:p-10">
        <div
          aria-hidden="true"
          className="glow-gold mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-accent-electric/20 bg-accent-electric/10 text-accent-electric"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-accent-electric">
          Unexpected error
        </p>
        <h1 className="mt-3 font-heading text-2xl font-semibold text-text-primary sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
          We couldn&apos;t load this section right now. Please try again — if the
          problem persists, head back home.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="glow-gold inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-electric px-6 py-3 text-sm font-semibold text-bg-base transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="glass inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
