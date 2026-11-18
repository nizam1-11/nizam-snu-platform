"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder products (will be loaded from API)
const products = [
  {
    id: "1",
    name: "AI Task Automator",
    slug: "ai-task-automator",
    category: "ai-tool",
    licenseType: "freemium",
    status: "published",
    version: "1.2.0",
    downloads: 1234,
    updatedAt: "2026-11-10",
  },
  {
    id: "2",
    name: "Workflow Builder",
    slug: "workflow-builder",
    category: "automation",
    licenseType: "free",
    status: "published",
    version: "2.0.1",
    downloads: 5678,
    updatedAt: "2026-11-08",
  },
  {
    id: "3",
    name: "Data Sync Pro",
    slug: "data-sync-pro",
    category: "desktop-app",
    licenseType: "paid",
    status: "draft",
    version: "1.0.0",
    downloads: 0,
    updatedAt: "2026-11-15",
  },
];

const statusColors: Record<string, string> = {
  draft: "bg-warning/15 text-warning border-warning/25",
  published: "bg-success/15 text-success border-success/25",
  archived: "bg-error/15 text-error border-error/25",
};

const licenseColors: Record<string, string> = {
  free: "bg-success/15 text-success border-success/25",
  freemium: "bg-accent-blue/15 text-accent-blue border-accent-blue/25",
  paid: "bg-accent-purple/15 text-accent-purple border-accent-purple/25",
  "open-source": "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25",
};

const inputClass =
  "w-full bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20";

export default function AdminProductsPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Products
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your software products and releases.
          </p>
        </div>
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(inputClass, "pl-11 pr-4 py-2.5")}
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(inputClass, "pl-11 pr-9 py-2.5 sm:min-w-[160px]")}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-deep/40">
                {["Product", "Category", "License", "Status", "Version", "Downloads", "Updated"].map((h) => (
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
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border/70 last:border-0 hover:bg-surface-elevated/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-[0_8px_22px_-12px_rgb(181_121_74_/_0.9)]">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-text-muted truncate">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {product.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex px-2.5 py-1 text-xs rounded-full border", licenseColors[product.licenseType])}>
                      {product.licenseType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border capitalize", statusColors[product.status])}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    v{product.version}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {product.downloads.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {product.updatedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 rounded-lg text-text-secondary hover:text-accent-blue hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
