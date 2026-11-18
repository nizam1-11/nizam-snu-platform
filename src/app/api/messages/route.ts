import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDbAsync } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  try {
    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: "Database unavailable", code: "DB_UNAVAILABLE" }, { status: 503 });
    const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(100);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages list error:", error);
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
