"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

function errorMessage(code?: string): string {
  switch (code) {
    case "INVALID_PASSWORD":
      return "Wrong password. Please try again.";
    case "TOO_MANY_ATTEMPTS":
      return "Too many attempts — please try again later.";
    case "ADMIN_UNAVAILABLE":
      return "Admin access isn't configured yet.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }

      let code: string | undefined;
      try {
        const data = (await res.json()) as { error?: unknown };
        if (typeof data?.error === "string") code = data.error;
      } catch {
        // Non-JSON error response — fall back to the generic message.
      }
      setError(errorMessage(code));
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page relative flex min-h-screen items-center justify-center overflow-hidden bg-atmosphere px-4 py-16 sm:px-6">
      {/* Page-scoped ambient motion. The project's global `motion-off`
          override neutralizes these for users who explicitly opt out —
          no local toggle is introduced here. */}
      <style>{`
        .login-shell { animation: login-enter 0.85s var(--ease-premium) both; }
        .login-card  { animation: login-card-in 0.9s var(--ease-premium) 0.08s both; }
        .login-logo-glow { animation: login-logo-breathe 4.8s ease-in-out infinite; }
        .login-dot   { animation: login-dot-pulse 2.6s ease-in-out infinite; }

        @keyframes login-enter {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes login-card-in {
          from { opacity: 0; transform: translateY(14px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes login-logo-breathe {
          0%, 100% { opacity: 0.45; transform: scale(0.94); }
          50%      { opacity: 0.95; transform: scale(1.08); }
        }
        @keyframes login-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(0.75); }
        }
      `}</style>

      {/* Atmospheric layers */}
      <div aria-hidden="true" className="hero-ambient-glow" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-overlay opacity-30"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 noise-overlay" />

      <div className="login-shell relative z-10 w-full max-w-md">
        <div className="mb-6 flex justify-center sm:justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent-electric focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to site
          </Link>
        </div>

        <section
          aria-labelledby="login-title"
          className="login-card relative rounded-3xl glass-strong gradient-border glow-blue px-6 py-9 sm:px-10 sm:py-11"
        >
          <div className="flex flex-col items-center text-center">
            {/* SNU mark with a soft, always-breathing copper halo */}
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl glass gradient-border">
              <span
                aria-hidden="true"
                className="login-logo-glow absolute -inset-3 rounded-[1.75rem] bg-accent-blue/25 blur-xl"
              />
              <img
                src="/images/snu-logo.png"
                alt="SNU Automation"
                width={512}
                height={512}
                className="relative h-14 w-14 object-contain"
              />
            </div>

            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-electric">
              <span
                aria-hidden="true"
                className="login-dot h-1.5 w-1.5 rounded-full bg-accent-electric shadow-[0_0_10px_rgb(216_164_107_/_0.9)]"
              />
              SNU Automation
            </p>

            <h1
              id="login-title"
              className="mt-3 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
            >
              Admin <span className="text-gradient-primary">Access</span>
            </h1>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              This area is reserved for the site owner. Enter your password to
              continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8" noValidate>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-text-muted"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError(null);
                  }}
                  autoComplete="current-password"
                  autoFocus
                  required
                  disabled={submitting}
                  placeholder="••••••••"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : "login-hint"}
                  className="w-full rounded-xl border border-border bg-surface-deep/70 px-4 py-3.5 pl-12 pr-12 text-[15px] text-text-primary placeholder:text-text-muted/60 transition-colors duration-200 focus:border-accent-blue/60 focus-visible:ring-2 focus-visible:ring-accent-electric/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-surface-elevated hover:text-accent-electric focus-visible:ring-2 focus-visible:ring-accent-electric"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p id="login-hint" className="sr-only">
                Enter the admin password to sign in.
              </p>
            </div>

            {error && (
              <p
                id="login-error"
                role="alert"
                aria-live="assertive"
                className="mt-3 flex items-start gap-2 rounded-xl border border-error/25 bg-error/10 px-3.5 py-2.5 text-sm text-error"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="shine group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-[15px] font-semibold text-white shadow-lg shadow-accent-blue/25 transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-accent-blue/40 focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Verifying…
                </>
              ) : (
                <>
                  Enter Admin
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-border/60 pt-5 text-[11px] text-text-muted">
            <ShieldCheck
              className="h-3.5 w-3.5 text-accent-electric/70"
              aria-hidden="true"
            />
            Protected area · Session expires automatically
          </div>
        </section>
      </div>
    </main>
  );
}
