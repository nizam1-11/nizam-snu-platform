"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  HelpCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fallbackFaqs = [
  {
    id: "1",
    question: "What is AI Task Automator?",
    answer: "An AI-powered desktop application that automates repetitive business tasks.",
    category: "products",
    isPublished: true,
    sortOrder: 1,
  },
  {
    id: "2",
    question: "How do I download software?",
    answer: "Visit the Download Center, select your product and platform, and click Download.",
    category: "downloads",
    isPublished: true,
    sortOrder: 2,
  },
  {
    id: "3",
    question: "Is my data safe?",
    answer: "Yes, all data is processed locally and never shared with third parties.",
    category: "privacy",
    isPublished: false,
    sortOrder: 3,
  },
];

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

export default function AdminFaqPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [faqs, setFaqs] = useState(fallbackFaqs);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/faq?admin=1", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.faqs) || data.faqs.length === 0) return;
        setFaqs(
          data.faqs.map((f: any) => ({
            id: String(f.id ?? ""),
            question: String(f.question ?? ""),
            answer: String(f.answer ?? ""),
            category: String(f.category ?? "general"),
            isPublished: Boolean(f.isPublished),
            sortOrder: Number(f.sortOrder ?? 0),
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

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch = f.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            FAQ Management
          </h1>
          <p className="text-sm text-text-secondary">
            Manage frequently asked questions.
          </p>
        </div>
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Link
            href="/admin/faq/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </Link>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            aria-label="Search FAQs"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-11 pr-9 py-2.5 bg-surface border border-border rounded-xl text-text-primary transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20 sm:min-w-[180px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <motion.div
            key={faq.id}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass gradient-border rounded-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-surface-elevated border border-border text-text-secondary">
                    {faq.category}
                  </span>
                  {faq.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="w-3.5 h-3.5" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <XCircle className="w-3.5 h-3.5" /> Draft
                    </span>
                  )}
                </div>
                <h3 className="text-base font-medium text-text-primary mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-text-secondary">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 rounded-lg text-text-secondary hover:text-accent-blue hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            No FAQs found.
          </div>
        )}
      </div>
    </div>
  );
}
