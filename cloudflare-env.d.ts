/// <reference types="@opennextjs/cloudflare" />

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    STORAGE: R2Bucket;
    ASSETS?: Fetcher;
    BETTER_AUTH_SECRET?: string;
    NEXT_PUBLIC_APP_URL?: string;
    RESEND_API_KEY?: string;
  }
}

export {};
