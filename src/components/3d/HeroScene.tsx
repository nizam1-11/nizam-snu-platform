"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { motion } from "motion/react";
import * as THREE from "three";

/**
 * 3D materials need literal colors. Centralised here so the whole scene can be
 * re-tinted from one place; values mirror src/app/globals.css design tokens.
 * Warm gold + black only — no blue / purple / cyan / pink hues.
 */
const PALETTE = {
  gold: "#D4AF37", // primary gold
  brightGold: "#F5D67B", // bright gold highlight
  bronze: "#8A6A1F", // deep gold / bronze
  champagne: "#E8C66A", // champagne
  amber: "#D9A94A", // amber
  haze: "#B3A688", // warm dim ivory
  deep: "#14120F", // warm near-black
} as const;

type FrameLoop = "always" | "demand" | "never";
type Vec3 = [number, number, number];
type PointerState = { current: { x: number; y: number } };

/** Clamp delta after a paused/resumed tab so rotations never jump. */
const step = (delta: number) => Math.min(delta, 0.05);

/** Cinematic ease-out-expo — matches --ease-out-expo in globals.css. */
const ENTRANCE_SECONDS = 1.2;
const easeOutExpo = (t: number) =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

function useReducedMotionPref() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** drei's Float uses useFrame internally — skip it entirely for static mode. */
function MaybeFloat({
  animate,
  children,
  speed = 1.4,
  rotationIntensity = 0.4,
  floatIntensity = 0.8,
}: {
  animate: boolean;
  children: ReactNode;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
}) {
  if (!animate) return <>{children}</>;
  return (
    <Float
      speed={speed}
      rotationIntensity={rotationIntensity}
      floatIntensity={floatIntensity}
      floatingRange={[-0.22, 0.22]}
    >
      {children}
    </Float>
  );
}

/**
 * Mount entrance: the whole composition eases from a gentle 0.86 scale up to
 * 1 over ~1.2s. Driven by useFrame so it shares the scene's single animation
 * clock (no competing GSAP ticker, no postprocessing). Reduced motion renders
 * the final state immediately.
 */
function CinematicEntrance({
  animate,
  children,
}: {
  animate: boolean;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (!animate) {
      ref.current.scale.setScalar(1);
      return;
    }
    if (elapsed.current >= ENTRANCE_SECONDS) return;
    elapsed.current = Math.min(
      ENTRANCE_SECONDS,
      elapsed.current + step(delta)
    );
    const t = easeOutExpo(elapsed.current / ENTRANCE_SECONDS);
    ref.current.scale.setScalar(0.86 + 0.14 * t);
  });

  return <group ref={ref}>{children}</group>;
}

/** One-shot gold sparkle burst that expands and dissolves during entry. */
function EntranceBurst({ animate }: { animate: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const elapsed = useRef(0);

  const positions = useMemo(() => {
    const count = 32;
    const data = new Float32Array(count * 3);
    let seed = 907;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < count; i += 1) {
      const radius = 0.6 + rand() * 0.9;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[i * 3 + 2] = radius * Math.cos(phi);
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (!animate || !materialRef.current) return;
    if (elapsed.current >= ENTRANCE_SECONDS) return;
    elapsed.current = Math.min(
      ENTRANCE_SECONDS,
      elapsed.current + step(delta)
    );
    const t = easeOutExpo(elapsed.current / ENTRANCE_SECONDS);
    if (pointsRef.current) pointsRef.current.scale.setScalar(0.3 + 1.7 * t);
    materialRef.current.opacity = 0.65 * (1 - t);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.07}
        color={PALETTE.brightGold}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Cheap soft radial sprite used as fake volumetric glow (no postprocessing). */
function Glow({
  position,
  scale,
  color,
  opacity = 0.35,
}: {
  position: Vec3;
  scale: number;
  color: string;
  opacity?: number;
}) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.4)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </sprite>
  );
}

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  animate,
  opacity = 0.35,
  tube = 0.006,
}: {
  radius: number;
  tilt: Vec3;
  speed: number;
  color: string;
  animate: boolean;
  opacity?: number;
  tube?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.z += step(delta) * speed;
  });

  return (
    <group ref={ref} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, tube, 6, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Slowly rotating faceted core plus its glow and orbital rings. */
function Core({ animate }: { animate: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!animate || !mesh.current) return;
    mesh.current.rotation.y += step(delta) * 0.12;
    mesh.current.rotation.x += step(delta) * 0.045;
  });

  return (
    <group>
      <Glow position={[0, 0, -1.5]} scale={7} color={PALETTE.gold} opacity={0.32} />
      <Glow position={[0.6, 0.4, -2.1]} scale={5} color={PALETTE.bronze} opacity={0.24} />
      <MaybeFloat animate={animate} speed={1.2} floatIntensity={0.6}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.15, 1]} />
          <MeshDistortMaterial
            color={PALETTE.gold}
            emissive={PALETTE.brightGold}
            emissiveIntensity={0.2}
            roughness={0.18}
            metalness={0.82}
            distort={0.24}
            speed={animate ? 1.5 : 0}
          />
        </mesh>
      </MaybeFloat>
      <OrbitRing
        radius={2}
        tilt={[Math.PI / 2.7, 0.2, 0]}
        speed={0.08}
        color={PALETTE.champagne}
        animate={animate}
      />
      <OrbitRing
        radius={2.5}
        tilt={[Math.PI / 2.1, -0.5, 0.4]}
        speed={-0.06}
        color={PALETTE.gold}
        animate={animate}
      />
      {/* Slow, thin gold ring — a quiet orbital accent. */}
      <OrbitRing
        radius={3.05}
        tilt={[Math.PI / 3.4, 0.7, -0.3]}
        speed={0.035}
        color={PALETTE.brightGold}
        animate={animate}
        opacity={0.24}
        tube={0.004}
      />
    </group>
  );
}

