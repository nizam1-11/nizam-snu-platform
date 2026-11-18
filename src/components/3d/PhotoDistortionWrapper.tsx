"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * The real photo, rendered on the server and before hydration (and kept as the
 * fallback for any device that cannot run the WebGL effect). Never substituted.
 */
function PlainProfileImage() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="Nizam — AI Automation Developer & Software Creator"
      fill
      priority
      sizes="(max-width: 639px) 220px, (max-width: 1023px) 280px, 300px"
      className="object-cover object-top"
    />
  );
}

const PhotoDistortionDynamic = dynamic(
  () =>
    import("@/components/3d/PhotoDistortion").then(
      (mod) => mod.PhotoDistortion
    ),
  { ssr: false, loading: () => <PlainProfileImage /> }
);

/** Feature-detect WebGL without leaving a live context behind. */
function supportsWebGL() {
  try {
    if (typeof window === "undefined" || !window.WebGLRenderingContext) {
      return false;
    }
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!context) return false;
    (context as WebGLRenderingContext)
      .getExtension("WEBGL_lose_context")
      ?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function PhotoDistortionWrapper() {
  // null → SSR/pre-hydration output is identical to the plain-image fallback.
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    // Defer to the next frame so detection never blocks hydration.
    const raf = requestAnimationFrame(() => setWebgl(supportsWebGL()));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (webgl === false) return <PlainProfileImage />;
  return <PhotoDistortionDynamic />;
}
