"use client";

import RouteError from "@/components/layout/RouteError";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return <RouteError error={error} reset={reset} />;
}
