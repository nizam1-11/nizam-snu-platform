import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";

// Allowlist mirrors scripts/seed.ts keys, plus the social link keys used by the
// admin form and `maintenance_mode` (toggled in the UI but not seeded).
// Unknown keys are IGNORED (forward-compatible: a client may send extra fields
// without breaking the save), and the response `count` reflects only keys that
// were actually written.
const ALLOWED_KEYS = new Set([
  "site_name",
  "site_description",
  "site_url",
  "contact_email",
  "analytics_enabled",
  "maintenance_mode",
  "github_url",
  "linkedin_url",
  "twitter_url",
]);

function errorResponse(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

function parseValue(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    // Legacy / non-JSON values are stored as plain text.
    return raw;
  }
}

// GET /api/admin/settings — read all website settings as { key: value }
export async function GET() {
  let db: ReturnType<typeof getDb>;
  try {
    db = getDb();
  } catch (error) {
    console.error("Settings DB init error:", error);
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }
  if (!db) {
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }

  try {
    const rows = await db.select().from(settings);
    const result: Record<string, unknown> = {};
    for (const row of rows) {
      result[row.key] = parseValue(row.value);
    }
    return NextResponse.json({ settings: result });
  } catch (error) {
    console.error("Settings read error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}

// POST /api/admin/settings — upsert website settings.
// Accepts { settings: { [key]: value } } or a flat { [key]: value } body.
export async function POST(request: NextRequest) {
  let db: ReturnType<typeof getDb>;
  try {
    db = getDb();
  } catch (error) {
    console.error("Settings DB init error:", error);
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }
  if (!db) {
    return errorResponse("Database unavailable", "DB_UNAVAILABLE", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", "INVALID_JSON", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Invalid request body", "INVALID_BODY", 400);
  }

  const record = body as Record<string, unknown>;
  const nested = record.settings;
  const incoming =
    nested && typeof nested === "object" && !Array.isArray(nested)
      ? (nested as Record<string, unknown>)
      : record; // tolerate a flat object body

  // Ignore keys outside the allowlist rather than rejecting the whole request.
  const entries = Object.entries(incoming).filter(([key]) =>
    ALLOWED_KEYS.has(key)
  );
  if (entries.length === 0) {
    return errorResponse(
      "No valid settings provided",
      "NO_VALID_SETTINGS",
      400
    );
  }

  const invalid = entries.find(([, value]) => value === undefined);
  if (invalid) {
    return errorResponse(
      `Invalid value for setting "${invalid[0]}"`,
      "VALIDATION_ERROR",
      400
    );
  }

  const now = new Date().toISOString();
  try {
    for (const [key, value] of entries) {
      const stored = JSON.stringify(value) ?? "null";
      await db
        .insert(settings)
        .values({ key, value: stored, updatedAt: now })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value: stored, updatedAt: now },
        });
    }
    return NextResponse.json({ success: true, count: entries.length });
  } catch (error) {
    console.error("Settings write error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
