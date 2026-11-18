"use client";

import { use } from "react";
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

// Placeholder post data (will be loaded from DB)
const postData: Record<string, any> = {
  "getting-started-ai-automation": {
    title: "Getting Started with AI Automation",
    excerpt:
      "Learn how to build your first AI automation workflow with practical examples and best practices.",
    content: `## Introduction

AI automation is transforming how businesses operate. By combining artificial intelligence with workflow automation, you can create systems that handle repetitive tasks, process data intelligently, and make decisions autonomously.

## What You'll Learn

In this guide, we'll cover:
- The basics of AI automation
- Common use cases and patterns
- How to build your first automation workflow
- Best practices for production systems

## Getting Started

### Prerequisites

Before diving in, make sure you have:
- Basic programming knowledge (Python or JavaScript)
- An API key for an AI service (OpenAI, Anthropic, etc.)
- A clear understanding of the task you want to automate

### Step 1: Define Your Automation Goal

Start by identifying a repetitive task that:
- Takes significant time
- Follows predictable patterns
- Has clear inputs and outputs
- Doesn't require complex human judgment

### Step 2: Choose Your Tools

For AI automation, you'll typically need:
- **AI Model** — OpenAI GPT-4, Anthropic Claude, or similar
- **Workflow Engine** — n8n, Zapier, Make, or custom
- **Data Storage** — Database or file system
- **Integration Layer** — APIs, webhooks, or direct connections

### Step 3: Build Your First Workflow

Start simple. A basic AI automation workflow might:

1. Receive input (email, form submission, file upload)
2. Process with AI (extract info, classify, generate response)
3. Take action (send email, update database, create file)
4. Log results

### Best Practices

- **Start small** — Automate one task at a time
- **Add error handling** — AI can fail; plan for it
- **Monitor everything** — Log inputs, outputs, and errors
- **Iterate** — Improve based on real usage
- **Keep humans in the loop** — For critical decisions

## Conclusion

AI automation is powerful but requires thoughtful design. Start with simple workflows, learn from real usage, and gradually increase complexity. The key is to solve real problems, not to automate for automation's sake.

---

*Have questions? [Contact me](/contact) for a consultation.*`,
    category: "AI",
    tags: ["AI", "Automation", "Tutorial"],
    readingTime: 5,
    publishedAt: "2026-11-10",
    author: "Syed Nizam Uddin",
  },
};

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const reduceMotion = useReducedMotion();
  const post = postData[slug];

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
