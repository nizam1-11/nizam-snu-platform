import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { projects, projectScreenshots } from "@/lib/db/schema";
import { eq, desc, like, and } from "drizzle-orm";

// GET /api/projects — List published projects (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const db = getDb();
    const conditions = [eq(projects.isPublished, true)];
    if (category && category !== "all") {
      conditions.push(eq(projects.category, category));
    }
    if (search) {
      conditions.push(like(projects.title, `%${search}%`));
    }

    const results = await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(desc(projects.isFeatured), desc(projects.publishedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ projects: results, page, limit });
  } catch (error) {
    console.error("Projects list error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects — Create project (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.insert(projects).values({
      id,
      slug: body.slug,
      title: body.title,
      description: body.description,
      longDescription: body.longDescription,
      coverImageUrl: body.coverImageUrl,
      demoVideoUrl: body.demoVideoUrl,
      techStack: body.techStack ? JSON.stringify(body.techStack) : null,
      features: body.features ? JSON.stringify(body.features) : null,
      category: body.category || "experimental",
      status: body.status || "completed",
      projectUrl: body.projectUrl,
      githubUrl: body.githubUrl,
      isFeatured: body.isFeatured || false,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id, message: "Project created" }, { status: 201 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}