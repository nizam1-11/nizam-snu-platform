import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle, Sparkles } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GradientOrb } from "@/components/interactive";
import { CoverAmbience } from "@/components/interactive/CoverAmbience";
import { cn } from "@/lib/utils";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// Placeholder project data (will be loaded from DB)
const projectData: Record<string, any> = {
  "snu-automation": {
    title: "SNU Automation",
    description:
      "One Windows app for bulk video downloads, Facebook Page scheduling, and visual automation workflows — with an AI assistant that acts on real services, safely and with you in control.",
    longDescription: `
## Overview
SNU Automation brings three powerful jobs together in one place: bulk video downloading, Facebook Page scheduling, and a visual workflow builder. An in-app AI assistant — Gemini, Claude, or GPT — works through tools that act on the real queue and workflow services, never a side path that skips safety checks.

- Bulk video downloading: pull videos from YouTube, TikTok, and Snapchat into tidy, organized folders.
- Facebook Page scheduling: publish to your Pages with human-like pacing and safety limits.
- Visual workflow builder: design automated workflows visually, at your own pace.

## Bulk Downloader
- Paste a channel link to download the whole batch in one go.
- Per-channel folders keep every download organized.
- A download archive skips duplicates automatically.
- Friendly errors — no silent skips.
- Cookie health checks and refresh, so connections stay alive.
- Audio-only downloads and subtitles when you need them.
- Handles 500 videos in one click.

## Facebook Automation
- Connect Meta OAuth Pages and manage 100+ Pages with ease.
- A posting queue with jitter, daily caps, spacing, and posting hours.
- Dry-run first, so you can check everything before it goes live.
- Resumable uploads and caption rotation.
- Analytics and health checks that automatically pause unhealthy Page queues.
- Edit, reschedule, or run posts now; nightly cleanup keeps things tidy.

## Visual Workflow Builder
- 12 node types.
- 8 starter templates.
- Daily schedule with pause/resume and next-run info.
- JSON import/export.

## Why SNU
- Nothing silent: one activity timeline shows everything.
- Editable queued posts and undo.
- Safety before speed: no bot-like behavior, dry-run first.
- Data stays yours: local SQLite; the server only verifies keys.
- Made by Nizam for solo creators.

## How It Works
1. Install and activate with a key.
2. Add sources — channel links, Pages, or a template.
3. Run — everything shows up in the Home activity feed.

## On the Roadmap
Planned updates — not shipped yet:
- TikTok uploading workflow automation.
- Instagram automation.
- YouTube workflow automation.
- More platform workflows being added over time.
    `,
    category: "Automation Systems",
    techStack: ["Windows", "Local SQLite", "Meta Graph API", "Gemini / Claude / GPT"],
    features: [
      "Bulk channel downloads (YouTube, TikTok, Snapchat)",
      "Per-channel folders & duplicate skipping",
      "100+ Facebook Pages via Meta OAuth",
      "Dry-run safety & posting queue limits",
      "Human-like pacing with daily caps",
      "Health checks auto-pause unsafe queues",
      "12-node visual workflow builder",
      "8 starter templates & JSON import/export",
      "AI assistant (Gemini / Claude / GPT)",
      "Local SQLite — your data stays yours",
    ],
    status: "completed",
    iconUrl: "/images/snu-logo.png",
    githubUrl: "#",
    projectUrl: "#",
    screenshots: [],
  },
  "snu-clips": {
    title: "SNU Clips",
    description:
      "An upcoming tool that turns long videos and livestreams into ready-to-post clips — with 100 caption templates.",
    longDescription: `
## In Development — Coming Soon
SNU Clips is being built to turn long videos and livestreams into ready-to-post clips, with 100 caption templates to choose from. It's still in development — not available yet.

## The Concept
- Extract engaging clips from long videos.
- Turn livestreams into shareable clips.
- A move-to-clip workflow that makes trimming feel natural.
- 100 caption templates to match your style.
- Ready-to-post exports, formatted and good to go.

## Status
In development — coming soon. More details will be shared as it takes shape.
    `,
    category: "AI Applications",
    techStack: ["Video Processing", "AI Captions", "Automation"],
    features: [
      "Video → clips",
      "Livestream → clips",
      "Move to clip workflow",
      "100 caption templates",
      "Ready-to-post exports",
    ],
    status: "in-progress",
    iconUrl: "/images/snu-logo.png",
    githubUrl: "#",
    projectUrl: "#",
    screenshots: [],
  },
  "surprise-project": {
    title: "Something Surprising",
    description: "A new project is on the way. More details soon.",
    longDescription: `
## Coming Soon
Coming soon. More details will be shared here.
    `,
    category: "Experimental",
    techStack: [],
    features: [
      "Coming soon",
      "Details to be revealed",
    ],
    status: "in-progress",
    githubUrl: "#",
    projectUrl: "#",
    screenshots: [],
  },
  "ai-task-automator": {
    title: "AI Task Automator",
    description:
      "An AI-powered desktop application that automates repetitive business tasks using natural language instructions.",
    longDescription: `
## Overview
AI Task Automator is a desktop application that allows users to describe tasks in natural language and have them executed automatically.

## Key Features
- Natural language task description
- Multi-step workflow execution
- Integration with common business tools
- Error handling and retry logic
- Progress tracking and reporting

## Technical Details
Built with Python for the AI backend and Electron for the desktop interface. Uses OpenAI's GPT models for natural language understanding.
    `,
    category: "AI Applications",
    techStack: ["Python", "OpenAI", "Electron", "SQLite", "FastAPI"],
    features: [
      "Natural language task description",
      "Multi-step workflow execution",
      "Integration with common business tools",
      "Error handling and retry logic",
      "Progress tracking and reporting",
      "Offline mode support",
    ],
    status: "completed",
    githubUrl: "#",
    projectUrl: "#",
    screenshots: [],
  },
  "workflow-engine": {
    title: "Workflow Engine",
    description:
      "A visual workflow builder for creating automated business processes with a drag-and-drop interface.",
    longDescription: `## Overview
A visual workflow builder concept for creating automated business processes with a drag-and-drop interface. Details will be shared here as this project develops.`,
    category: "Automation Systems",
    techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
    features: ["Drag-and-drop builder", "Automation pipelines"],
    status: "completed",
    githubUrl: "#",
    projectUrl: "#",
    screenshots: [],
  },
  "data-sync-tool": {
    title: "Data Sync Tool",
    description:
      "A cross-platform tool concept for synchronizing data between different business systems and databases.",
    longDescription: `## Overview
A cross-platform data synchronization concept. Details will be shared here as this project develops.`,
    category: "Desktop Applications",
    techStack: ["C#", ".NET", "SQLite", "REST API"],
    features: ["Cross-platform sync", "Database connectors"],
    status: "in-progress",
    githubUrl: "#",
    projectUrl: "#",
    screenshots: [],
  },
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectData[slug];

  if (!project) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base px-4">
        <GradientOrb
          color="purple"
          size={320}
          blur={70}
          opacity={0.2}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="relative text-center">
          <h1 className="mb-4 font-heading text-2xl font-bold text-text-primary">
            Project Not Found
          </h1>
          <Link
            href="/projects"
            className="text-accent-electric transition-colors hover:text-accent-blue"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base">
      {/* Back Navigation */}
      <div className="section-container pt-8">
        <Reveal y={12}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Reveal>
      </div>

      {/* Cinematic Header */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8">
        <GradientOrb
          color="blue"
          size={380}
          blur={80}
          opacity={0.2}
          float
          className="absolute -left-16 top-0"
        />
        <div className="section-container relative z-10">
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent-blue/15 px-3 py-1.5 text-sm font-medium text-accent-blue ring-1 ring-inset ring-accent-blue/25">
                <Sparkles className="h-3.5 w-3.5" />
                {project.category}
              </span>
              <h1 className="font-heading text-4xl font-bold text-text-primary sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary">
                {project.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                {project.githubUrl && project.githubUrl !== "#" && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 transition-colors hover:bg-surface-light"
                  >
                    <GithubIcon className="h-5 w-5" />
                    View Source
                  </a>
                )}
                {project.projectUrl && project.projectUrl !== "#" && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3 text-white shadow-lg shadow-accent-blue/20 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cover Image Placeholder */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-container">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent-blue/15 via-accent-purple/10 to-transparent glass gradient-border glow-blue">
              <div className="absolute inset-0 grid-overlay opacity-70" />
              <CoverAmbience />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-electric/60 to-transparent" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl glass-strong text-5xl shadow-lg shadow-accent-blue/20">
                {project.iconUrl ? (
                  <img src={project.iconUrl} alt="" className="h-20 w-20 object-contain" />
                ) : (
                  <span aria-hidden="true">🚀</span>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="section-container grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <Reveal direction="left" className="lg:col-span-2">
            <div className="rounded-2xl glass gradient-border p-6 sm:p-8">
              <div className="leading-relaxed text-text-secondary">
                {project.longDescription.split("\n").map((line: string, index: number) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h3
                        key={index}
                        className="mb-2 mt-6 font-heading text-xl font-bold text-text-primary first:mt-0"
                      >
                        {line.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <div key={index} className="ml-4 flex gap-2 py-0.5">
                        <span className="text-accent-electric">•</span>
                        <span>{line.replace("- ", "")}</span>
                      </div>
                    );
                  }
                  if (!line.trim()) return <div key={index} className="h-2" />;
                  return (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Sidebar */}
          <Stagger className="space-y-6">
            <StaggerItem>
              <div className="rounded-2xl glass gradient-border p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-text-primary">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-md bg-surface-elevated/70 px-3 py-1 text-sm text-text-secondary ring-1 ring-inset ring-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-2xl glass gradient-border p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-text-primary">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature: string) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-text-secondary"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-2xl glass gradient-border p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-text-primary">
                  Status
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                    project.status === "completed"
                      ? "bg-success/15 text-success"
                      : "bg-warning/15 text-warning"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      project.status === "completed"
                        ? "bg-success glow-blue"
                        : "bg-warning"
                    )}
                  />
                  {project.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>
    </div>
  );
}
