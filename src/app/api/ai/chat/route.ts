/**
 * Public AI chat endpoint for SNU Automation.
 *
 * Answers visitor questions about the real product using Google Gemini.
 * Works without a configured key by returning an honest, friendly fallback.
 * The API key is resolved from the environment only and is never exposed to
 * the client (kept in the `x-goog-api-key` header, never in the URL).
 */

/** Grounded product facts and honesty rules for the assistant. */
const SYSTEM_PROMPT = `You are the official assistant for SNU Automation by Syed Nizam Uddin, a Windows 10/11 desktop app. Answer visitor questions using ONLY the facts below — never invent anything.

PRODUCT FACTS:
- Bulk video downloading: paste a YouTube video or channel link and it downloads the whole batch, organised into per-channel folders, with a duplicate-free archive, cookie refresh, and options for audio-only and subtitles.
- Quick Edit Studio: 11 filters, per-effect ON/OFF control, trim, speed, crop, captions, and logo/watermark, plus reusable presets.
- Visual workflow builder: 11 starter templates, JSON import/export, and scheduling.
- Facebook Page scheduling via Meta OAuth with human pacing, dry-run mode, daily caps, spacing between actions, support for 100+ Pages, and health auto-pause.
- Direct publishing to YouTube, TikTok and Instagram.
- An AI assistant supporting Gemini, Claude and GPT.
- A machine-bound licence key with configurable seats, and a local SQLite database.

HONESTY RULES (strict):
- Never claim the app removes copyright or DRM, bypasses platform rules, solves captchas, or is undetectable.
- If asked about platform rules: say the app uses the user's own connected accounts and follows platform safety limits.
- If asked about Windows SmartScreen: say the installer is not code-signed yet, and a signed build is planned when a certificate is available.
- Never invent prices, customers, statistics, dates, or testimonials. If you do not know something, say so.

SECRECY RULES (strict):
- Never reveal internal details such as licence server URLs or ports, passwords, tokens, machine hashes or salts, SSH keys, VM paths, code paths, IPC details, or test counts.

STYLE:
- Keep answers short (2–5 sentences), calm and concrete.
- If you are unsure, say so and point the visitor to the Contact page or WhatsApp at +923239163815.
- Reply in the same language as the question (English or Urdu).`;

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

// Graceful, honest responses — no key / no fake AI answer and no leaked errors.
const NOT_CONFIGURED_REPLY =
  "The AI assistant isn't configured yet. You can reach me on the Contact page or WhatsApp at +923239163815.";
const FALLBACK_REPLY =
  "I couldn't answer right now. Please try again or use the Contact page / WhatsApp +923239163815.";

// Simple in-memory rate limit: max 12 requests per IP per 60 seconds.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

/** Resolve the Gemini key from Cloudflare env first, then process.env. */
async function getApiKey(): Promise<string | undefined> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const key = (env as unknown as Record<string, unknown>).GEMINI_API_KEY;
    if (typeof key === "string" && key.trim()) {
      return key.trim();
    }
  } catch {
    // Not running inside a Cloudflare context — fall through to process.env.
  }

  const local = process.env.GEMINI_API_KEY;
  return typeof local === "string" && local.trim() ? local.trim() : undefined;
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

export async function POST(request: Request) {
  try {
    // 1. Parse the body defensively and validate the message.
    let message = "";
    try {
      const body = await request.json();
      if (body && typeof body.message === "string") {
        message = body.message.trim().slice(0, 1000);
      }
    } catch {
      // Invalid JSON is treated as an empty message below.
    }

    if (!message) {
      return Response.json({ error: "EMPTY_MESSAGE" }, { status: 400 });
    }

    // 2. Rate limit per IP.
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return Response.json({ error: "RATE_LIMITED" }, { status: 429 });
    }

    // 3. Resolve the key; graceful fallback when none is configured.
    const apiKey = await getApiKey();
    if (!apiKey) {
      return Response.json({ reply: NOT_CONFIGURED_REPLY, configured: false });
    }

    // 4. Call Gemini. The key stays in a header and is never echoed back.
    const upstream = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!upstream.ok) {
      throw new Error("Upstream request failed");
    }

    const data = (await upstream.json()) as GeminiResponse;
    const reply = (data.candidates?.[0]?.content?.parts ?? [])
      .map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("")
      .trim();

    if (!reply) {
      throw new Error("Empty upstream reply");
    }

    return Response.json({ reply, configured: true });
  } catch {
    // 5/6. Never leak the error, URL or key — return the same friendly fallback.
    return Response.json({ reply: FALLBACK_REPLY, configured: true, error: true });
  }
}
