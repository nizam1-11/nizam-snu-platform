"use client";

import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const PROFILE_SRC = "/images/profile.jpg";
const PROFILE_ALT = "Nizam — AI Automation Developer & Software Creator";

/** Barely-there baseline once the pointer leaves; keeps the photo alive. */
const IDLE_INTENSITY = 0.08;
/** How long we keep rendering through the ease-out before dropping to demand. */
const SETTLE_MS = 800;

type FrameLoop = "always" | "demand" | "never";

/**
 * Cover-crop in the fragment shader so the square source photo fills the 4:5
 * portrait frame exactly like `object-cover object-top` does in CSS. The plane
 * itself is only a flat full-viewport quad — no mesh distortion, no postfx.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uIntensity;
  uniform sampler2D uTexture;
  uniform float uAspect;

  // /images/profile.jpg is square (1254x1254).
  const float TEXTURE_ASPECT = 1.0;

  vec2 coverUv(vec2 uv, float containerAspect, float textureAspect) {
    vec2 scale = vec2(1.0);
    if (containerAspect > textureAspect) {
      scale.y = textureAspect / containerAspect;
    } else {
      scale.x = containerAspect / textureAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = vUv;

    // Aspect-correct the delta so the ripple stays circular in a tall frame.
    vec2 delta = uv - uMouse;
    delta.x *= uAspect;
    float dist = length(delta);
    vec2 dir = dist > 0.0001 ? delta / dist : vec2(0.0);

    // Localized sine ripple around the pointer + a very soft travelling sway.
    float ripple = sin(dist * 22.0 - uTime * 3.0) * exp(-dist * 6.0);
    float sway   = sin(uv.y * 5.0 + uTime * 0.7) * 0.12;

    // Restrained amplitude (~0.016 UV max) — the face stays recognizable.
    float amp = 0.016 * uIntensity;
    vec2 distorted = uv + dir * ripple * amp + vec2(0.0, sway * amp);

    vec2 texUv = coverUv(distorted, uAspect, TEXTURE_ASPECT);
    gl_FragColor = texture2D(uTexture, clamp(texUv, 0.0, 1.0));
  }
`;

/** The real, unmodified photo — SSR / pre-hydration / every fallback path. */
function PlainProfileImage() {
  return (
    <Image
      src={PROFILE_SRC}
      alt={PROFILE_ALT}
      fill
      priority
      sizes="(max-width: 1024px) 0px, 300px"
      className="object-cover object-top"
    />
  );
}

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

/**
 * null while pending so the first (SSR/client) render is always the plain
 * image. Reduced motion, coarse pointers and no-WebGL devices never mount the
 * canvas at all.
 */
function useWebGLEligibility(): boolean | null {
  const [eligible, setEligible] = useState<boolean | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      setEligible(!reduce && !coarse && supportsWebGL());
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return eligible;
}

type DistortedImageProps = {
  mouse: { current: THREE.Vector2 };
  hovered: boolean;
  onReady: () => void;
};

/** Full-viewport quad + custom shader material. All animation lives here. */
function DistortedImage({ mouse, hovered, onReady }: DistortedImageProps) {
  const texture = useTexture(PROFILE_SRC);
  const textureRef = useRef(texture);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { invalidate, viewport } = useThree();

  // Stable uniforms object: R3F only re-applies it if identity changes, so
  // per-frame writes must go through materialRef.current.uniforms instead.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 0 },
      uTexture: { value: texture },
      uAspect: { value: 1 },
    }),
    [texture]
  );

  useLayoutEffect(() => {
    // jpg is an sRGB color texture — mark it so three doesn't render it washed.
    textureRef.current.colorSpace = THREE.SRGBColorSpace;
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;
    textureRef.current.generateMipmaps = false;
    textureRef.current.needsUpdate = true;
    onReady();
    invalidate();
  }, [onReady, invalidate]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uAspect.value =
      viewport.width / viewport.height;
    invalidate();
  }, [viewport.width, viewport.height, invalidate]);

  // R3F disposes the declarative geometry + material on unmount; here we only
  // release the cached texture, clearing the entry so a remount reloads it.
  useEffect(
    () => () => {
      textureRef.current.dispose();
      useTexture.clear(PROFILE_SRC);
    },
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const d = Math.min(delta, 0.05);
    materialRef.current.uniforms.uTime.value += d;
    (materialRef.current.uniforms.uMouse.value as THREE.Vector2).lerp(
      mouse.current,
      1 - Math.exp(-8 * d)
    );
    materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uIntensity.value,
      hovered ? 1 : IDLE_INTENSITY,
      5,
      d
    );
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Last line of defence: any WebGL error falls back to the real photo. */
class WebGLErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function PhotoDistortion() {
  const eligible = useWebGLEligibility();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    []
  );

  const updateMouse = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.current.set(
      (event.clientX - rect.left) / rect.width,
      1 - (event.clientY - rect.top) / rect.height
    );
  }, []);

  const handleEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      updateMouse(event);
      setHovered(true);
      setActive(true);
    },
    [updateMouse]
  );

  const handleLeave = useCallback(() => {
    setHovered(false);
    // Keep the loop alive just long enough to ease intensity back down.
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setActive(false), SETTLE_MS);
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => setFailed(true), []);

  // Stop all GPU work while the tab is hidden; render on demand at rest.
  const frameLoop: FrameLoop = hidden
    ? "never"
    : active
      ? "always"
      : "demand";

  const showCanvas = eligible === true && !failed;

  return (
    <div className="relative h-full w-full">
      {/* Always present: identical photo behind the canvas, so there is no
          flash while the texture loads and it is the ultimate fallback. */}
      <PlainProfileImage />

      {showCanvas && (
        <WebGLErrorBoundary onError={handleError}>
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            onPointerEnter={handleEnter}
            onPointerMove={updateMouse}
            onPointerLeave={handleLeave}
          >
            <Canvas
              orthographic
              camera={{ position: [0, 0, 1], zoom: 1 }}
              dpr={[1, 1.5]}
              frameloop={frameLoop}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
              }}
            >
              <Suspense fallback={null}>
                <DistortedImage
                  mouse={mouse}
                  hovered={hovered}
                  onReady={onReady}
                />
              </Suspense>
            </Canvas>
          </div>
        </WebGLErrorBoundary>
      )}
    </div>
  );
}
