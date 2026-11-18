"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Globe,
  Mail,
  Share2,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsState {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  analyticsEnabled: boolean;
  maintenanceMode: boolean;
}

// These defaults match scripts/seed.ts. Missing keys from the API keep them.
const DEFAULT_SETTINGS: SettingsState = {
  siteName: "Nizam — SNU Automation",
  siteDescription: "AI Automation Developer & Software Creator",
  siteUrl: "https://nizam-snu.pages.dev",
  contactEmail: "nizam14010@gmail.com",
  githubUrl: "https://github.com/yourusername",
  linkedinUrl: "https://linkedin.com/in/yourusername",
  twitterUrl: "https://twitter.com/yourusername",
  analyticsEnabled: true,
  maintenanceMode: false,
};

// Map the API's snake_case keys (matching scripts/seed.ts) to form fields.
function mergeApiSettings(
  current: SettingsState,
  api: Record<string, unknown>
): SettingsState {
  return {
    siteName: typeof api.site_name === "string" ? api.site_name : current.siteName,
    siteDescription:
      typeof api.site_description === "string"
        ? api.site_description
        : current.siteDescription,
    siteUrl: typeof api.site_url === "string" ? api.site_url : current.siteUrl,
    contactEmail:
      typeof api.contact_email === "string"
        ? api.contact_email
        : current.contactEmail,
    githubUrl:
      typeof api.github_url === "string" ? api.github_url : current.githubUrl,
    linkedinUrl:
      typeof api.linkedin_url === "string"
        ? api.linkedin_url
        : current.linkedinUrl,
    twitterUrl:
      typeof api.twitter_url === "string" ? api.twitter_url : current.twitterUrl,
    analyticsEnabled:
      typeof api.analytics_enabled === "boolean"
        ? api.analytics_enabled
        : current.analyticsEnabled,
    maintenanceMode:
      typeof api.maintenance_mode === "boolean"
        ? api.maintenance_mode
        : current.maintenanceMode,
  };
}

function toApiSettings(state: SettingsState): Record<string, string | boolean> {
  return {
    site_name: state.siteName,
    site_description: state.siteDescription,
    site_url: state.siteUrl,
    contact_email: state.contactEmail,
    github_url: state.githubUrl,
    linkedin_url: state.linkedinUrl,
    twitter_url: state.twitterUrl,
    analytics_enabled: state.analyticsEnabled,
    maintenance_mode: state.maintenanceMode,
  };
}

export default function AdminSettingsPage() {
  const reduceMotion = useReducedMotion();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Hydrate from the database on mount; keep defaults if it fails.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (controller.signal.aborted || !mountedRef.current) return;
        const apiSettings = data?.settings;
        if (
          apiSettings &&
          typeof apiSettings === "object" &&
          !Array.isArray(apiSettings)
        ) {
          setSettings((prev) => mergeApiSettings(prev, apiSettings));
        }
      } catch (err) {
        // Non-fatal: a failed load simply leaves the built-in defaults in place.
        if ((err as Error)?.name === "AbortError") return;
      }
    })();
    return () => controller.abort();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: toApiSettings(settings) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save settings");
      }
      if (!mountedRef.current) return;
      setSaved(true);
      setTimeout(() => {
        if (mountedRef.current) setSaved(false);
      }, 3000);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Manage your website configuration.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <section className="glass gradient-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass gradient-border flex items-center justify-center text-accent-blue">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-heading font-bold text-text-primary">
              General
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Site Description
            </label>
            <input
              type="text"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) =>
                setSettings({ ...settings, siteUrl: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Contact Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                className={cn(inputClass, "pl-11")}
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="glass gradient-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass gradient-border flex items-center justify-center text-accent-purple">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Social Links
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={settings.githubUrl}
              onChange={(e) =>
                setSettings({ ...settings, githubUrl: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={settings.linkedinUrl}
              onChange={(e) =>
                setSettings({ ...settings, linkedinUrl: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Twitter/X URL
            </label>
            <input
              type="url"
              value={settings.twitterUrl}
              onChange={(e) =>
                setSettings({ ...settings, twitterUrl: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </section>

        {/* Toggles */}
        <section className="glass gradient-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass gradient-border flex items-center justify-center text-accent-cyan">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Options
            </h2>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Analytics Enabled
              </p>
              <p className="text-xs text-text-muted">
                Track page views and visitor analytics
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.analyticsEnabled}
              aria-label="Analytics Enabled"
              onClick={() =>
                setSettings({
                  ...settings,
                  analyticsEnabled: !settings.analyticsEnabled,
                })
              }
              className={cn(
                "relative shrink-0 w-12 h-6 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                settings.analyticsEnabled
                  ? "bg-accent-blue border-accent-blue/60 shadow-[0_0_16px_-4px_rgb(181_121_74_/_0.9)]"
                  : "bg-surface-elevated border-border"
              )}
            >
              <span
                className={cn(
                  "block w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform duration-200",
                  settings.analyticsEnabled ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Maintenance Mode
              </p>
              <p className="text-xs text-text-muted">
                Show maintenance page to visitors
              </p>
            </div>
            <button
              role="switch"
              aria-checked={settings.maintenanceMode}
              aria-label="Maintenance Mode"
              onClick={() =>
                setSettings({
                  ...settings,
                  maintenanceMode: !settings.maintenanceMode,
                })
              }
              className={cn(
                "relative shrink-0 w-12 h-6 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                settings.maintenanceMode
                  ? "bg-warning border-warning/60 shadow-[0_0_16px_-4px_rgb(251_191_36_/_0.8)]"
                  : "bg-surface-elevated border-border"
              )}
            >
              <span
                className={cn(
                  "block w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform duration-200",
                  settings.maintenanceMode ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </motion.button>
          {saved && (
            <span className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="w-4 h-4" />
              Saved successfully
            </span>
          )}
          {error && (
            <span
              role="alert"
              className="flex items-center gap-2 text-sm text-error"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
