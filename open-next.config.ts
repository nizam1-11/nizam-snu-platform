import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // D1 is accessed via getCloudflareContext() in src/lib/db/index.ts
  // Static assets served from .open-next/assets via the ASSETS binding
});
