"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AnnouncementRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  version: string;
  isPublished: boolean;
  updatedAt: string;
};

/**
 * Real seeded announcements (mirrors scripts/seed-announcements.ts) used as a
 * fallback so the admin list is never blank when the API is empty/unavailable.
 */
const fallbackAnnouncements: AnnouncementRow[] = [
  {
    id: "fallback-snu-automation-portfolio-launch",
    slug: "snu-automation-portfolio-launch",
    title: "SNU Automation is now on the portfolio",
    category: "launch",
    version: "1.0",
    isPublished: true,
    updatedAt: "2026-11-18",
  },
  {
    id: "fallback-snu-clips-in-development",
    slug: "snu-clips-in-development",
    title: "SNU Clips is in development",
    category: "announcement",
    version: "",
    isPublished: true,
    updatedAt: "2026-11-18",
  },
  {
    id: "fallback-roadmap-more-platform-workflows",
    slug: "roadmap-more-platform-workflows",
    title: "On the roadmap: more platform workflows",
    category: "feature",
    version: "",
    isPublished: true,
    updatedAt: "2026-11-18",
  },
];

const categoryStyles: Record<string, string> = {
  launch: "bg-accent-purple/15 text-accent-purple border-accent-purple/25",
  update: "bg-accent-blue/15 text-accent-blue border-accent-blue/25",
  security: "bg-success/15 text-success border-success/25",
  feature: "bg-warning/15 text-warning border-warning/25",
  announcement: "bg-surface-elevated text-text-secondary border-border",
};

export default function AdminAnnouncementsPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>(
    fallbackAnnouncements
  );
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/announcements?admin=1", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.announcements) || data.announcements.length === 0) return;
        setAnnouncements(
          data.announcements.map((a: any) => ({
            id: String(a.id ?? ""),
            slug: String(a.slug ?? ""),
            title: String(a.title ?? ""),
            category: String(a.category ?? "announcement"),
            version: String(a.version ?? ""),
            isPublished: Boolean(a.isPublished),
            updatedAt: String(a.updatedAt ?? a.createdAt ?? "").slice(0, 10),
          }))
        );
      })
      .catch(() => {
        // Keep fallback data on error.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm('Delete "' + label + '"? This cannot be undone.')) return;
    setDeleteError("");
    setDeletingId(id);
    try {
      const res = await fetch("/api/announcements/" + id, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((x) => x.id !== id));
      } else {
        setDeleteError("Could not delete. Please try again.");
      }
    } catch {
      setDeleteError("Could not delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Announcements
          </h1>
          <p className="text-sm text-text-secondary">
            {loading
              ? "Loading announcements…"
              : "Manage updates shown on What's New."}
          </p>
        </div>
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Link
            href="/admin/announcements/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Announcement
          </Link>
        </motion.div>
      </div>

      {deleteError && (
        <p role="alert" className="mb-4 text-sm text-error">{deleteError}</p>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          aria-label="Search announcements"
          placeholder="Search announcements..."
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
                {["Announcement", "Category", "Published", "Version", "Updated"].map((h) => (
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
              {filteredAnnouncements.map((announcement) => (
                <tr
                  key={announcement.id}
                  className="border-b border-border/70 last:border-0 hover:bg-surface-elevated/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-[0_8px_22px_-12px_rgb(92_126_255_/_0.9)]">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">{announcement.title}</div>
                        <div className="text-xs text-text-muted truncate">{announcement.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center px-2.5 py-1 text-xs rounded-full border capitalize", categoryStyles[announcement.category] ?? categoryStyles.announcement)}>
                      {announcement.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {announcement.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-success">
                        <Eye className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                        <EyeOff className="w-4 h-4" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {announcement.version ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-text-secondary">
                        <Hash className="w-3.5 h-3.5" />
                        {announcement.version}
                      </span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{announcement.updatedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/whats-new#${announcement.slug}`} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/announcements/${announcement.id}/edit`} className="p-2 rounded-lg text-text-secondary hover:text-accent-blue hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error" title="Delete" onClick={() => handleDelete(announcement.id, announcement.title || announcement.id)} disabled={deletingId === announcement.id}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 text-text-secondary">No announcements found.</div>
        )}
      </div>
    </div>
  );
}
