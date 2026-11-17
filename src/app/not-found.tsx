import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-24">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-atmosphere opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-purple/20 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-xl text-center">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-accent-electric">
          Error 404
        </p>
        <h1 className="text-gradient-primary font-heading text-8xl font-extrabold leading-none sm:text-9xl">
          404
        </h1>
        <h2 className="mt-8 font-heading text-2xl font-semibold text-text-primary sm:text-3xl">
          This page drifted into the void
        </h2>
        <p className="mx-auto mt-4 max-w-md text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to solid ground.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="shine group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-blue/25 transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <Home className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <Link
            href="/contact"
            className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-accent-electric"
          >
            <ArrowLeft className="h-4 w-4" />
            Contact support
          </Link>
        </div>
      </div>
    </section>
  );
}
