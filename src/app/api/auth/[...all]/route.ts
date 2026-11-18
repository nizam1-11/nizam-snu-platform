import { getAuthAsync } from "@/lib/auth/config";
import { toNextJsHandler } from "better-auth/next-js";

// Auth handler must be created after the async DB resolver completes (D1 on
// Cloudflare, local SQLite in dev). Cache the handlers once resolved.
let handlerPromise: Promise<{ GET: any; POST: any }> | null = null;

function getHandler() {
  if (!handlerPromise) {
    handlerPromise = getAuthAsync().then((auth) => {
      if (!auth) {
        return {
          GET: async () => new Response("Auth not configured", { status: 503 }),
          POST: async () => new Response("Auth not configured", { status: 503 }),
        };
      }
      return toNextJsHandler(auth);
    });
  }
  return handlerPromise;
}

export async function GET(request: Request) {
  const h = await getHandler();
  return h.GET(request);
}

export async function POST(request: Request) {
  const h = await getHandler();
  return h.POST(request);
}
