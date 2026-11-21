import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { contactSchema, type ContactInput } from "@/lib/validators/contact";
import { getDbAsync } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

// Simple in-memory rate limiter (replace with Cloudflare KV or Upstash in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count++;
  return true;
}

const CONTACT_OWNER_EMAIL = "nizam14010@gmail.com";
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function resolveResendConfig(): Promise<{ key?: string; from: string }> {
  let env: Record<string, unknown> | undefined;

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext({ async: true });
    env = context.env as unknown as Record<string, unknown>;
  } catch {
    // Not running inside a Cloudflare Worker context — fall back to process.env.
  }

  const key =
    (typeof env?.RESEND_API_KEY === "string" ? env.RESEND_API_KEY : undefined) ||
    process.env.RESEND_API_KEY;
  const from =
    (typeof env?.RESEND_FROM_EMAIL === "string" ? env.RESEND_FROM_EMAIL : undefined) ||
    process.env.RESEND_FROM_EMAIL ||
    DEFAULT_FROM_EMAIL;

  return { key, from };
}

async function sendContactEmail(data: ContactInput, messageId: string): Promise<void> {
  const { key, from } = await resolveResendConfig();

  // No API key configured — D1 save is the source of truth, so skip silently.
  if (!key) return;

  const subject = escapeHtml(data.subject || "No subject");
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const inquiryType = escapeHtml(data.inquiryType);
  const message = escapeHtml(data.message);
  const date = new Date().toISOString();

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6;">
      <h2>New contact message</h2>
      <table cellpadding="6" cellspacing="0" border="0">
        <tr><td><strong>Name</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Subject</strong></td><td>${subject}</td></tr>
        <tr><td><strong>Inquiry type</strong></td><td>${inquiryType}</td></tr>
        <tr><td><strong>Date</strong></td><td>${date}</td></tr>
        <tr><td><strong>Reference</strong></td><td>${escapeHtml(messageId)}</td></tr>
      </table>
      <p><strong>Message</strong></p>
      <pre style="white-space: pre-wrap; word-wrap: break-word; background: #f6f6f6; padding: 12px; border-radius: 6px;">${message}</pre>
    </div>
  `;

  let res: Response | undefined;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: CONTACT_OWNER_EMAIL,
        subject: `New contact: ${data.subject || "No subject"} — SNU Automation`,
        html,
        reply_to: data.email,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("Contact email failed:", res?.status || "network");
    }
  } catch {
    console.error("Contact email failed:", res?.status || "network");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", code: "RATE_LIMITED" },
        { status: 429 }
      );
    }

    // Parse and validate
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // Save to database
    const db = await getDbAsync();

    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable", code: "DB_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const messageId = crypto.randomUUID();
    await db.insert(contactMessages).values({
      id: messageId,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      inquiryType: data.inquiryType,
      status: "unread",
      ipAddress: ip,
      createdAt: new Date().toISOString(),
    });

    console.log("Contact form submission saved:", messageId);

    // Best-effort email notification. The message is already persisted in D1,
    // so email failures never fail the request.
    await sendContactEmail(data, messageId);

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}