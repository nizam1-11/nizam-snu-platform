"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  FileArchive,
  Package,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20";

const statuses = ["stable", "beta", "experimental", "deprecated"];
const platforms = ["windows", "macos", "linux", "android"];
const architectures = ["x64", "arm64", "universal"];
const fileTypes = ["exe", "msi", "zip"];
const MAX_INSTALLER_SIZE = 500 * 1024 * 1024;

type Product = { id: string; name: string };
type Feedback = { type: "success" | "error"; message: string };
type UploadResult = { url: string; size: number };

function formatMB(bytes: number | null | undefined) {
  if (!bytes || bytes <= 0) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uploadErrorMessage(data: any): string {
  const codeMessages: Record<string, string> = {
    NO_FILE: "Please choose an installer and try again.",
    INVALID_FILE_TYPE: "Use .exe, .msi or .zip",
    FILE_TOO_LARGE: "File must be 500 MB or smaller",
    INVALID_FOLDER: "Upload failed. Please try again.",
    UNAUTHORIZED: "Your session has expired. Please sign in again.",
    STORAGE_UNAVAILABLE: "Storage isn't available right now.",
    INTERNAL_ERROR: "Upload failed. Please try again.",
  };
  if (data?.network) return "Upload failed. Check your connection and try again.";
  return (
    (data?.code && codeMessages[data.code]) ||
    data?.error ||
    "Upload failed. Please try again."
  );
}

export default function NewReleasePage() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    productId: "pr1",
    version: "",
    releaseNotes: "",
    changelog: "",
    status: "stable",
    isLatest: false,
    platform: "windows",
    architecture: "x64",
    fileType: "exe",
  });
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products?admin=1", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products?: any[] } | null) => {
        if (cancelled || !data || !Array.isArray(data.products)) return;
        const list: Product[] = data.products.map((p: any) => ({
          id: String(p.id ?? ""),
          name: String(p.name ?? ""),
        }));
        setProducts(list);
        setFormData((prev) => {
          if (prev.productId !== "pr1" && list.some((p) => p.id === prev.productId)) {
            return prev;
          }
          const preferred =
            list.find((p) => p.id === "pr1") ||
            list.find((p) => /snu automation/i.test(p.name)) ||
            list[0];
          return preferred ? { ...prev, productId: preferred.id } : prev;
        });
      })
      .catch(() => {
        // Keep the default "pr1" selection when products cannot be loaded.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Upload with real progress reporting, using the same-origin admin cookie. */
  const uploadInstaller = (file: File): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "installers");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/upload");
      xhr.withCredentials = true;
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
        }
      };
      xhr.onload = () => {
        let data: any = {};
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          // Use the empty object below for error mapping.
        }
        if (xhr.status >= 200 && xhr.status < 300 && typeof data.url === "string") {
          resolve({ url: data.url, size: Number(data.size) || file.size });
        } else {
          reject(data);
        }
      };
      xhr.onerror = () => reject({ network: true });
      xhr.send(fd);
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".exe", ".msi", ".zip"].includes(ext)) {
      setUploadError("Use .exe, .msi or .zip");
      return;
    }
    if (file.size > MAX_INSTALLER_SIZE) {
      setUploadError("File must be 500 MB or smaller");
      return;
    }

    setUploadError("");
    setUploadSuccess("");
    setFeedback(null);
    setDownloadUrl("");
    setFileSize(0);
    setSelectedFile({ name: file.name, size: file.size });
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadInstaller(file);
      setDownloadUrl(result.url);
      setFileSize(result.size);
      setUploadProgress(100);
      setUploadSuccess(file.name);
    } catch (err: any) {
      setSelectedFile(null);
      setDownloadUrl("");
      setFileSize(0);
      setUploadError(uploadErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.productId.trim()) {
      setFeedback({ type: "error", message: "Select a product before publishing." });
      return;
    }
    if (!formData.version.trim()) {
      setFeedback({ type: "error", message: "Enter a version, for example 1.0.0." });
      return;
    }
    if (!downloadUrl) {
      setFeedback({ type: "error", message: "Upload an installer before publishing." });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          productId: formData.productId.trim(),
          version: formData.version.trim(),
          releaseNotes: formData.releaseNotes || undefined,
          changelog: formData.changelog || undefined,
          status: formData.status,
          isLatest: formData.isLatest,
          platform: formData.platform,
          architecture: formData.architecture,
          fileType: formData.fileType,
          fileSize: fileSize,
          downloadUrl,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setFeedback({
          type: "success",
          message: `Release v${formData.version.trim()} published successfully.`,
        });
        setTimeout(() => router.push("/admin/releases"), 1200);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to publish release" });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to publish release. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/releases"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            New Release
          </h1>
          <p className="text-sm text-text-secondary">
            Publish a new version with its Windows installer.
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
              <Package className="w-4 h-4 text-accent-blue" />
              Release details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="release-product" className="block text-sm font-medium text-text-primary mb-2">
                  Product *
                </label>
                <select
                  id="release-product"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className={inputClass}
                >
                  {products.length === 0 ? (
                    <option value="pr1">SNU Automation</option>
                  ) : (
                    products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.id}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="release-version" className="block text-sm font-medium text-text-primary mb-2">
                  Version *
                </label>
                <input
                  id="release-version"
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className={inputClass}
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label htmlFor="release-status" className="block text-sm font-medium text-text-primary mb-2">
                  Status
                </label>
                <select
                  id="release-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={inputClass}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end pb-2.5">
                <label htmlFor="release-latest" className="flex items-center gap-2.5 text-sm font-medium text-text-primary cursor-pointer">
                  <input
                    id="release-latest"
                    type="checkbox"
                    checked={formData.isLatest}
                    onChange={(e) => setFormData({ ...formData, isLatest: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-surface accent-accent-blue focus:ring-2 focus:ring-accent-blue/40"
                  />
                  Latest release
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="release-notes" className="block text-sm font-medium text-text-primary mb-2">
                Release notes (Markdown)
              </label>
              <textarea
                id="release-notes"
                value={formData.releaseNotes}
                onChange={(e) => setFormData({ ...formData, releaseNotes: e.target.value })}
                rows={8}
                className={cn(inputClass, "resize-none font-mono text-sm")}
                placeholder={"## What's new\n\nDescribe this update..."}
              />
            </div>

            <div>
              <label htmlFor="release-changelog" className="block text-sm font-medium text-text-primary mb-2">
                Changelog <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                id="release-changelog"
                value={formData.changelog}
                onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                rows={5}
                className={cn(inputClass, "resize-none font-mono text-sm")}
                placeholder={"- Added ...\n- Fixed ..."}
              />
            </div>
          </section>

          <section className="glass gradient-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
              <FileArchive className="w-4 h-4 text-accent-blue" />
              Installer
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="release-platform" className="block text-sm font-medium text-text-primary mb-2">
                  Platform
                </label>
                <select
                  id="release-platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className={inputClass}
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="release-architecture" className="block text-sm font-medium text-text-primary mb-2">
                  Architecture
                </label>
                <select
                  id="release-architecture"
                  value={formData.architecture}
                  onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                  className={inputClass}
                >
                  {architectures.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="release-filetype" className="block text-sm font-medium text-text-primary mb-2">
                  File type
                </label>
                <select
                  id="release-filetype"
                  value={formData.fileType}
                  onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                  className={inputClass}
                >
                  {fileTypes.map((f) => (
                    <option key={f} value={f}>
                      {f.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Installer file *
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".exe,.msi,.zip,application/octet-stream"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload installer"
                />
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-text-primary glass rounded-xl hover:bg-surface-elevated transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading
                    ? "Uploading…"
                    : selectedFile
                    ? "Replace installer"
                    : "Choose installer"}
                </motion.button>
                <span className="text-xs text-text-muted">
                  .exe, .msi or .zip up to 500 MB
                </span>
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-xs text-text-secondary">
                  <FileArchive className="w-4 h-4 text-accent-blue shrink-0" />
                  <span className="truncate">{selectedFile.name}</span>
                  <span className="ml-auto shrink-0 text-text-muted">
                    {formatMB(selectedFile.size)}
                  </span>
                </div>
              )}

              {uploading && (
                <div
                  className="mt-3 rounded-xl border border-border bg-surface px-4 py-3"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading {uploadProgress}% / please wait
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-surface-deep overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-[width] duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadSuccess && !uploading && (
                <p role="status" className="mt-3 flex items-center gap-2 text-xs text-success">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {uploadSuccess} uploaded and ready to publish.
                </p>
              )}

              {uploadError && (
                <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-error">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {uploadError}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-6">
          <section className="glass gradient-border rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-heading font-bold text-text-primary">Publish</h2>
            <p className="text-xs text-text-muted">
              The installer is required. Mark the release as latest to feature it as the
              current download.
            </p>
            <motion.button
              type="button"
              onClick={handlePublish}
              disabled={saving || uploading}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)] hover:opacity-90 transition-opacity disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4" />
              )}
              {saving ? "Publishing…" : "Publish Release"}
            </motion.button>
          </section>
        </div>
      </div>
    </div>
  );
}
