import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ─── Admin Users ───────────────────────────────────────────
export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: text("role").notNull().default("editor"), // admin | editor | viewer
  mfaEnabled: integer("mfa_enabled", { mode: "boolean" }).default(false),
  mfaSecret: text("mfa_secret"),
  lastLogin: text("last_login"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Profile (single row) ──────────────────────────────────
export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  resumeUrl: text("resume_url"),
  location: text("location"),
  email: text("email"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  updatedAt: text("updated_at").notNull(),
});

// ─── Skills ────────────────────────────────────────────────
export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"), // frontend | backend | ai | devops | etc
  proficiency: integer("proficiency"), // 1-5
  iconUrl: text("icon_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull(),
});

// ─── Services ──────────────────────────────────────────────
export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  benefits: text("benefits"), // JSON array
  icon: text("icon"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Projects ──────────────────────────────────────────────
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  longDescription: text("long_description"), // markdown
  coverImageUrl: text("cover_image_url"),
  demoVideoUrl: text("demo_video_url"),
  techStack: text("tech_stack"), // JSON array
  features: text("features"), // JSON array
  category: text("category").notNull(), // ai | automation | web | desktop | android | experimental
  status: text("status").default("completed"), // completed | in-progress | archived
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  publishedAt: text("published_at"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const projectScreenshots = sqliteTable("project_screenshots", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
});

// ─── Products ──────────────────────────────────────────────
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  longDescription: text("long_description"), // markdown
  logoUrl: text("logo_url"),
  heroBannerUrl: text("hero_banner_url"),
  category: text("category"), // ai-tool | automation | desktop-app | web-app | utility
  features: text("features"), // JSON array
  systemRequirements: text("system_requirements"), // JSON object
  supportedPlatforms: text("supported_platforms"), // JSON array
  installationGuide: text("installation_guide"), // markdown
  documentationUrl: text("documentation_url"),
  supportInfo: text("support_info"),
  licenseType: text("license_type").default("free"), // free | freemium | paid | open-source
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  status: text("status").default("draft"), // draft | published | archived
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const productScreenshots = sqliteTable("product_screenshots", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
});

// ─── Releases ──────────────────────────────────────────────
export const releases = sqliteTable("releases", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  version: text("version").notNull(), // semver
  releaseDate: text("release_date").notNull(),
  releaseNotes: text("release_notes"), // markdown
  changelog: text("changelog"), // markdown
  status: text("status").default("stable"), // stable | beta | experimental | deprecated
  isLatest: integer("is_latest", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const releaseAssets = sqliteTable("release_assets", {
  id: text("id").primaryKey(),
  releaseId: text("release_id")
    .notNull()
    .references(() => releases.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(), // windows | android | linux | macos
  architecture: text("architecture"), // x64 | arm64 | universal
  fileType: text("file_type"), // exe | msi | apk | deb | rpm | dmg
  fileSize: integer("file_size"), // bytes
  downloadUrl: text("download_url").notNull(),
  sha256: text("sha256"),
  minOsVersion: text("min_os_version"),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  downloadCount: integer("download_count").default(0),
  createdAt: text("created_at").notNull(),
});

// ─── Blog Posts ────────────────────────────────────────────
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // markdown
  coverImageUrl: text("cover_image_url"),
  category: text("category"),
  tags: text("tags"), // JSON array
  authorId: text("author_id").references(() => adminUsers.id),
  status: text("status").default("draft"), // draft | published | archived
  publishedAt: text("published_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ogImageUrl: text("og_image_url"),
  readingTime: integer("reading_time"), // minutes
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const blogCategories = sqliteTable("blog_categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
});

// ─── Announcements (What's New) ────────────────────────────
export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"), // launch | update | security | feature | announcement
  coverImageUrl: text("cover_image_url"),
  relatedProductId: text("related_product_id").references(() => products.id),
  version: text("version"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── FAQs ──────────────────────────────────────────────────
export const faqs = sqliteTable("faqs", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"), // general | services | products | downloads | installation | updates | support | privacy | licensing
  sortOrder: integer("sort_order").default(0),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── Testimonials ─────────────────────────────────────────
export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title"),
  authorPhotoUrl: text("author_photo_url"),
  content: text("content").notNull(),
  rating: integer("rating"), // 1-5
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
});

// ─── Contact Messages ──────────────────────────────────────
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  inquiryType: text("inquiry_type"), // general | project | service | support
  status: text("status").default("unread"), // unread | read | replied | archived
  ipAddress: text("ip_address"),
  createdAt: text("created_at").notNull(),
});

// ─── Legal Documents ───────────────────────────────────────
export const legalDocuments = sqliteTable("legal_documents", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(), // privacy, terms, cookies, etc.
  title: text("title").notNull(),
  content: text("content").notNull(), // markdown
  version: text("version"),
  effectiveDate: text("effective_date"),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  updatedAt: text("updated_at").notNull(),
});

