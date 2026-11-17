import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { contactSchema } from "@/lib/validators/contact";
import { getDb } from "@/lib/db";
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
    const db = getDb();
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

    // TODO: Integrate with Resend for email notification
    // await resend.emails.send({
    //   from: "nizam14010@gmail.com",
    //   to: "nizam14010@gmail.com",
    //   subject: `New contact: ${data.subject || "No subject"}`,
    //   html: `<p>From: ${data.name} (${data.email})</p><p>${data.message}</p>`,
    // });

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