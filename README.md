# Nizam — SNU Automation Platform

Premium personal brand website, software product marketplace, and download center.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **3D:** React Three Fiber + drei
- **Animation:** Motion (Framer Motion) + GSAP + Lenis
- **Database:** Cloudflare D1 (SQLite) + Drizzle ORM
- **Auth:** better-auth (email/password + MFA)
- **Storage:** Cloudflare R2 (images) + GitHub Releases (binaries)
- **Email:** Resend
- **Hosting:** Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nizam-snu-platform.git
cd nizam-snu-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations (local)
npx drizzle-kit push

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

`npm run db:seed` is **optional** and creates the default admin user for local development. The seeded admin account uses a default password that **MUST be changed** immediately before it is used anywhere beyond local development.

### Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run typecheck` — Run TypeScript type checking
- `npm run test` — Run unit tests (Vitest)
- `npm run test:e2e` — Run E2E tests (Playwright)

## Project Structure

See the plan document for the complete folder structure.

## Deployment

Deployed to Cloudflare Pages. See `wrangler.toml` for configuration.

```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static
```

## License

Private — All rights reserved. Nizam / SNU Automation.