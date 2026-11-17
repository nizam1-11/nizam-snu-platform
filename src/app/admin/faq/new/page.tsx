"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Eye,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20";

const categories = [
  "general",
  "services",
  "products",
  "downloads",
  "installation",
  "updates",
  "support",
  "privacy",
  "licensing",
];

export default function NewFaqPage() {
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isPublished: publish, sortOrder: 0 }),
      });
      const data = await response.json();
      if (response.ok) {
        setFeedback({
          type: "success",
          message: `FAQ ${publish ? "published" : "saved as draft"} successfully.${data.id ? ` ID: ${data.id}` : ""}`,
        });
        setFormData({ question: "", answer: "", category: "general" });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to save FAQ" });
      }
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to save FAQ. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/faq"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Add FAQ
          </h1>
          <p className="text-sm text-text-secondary">
            Create a new frequently asked question.
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
              <HelpCircle className="w-4 h-4 text-accent-blue" />
              Question &amp; Answer
            </h2>

            <div>
              <label htmlFor="faq-question" className="block text-sm font-medium text-text-primary mb-2">
                Question *
              </label>
              <input
                id="faq-question"
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className={inputClass}
                placeholder="What is SNU Automation?"
              />
            </div>

            <div>
              <label htmlFor="faq-answer" className="block text-sm font-medium text-text-primary mb-2">
                Answer *
              </label>
              <textarea
                id="faq-answer"
                required
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={8}
                className={cn(inputClass, "resize-none")}
                placeholder="Write a clear, concise answer..."
              />
            </div>
          </section>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-6">
          <section className="glass gradient-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-heading font-bold text-text-primary">Settings</h2>

            <div>
              <label htmlFor="faq-category" className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                id="faq-category"
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(212_175_55_/_0.9)] hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Publish FAQ
            </motion.button>
          </section>
        </div>
      </div>
    </div>
  );
}
