"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArticleSchema } from "@/components/seo/StructuredData";
import { GradientOrb } from "@/components/interactive";
import { Reveal } from "@/components/motion/Reveal";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
} from "lucide-react";

// Blog article data
const postData: Record<string, any> = {
  "safe-facebook-page-automation": {
    title: "How to Automate Facebook Page Posting Without Getting Flagged",
    excerpt:
      "Schedule Facebook Page posts safely with human-like pacing, dry runs, daily caps, caption rotation, and health checks that pause a failing queue.",
    content: `## Why Pacing Matters More Than Speed

When you schedule Facebook Page posts, the temptation is to push everything out as fast as possible. In practice, speed is exactly what makes automation look unnatural. A Page that publishes six posts in the same minute, every day at precisely 09:00, behaves nothing like a person running a real account. Platforms pay attention to patterns like that, and so do the people who follow your Page.

Good automation is less about firing requests quickly and more about reproducing the rhythm of a careful human operator. That means random-looking gaps between posts, sensible publishing windows, and guardrails that stop a queue before it becomes a problem. If you manage more than one Page, those guardrails matter even more, because a mistake scales with the number of Pages you control.

## What a Dry Run Actually Does

A dry run is a rehearsal. It walks your queue from top to bottom and shows you exactly what would be posted, to which Page, with which caption and image, and at what time, without contacting Facebook at all. Nothing is published. Nothing is consumed.

Use one every time you set up a new batch, especially if the posts contain links, promotional copy, or anything time-sensitive. A dry run catches the small, embarrassing errors: a caption meant for one Page attached to another, a duplicate that slipped through, a post scheduled outside your intended window. These are cheap to fix before publishing and costly to fix after.

Think of it as the preview button you wish every scheduler had. If your tool does not offer one, you are effectively publishing blind and trusting the queue to be correct.

## Daily Caps, Spacing, and Posting Hours

Three settings do most of the work in keeping a queue healthy:

- Daily cap — a hard ceiling on how many posts a Page can publish in a day. This prevents a backlog from dumping two weeks of content into a single afternoon.
- Spacing — a minimum gap between consecutive posts, ideally with a little variation so the timing does not look mechanical.
- Posting hours — the window during which publishing is allowed. A post that is due at 03:00 waits until the window opens instead of going out in the middle of the night.

Together, these turn a raw list of posts into a schedule that respects both the platform and your audience. A daily cap is your safety net; spacing and posting hours are what make the result look natural. When a queue gets ahead of itself, the cap holds the line rather than letting everything rush out at once.

## Rotate Your Captions

If every post in a campaign opens with the same sentence, a queue that is technically well-paced can still read like a machine. Caption rotation is the simple fix: keep a small pool of approved variations and cycle through them so each post feels written for the moment rather than stamped from a template.

Rotate the opening line, the call to action, or the closing question, while keeping the facts accurate. Keep the variations genuinely different in tone and length, and review them occasionally to remove ones that have gone stale. The goal is not to disguise identical content; it is to avoid the repetitive phrasing that makes even good content feel automated.

## Health Checks That Pause an Unhealthy Queue

The most useful safety feature in any scheduler is the one that stops itself. A health check watches the publishing process and pauses a Page's queue when something looks wrong: a run of failed posts, a session that is no longer valid, or an unusual error pattern from the platform.

When a queue is flagged unhealthy, a good tool stops posting, keeps the remaining items safely in place, and tells you what happened. You investigate, fix the cause, and resume from where it stopped, rather than discovering hours later that half your posts silently failed. This is the difference between a queue that fails loudly and safely, and one that fails quietly and wastes the whole batch.

If you manage many Pages, health should be tracked per queue. One problem Page should not block the others.

## Editing and Rescheduling Without Starting Over

Plans change. A product launch moves, a link breaks, or a caption needs a review. Your workflow should let you open a queued post, edit its text or media, and move it to a new time without rebuilding the whole schedule. Look for the ability to:

- Edit a caption or swap an image on a single queued item.
- Reschedule one post without shifting everything after it.
- Reorder the queue when priority changes.
- Remove an item entirely before its slot arrives.

Because changes happen locally and stay with you, there is no round trip to a third-party server just to fix a typo. That keeps iteration fast and keeps your content under your control.

## A Practical Safety Checklist

Before you let a Facebook queue run, work through this list:

- Connect Pages through the official Meta OAuth flow, not stored passwords.
- Do a dry run and read every scheduled item.
- Set a daily cap that matches how much you would realistically post by hand.
- Configure spacing and posting hours so timing looks human.
- Prepare a few caption variations and rotate them.
- Confirm health checks will pause the queue on repeated failures.
- Know how to edit, reschedule, and remove a queued post quickly.

Tools such as SNU Automation bake these controls into a local Windows app that schedules Facebook Page posts with Meta OAuth, queue safety, and analytics, with data kept in a local SQLite database. But the checklist above is tool-agnostic: whatever scheduler you use, these are the habits that keep posting consistent without drawing the wrong kind of attention.

Publish slowly, review often, and let the guardrails do their job.`,
    category: "Automation",
    tags: ["Facebook", "Automation", "Safety"],
    readingTime: 6,
    publishedAt: "2026-11-18",
    author: "Syed Nizam Uddin",
  },
  "bulk-video-downloading-organized": {
    title: "Bulk Video Downloading Done Right: Folders, Duplicates & Cookie Health",
    excerpt:
      "Turn a pile of links into an organized library: per-channel folders, duplicate skipping, clear errors, healthy cookies, and audio-only or subtitle options.",
    content: `## Why Batch Beats One-by-One

Downloading videos individually works until it does not. Paste a link, wait, save, rename, repeat — doing that dozens or hundreds of times is slow, easy to get wrong, and nearly impossible to keep organized. A batch workflow takes a list of links, or a whole channel, and processes them in one pass while applying the same rules to every item.

The real win is consistency. When you paste a channel link and let the tool work through it, every video lands in the right place with the right name, and nothing depends on you remembering a manual step on item forty-seven. For a content workflow built around reference footage, research, or repurposing, that reliability matters more than raw download speed.

## Give Every Channel Its Own Folder

A pile of files in a single downloads folder is not a library. Organize by source from the start: one folder per channel or creator, with a clear naming scheme inside each. When downloads arrive in per-channel folders, you can find a clip weeks later, avoid mixing content from different sources, and hand a folder to a teammate without explanation.

Good batch tools create these folders automatically from the channel or playlist you point them at. If you regularly pull from YouTube, TikTok, or Snapchat, that automatic structure removes the tidiest part of the job. You set the destination once and let the tool file everything afterward.

## Skip Duplicates With a Download Archive

Re-running a batch is normal. You add a new channel to your list, or you come back a week later to catch anything you missed. Without protection, that means re-downloading everything you already have, wasting bandwidth and cluttering your folders.

A download archive solves this. The tool records what it has already fetched and skips those items on subsequent runs, so a batch only pulls what is genuinely new. This is the feature that turns a one-off download into a repeatable sync: run the same list as often as you like, and it quietly converges on everything being up to date rather than piling up copies.

## Friendly Errors Instead of Silent Skips

Not every video will download. Links expire, a video is removed, a network request times out, or a private clip is not accessible. What matters is how the tool reports that failure. A silent skip — where an item simply vanishes from the results — is the worst case, because you assume the batch is complete when it is not.

Aim for a tool that tells you which items failed and why, in plain language, and keeps going with the rest of the batch. A short, readable error such as video unavailable or sign-in required is far more useful than a raw code. It lets you decide what to retry, what to skip, and what needs a manual look, instead of guessing.

## Cookie Health and Refresh

Some content requires you to be signed in. When it does, the tool relies on session cookies from your browser. Those cookies expire, and when they go stale, downloads start failing for reasons that are not obvious from the error alone.

Cookie health is the practice of checking that your session is still valid before a batch runs, and refreshing it when it is not. A tool that detects an expired or missing session can tell you exactly what to fix instead of burning through a batch of failures. Keep your sign-in current, re-check it before large jobs, and treat a cookie warning as a prompt to refresh rather than an inconvenience. A few seconds of attention here saves an entire failed run.

## Audio-Only and Subtitles

Not every download needs the full video. If you are transcribing an interview, sampling a track, or building a reference library, audio-only downloads are smaller and faster, and they keep your folders focused. Subtitles are just as useful: they make content searchable, easier to quote, and simpler to turn into notes or captions later.

When a tool supports both, you can decide per batch what you actually need instead of always pulling the heaviest file. That flexibility adds up when you are processing hundreds of videos and storage starts to matter.

## Fitting Downloads Into a Content Workflow

The point of batch downloading is not to collect files. It is to feed the next step. A clean, organized library — grouped by channel, free of duplicates, with clear errors and optional audio or subtitles — is something you can actually work with. It can feed a visual workflow, a captioning step, or a review process without you sorting through clutter first.

Tools such as SNU Automation treat bulk video downloading as one part of a wider local workflow, with per-channel folders, duplicate skipping, cookie health checks, and audio or subtitle options, all kept on your machine in a local SQLite database. Whether you use a dedicated app or a script you maintain yourself, the principles are the same: organize by source, skip what you have, surface errors clearly, and keep your session healthy.

Start with one channel, verify the folders and the archive behave the way you expect, then scale up.`,
    category: "Tutorials",
    tags: ["Video", "Downloading", "Workflow"],
    readingTime: 5,
    publishedAt: "2026-11-15",
    author: "Syed Nizam Uddin",
  },
  "visual-workflow-builder-guide": {
    title: "Visual Workflow Builders: Automate Repetitive Content Tasks Without Code",
    excerpt:
      "Learn how node-based workflows, starter templates, scheduling, JSON portability, and a safety-bound AI assistant can handle repetitive content work.",
    content: `## What a Node-Based Workflow Builder Is

A visual workflow builder represents a process as a diagram. Each step is a node — a trigger, an action, a decision, a delay — and the lines between nodes define what happens next. Instead of writing code to describe the flow, you connect blocks on a canvas and configure each one through a form.

That matters because a lot of content work is really a flow: when a new item arrives, do this, then that, wait until a certain time, publish, log the result. A diagram makes that flow visible. You can see where a branch goes, where a delay sits, and what happens when something fails, without reading a single line of code.

## When to Use One

A workflow builder earns its place when a task repeats and follows a predictable shape. Good candidates include:

- Turning a raw video into a set of captions and a scheduled post.
- Collecting items from several sources into one organized destination.
- Running a review step before anything is published.
- Repeating the same sequence across many accounts or channels.

It is less useful for one-off tasks, or for work that depends on constant human judgment with no repeatable pattern. The test is simple: if you find yourself doing the same sequence of steps more than a few times, and you could describe those steps in advance, a workflow is probably worth building.

## Start From a Template

A blank canvas is the hardest place to begin. Starter templates give you a working flow you can inspect, run, and adapt, which teaches the builder far faster than assembling everything from zero. Look for templates that cover common content jobs and treat them as examples rather than finished products.

The fastest way to learn is to run a template in a safe mode first, watch what each node does, and then change one thing at a time. Swap a trigger, adjust a delay, rename an output. By the time you have made a few small edits, the pattern is yours.

## Scheduling, Pause, and Resume

Real workflows rarely finish in one sitting. A step may need to wait until a posting window opens, or a queue may need to stop while you fix something. Two features make that practical:

- Scheduling — a node that holds the flow until a chosen time or window, so work goes out when it should rather than the moment it is ready.
- Pause and resume — the ability to stop a running workflow and continue later from the same point, without losing progress or starting the sequence over.

Together, they let a workflow span hours or days. A pause is also a safety tool: if something looks wrong, you stop the flow, investigate, and resume when you are confident, rather than letting it run to completion.

## JSON Import and Export for Portability

A workflow you build should not be trapped in one tool. JSON import and export means the entire flow — nodes, settings, connections — can be saved to a file and loaded again. That is useful in three ways: you can back up a workflow, move it to another machine, and share a working setup with a teammate.

It also makes iteration safer. Before a big change, export the current version. If the new version misbehaves, you can load the old one instead of rebuilding from memory. Treat exported workflow files like source code: keep the good versions, name them clearly, and you will never lose a working setup.

## Letting an AI Assistant Drive Real Workflows Safely

An AI assistant becomes genuinely useful when it can act on real services instead of only suggesting text. Ask it to draft captions for a batch, organize a set of downloads, or prepare a schedule, and the assistant can call the same tools your workflow uses.

That power needs boundaries. The assistant should work inside the safety rules you already set: the same posting windows, caps, dry runs, and health checks apply whether a person or an AI triggered the step. Never give an assistant permission to skip a safety check for convenience. Keep a human review step before anything irreversible, and let the tool act on real services only through the same guarded paths a manual run would take.

Tools such as SNU Automation combine a visual builder with an AI assistant that can act on real services, while keeping data local in a SQLite database so your content and configuration stay with you. The principle holds regardless of tool: the assistant accelerates the work, but the guardrails stay in charge.

## Plan Your First Repeatable Content Pipeline

Before you open a builder, write the process down in plain language:

- What triggers the workflow, and how often?
- What are the steps, in order?
- Where does a delay or a posting window belong?
- What should happen when a step fails?
- Which safety checks must never be skipped?
- Who reviews the result before it goes live?

Then pick the smallest version that produces a real result and build only that. Run it with a dry run or in a safe mode, check every output, and add one improvement at a time. Once it is reliable, save a copy, export the JSON, and reuse it as the starting point for the next pipeline.

Automate the boring middle — the sorting, scheduling, and repeating — and keep your attention on the decisions that actually need a person.`,
    category: "AI",
    tags: ["Workflows", "AI", "No-Code"],
    readingTime: 7,
    publishedAt: "2026-11-10",
    author: "Syed Nizam Uddin",
  },
};

