"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  FolderKanban,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: "1",
    title: "AI Task Automator",
    slug: "ai-task-automator",
    category: "ai",
    status: "completed",
    isPublished: true,
    isFeatured: true,
    updatedAt: "2026-11-10",
  },
  {
    id: "2",
    title: "Workflow Engine",
    slug: "workflow-engine",
    category: "automation",
    status: "completed",
    isPublished: true,
    isFeatured: true,
    updatedAt: "2026-11-08",
  },
  {
    id: "3",
    title: "Data Sync Tool",
    slug: "data-sync-tool",
    category: "desktop",
    status: "in-progress",
    isPublished: false,
    isFeatured: false,
    updatedAt: "2026-11-15",
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-success/15 text-success border-success/25",
  "in-progress": "bg-warning/15 text-warning border-warning/25",
  archived: "bg-error/15 text-error border-error/25",
};

export default function AdminProjectsPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Projects
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your portfolio projects.
          </p>
        </div>
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(212_175_55_/_0.9)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        </motion.div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          aria-label="Search projects"
          placeholder="Search projects..."
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
                {["Project", "Category", "Status", "Published", "Featured", "Updated"].map((h) => (
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
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border/70 last:border-0 hover:bg-surface-elevated/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-[0_8px_22px_-12px_rgb(133_92_255_/_0.9)]">
                        <FolderKanban className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">{project.title}</div>
                        <div className="text-xs text-text-muted truncate">{project.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary capitalize">{project.category}</td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border capitalize", statusColors[project.status])}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {project.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-success">
                        <Eye className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                        <EyeOff className="w-4 h-4" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {project.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-xs text-accent-purple">
                        <Star className="w-3.5 h-3.5 fill-accent-purple" /> Yes
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{project.updatedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/projects/${project.slug}`} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/projects/${project.id}/edit`} className="p-2 rounded-lg text-text-secondary hover:text-accent-blue hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-text-secondary">No projects found.</div>
        )}
      </div>
    </div>
  );
}