/** Floating tech shard — solid faceted or lightweight wireframe. */
function Shard({
  position,
  scale,
  color,
  animate,
  wireframe = false,
  speed = 1,
}: {
  position: Vec3;
  scale: number;
  color: string;
  animate: boolean;
  wireframe?: boolean;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!animate || !ref.current) return;
    const d = step(delta) * speed;
    ref.current.rotation.x += d * 0.18;
    ref.current.rotation.y += d * 0.24;
  });

  return (
    <MaybeFloat
      animate={animate}
      speed={1.6}
      rotationIntensity={0.35}
      floatIntensity={0.9}
    >
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.14}
          roughness={0.28}
          metalness={0.7}
          flatShading
          wireframe={wireframe}
          transparent
          opacity={wireframe ? 0.55 : 0.92}
        />
      </mesh>
    </MaybeFloat>
  );
}

/** Restrained spherical halo — 120 additive points, one slow drift. */
function ParticleField({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 120;
    const data = new Float32Array(count * 3);
    // Deterministic LCG keeps the render pure and the field stable across runs.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < count; i += 1) {
      const radius = 4 + rand() * 5;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      data[i * 3 + 2] = radius * Math.cos(phi);
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y += step(delta) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={PALETTE.gold}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Whole composition eases toward the pointer and returns to centre. */
function SceneRig({
  pointer,
  parallax,
  children,
}: {
  pointer: PointerState;
  parallax: boolean;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current || !parallax) return;
    const d = step(delta);
    ref.current.rotation.y = THREE.MathUtils.damp(
      ref.current.rotation.y,
      pointer.current.x * 0.16,
      2.6,
      d
    );
    ref.current.rotation.x = THREE.MathUtils.damp(
      ref.current.rotation.x,
      -pointer.current.y * 0.1,
      2.6,
      d
    );
  });

  return <group ref={ref}>{children}</group>;
}

export function HeroScene() {
  const reduced = useReducedMotionPref();
  const pointer = useRef({ x: 0, y: 0 });
  const [touch, setTouch] = useState(false);
  const [hidden, setHidden] = useState(
    () => typeof document !== "undefined" && document.hidden
  );

  const motionOn = !reduced;
  const parallaxOn = !reduced && !touch;

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!parallaxOn) return;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const reset = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      document.removeEventListener("mouseleave", reset);
      reset();
    };
  }, [parallaxOn]);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Reduced motion renders one static frame; a hidden tab renders none.
  const frameLoop: FrameLoop = reduced ? "demand" : hidden ? "never" : "always";

  return (
    <motion.div
      className="absolute inset-0 -z-10"
      aria-hidden="true"
      initial={motionOn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: motionOn ? ENTRANCE_SECONDS : 0, ease: [0.19, 1, 0.22, 1] }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.75]}
        frameloop={frameLoop}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Warm gold key + champagne rim — mirrors the brand gradient. */}
        <ambientLight intensity={0.35} color={PALETTE.haze} />
        <hemisphereLight args={[PALETTE.champagne, PALETTE.deep, 0.4]} />
        <directionalLight position={[4, 3, 5]} intensity={2.1} color={PALETTE.gold} />
        <directionalLight position={[-5, 2, -4]} intensity={1.3} color={PALETTE.champagne} />
        <pointLight
          position={[-2.5, -2, 4]}
          intensity={26}
          distance={22}
          color={PALETTE.brightGold}
        />

        <Stars
          radius={48}
          depth={40}
          count={600}
          factor={3}
          saturation={0}
          fade
          speed={motionOn ? 0.35 : 0}
        />

        <CinematicEntrance animate={motionOn}>
          <SceneRig pointer={pointer} parallax={parallaxOn}>
            <Core animate={motionOn} />
            <Shard position={[-3.1, 1.4, -0.5]} scale={0.55} color={PALETTE.champagne} animate={motionOn} />
            <Shard position={[3.2, -1.1, -1]} scale={0.7} color={PALETTE.amber} animate={motionOn} speed={0.85} />
            <Shard
              position={[1.8, 2.3, -2]}
              scale={0.42}
              color={PALETTE.brightGold}
              animate={motionOn}
              wireframe
              speed={1.15}
            />
            <Glow position={[-3, 1.4, -3]} scale={6} color={PALETTE.gold} opacity={0.16} />
            <Glow position={[3, -1.2, -3]} scale={6} color={PALETTE.champagne} opacity={0.14} />
            <ParticleField animate={motionOn} />
            {motionOn && (
              <Sparkles
                count={26}
                scale={[9, 5, 3]}
                size={1.6}
                speed={0.25}
                opacity={0.5}
                color={PALETTE.brightGold}
              />
            )}
            <EntranceBurst animate={motionOn} />
          </SceneRig>
        </CinematicEntrance>
      </Canvas>
    </motion.div>
  );
}
