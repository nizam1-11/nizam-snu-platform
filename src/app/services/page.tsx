import Link from "next/link";
import {
  Bot,
  Workflow,
  Code2,
  Globe,
  Monitor,
  Brain,
  Lightbulb,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { StickyCardDeck } from "@/components/motion/StickyCardDeck";
import { SpotlightCard, GradientOrb } from "@/components/interactive";
import { cn } from "@/lib/utils";

const services = [
  {
    slug: "ai-automation",
    icon: Bot,
    title: "AI Automation Development",
    description:
      "Build AI-powered automation systems that handle repetitive tasks, process data intelligently, and make decisions autonomously.",
    benefits: [
      "Reduce manual work by up to 80%",
      "24/7 automated processing",
      "Intelligent decision-making",
      "Scalable architecture",
    ],
    color: "from-accent-blue to-accent-electric",
  },
  {
    slug: "business-process-automation",
    icon: Workflow,
    title: "Business Process Automation",
    description:
      "Streamline your business workflows by automating repetitive processes, approvals, notifications, and data synchronization.",
    benefits: [
      "Faster turnaround times",
      "Fewer human errors",
      "Cost reduction",
      "Better compliance",
    ],
    color: "from-accent-purple to-accent-pink",
  },
  {
    slug: "custom-application-development",
    icon: Code2,
    title: "Custom Application Development",
    description:
      "Full-stack custom applications built to your specifications — web, desktop, or mobile — with modern architecture and clean code.",
    benefits: [
      "Tailored to your needs",
      "Modern tech stack",
      "Maintainable codebase",
      "Ongoing support",
    ],
    color: "from-accent-cyan to-accent-blue",
  },
  {
    slug: "workflow-automation",
    icon: Settings,
    title: "Workflow Automation",
    description:
      "Design and implement automated workflows connecting your tools, APIs, and services into seamless pipelines.",
    benefits: [
      "Tool integration",
      "Event-driven triggers",
      "Error handling & retries",
      "Monitoring & alerts",
    ],
    color: "from-accent-electric to-accent-cyan",
  },
  {
    slug: "ai-integration",
    icon: Brain,
    title: "AI Integration",
    description:
      "Integrate AI capabilities into your existing applications — chatbots, content generation, data analysis, and more.",
    benefits: [
      "LLM integration",
      "RAG pipelines",
      "Custom AI agents",
      "API-first design",
    ],
    color: "from-accent-purple to-accent-blue",
  },
  {
    slug: "web-development",
    icon: Globe,
    title: "Web Application Development",
    description:
      "Modern, responsive web applications built with React, Next.js, and TypeScript. Fast, accessible, and SEO-optimized.",
    benefits: [
      "Responsive design",
      "SEO optimized",
      "Fast performance",
      "Accessibility",
    ],
    color: "from-accent-blue to-accent-purple",
  },
  {
    slug: "desktop-software",
    icon: Monitor,
    title: "Desktop Software Development",
    description:
      "Cross-platform desktop applications for Windows, macOS, and Linux using modern frameworks.",
    benefits: [
      "Native performance",
      "Offline capable",
      "Auto-updates",
      "System integration",
    ],
    color: "from-accent-cyan to-accent-electric",
  },
  {
    slug: "technical-consultation",
    icon: Lightbulb,
    title: "Technical Consultation",
    description:
      "Expert advice on architecture, technology selection, automation strategy, and software design for your projects.",
    benefits: [
      "Architecture review",
      "Tech stack advice",
      "Automation strategy",
      "Code review",
    ],
    color: "from-accent-pink to-accent-purple",
  },
];

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen overflow-clip bg-bg-base">
      {/* Hero */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <GradientOrb
          color="blue"
          size={380}
          blur={80}
          opacity={0.22}
          float
          className="absolute -left-20 top-6"
        />
        <GradientOrb
          color="purple"
          size={340}
          blur={80}
          opacity={0.2}
          className="absolute -right-16 top-24"
        />
        <div className="section-container relative z-10">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-accent-electric">
                <Sparkles className="h-3.5 w-3.5" />
                What I Do
              </div>
              <h1 className="font-heading text-4xl font-bold text-text-primary sm:text-5xl">
                My <span className="text-gradient-primary">Services</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                I offer a range of development and automation services. Each
                service is tailored to your specific needs and delivered with
                quality and transparency.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services — sticky card deck (plain grid on small screens / reduced motion) */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="section-container">
          <StickyCardDeck>
            {services.map((service) => (
              <SpotlightCard
                key={service.slug}
                className="relative h-full rounded-2xl"
              >
                <div className="glass card-interactive relative h-full overflow-hidden rounded-2xl p-8">
                  {/* Gradient top border */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent-blue/70 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-purple/60 to-transparent" />

                  <div
                    className={cn(
                      "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset ring-white/15 glow-blue",
                      service.color
                    )}
                  >
                    <service.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-3 font-heading text-xl font-bold text-text-primary">
                    {service.title}
                  </h3>
                  <p className="mb-6 text-text-secondary">{service.description}</p>

                  <ul className="mb-7 space-y-2.5">
                    {service.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2.5 text-sm text-text-secondary"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue glow-blue" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-accent-electric transition-colors hover:text-accent-blue"
                  >
                    Get in touch
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </StickyCardDeck>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-strong card-interactive p-12 text-center glow-purple">
              <GradientOrb
                color="purple"
                size={380}
                blur={70}
                opacity={0.25}
                className="absolute -top-28 left-1/2 -translate-x-1/2"
              />
              <div className="relative z-10">
                <h2 className="font-heading text-3xl font-bold text-text-primary">
                  Need Something Custom?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                  Don&apos;t see exactly what you need? I work on custom projects
                  too. Let&apos;s discuss your requirements.
                </p>
                <Link
                  href="/contact"
                  className="shine group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink px-8 py-4 text-base font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
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
