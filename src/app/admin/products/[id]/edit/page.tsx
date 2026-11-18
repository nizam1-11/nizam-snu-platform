"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Plus,
  X,
  Package,
} from "lucide-react";

export default function EditProductPage() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    longDescription: "",
    category: "ai-tool",
    licenseType: "free",
    isFeatured: false,
    features: [""] as string[],
    supportedPlatforms: [] as string[],
    installationGuide: "",
    documentationUrl: "",
    supportInfo: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadProduct = async () => {
      try {
        const res = await fetch("/api/products/" + id, {
          credentials: "same-origin",
        });
        if (!res.ok) {
          if (!cancelled) {
            setLoadError(
              res.status === 404
                ? "Product not found."
                : "Could not load product. Please try again."
            );
          }
          return;
        }
        const data = await res.json();
        const product = data.product;
        if (!product) {
          if (!cancelled) setLoadError("Product not found.");
          return;
        }
        const parseArray = (value: unknown): string[] => {
          try {
            const parsed =
              typeof value === "string" ? JSON.parse(value) : value;
            return Array.isArray(parsed)
              ? parsed.map(String)
              : typeof parsed === "string" && parsed
              ? [parsed]
              : [];
          } catch {
            return [];
          }
        };
        const features = parseArray(product.features);
        if (!cancelled) {
          setFormData({
            name: String(product.name ?? ""),
            slug: String(product.slug ?? ""),
            tagline: String(product.tagline ?? ""),
            description: String(product.description ?? ""),
            longDescription: String(product.longDescription ?? ""),
            category: String(product.category ?? "ai-tool"),
            licenseType: String(product.licenseType ?? "free"),
            isFeatured: Boolean(product.isFeatured),
            features: features.length ? features : [""],
            supportedPlatforms: parseArray(product.supportedPlatforms),
            installationGuide: "",
            documentationUrl: String(product.documentationUrl ?? ""),
            supportInfo: String(product.supportInfo ?? ""),
          });
        }
      } catch {
        if (!cancelled) setLoadError("Could not load product. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSlugGenerate = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, slug });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const togglePlatform = (platform: string) => {
    setFormData({
      ...formData,
      supportedPlatforms: formData.supportedPlatforms.includes(platform)
        ? formData.supportedPlatforms.filter((p) => p !== platform)
        : [...formData.supportedPlatforms, platform],
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    setSaving(true);
    try {
      const response = await fetch("/api/products/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...formData, status }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Product ${status === "draft" ? "saved as draft" : "published"} successfully!${data.item?.id ? ` ID: ${data.item.id}` : ""}`);
        setTimeout(() => router.push("/admin/products"), 1200);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const platforms = ["windows", "android", "linux", "macos", "web"];

  if (loading || loadError) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/products"
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              Edit Product
            </h1>
            <p className="text-text-secondary">
              {loading ? "Loading product..." : loadError}
            </p>
          </div>
        </div>
        {!loading && (
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary glass rounded-lg hover:bg-surface-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Edit Product
          </h1>
          <p className="text-text-secondary">
            Edit an existing software product in your marketplace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onBlur={handleSlugGenerate}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="AI Task Automator"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="ai-task-automator"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Automate repetitive tasks with natural language"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Short Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                placeholder="A brief description of the product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Long Description (Markdown)
              </label>
              <textarea
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                rows={8}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none font-mono text-sm"
                placeholder="## Overview\n\nDetailed description in markdown..."
              />
            </div>
          </div>

          {/* Features */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-text-primary">
                Features
              </h2>
              <button
                onClick={addFeature}
                className="flex items-center gap-1 text-sm text-accent-electric hover:text-accent-blue"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  placeholder="Feature description"
                />
                {formData.features.length > 1 && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2.5 text-text-secondary hover:text-error transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Installation Guide */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Installation Guide (Markdown)
            </h2>
            <textarea
              value={formData.installationGuide}
              onChange={(e) =>
                setFormData({ ...formData, installationGuide: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none font-mono text-sm"
              placeholder="## Windows Installation\n\n1. Download...\n2. Run..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & License */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Settings
            </h2>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                <option value="ai-tool">AI Tool</option>
                <option value="automation">Automation</option>
                <option value="desktop-app">Desktop App</option>
                <option value="web-app">Web App</option>
                <option value="utility">Utility</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                License Type
              </label>
              <select
                value={formData.licenseType}
                onChange={(e) =>
                  setFormData({ ...formData, licenseType: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="open-source">Open Source</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-4 h-4 rounded border-border bg-surface text-accent-blue focus:ring-accent-blue"
              />
              <label htmlFor="isFeatured" className="text-sm text-text-primary">
                Featured Product
              </label>
            </div>
          </div>

          {/* Supported Platforms */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Supported Platforms
            </h2>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.supportedPlatforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                    className="w-4 h-4 rounded border-border bg-surface text-accent-blue focus:ring-accent-blue"
                  />
                  <span className="text-sm text-text-primary capitalize">
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Media
            </h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-text-secondary mx-auto mb-3" />
              <p className="text-sm text-text-secondary mb-2">
                Upload logo, banner, and screenshots
              </p>
              <p className="text-xs text-text-secondary">
                Drag & drop or click to browse
              </p>
              <button className="mt-4 px-4 py-2 text-sm text-accent-electric glass rounded-lg hover:bg-surface-light transition-colors">
                Choose Files
              </button>
            </div>
          </div>

          {/* Documentation & Support */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-heading font-bold text-text-primary">
              Documentation & Support
            </h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Documentation URL
              </label>
              <input
                type="url"
                value={formData.documentationUrl}
                onChange={(e) =>
                  setFormData({ ...formData, documentationUrl: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="https://docs.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Support Info
              </label>
              <textarea
                value={formData.supportInfo}
                onChange={(e) =>
                  setFormData({ ...formData, supportInfo: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                placeholder="Contact nizam14010@gmail.com for help..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="glass gradient-border rounded-2xl p-6 space-y-3">
            <motion.button
              onClick={() => handleSave("draft")}
              disabled={saving}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-text-primary glass rounded-xl hover:bg-surface-light transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save as Draft"}
            </motion.button>
            <motion.button
              onClick={() => handleSave("published")}
              disabled={saving}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              {saving ? "Publishing..." : "Publish Product"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
