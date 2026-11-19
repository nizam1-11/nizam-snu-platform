"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Package,
  FolderKanban,
  FileText,
  HelpCircle,
  Mail,
  TrendingUp,
  Download,
  Eye,
  Plus,
  ArrowRight,
  Settings,
  Activity,
  Zap,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATS_FALLBACK = [
  { label: "Products", value: "0", icon: Package, color: "from-accent-blue to-accent-electric" },
  { label: "Projects", value: "0", icon: FolderKanban, color: "from-accent-purple to-accent-pink" },
  { label: "Blog Posts", value: "0", icon: FileText, color: "from-accent-cyan to-accent-blue" },
  { label: "FAQs", value: "0", icon: HelpCircle, color: "from-accent-electric to-accent-cyan" },
  { label: "Messages", value: "0", icon: Mail, color: "from-accent-pink to-accent-purple" },
  { label: "Downloads", value: "0", icon: Download, color: "from-success to-accent-cyan" },
];

const quickActions = [
  { label: "Add Product", href: "/admin/products/new", icon: Package },
  { label: "Add Project", href: "/admin/projects/new", icon: FolderKanban },
  { label: "Write Post", href: "/admin/blog/new", icon: FileText },
  { label: "Add FAQ", href: "/admin/faq/new", icon: HelpCircle },
];

const RECENT_ACTIVITY_FALLBACK = [
  { action: "System initialized", time: "Just now", type: "system" },
];

const quickLinks = [
  { label: "View Live Site", href: "/", icon: Eye },
  { label: "Product Publishing Guide", href: "#", icon: Package },
  { label: "API Documentation", href: "#", icon: FileText },
  { label: "Cloudflare Dashboard", href: "https://dash.cloudflare.com", icon: Settings },
];

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return (await res.json()) as unknown;
}

function settledValue(result: PromiseSettledResult<unknown>): unknown {
  return result.status === "fulfilled" ? result.value : null;
}

function extractArray(payload: unknown, key: string): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;
  const candidate = (payload as Record<string, unknown>)[key];
  return Array.isArray(candidate) ? candidate : null;
}

function formatTime(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const reduceMotion = useReducedMotion();
  const hover = reduceMotion ? undefined : { y: -3 };
  const tap = reduceMotion ? undefined : { scale: 0.99 };

  // Seeded with the current hardcoded values so the page never flashes zeros.
  // On a failed/empty fetch the fallback is retained.
  const [stats, setStats] = useState(STATS_FALLBACK);
  const [recentActivity, setRecentActivity] = useState(RECENT_ACTIVITY_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // The 4th result (announcements) has no stat card in the current UI, so it
      // is fetched but not bound — keeping the endpoint call per the data spec.
      const [blogRes, projectsRes, productsRes, , messagesRes, faqRes] =
        await Promise.allSettled([
          fetchJson("/api/blog?admin=1"),
          fetchJson("/api/projects?admin=1"),
          fetchJson("/api/products?admin=1"),
          fetchJson("/api/announcements?admin=1"),
          fetchJson("/api/messages"),
          fetchJson("/api/faq?admin=1"),
        ]);

      if (cancelled) return;

      const posts = extractArray(settledValue(blogRes), "posts");
      const projects = extractArray(settledValue(projectsRes), "projects");
      const products = extractArray(settledValue(productsRes), "products");
      const messages = extractArray(settledValue(messagesRes), "messages");
      const faqs = extractArray(settledValue(faqRes), "faqs");

      setStats((current) =>
        current.map((stat) => {
          let nextValue: string | null = null;
          switch (stat.label) {
            case "Products":
              nextValue = products ? String(products.length) : null;
              break;
            case "Projects":
              nextValue = projects ? String(projects.length) : null;
              break;
            case "Blog Posts":
              nextValue = posts ? String(posts.length) : null;
              break;
            case "FAQs":
              nextValue = faqs ? String(faqs.length) : null;
              break;
            case "Messages":
              nextValue = messages ? String(messages.length) : null;
              break;
            // "Downloads" has no matching API — keep its fallback value.
            default:
              nextValue = null;
          }
          return nextValue === null ? stat : { ...stat, value: nextValue };
        })
      );

      if (messages && messages.length > 0) {
        const rows = messages.slice(0, 5).map((entry) => {
          const record =
            entry && typeof entry === "object"
              ? (entry as Record<string, unknown>)
              : {};
          const rawName = record.name;
          const rawSubject = record.subject;
          const name =
            typeof rawName === "string" && rawName.trim()
              ? rawName.trim()
              : "New message";
          const subject =
            typeof rawSubject === "string" && rawSubject.trim()
              ? rawSubject.trim()
              : "Contact submission";
          const rawTime = record.createdAt ?? record.created_at ?? record.date;
          return {
            action: `${name}: ${subject}`,
            time: formatTime(rawTime),
            type: "message",
          };
        });
        setRecentActivity(rows);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-electric mb-2">
            <Zap className="w-3.5 h-3.5" />
            Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Welcome back, Syed Nizam Uddin. Here&apos;s an overview of your platform.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={hover}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass gradient-border rounded-2xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className={cn(
                "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-[0_10px_28px_-12px_rgb(181_121_74_/_0.7)]",
                stat.color
              )}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-success/80" />
            </div>
            <div className="text-3xl font-heading font-bold text-text-primary">
              {stat.value}
            </div>
            <div className="text-sm text-text-muted mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-accent-blue" />
          <h2 className="text-lg font-heading font-bold text-text-primary">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.div key={action.label} whileHover={hover} whileTap={tap}>
              <Link
                href={action.href}
                className="glass rounded-xl p-4 flex items-center gap-3 hover:border-accent-blue/40 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <div className="w-9 h-9 shrink-0 rounded-lg glass gradient-border flex items-center justify-center text-accent-blue group-hover:text-accent-electric transition-colors">
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {action.label}
                </span>
                <Plus className="w-4 h-4 text-text-muted ml-auto group-hover:text-accent-electric transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-accent-electric" />
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-deep/50 border border-border/60"
              >
                <span className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgb(181_121_74_/_0.8)]" />
                <div className="flex-1">
                  <p className="text-sm text-text-primary">{activity.action}</p>
                  <p className="text-xs text-text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Compass className="w-4 h-4 text-accent-purple" />
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Quick Links
            </h2>
          </div>
          <div className="space-y-1">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <link.icon className="w-4 h-4 text-text-muted" />
                {link.label}
                <ArrowRight className="w-3 h-3 ml-auto opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
