import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  tagline: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  longDescription: z.string().optional(),
  category: z.enum(["ai-tool", "automation", "desktop-app", "web-app", "utility"]).optional(),
  features: z.array(z.string()).default([]),
  systemRequirements: z.record(z.string(), z.string()).optional(),
  supportedPlatforms: z.array(z.enum(["windows", "android", "linux", "macos", "web"])).default([]),
  installationGuide: z.string().optional(),
  documentationUrl: z.string().url().optional().or(z.literal("")),
  supportInfo: z.string().optional(),
  licenseType: z.enum(["free", "freemium", "paid", "open-source"]).default("free"),
  isFeatured: z.boolean().default(false),
});

export const releaseSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be semver (e.g., 1.0.0)"),
  releaseDate: z.string().datetime().or(z.string().date()),
  releaseNotes: z.string().optional(),
  changelog: z.string().optional(),
  status: z.enum(["stable", "beta", "experimental", "deprecated"]).default("stable"),
});

export const releaseAssetSchema = z.object({
  platform: z.enum(["windows", "android", "linux", "macos"]),
  architecture: z.enum(["x64", "arm64", "universal"]).optional(),
  fileType: z.enum(["exe", "msi", "apk", "deb", "rpm", "dmg", "appimage"]).optional(),
  fileSize: z.number().positive().optional(),
  downloadUrl: z.string().url(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/, "SHA-256 must be 64 hex characters").optional(),
  minOsVersion: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ReleaseInput = z.infer<typeof releaseSchema>;
export type ReleaseAssetInput = z.infer<typeof releaseAssetSchema>;