"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Asset = {
  id: string;
  platform: string;
  architecture: string | null;
  fileType: string | null;
  fileSize: number | null;
  downloadUrl: string;
  isAvailable: boolean;
};

type Release = {
  id: string;
  productId: string;
  version: string;
  releaseDate: string;
  releaseNotes: string | null;
  changelog: string | null;
  status: string;
  isLatest: boolean;
  assets: Asset[];
};

type Product = { id: string; name: string };

const statusColors: Record<string, string> = {
  stable: "bg-success/15 text-success border-success/25",
  beta: "bg-accent-blue/15 text-accent-blue border-accent-blue/25",
  experimental: "bg-accent-purple/15 text-accent-purple border-accent-purple/25",
  deprecated: "bg-error/15 text-error border-error/25",
};

const inputClass =
  "w-full bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20";

function formatMB(bytes: number | null | undefined) {
  if (!bytes || bytes <= 0) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminReleasesPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [releases, setReleases] = useState<Release[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/releases", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("load failed"))))
      .then((data: { releases?: any[] }) => {
        if (cancelled) return;
        const rows = Array.isArray(data.releases) ? data.releases : [];
        setReleases(
          rows.map((r: any) => {
            const assets = Array.isArray(r.assets) ? r.assets : [];
            return {
              id: String(r.id ?? ""),
              productId: String(r.productId ?? ""),
              version: String(r.version ?? ""),
              releaseDate: String(r.releaseDate ?? r.createdAt ?? ""),
              releaseNotes: r.releaseNotes ?? null,
              changelog: r.changelog ?? null,
              status: String(r.status ?? "stable"),
              isLatest: Boolean(r.isLatest),
              assets: assets.map((a: any) => ({
                id: String(a.id ?? ""),
                platform: String(a.platform ?? "—"),
                architecture: a.architecture ? String(a.architecture) : null,
                fileType: a.fileType ? String(a.fileType) : null,
                fileSize: a.fileSize != null ? Number(a.fileSize) : null,
                downloadUrl: String(a.downloadUrl ?? ""),
                isAvailable: a.isAvailable !== false,
              })),
            } as Release;
          })
        );
        setLoadError("");
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load releases. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    fetch("/api/products?admin=1", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products?: any[] } | null) => {
        if (cancelled || !data || !Array.isArray(data.products)) return;
        setProducts(
          data.products.map((p: any) => ({
            id: String(p.id ?? ""),
            name: String(p.name ?? ""),
          }))
        );
      })
      .catch(() => {
        // Product names are cosmetic — fall back to IDs.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const productNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of products) map[p.id] = p.name;
    return map;
  }, [products]);

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm('Delete "' + label + '"? This cannot be undone.')) return;
    setDeleteError("");
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/releases/" + id, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        setReleases((prev) => prev.filter((r) => r.id !== id));
      } else {
        setDeleteError("Could not delete. Please try again.");
      }
    } catch {
      setDeleteError("Could not delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReleases = releases.filter((r) => {
    const q = searchQuery.toLowerCase();
    const asset = r.assets[0];
    return (
      r.version.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      (productNames[r.productId] || r.productId).toLowerCase().includes(q) ||
      (asset?.platform || "").toLowerCase().includes(q) ||
      (asset?.fileType || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Releases
          </h1>
          <p className="text-sm text-text-secondary">
            Publish installers and manage app updates.
          </p>
        </div>
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Link
            href="/admin/releases/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Release
          </Link>
        </motion.div>
      </div>

      {deleteError && (
        <p role="alert" className="mb-4 text-sm text-error">{deleteError}</p>
      )}
      {loadError && (
        <p role="alert" className="mb-4 text-sm text-error">{loadError}</p>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            aria-label="Search releases"
            placeholder="Search releases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(inputClass, "pl-11 pr-4 py-2.5")}
          />
        </div>
      </div>

      {/* Releases Table */}
      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-deep/40">
                {["Version", "Product", "Platform", "Status", "File size", "Published"].map((h) => (
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
              {filteredReleases.map((release) => {
                const asset = release.assets[0];
                return (
                  <tr
                    key={release.id}
                    className="border-b border-border/70 last:border-0 hover:bg-surface-elevated/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">
                          v{release.version}
                        </span>
                        {release.isLatest && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border bg-accent-blue/15 text-accent-blue border-accent-blue/25">
                            <Tag className="w-3 h-3" />
                            Latest
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-text-secondary truncate">
                          {productNames[release.productId] || release.productId || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary capitalize">
                      {asset ? (
                        <span>
                          {asset.platform}
                          {asset.architecture ? (
                            <span className="text-text-muted"> / {asset.architecture}</span>
                          ) : null}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border capitalize", statusColors[release.status] || statusColors.stable)}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {release.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatMB(asset?.fileSize)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {release.releaseDate ? release.releaseDate.slice(0, 10) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {asset?.downloadUrl ? (
                          <a
                            href={asset.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-text-secondary hover:text-success hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                            title={asset.isAvailable ? "Download installer" : "Download unavailable"}
                            aria-label="View download link"
                          >
                            {asset.isAvailable ? (
                              <Download className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </a>
                        ) : (
                          <span className="p-2 text-text-muted/50" title="No installer uploaded">
                            <Download className="w-4 h-4" />
                          </span>
                        )}
                        <Link
                          href={`/admin/releases/${release.id}/edit`}
                          className="p-2 rounded-lg text-text-secondary hover:text-accent-blue hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                          title="Edit"
                          aria-label="Edit release"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-50"
                          title="Delete"
                          aria-label="Delete release"
                          onClick={() => handleDelete(release.id, `v${release.version}`)}
                          disabled={deletingId === release.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredReleases.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
              <Package className="w-6 h-6 text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {loading ? "Loading releases…" : "No releases yet"}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {loading
                  ? "Fetching the latest updates."
                  : "Publish your first installer to make it available for download."}
              </p>
            </div>
            {!loading && (
              <Link
                href="/admin/releases/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add Release
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
