/**
 * Shared per-route loading skeleton.
 *
 * Lightweight Server Component used by `loading.tsx` in individual App Router
 * segments. Renders a compact header placeholder plus three card placeholders
 * in the gold-black theme. No client JS is required.
 */
export interface RouteLoadingProps {
  /** Accessible label announced by the live region. Defaults to "Loading content". */
  label?: string;
}

const CARD_INDICES = [0, 1, 2] as const;

export default function RouteLoading({ label = "Loading content" }: RouteLoadingProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-20">
      {/* Ambient gold atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-2/3 -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[120px]"
      />

      <div className="section-container" aria-busy="true" aria-live="polite" role="status">
        <span className="sr-only">{label}</span>

        {/* Small header placeholder */}
        <div className="mx-auto max-w-3xl">
          <div className="skeleton-shimmer mx-auto h-6 w-40 rounded-full" />
          <div className="skeleton-shimmer mx-auto mt-6 h-11 w-3/4 max-w-lg rounded-xl" />
          <div className="skeleton-shimmer mx-auto mt-3 h-4 w-2/3 max-w-md rounded-md" />
        </div>

        {/* Three card placeholders */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_INDICES.map((index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="skeleton-shimmer h-10 w-10 rounded-xl" />
              <div className="skeleton-shimmer mt-5 h-5 w-3/4 rounded-md" />
              <div className="skeleton-shimmer mt-3 h-4 w-full rounded-md" />
              <div className="skeleton-shimmer mt-2 h-4 w-5/6 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
