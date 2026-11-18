import Link from "next/link";
import { ArrowRight, Box, Download, Layers, Sparkles } from "lucide-react";

import { HeroSceneWrapper } from "@/components/3d/HeroSceneWrapper";
import { PhotoDistortionWrapper } from "@/components/3d/PhotoDistortionWrapper";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import {
  DeviceMockup,
  GradientOrb,
  Magnetic,
  AnimatedNumber,
  ImageReveal,
} from "@/components/interactive";

const stats = [
  { label: "Projects", value: "0+" },
  { label: "Products", value: "0+" },
  { label: "Downloads", value: "0+" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Preserve the existing 3D / atmosphere background */}
        <HeroSceneWrapper />

        <div className="relative z-10 w-full section-container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* ── Left: cinematic copy ── */}
            <div className="text-center lg:text-left">
              <Reveal y={16}>
                <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 shadow-lg shadow-accent-blue/10">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-electric opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-electric glow-electric" />
                  </span>
                  <span className="text-xs font-medium tracking-wide text-text-secondary sm:text-sm">
                    AI Automation Developer &amp; Software Creator
                  </span>
                </div>
              </Reveal>

              {/*
                GSAP word reveal. The scoped rule below paints only the 3rd
                word ("AI-Powered") with the primary gradient — TextReveal
                renders one wrapper <span> per word in source order.
              */}
              <style>{`
                .hero-headline > span > [data-reveal-word] { -webkit-text-fill-color: currentColor; }
                .hero-headline > span:nth-of-type(3) > [data-reveal-word] {
                  background: linear-gradient(120deg, #d4af37, #f5d67b);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                  -webkit-text-fill-color: transparent;
                }
              `}</style>
              <TextReveal
                as="h1"
                text="I Build AI-Powered Applications & Automation"
                className="hero-headline mt-7 font-heading text-4xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
              />

              <Reveal delay={0.15}>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg lg:mx-0">
                  Welcome to my digital platform. I create AI applications,
                  business automation systems, workflow solutions, and software
                  products. Explore my work, download my software, and
                  let&apos;s build something great together.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                  <Magnetic>
                    <Link
                      href="/products"
                      className="shine group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-blue/25 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-accent-blue/40"
                    >
                      Explore Products
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link
                      href="/download"
                      className="inline-flex items-center gap-2.5 rounded-xl glass px-8 py-4 text-base font-semibold text-text-primary transition-colors duration-300 hover:bg-surface-light hover:glow-electric"
                    >
                      <Download className="h-5 w-5" />
                      Download Center
                    </Link>
                  </Magnetic>
                </div>
              </Reveal>

              {/* Stats as refined metric cards */}
              <Stagger className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-3 sm:gap-4 lg:mx-0">
                {stats.map((stat) => (
                  <StaggerItem key={stat.label}>
                    <div className="rounded-2xl glass px-3 py-5 text-center transition-colors duration-300 hover:border-accent-blue/40">
                      <div className="font-heading text-2xl font-bold text-gradient-primary sm:text-3xl">
                        <AnimatedNumber value={stat.value} />
                      </div>
                      <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-text-muted sm:text-xs">
                        {stat.label}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* ── Right: premium profile card ── */}
            <div className="relative hidden lg:block">
              <GradientOrb
                color="purple"
                size={420}
                blur={70}
                opacity={0.4}
                float
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <Reveal direction="left" delay={0.1}>
                <div className="relative mx-auto w-full max-w-sm">
                  {/* Concentric glow rings */}
                  <div className="absolute -inset-8 rounded-[3rem] border border-accent-blue/10" />
                  <div className="absolute -inset-4 rounded-[2.75rem] border border-accent-purple/20" />
                  <div className="relative rounded-[2rem] glass-strong gradient-border p-3 glow-blue">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-surface-deep">
                      <ImageReveal className="relative h-full w-full" direction="up">
                        <PhotoDistortionWrapper />
                      </ImageReveal>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent" />
                      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-25" />
                      <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                        Profile
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (placeholder — no fabricated data) */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-electric">
                Coming Soon
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
                Featured <span className="text-gradient-primary">Products</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                Software products and tools I&apos;ve built. Download, use, and
                provide feedback.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-3xl">
              <DeviceMockup variant="browser" title="products.snuautomation.dev">
                <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple glow-blue">
                    <Box className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary">
                    Launching soon
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-text-muted">
                    No products yet. Add them via the admin dashboard.
                  </p>
                </div>
              </DeviceMockup>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Projects (placeholder — no fabricated data) */}
      <section className="relative bg-surface/50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-violet">
                Coming Soon
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
                Featured <span className="text-gradient-primary">Projects</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                A selection of my automation systems, applications, and
                experiments.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-3xl">
              <DeviceMockup variant="desktop" title="projects.snuautomation.dev">
                <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-electric glow-purple">
                    <Layers className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary">
                    Launching soon
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-text-muted">
                    No projects yet. Add them via the admin dashboard.
                  </p>
                </div>
              </DeviceMockup>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-strong card-interactive px-6 py-14 text-center glow-blue">
              <GradientOrb
                color="blue"
                size={380}
                blur={70}
                opacity={0.25}
                className="absolute -top-28 left-1/2 -translate-x-1/2"
              />
              <div className="relative z-10">
                <Sparkles className="mx-auto mb-5 h-6 w-6 text-accent-electric" />
                <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
                  Let&apos;s Build Something Together
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                  Interested in AI automation, custom software, or workflow
                  solutions? Get in touch and let&apos;s discuss your project.
                </p>
                <Link
                  href="/contact"
                  className="shine group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-blue/25 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Contact Me
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