// ─── Media Assets ──────────────────────────────────────────
export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  fileSize: integer("file_size"),
  width: integer("width"),
  height: integer("height"),
  altText: text("alt_text"),
  folder: text("folder"), // products | blog | profile | etc
  uploadedBy: text("uploaded_by").references(() => adminUsers.id),
  createdAt: text("created_at").notNull(),
});

// ─── SEO Metadata ──────────────────────────────────────────
export const seoMetadata = sqliteTable("seo_metadata", {
  id: text("id").primaryKey(),
  pagePath: text("page_path").notNull().unique(), // /products/my-app
  title: text("title"),
  description: text("description"),
  ogImageUrl: text("og_image_url"),
  canonicalUrl: text("canonical_url"),
  structuredData: text("structured_data"), // JSON-LD
  noIndex: integer("no_index", { mode: "boolean" }).default(false),
  updatedAt: text("updated_at").notNull(),
});

// ─── Website Settings (key-value) ─────────────────────────
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(), // JSON
  updatedAt: text("updated_at").notNull(),
});

// ─── Audit Log ─────────────────────────────────────────────
export const auditLog = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  adminUserId: text("admin_user_id").references(() => adminUsers.id),
  action: text("action").notNull(), // create | update | delete | publish | unpublish
  entityType: text("entity_type").notNull(), // product | release | blog_post | etc
  entityId: text("entity_id"),
  changes: text("changes"), // JSON diff
  ipAddress: text("ip_address"),
  createdAt: text("created_at").notNull(),
});

// ─── Relations ─────────────────────────────────────────────
export const projectsRelations = relations(projects, ({ many }) => ({
  screenshots: many(projectScreenshots),
}));

export const projectScreenshotsRelations = relations(projectScreenshots, ({ one }) => ({
  project: one(projects, {
    fields: [projectScreenshots.projectId],
    references: [projects.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  screenshots: many(productScreenshots),
  releases: many(releases),
}));

export const productScreenshotsRelations = relations(productScreenshots, ({ one }) => ({
  product: one(products, {
    fields: [productScreenshots.productId],
    references: [products.id],
  }),
}));

export const releasesRelations = relations(releases, ({ one, many }) => ({
  product: one(products, {
    fields: [releases.productId],
    references: [products.id],
  }),
  assets: many(releaseAssets),
}));

export const releaseAssetsRelations = relations(releaseAssets, ({ one }) => ({
  release: one(releases, {
    fields: [releaseAssets.releaseId],
    references: [releases.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(adminUsers, {
    fields: [blogPosts.authorId],
    references: [adminUsers.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  relatedProduct: one(products, {
    fields: [announcements.relatedProductId],
    references: [products.id],
  }),
}));

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  uploadedBy: one(adminUsers, {
    fields: [mediaAssets.uploadedBy],
    references: [adminUsers.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  adminUser: one(adminUsers, {
    fields: [auditLog.adminUserId],
    references: [adminUsers.id],
  }),
}));