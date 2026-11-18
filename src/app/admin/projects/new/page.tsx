"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Eye,
  FolderKanban,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20";

const categories = ["ai", "automation", "desktop", "web", "experimental"];
const statuses = ["completed", "in-progress", "archived"];

export default function NewProjectPage() {
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "ai",
    status: "in-progress",
    techStack: "",
    isFeatured: false,
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSlugGenerate = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, slug });
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          techStack: formData.techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          status: formData.status,
          isPublished: publish,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedback({
          type: "success",
          message: `Project ${publish ? "published" : "saved as draft"} successfully.${data.id ? ` ID: ${data.id}` : ""}`,
        });
        setFormData({
          title: "",
          slug: "",
          description: "",
          category: "ai",
          status: "in-progress",
          techStack: "",
          isFeatured: false,
        });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to save project" });
      }
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to save project. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/projects"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Add Project
          </h1>
          <p className="text-sm text-text-secondary">
            Create a new portfolio project.
          </p>
        </div>
      </div>

      <div className="overflow-hidden">
        <AnimatePresence initial={false}>
          {feedback && (
            <motion.div
              key={feedback.type}
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "mb-6 p-4 rounded-xl border flex items-center gap-3",
                feedback.type === "success"
                  ? "bg-success/10 border-success/25 text-success"
                  : "bg-error/10 border-error/25 text-error"
              )}
              role={feedback.type === "error" ? "alert" : "status"}
            >
              {feedback.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm">{feedback.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass gradient-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-accent-blue" />
              Project Details
            </h2>

            <div>
              <label htmlFor="project-title" className="block text-sm font-medium text-text-primary mb-2">
                Title *
              </label>
              <input
                id="project-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={handleSlugGenerate}
                className={inputClass}
                placeholder="AI Task Automator"
              />
            </div>

            <div>
              <label htmlFor="project-slug" className="block text-sm font-medium text-text-primary mb-2">
                Slug *
              </label>
              <input
                id="project-slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={inputClass}
                placeholder="ai-task-automator"
              />
            </div>

            <div>
              <label htmlFor="project-description" className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                id="project-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className={cn(inputClass, "resize-none")}
                placeholder="What does this project do?"
              />
            </div>
          </section>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-6">
          <section className="glass gradient-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-heading font-bold text-text-primary">Settings</h2>

            <div>
              <label htmlFor="project-category" className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                id="project-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="project-status" className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                id="project-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={inputClass}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="project-tech" className="block text-sm font-medium text-text-primary mb-2">
                Tech Stack
              </label>
              <input
                id="project-tech"
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className={inputClass}
                placeholder="Next.js, TypeScript, Python"
              />
              <p className="text-xs text-text-muted mt-2">Separate technologies with commas.</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded border-border bg-surface accent-accent-blue focus:ring-accent-blue"
              />
              <span className="text-sm text-text-primary">Featured project</span>
            </label>
          </section>

          <section className="glass gradient-border rounded-2xl p-6 space-y-3">
            <motion.button
              onClick={() => handleSave(false)}
              disabled={saving}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-text-primary glass rounded-xl hover:bg-surface-elevated transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save as Draft
            </motion.button>
            <motion.button
              onClick={() => handleSave(true)}
              disabled={saving}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Publish Project
            </motion.button>
          </section>
        </div>
      </div>
    </div>
  );
}
