"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fallbackPosts = [
  {
    id: "1",
    title: "Getting Started with AI Automation",
    slug: "getting-started-ai-automation",
    category: "AI",
    status: "published",
    readingTime: 5,
    publishedAt: "2026-11-10",
    updatedAt: "2026-11-10",
  },
  {
    id: "2",
    title: "Building Desktop Apps with Electron",
    slug: "building-desktop-apps-electron",
    category: "Development",
    status: "published",
    readingTime: 8,
    publishedAt: "2026-11-05",
    updatedAt: "2026-11-05",
  },
  {
    id: "3",
    title: "Workflow Automation Best Practices",
    slug: "workflow-automation-best-practices",
    category: "Automation",
    status: "draft",
    readingTime: 6,
    publishedAt: null,
    updatedAt: "2026-11-15",
  },
];

const statusColors: Record<string, string> = {
  draft: "bg-warning/15 text-warning border-warning/25",
  published: "bg-success/15 text-success border-success/25",
  archived: "bg-error/15 text-error border-error/25",
};

export default function AdminBlogPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog?admin=1", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.posts) || data.posts.length === 0) return;
        setPosts(
          data.posts.map((p: any) => ({
            id: String(p.id ?? ""),
            title: String(p.title ?? ""),
            slug: String(p.slug ?? ""),
            category: String(p.category ?? ""),
            status: String(p.status ?? "draft"),
            readingTime: Number(p.readingTime ?? 0),
            publishedAt: p.publishedAt ? String(p.publishedAt).slice(0, 10) : null,
            updatedAt: String(p.updatedAt ?? p.createdAt ?? "").slice(0, 10),
          }))
        );
      })
      .catch(() => {
        // Keep fallback data on error.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Blog Posts
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your knowledge center articles.
          </p>
        </div>
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </motion.div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          aria-label="Search posts"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20"
        />
      </div>

      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-deep/40">
                {["Title", "Category", "Status", "Reading Time", "Published"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
                <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border/70 last:border-0 hover:bg-surface-elevated/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center shadow-[0_8px_22px_-12px_rgb(54_217_245_/_0.8)]">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">
                          {post.title}
                        </div>
                        <div className="text-xs text-text-muted truncate">
                          {post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {post.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border capitalize", statusColors[post.status])}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-text-secondary">
                      <Clock className="w-3.5 h-3.5 text-text-muted" />
                      {post.readingTime} min
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {post.publishedAt || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-2 rounded-lg text-text-secondary hover:text-accent-blue hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}