/** Defensively parse a value that may be a JSON string (D1) or an array. */
function parseStringArray(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Malformed JSON — fall back.
    }
  }
  return fallback;
}

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

/** "2026-11-18T00:00:00.000Z" -> "2026-11-18" to match the hardcoded display. */
function toDateLabel(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : value;
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const reduceMotion = useReducedMotion();
  const [post, setPost] = useState<any>(() => postData[slug]);

  useEffect(() => {
    const controller = new AbortController();
    // Start from the hardcoded article; an API match overrides it below.
    setPost(postData[slug]);

    fetch("/api/blog", { signal: controller.signal })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error("Blog request failed"))
      )
      .then((data: { posts?: Record<string, unknown>[] }) => {
        const fromApi = Array.isArray(data.posts) ? data.posts : [];
        const match = fromApi.find((item) => item.slug === slug);
        if (!match) return; // Not in the API — keep the hardcoded entry.
        const base = postData[slug] || {};
        setPost({
          title: String(match.title || base.title || "Untitled"),
          excerpt: String(match.excerpt || base.excerpt || ""),
          content:
            typeof match.content === "string" && match.content.length > 0
              ? match.content
              : base.content || "",
          category: capitalize(String(match.category || base.category || "")),
          tags: parseStringArray(match.tags, base.tags || []),
          readingTime:
            typeof match.readingTime === "number" && match.readingTime > 0
              ? match.readingTime
              : base.readingTime || 5,
          publishedAt: toDateLabel(match.publishedAt || base.publishedAt),
          author: base.author || "Syed Nizam Uddin",
        });
      })
      .catch(() => {
        // Keep the hardcoded article as the fallback.
      });

    return () => controller.abort();
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
        <div className="text-center glass-strong rounded-2xl p-10">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Article Not Found
          </h1>
          <Link href="/blog" className="text-accent-electric hover:text-accent-blue">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        author={post.author || "Syed Nizam Uddin"}
        datePublished={post.publishedAt}
        url={`${process.env.NEXT_PUBLIC_APP_URL || "https://nizam-snu.pages.dev"}/blog/${slug}`}
      />

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-atmosphere opacity-40" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-50" />
      <GradientOrb
        color="blue"
        size={420}
        opacity={0.18}
        blur={80}
        float={!reduceMotion}
        className="absolute -top-40 -left-40"
      />

      {/* Back Navigation */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-electric transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      <article className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Premium article header */}
          <Reveal>
            <div className="glass-strong gradient-border relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-12">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-blue via-accent-electric to-accent-purple" />
              <GradientOrb
                color="purple"
                size={280}
                opacity={0.3}
                blur={60}
                float={!reduceMotion}
                className="absolute -top-24 -right-20"
              />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 text-sm rounded-full glass text-accent-cyan">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-text-muted">
                    <Calendar className="w-4 h-4" />
                    {post.publishedAt}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-text-muted">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} min read
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary mb-6 leading-tight">
                  {post.title}
                </h1>

                <p className="text-lg text-text-secondary mb-10 max-w-2xl">
                  {post.excerpt}
                </p>

                {/* Author card */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-accent-blue/40 shadow-[0_8px_28px_-10px_rgb(181_121_74_/_0.9)]">
                    <Image
                      src="/images/profile.jpg"
                      alt={post.author || "Syed Nizam Uddin"}
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                      <User className="w-3.5 h-3.5 text-accent-electric" />
                      {post.author || "Syed Nizam Uddin"}
                    </p>
                    <p className="text-xs text-text-muted">Author</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Article content */}
          <Reveal delay={0.05}>
            <div className="glass rounded-3xl p-7 sm:p-10">
              <div className="prose prose-invert max-w-none">
                <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                  {post.content.split("\n").map((line: string, i: number) => {
                    if (line.startsWith("## ")) {
                      return (
                        <h2
                          key={i}
                          className="text-2xl font-heading font-bold text-text-primary mt-8 mb-4 first:mt-0"
                        >
                          {line.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (line.startsWith("### ")) {
                      return (
                        <h3
                          key={i}
                          className="text-xl font-heading font-bold text-text-primary mt-6 mb-3"
                        >
                          {line.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="text-text-secondary ml-6 list-disc marker:text-accent-blue/60">
                          {line.replace("- ", "")}
                        </li>
                      );
                    }
                    if (line.startsWith("---")) {
                      return <hr key={i} className="border-border my-8" />;
                    }
                    if (line.startsWith("*") && line.endsWith("*")) {
                      return (
                        <p key={i} className="text-sm text-text-secondary italic mt-4">
                          {line.replace(/^\*|\*$/g, "")}
                        </p>
                      );
                    }
                    if (line.trim() === "") {
                      return <br key={i} />;
                    }
                    return (
                      <p key={i} className="text-text-secondary mb-4">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tags */}
          <Reveal delay={0.05}>
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full glass text-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-8 border-t border-border">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-text-secondary hover:text-accent-electric transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
