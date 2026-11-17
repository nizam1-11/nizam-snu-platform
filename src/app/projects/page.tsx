"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Filter, Sparkles } from "lucide-react";

// GitHub icon (inline SVG since lucide removed brand icons)
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
import { TiltCard } from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import { GradientOrb } from "@/components/interactive";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI Applications" },
  { id: "automation", label: "Automation Systems" },
  { id: "web", label: "Web Development" },
  { id: "desktop", label: "Desktop Applications" },
  { id: "android", label: "Android Applications" },
  { id: "experimental", label: "Experimental" },
];

// Placeholder projects (will be loaded from database)
const projects = [
  {
    id: "1",
    slug: "ai-task-automator",
    title: "AI Task Automator",
    description:
      "An AI-powered desktop application that automates repetitive business tasks using natural language instructions.",
    category: "ai",
    techStack: ["Python", "OpenAI", "Electron", "SQLite"],
    status: "completed",
    isFeatured: true,
    githubUrl: "#",
    projectUrl: "#",
  },
  {
    id: "2",
    slug: "workflow-engine",
    title: "Workflow Engine",
    description:
      "A visual workflow builder for creating automated business processes with drag-and-drop interface.",
    category: "automation",
    techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
    status: "completed",
    isFeatured: true,
    githubUrl: "#",
    projectUrl: "#",
  },
  {
    id: "3",
    slug: "data-sync-tool",
    title: "Data Sync Tool",
    description:
      "Cross-platform tool for synchronizing data between different business systems and databases.",
    category: "desktop",
    techStack: ["C#", ".NET", "SQLite", "REST API"],
    status: "in-progress",
    isFeatured: false,
    githubUrl: "#",
    projectUrl: "#",
  },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base">
      {/* Hero */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <GradientOrb
          color="purple"
          size={380}
          blur={80}
          opacity={0.2}
          float
          className="absolute -right-16 top-0"
        />
        <div className="section-container relative z-10">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-accent-electric">
                <Sparkles className="h-3.5 w-3.5" />
                Selected Work
              </div>
              <h1 className="font-heading text-4xl font-bold text-text-primary sm:text-5xl">
                My <span className="text-gradient-primary">Projects</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                A collection of automation systems, applications, and
                experiments I&apos;ve built. Each project represents real
                problem-solving and learning.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="section-container">
          <div className="mb-5 flex items-center gap-2">
            <Filter className="h-4 w-4 text-accent-electric" />
            <span className="text-sm font-medium text-text-secondary">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg shadow-accent-blue/25"
                    : "glass text-text-secondary hover:-translate-y-0.5 hover:text-text-primary hover:glow-electric"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="section-container">
          <Reveal>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredProjects.map((project) => (
                  <TiltCard
                    key={project.id}
                    className="glass gradient-border overflow-hidden rounded-2xl group"
                  >
                    {/* Gradient cover placeholder */}
                    <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-accent-blue/20 via-accent-purple/10 to-transparent">
                      <div className="absolute inset-0 grid-overlay opacity-70" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-electric/60 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full glass px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">
                        {categories.find((c) => c.id === project.category)?.label}
                      </span>
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl glass-strong text-3xl shadow-lg shadow-accent-blue/20">
                        <span aria-hidden="true">🚀</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-medium",
                            project.status === "completed"
                              ? "bg-success/15 text-success"
                              : "bg-warning/15 text-warning"
                          )}
                        >
                          {project.status === "completed" ? "Completed" : "In Progress"}
                        </span>
                        {project.isFeatured && (
                          <span className="rounded-full bg-accent-purple/15 px-2.5 py-1 text-xs font-medium text-accent-purple">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">
                        {project.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="mb-5 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-surface-elevated/70 px-2 py-1 text-xs text-text-secondary ring-1 ring-inset ring-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="group/link inline-flex items-center gap-1 text-sm font-medium text-accent-electric transition-colors hover:text-accent-blue"
                        >
                          View Details
                          <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                        </Link>
                        {project.githubUrl && project.githubUrl !== "#" && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary transition-colors hover:text-text-primary"
                          >
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        )}
                        {project.projectUrl && project.projectUrl !== "#" && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary transition-colors hover:text-text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </motion.div>
            </AnimatePresence>
          </Reveal>

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center text-text-secondary">
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
