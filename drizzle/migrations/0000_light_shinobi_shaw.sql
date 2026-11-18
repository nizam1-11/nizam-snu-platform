CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text,
	`role` text DEFAULT 'editor' NOT NULL,
	`mfa_enabled` integer DEFAULT false,
	`mfa_secret` text,
	`last_login` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text,
	`cover_image_url` text,
	`related_product_id` text,
	`version` text,
	`is_published` integer DEFAULT false,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`related_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `announcements_slug_unique` ON `announcements` (`slug`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_user_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`changes` text,
	`ip_address` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `blog_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_categories_slug_unique` ON `blog_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`cover_image_url` text,
	`category` text,
	`tags` text,
	`author_id` text,
	`status` text DEFAULT 'draft',
	`published_at` text,
	`seo_title` text,
	`seo_description` text,
	`og_image_url` text,
	`reading_time` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`inquiry_type` text,
	`status` text DEFAULT 'unread',
	`ip_address` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text,
	`sort_order` integer DEFAULT 0,
	`is_published` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `legal_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`version` text,
	`effective_date` text,
	`is_published` integer DEFAULT true,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `legal_documents_slug_unique` ON `legal_documents` (`slug`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text,
	`file_size` integer,
	`width` integer,
	`height` integer,
	`alt_text` text,
	`folder` text,
	`uploaded_by` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_screenshots` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`image_url` text NOT NULL,
	`caption` text,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text,
	`description` text,
	`long_description` text,
	`logo_url` text,
	`hero_banner_url` text,
	`category` text,
	`features` text,
	`system_requirements` text,
	`supported_platforms` text,
	`installation_guide` text,
	`documentation_url` text,
	`support_info` text,
	`license_type` text DEFAULT 'free',
	`is_featured` integer DEFAULT false,
	`status` text DEFAULT 'draft',
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`tagline` text,
	`bio` text,
	`photo_url` text,
	`resume_url` text,
	`location` text,
	`email` text,
	`github_url` text,
	`linkedin_url` text,
	`twitter_url` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_screenshots` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`image_url` text NOT NULL,
	`caption` text,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`long_description` text,
	`cover_image_url` text,
	`demo_video_url` text,
	`tech_stack` text,
	`features` text,
	`category` text NOT NULL,
	`status` text DEFAULT 'completed',
	`project_url` text,
	`github_url` text,
	`published_at` text,
	`is_featured` integer DEFAULT false,
	`is_published` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE TABLE `release_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`release_id` text NOT NULL,
	`platform` text NOT NULL,
	`architecture` text,
	`file_type` text,
	`file_size` integer,
	`download_url` text NOT NULL,
	`sha256` text,
	`min_os_version` text,
	`is_available` integer DEFAULT true,
	`download_count` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`release_id`) REFERENCES `releases`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `releases` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`version` text NOT NULL,
	`release_date` text NOT NULL,
	`release_notes` text,
	`changelog` text,
	`status` text DEFAULT 'stable',
	`is_latest` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `seo_metadata` (
	`id` text PRIMARY KEY NOT NULL,
	`page_path` text NOT NULL,
	`title` text,
	`description` text,
	`og_image_url` text,
	`canonical_url` text,
	`structured_data` text,
	`no_index` integer DEFAULT false,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seo_metadata_page_path_unique` ON `seo_metadata` (`page_path`);--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`benefits` text,
	`icon` text,
	`is_published` integer DEFAULT false,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`proficiency` integer,
	`icon_url` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`author_name` text NOT NULL,
	`author_title` text,
	`author_photo_url` text,
	`content` text NOT NULL,
	`rating` integer,
	`is_verified` integer DEFAULT false,
	`is_published` integer DEFAULT false,
	`created_at` text NOT NULL
);
