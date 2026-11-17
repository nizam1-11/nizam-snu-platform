export default function Loading() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-2/3 -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[130px]"
      />

      <div className="section-container" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading content</span>

        {/* Hero skeleton */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="skeleton-shimmer mx-auto h-7 w-56 rounded-full" />
          <div className="skeleton-shimmer mx-auto mt-8 h-14 w-full max-w-xl rounded-xl" />
          <div className="skeleton-shimmer mx-auto mt-4 h-14 w-4/5 max-w-lg rounded-xl" />
          <div className="skeleton-shimmer mx-auto mt-8 h-4 w-full max-w-md rounded-md" />
          <div className="skeleton-shimmer mx-auto mt-3 h-4 w-3/4 max-w-sm rounded-md" />
          <div className="mt-10 flex justify-center gap-3">
            <div className="skeleton-shimmer h-12 w-36 rounded-xl" />
            <div className="skeleton-shimmer h-12 w-36 rounded-xl" />
          </div>
        </div>

        {/* Card grid skeleton */}
        <div className="mx-auto mt-24 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6"
              style={{ animationDelay: `${index * 80}ms` }}
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
