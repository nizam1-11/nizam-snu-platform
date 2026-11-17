import { getAuth } from "@/lib/auth/config";
import { toNextJsHandler } from "better-auth/next-js";

const auth = getAuth();

export const GET = auth
  ? toNextJsHandler(auth).GET
  : async () => new Response("Auth not configured", { status: 503 });

export const POST = auth
  ? toNextJsHandler(auth).POST
  : async () => new Response("Auth not configured", { status: 503 });