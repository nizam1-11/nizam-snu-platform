# Nizam — SNU Automation Platform

Premium personal brand website, software product marketplace, and download center.

**Live URL:** https://nizam-snu-platform.nizam-snu-platform.workers.dev

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **3D:** React Three Fiber + drei
- **Animation:** Motion (Framer Motion) + GSAP + Lenis
- **Database:** Cloudflare D1 (SQLite, database `nizam-snu-db`) + Drizzle ORM
- **Auth:** custom admin session (password secret) + better-auth
- **Storage:** Cloudflare R2 (bucket `nizam-snu-storage`, images) + GitHub Releases (binaries)
- **Email:** Resend
- **Hosting:** Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`)
- **Repository:** https://github.com/nizam1-11/nizam-snu-platform

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/nizam1-11/nizam-snu-platform.git
cd nizam-snu-platform

# Install dependencies
npm install

# Copy environment variables and fill in your values
cp .env.example .env.local

# Start development server
npm run dev
```

### Fresh clone / new machine setup

The local SQLite database (`local.db`) is intentionally **not committed** — it is gitignored (`/local.db` and `/local.db-*`). On a fresh clone or a new machine the database file does not exist yet, so you must create the schema **before** starting the app. Running `npm run dev` without pushing the schema first will make the API routes fail and return **500** errors, because the database tables are missing.

Run these commands in this order:

```bash
npm install
npm run db:push
npm run dev
```

- `npm install` — install dependencies.
- `npm run db:push` — create `local.db` and push the Drizzle schema (required once, before the first run).
- `npm run dev` — start the development server.

`npm run db:seed` is **optional** and creates default local content. The seeded local admin password is a convenience default that **MUST be changed** (via the `ADMIN_PASSWORD` secret) before it is used anywhere beyond local development.

### Common commands

```bash
npm install         # install dependencies
npm run dev         # local development server
npm run typecheck   # TypeScript type checking (tsc --noEmit)
npm run build       # production Next.js build
```

Other scripts: `npm run lint`, `npm run db:push`, `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, `npm run db:studio`.

## Deployment

The site runs on **Cloudflare Workers** using OpenNext. `wrangler.toml` holds the non-secret config (worker name, D1 binding `nizam-snu-db`, R2 binding `nizam-snu-storage`); secrets are stored in Cloudflare, never in the repo.

```bash
# Requires these in your shell environment (never commit the token):
#   CLOUDFLARE_API_TOKEN
#   CLOUDFLARE_ACCOUNT_ID
npm run deploy:build && npx wrangler deploy
```

`npm run deploy:build` runs `next build` followed by `opennextjs-cloudflare build`, producing the `.open-next/` output that `wrangler deploy` uploads.

### Worker secrets

Set secrets once (and whenever they rotate) with `npx wrangler secret put <NAME>`. **Never commit secret values** — not in `wrangler.toml`, `.env.*`, or git history.

Required:

- `ADMIN_PASSWORD` — password for `/login` and all admin write routes.
- `BETTER_AUTH_SECRET` — secret used by better-auth.

If the corresponding features are enabled in your environment, also set the matching secrets (see `.env.example` for names): `RESEND_API_KEY`, `GITHUB_TOKEN`, and the R2 credentials (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`).

## Admin

- Sign in at `/login`. The password is the Cloudflare Worker secret `ADMIN_PASSWORD` (not stored in the repo).
- Rotate it with `npx wrangler secret put ADMIN_PASSWORD`, then redeploy with `npm run deploy:build && npx wrangler deploy`.
- Admin sections: **Products, Projects, Blog, FAQ, Messages, Announcements, Settings**.

## Content workflow

Content lives in **D1** and public pages fetch it at runtime, so adding or editing content in the admin requires **no rebuild and no redeploy**. A new item only appears publicly once it is published — set `isPublished: true` (announcements/projects/FAQ) or `status: "published"` (blog posts/products). Unpublished items remain admin-only.

## Images

Blog cover images can be uploaded from the admin directly to **R2**, or set by an external URL. Stored images are served publicly through `/api/images/...` (keys are validated; path traversal is rejected).

## Verification

After every deploy, run the read-only smoke test:

```bash
node scripts/smoke-test.mjs
# or against another deployment:
SMOKE_BASE_URL=https://your-deployment.workers.dev node scripts/smoke-test.mjs
```

It checks public pages, public APIs, the admin write-gate, invalid-login handling, and path-traversal rejection. It exits `1` if any check fails. No secrets or database writes are involved.

Also warm the edge cache right after each deploy. The first request to a route can take several seconds on a cold cache (this has caused timeouts on mobile networks); warming makes responses fast for real visitors:

```bash
node scripts/warm-cache.mjs
# or against another deployment:
SMOKE_BASE_URL=https://your-deployment.workers.dev node scripts/warm-cache.mjs
```

Both scripts are read-only with respect to the database and require no secrets.

## Known limitations / notes

- No custom domain is attached yet; the site is served from the free `*.workers.dev` URL.
- R2 usage is on the free tier and subject to its storage/request limits.
- The contact form is **not** wired to email: messages are stored in D1 only (visible under admin → Messages); no notification is sent.

## License

Private — All rights reserved. Nizam / SNU Automation.
