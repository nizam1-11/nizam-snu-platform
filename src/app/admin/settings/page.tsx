"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Globe,
  Mail,
  Share2,
  Shield,
  Save,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const reduceMotion = useReducedMotion();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteName: "Nizam — SNU Automation",
    siteDescription: "AI Automation Developer & Software Creator",
    siteUrl: "https://nizam-snu.pages.dev",
    contactEmail: "nizam14010@gmail.com",
    githubUrl: "https://github.com/yourusername",
    linkedinUrl: "https://linkedin.com/in/yourusername",
    twitterUrl: "https://twitter.com/yourusername",
    analyticsEnabled: true,
    maintenanceMode: false,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
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
                  ? "bg-accent-blue border-accent-blue/60 shadow-[0_0_16px_-4px_rgb(212_175_55_/_0.9)]"
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
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(212_175_55_/_0.9)] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </div>
  );
}
