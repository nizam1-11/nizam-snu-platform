import Image from "next/image";
import {
  Code2,
  Rocket,
  Zap,
  Users,
  Target,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { GradientOrb, ImageReveal } from "@/components/interactive";
import { cn } from "@/lib/utils";

const skills = [
  { name: "AI & Machine Learning", level: 85, category: "AI" },
  { name: "Workflow Automation", level: 90, category: "Automation" },
  { name: "Full-Stack Web Dev", level: 88, category: "Web" },
  { name: "Desktop Applications", level: 80, category: "Desktop" },
  { name: "Android Development", level: 75, category: "Mobile" },
  { name: "Cloud & DevOps", level: 78, category: "DevOps" },
];

const timeline = [
  {
    year: "2024",
    title: "Started Independent Development",
    description: "Began building AI automation tools and software products independently.",
  },
  {
    year: "2025",
    title: "Launched First Products",
    description: "Released first automation systems and desktop applications.",
  },
  {
    year: "2026",
    title: "Expanding Platform",
    description: "Building SNU Automation brand and comprehensive software marketplace.",
  },
];

const values = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, well-documented code that scales.",
  },
  {
    icon: Rocket,
    title: "Ship Fast",
    description: "Iterating quickly from idea to working product.",
  },
  {
    icon: Zap,
    title: "Automation First",
    description: "Automating repetitive tasks to focus on what matters.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description: "Building tools that solve real problems for real people.",
  },
  {
    icon: Target,
    title: "Quality Focus",
    description: "Shipping polished, tested, and reliable software.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description: "Staying current with AI, automation, and modern tech.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base">
      {/* Skill bar fill — transform-only so reduced-motion users see the final width */}
      <style>{`
        @keyframes skillFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .skill-bar { transform-origin: left center; animation: skillFill 1.25s cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .skill-bar { animation: none; } }
      `}</style>

      {/* Hero */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <GradientOrb
          color="purple"
          size={360}
          blur={80}
          opacity={0.22}
          float
          className="absolute right-0 top-10"
        />
        <GradientOrb
          color="blue"
          size={320}
          blur={80}
          opacity={0.2}
          className="absolute -left-24 top-32"
        />
        <div className="section-container relative z-10">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-accent-electric">
                <Sparkles className="h-3.5 w-3.5" />
                The Developer
              </div>
              <h1 className="font-heading text-4xl font-bold text-text-primary sm:text-5xl">
                About <span className="text-gradient-primary">Me</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                I&apos;m Nizam, an independent AI Automation Developer and
                Software Creator. I build AI-powered applications, business
                automation systems, workflow solutions, and software products
                under the SNU Automation brand.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Profile + Bio */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Photo — honest placeholder, beautifully framed */}
          <Reveal direction="left">
            <div className="relative flex justify-center">
              <GradientOrb
                color="blue"
                size={340}
                blur={60}
                opacity={0.28}
                float
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <div className="relative">
                {/* Layered glow rings */}
                <div className="absolute -inset-8 rounded-[2.5rem] border border-accent-purple/15" />
                <div className="absolute -inset-4 rounded-[2rem] border border-accent-blue/25" />
                <div className="relative h-64 w-64 overflow-hidden rounded-[1.75rem] glass-strong gradient-border glow-blue sm:h-80 sm:w-80">
                  <ImageReveal
                    className="relative h-full w-full"
                    direction="left"
                  >
                    <Image
                      src="/images/profile.jpg"
                      alt="Nizam — AI Automation Developer & Software Creator"
                      fill
                      priority
                      sizes="(max-width: 640px) 256px, 320px"
                      className="object-cover object-top"
                    />
                  </ImageReveal>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base/55 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-0 grid-overlay opacity-25" />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                    Portrait
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal direction="right" delay={0.1}>
            <div className="space-y-6">
              <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                My Story
              </h2>
              <p className="leading-relaxed text-text-secondary">
                I&apos;m an independent developer passionate about building
                software that solves real problems. My focus areas include AI
                automation, business process automation, workflow optimization,
                and creating tools that help people work smarter.
              </p>
              <p className="leading-relaxed text-text-secondary">
                Through SNU Automation, I develop and distribute software
                products ranging from AI-powered desktop applications to
                web-based automation tools. Each product is built with care,
                tested thoroughly, and designed to be genuinely useful.
              </p>
              <p className="leading-relaxed text-text-secondary">
                I believe in transparent development, clean code, and shipping
                products that people actually want to use. Every project on
                this platform represents real work, real learning, and real
                value.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-surface/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                Skills &amp; <span className="text-gradient-primary">Expertise</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">
                The toolkit I reach for to turn ideas into working systems.
              </p>
            </div>
          </Reveal>
          <Stagger className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {skills.map((skill) => (
              <StaggerItem key={skill.name}>
                <div className="h-full rounded-2xl glass card-interactive p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-electric glow-electric" />
                      <span className="text-sm font-medium text-text-primary">
                        {skill.name}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-accent-blue">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-deep ring-1 ring-inset ring-white/5">
                    <div
                      className="skill-bar h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-electric shadow-[0_0_12px_rgba(57,139,255,0.5)]"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="mt-3 block text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    {skill.category}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <h2 className="mb-12 text-center font-heading text-2xl font-bold text-text-primary sm:text-3xl">
              Development <span className="text-gradient-primary">Journey</span>
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl">
            {timeline.map((item, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-purple font-heading text-sm font-bold text-white glow-blue ring-1 ring-inset ring-white/15">
                      {item.year.slice(2)}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-gradient-to-b from-accent-blue/60 via-accent-purple/40 to-transparent" />
                    )}
                  </div>
                  <div className={cn("pb-10", index < timeline.length - 1 && "pt-2")}>
                    <span className="text-sm font-medium text-accent-electric">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-text-secondary">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative bg-surface/30 px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="mb-12 text-center font-heading text-2xl font-bold text-text-primary sm:text-3xl">
            What I <span className="text-gradient-primary">Value</span>
          </h2>
        </Reveal>
        <div className="section-container">
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title} className="h-full">
                <TiltCard className="h-full">
                  <div className="h-full rounded-2xl glass gradient-border p-6">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue/25 to-accent-purple/25 ring-1 ring-inset ring-white/10">
                      <value.icon className="h-6 w-6 text-accent-electric" />
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {value.description}
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
