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