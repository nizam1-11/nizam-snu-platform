import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DeviceVariant = "browser" | "desktop" | "phone";

export interface DeviceMockupProps {
  variant?: DeviceVariant;
  /** Optional chrome label (window title / URL / app name). */
  title?: string;
  children: ReactNode;
  className?: string;
}

const INNER_GLOW =
  "inset 0 1px 0 rgb(255 255 255 / 0.06), inset 0 0 48px rgb(var(--rgb-accent-electric) / 0.06)";

/** Decorative window controls — gold-family tinted, never announced. */
function WindowDots({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-1.5", className)}>
      <span className="h-2.5 w-2.5 rounded-full bg-accent-blue/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-accent-electric/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-accent-purple/80" />
    </div>
  );
}

/**
 * Pure CSS/HTML device frames for product previews. No images, no client JS.
 * The screen surface is the only accessible region — chrome is aria-hidden.
 */
export function DeviceMockup({
  variant = "browser",
  title,
  children,
  className,
}: DeviceMockupProps) {
  if (variant === "phone") {
    return (
      <div className={cn("mx-auto w-full max-w-[300px]", className)}>
        <div className="glass-strong gradient-border rounded-[2.25rem] p-2.5">
          <div
            className="relative overflow-hidden rounded-[1.75rem] bg-surface-deep px-3 pb-5 pt-3 ring-1 ring-inset ring-white/5"
            style={{ boxShadow: INNER_GLOW }}
          >
            <div
              aria-hidden="true"
              className="mx-auto mb-3 h-5 w-20 rounded-full bg-bg-base"
            />
            {title && (
              <p className="mb-2 text-center text-[10px] tracking-wide text-text-muted">
                {title}
              </p>
            )}
            <div className="min-h-[340px] text-text-primary">{children}</div>
            <div
              aria-hidden="true"
              className="mx-auto mt-3 h-1 w-24 rounded-full bg-white/20"
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "desktop") {
    return (
      <div className={cn("mx-auto w-full max-w-4xl", className)}>
        <div className="glass-strong gradient-border rounded-2xl p-2 sm:p-3">
          <div
            className="rounded-xl bg-surface-deep p-3 sm:p-5 ring-1 ring-inset ring-white/5"
            style={{ boxShadow: INNER_GLOW }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <WindowDots />
              {title && (
                <span className="truncate text-[10px] tracking-wide text-text-muted">
                  {title}
                </span>
              )}
              <span aria-hidden="true" className="w-12" />
            </div>
            <div className="min-h-[220px] text-text-primary">{children}</div>
          </div>
        </div>
        {/* Stand */}
        <div
          aria-hidden="true"
          className="mx-auto h-8 w-2 bg-gradient-to-b from-surface-elevated to-transparent"
        />
        <div
          aria-hidden="true"
          className="mx-auto h-2 w-32 rounded-b-lg bg-surface-elevated"
        />
      </div>
    );
  }

  // browser (default)
  return (
    <div
      className={cn(
        "glass-strong gradient-border w-full overflow-hidden rounded-2xl",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <WindowDots className="shrink-0" />
        <div className="mx-auto min-w-0 max-w-md flex-1">
          <div className="truncate rounded-full border border-white/10 bg-white/5 px-3 py-1 text-center text-[10px] text-text-muted">
            {title || "preview"}
          </div>
        </div>
        <span aria-hidden="true" className="w-12 shrink-0" />
      </div>
      <div className="p-3 sm:p-4">
        <div
          className="rounded-xl bg-surface-deep p-4 ring-1 ring-inset ring-white/5 sm:p-5"
          style={{ boxShadow: INNER_GLOW }}
        >
          <div className="text-text-primary">{children}</div>
        </div>
      </div>
    </div>
  );
}
