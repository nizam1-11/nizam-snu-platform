import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native SQLite driver must be loaded by Node, not bundled by Turbopack
  serverExternalPackages: ["better-sqlite3"],
  turbopack: {
    root: __dirname,
  },
  images: {
    // Cloudflare Pages image optimization
    unoptimized: false,
    remotePatterns: [
      {
        hostname: "**.r2.cloudflarestorage.com",
        protocol: "https",
      },
      {
        hostname: "files.yourdomain.com",
        protocol: "https",
      },
    ],
  },
  // Experimental features for Cloudflare compatibility
  experimental: {
    // Enable server actions
  },
};

export default nextConfig;