"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ImageIcon,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20";

const categories = ["AI", "Development", "Automation", "Tutorials"];

export default function NewBlogPostPage() {
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "AI",
    tags: "",
    coverImageUrl: "",
  });
  const [coverImageError, setCoverImageError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Use a JPG, PNG, WebP, GIF or AVIF image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be 10 MB or smaller.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = previewUrl;
    setLocalPreview(previewUrl);
    setCoverImageError(false);

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "same-origin",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setFormData((prev) => ({ ...prev, coverImageUrl: data.url }));
        setUploadError("");
      } else {
        const codeMessages: Record<string, string> = {
          NO_FILE: "Please choose an image and try again.",
          INVALID_FILE_TYPE: "Use a JPG, PNG, WebP, GIF or AVIF image.",
          FILE_TOO_LARGE: "Image must be 10 MB or smaller.",
          UNAUTHORIZED: "Your session has expired. Please sign in again.",
          STORAGE_UNAVAILABLE: "Storage isn't available right now.",
          INTERNAL_ERROR: "Upload failed. Please try again.",
        };
        setUploadError(
          (data.code && codeMessages[data.code]) ||
            data.error ||
            "Upload failed. Please try again."
        );
      }
    } catch {
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setLocalPreview(null);
      setUploading(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          status: publish ? "published" : "draft",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedback({
          type: "success",
          message: `Post ${publish ? "published" : "saved as draft"} successfully.${data.id ? ` ID: ${data.id}` : ""}`,
        });
        setFormData({ title: "", slug: "", excerpt: "", content: "", category: "AI", tags: "", coverImageUrl: "" });
        setCoverImageError(false);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to save post" });
      }
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to save post. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = localPreview || formData.coverImageUrl;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Write Post
          </h1>
          <p className="text-sm text-text-secondary">
            Create a new knowledge center article.
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
              <FileText className="w-4 h-4 text-accent-blue" />
              Article
            </h2>

            <div>
              <label htmlFor="post-title" className="block text-sm font-medium text-text-primary mb-2">
                Title *
              </label>
              <input
                id="post-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={handleSlugGenerate}
                className={inputClass}
                placeholder="Getting Started with AI Automation"
              />
            </div>

            <div>
              <label htmlFor="post-slug" className="block text-sm font-medium text-text-primary mb-2">
                Slug *
              </label>
              <input
                id="post-slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={inputClass}
                placeholder="getting-started-ai-automation"
              />
            </div>

            <div>
              <label htmlFor="post-excerpt" className="block text-sm font-medium text-text-primary mb-2">
                Excerpt
              </label>
              <textarea
                id="post-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className={cn(inputClass, "resize-none")}
                placeholder="A short summary of the article..."
              />
            </div>

            <div>
              <label htmlFor="post-content" className="block text-sm font-medium text-text-primary mb-2">
                Content (Markdown)
              </label>
              <textarea
                id="post-content"
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className={cn(inputClass, "resize-none font-mono text-sm")}
                placeholder={"## Introduction\n\nStart writing your article here..."}
              />
            </div>

            <div>
              <label htmlFor="coverImageUrl" className="block text-sm font-medium text-text-primary mb-2">
                Cover Image URL
              </label>
              <input
                id="coverImageUrl"
                name="coverImageUrl"
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, coverImageUrl: e.target.value });
                  setCoverImageError(false);
                }}
                className={inputClass}
                placeholder="https://example.com/cover.jpg"
              />
              <p className="text-xs text-text-muted mt-2">
                Paste a direct image link. Leave empty to use the default gradient cover.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Upload cover image"
                />
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-text-primary glass rounded-xl hover:bg-surface-elevated transition-colors disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading…" : "Upload Image"}
                </motion.button>
                <span className="text-xs text-text-muted">
                  or upload a JPG, PNG, WebP, GIF or AVIF up to 10 MB
                </span>
              </div>
              {uploadError && (
                <p className="mt-2 flex items-center gap-2 text-xs text-error" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {uploadError}
                </p>
              )}

              {previewSrc ? (
                coverImageError ? (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-xs text-text-muted" role="status">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Image could not be loaded
                  </div>
                ) : (
                  <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewSrc}
                      alt="Cover image preview"
                      className="block h-32 w-full object-cover"
                      onError={() => setCoverImageError(true)}
                      onLoad={() => setCoverImageError(false)}
                    />
                  </div>
                )
              ) : (
                <div className="mt-3 flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface text-text-muted">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs">No cover image</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-6">
          <section className="glass gradient-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-heading font-bold text-text-primary">Settings</h2>

            <div>
              <label htmlFor="post-category" className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                id="post-category"
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
              <label htmlFor="post-tags" className="block text-sm font-medium text-text-primary mb-2">
                Tags
              </label>
              <input
                id="post-tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className={inputClass}
                placeholder="AI, Automation, Tutorial"
              />
              <p className="text-xs text-text-muted mt-2">Separate tags with commas.</p>
            </div>
          </section>

          <section className="glass gradient-border rounded-2xl p-6 space-y-3">
            <motion.button
              onClick={() => handleSave(false)}
              disabled={saving}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-text-primary glass rounded-xl hover:bg-surface-elevated transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </motion.button>
            <motion.button
              onClick={() => handleSave(true)}
              disabled={saving}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Publish Post
            </motion.button>
          </section>
        </div>
      </div>
    </div>
  );
}
