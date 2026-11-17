"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TiltCard } from "@/components/motion/TiltCard";
import { GradientOrb } from "@/components/interactive";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import {
  HelpCircle,
  BookOpen,
  Download,
  Mail,
  Bug,
  Shield,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const supportCategories = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Read guides, tutorials, and API documentation for all products.",
    href: "/blog",
    color: "from-accent-blue to-accent-electric",
  },
  {
    icon: Download,
    title: "Downloads",
    description: "Get the latest versions of all software products.",
    href: "/download",
    color: "from-accent-purple to-accent-pink",
  },
  {
    icon: Bug,
    title: "Report a Bug",
    description: "Found an issue? Let me know so I can fix it.",
    href: "/contact?inquiry=support",
    color: "from-warning to-error",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Report security vulnerabilities responsibly.",
    href: "/legal/security-reporting",
    color: "from-success to-accent-cyan",
  },
  {
    icon: Mail,
    title: "Contact Support",
    description: "Get help with installation, troubleshooting, or general questions.",
    href: "/contact?inquiry=support",
    color: "from-accent-cyan to-accent-blue",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description: "Find answers to frequently asked questions.",
    href: "/faq",
    color: "from-accent-electric to-accent-purple",
  },
];

const commonIssues = [
  {
    title: "Installation fails on Windows",
    solution:
      "Make sure you have the latest Windows updates installed. Try running the installer as Administrator. Check that your antivirus isn't blocking the installation.",
  },
  {
    title: "App won't start after installation",
    solution:
      "Check that your system meets the minimum requirements. Try reinstalling the application. Check the application logs for error messages.",
  },
  {
    title: "License activation issues",
    solution:
      "Ensure you have a stable internet connection. Verify your license key is entered correctly. Contact support if the issue persists.",
  },
  {
    title: "Performance is slow",
    solution:
      "Close other resource-intensive applications. Ensure you have enough RAM. Check for background processes. Update to the latest version.",
  },
];

export default function SupportPage() {
  const reduceMotion = useReducedMotion();
  const [openIssues, setOpenIssues] = useState<Set<number>>(new Set());

  const toggleIssue = (index: number) => {
    const next = new Set(openIssues);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setOpenIssues(next);
  };

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-atmosphere opacity-40" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
      <GradientOrb
        color="cyan"
        size={420}
        opacity={0.2}
        blur={80}
        float={!reduceMotion}
        className="absolute -top-40 right-0"
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary mb-6">
              Support <span className="text-gradient-primary">Center</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Get help with installation, troubleshooting, and general questions.
              Find answers or reach out for personalized support.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Support Categories */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((cat) => (
              <StaggerItem key={cat.title} className="h-full">
                <TiltCard className="h-full" intensity={6}>
                  <Link
                    href={cat.href}
                    className="glass card-interactive rounded-2xl p-6 h-full flex flex-col group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-[0_10px_30px_-12px_rgb(212_175_55_/_0.7)]",
                      cat.color
                    )}>
                      <cat.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-text-primary mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4 flex-1">
                      {cat.description}
                    </p>
                    <span className="text-sm text-accent-electric group-hover:text-accent-blue transition-colors flex items-center gap-1">
                      Learn more
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Common Issues */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-surface-deep/40" />
        <div className="relative max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
              Common <span className="text-gradient-primary">Issues</span>
            </h2>
          </Reveal>
          <div className="space-y-4">
            {commonIssues.map((issue, index) => {
              const isOpen = openIssues.has(index);
              return (
                <Reveal key={issue.title} delay={index * 0.05}>
                  <div className={cn(
                    "glass rounded-xl overflow-hidden transition-colors duration-300",
                    isOpen && "border-accent-blue/30 glow-blue"
                  )}>
                    <button
                      onClick={() => toggleIssue(index)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between p-6 text-left group"
                    >
                      <span className="text-base font-medium text-text-primary group-hover:text-accent-electric transition-colors">
                        {issue.title}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                        className="shrink-0 ml-3"
                      >
                        <ChevronDown className="w-5 h-5 text-text-secondary" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="solution"
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-text-secondary px-6 pb-6 pt-0">
                            {issue.solution}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product-Specific Support */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center glass-strong rounded-3xl p-10">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
              Product-Specific Help
            </h2>
            <p className="text-text-secondary mb-8">
              Looking for help with a specific product? Visit its product page for
              installation guides, system requirements, and release notes.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Products
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
