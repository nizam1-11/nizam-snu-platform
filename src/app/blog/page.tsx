"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SpotlightCard, GradientOrb } from "@/components/interactive";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "automation", label: "Automation" },
  { id: "development", label: "Development" },
  { id: "tutorials", label: "Tutorials" },
];

const posts = [
  {
    id: "1",
    slug: "safe-facebook-page-automation",
    title: "How to Automate Facebook Page Posting Without Getting Flagged",
    excerpt:
      "Schedule Facebook Page posts safely with human-like pacing, dry runs, daily caps, caption rotation, and health checks that pause a failing queue.",
    category: "automation",
    tags: ["Facebook", "Automation", "Safety"],
    readingTime: 6,
    publishedAt: "2026-11-18",
  },
  {
    id: "2",
    slug: "bulk-video-downloading-organized",
    title: "Bulk Video Downloading Done Right: Folders, Duplicates & Cookie Health",
    excerpt:
      "Turn a pile of links into an organized library: per-channel folders, duplicate skipping, clear errors, healthy cookies, and audio-only or subtitle options.",
    category: "tutorials",
    tags: ["Video", "Downloading", "Workflow"],
    readingTime: 5,
    publishedAt: "2026-11-15",
  },
  {
    id: "3",
    slug: "visual-workflow-builder-guide",
    title: "Visual Workflow Builders: Automate Repetitive Content Tasks Without Code",
    excerpt:
      "Learn how node-based workflows, starter templates, scheduling, JSON portability, and a safety-bound AI assistant can handle repetitive content work.",
    category: "ai",
    tags: ["Workflows", "AI", "No-Code"],
    readingTime: 7,
    publishedAt: "2026-11-10",
  },
];

export default function BlogPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-atmosphere opacity-40" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
      <GradientOrb
        color="cyan"
        size={380}
        opacity={0.16}
        blur={80}
        float={!reduceMotion}
        className="absolute -top-36 left-1/3"
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary mb-6">
              Knowledge <span className="text-gradient-primary">Center</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Articles, tutorials, and insights on AI automation, software
              development, and technology.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Search + Filter */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                aria-label="Search articles"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 glass border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20 focus:shadow-[0_0_26px_-10px_rgb(181_121_74_/_0.55)]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  className={cn(
                    "px-3.5 py-1.5 text-sm rounded-full transition-colors duration-300",
                    activeCategory === cat.id
                      ? "text-white bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)]"
                      : "glass text-text-secondary hover:text-text-primary hover:border-accent-blue/40"
                  )}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <StaggerItem key={post.id} className="h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:rounded-2xl"
                    >
                      <SpotlightCard className="h-full">
                        <article className="glass rounded-2xl overflow-hidden h-full flex flex-col transition-colors duration-300 group-hover:border-accent-blue/30">
                          {/* Gradient cover placeholder */}
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-surface-deep via-surface-card to-surface-elevated flex items-center justify-center">
                            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent-blue/20 blur-2xl" />
                            <div className="pointer-events-none absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-accent-purple/20 blur-2xl" />
                            <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
                            <BookOpen className="relative w-14 h-14 text-text-muted/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-electric/60" />
                            <span className="absolute top-4 left-4 px-2.5 py-1 text-xs rounded-full glass text-accent-cyan capitalize">
                              {post.category}
                            </span>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="flex items-center gap-1 text-xs text-text-muted">
                                <Clock className="w-3 h-3" />
                                {post.readingTime} min read
                              </span>
                              <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                              <span className="flex items-center gap-1 text-xs text-text-muted">
                                <Calendar className="w-3 h-3" />
                                {post.publishedAt}
                              </span>
                            </div>

                            <h3 className="text-lg font-heading font-bold text-text-primary mb-2 group-hover:text-accent-electric transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <span className="text-sm text-accent-blue font-medium flex items-center gap-1 group-hover:text-accent-electric transition-colors">
                                Read More
                                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs rounded-md bg-surface-elevated/70 text-text-muted"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </article>
                      </SpotlightCard>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              No articles found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
