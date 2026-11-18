import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { announcements } from "../src/lib/db/schema";

/** Seeds the What's New feed with real, factual updates only. */
async function seedAnnouncements() {
  const db = getDb();
  if (!db) {
    console.error("DB unavailable");
    process.exit(1);
  }

  // Today's date (Nov 18 2026) — real, not an invented release date.
  const today = "2026-11-18T00:00:00.000Z";

  const entries = [
    {
      id: crypto.randomUUID(),
      slug: "snu-automation-portfolio-launch",
      title: "SNU Automation is now on the portfolio",
      content:
        "The main app is live on the site. One Windows tool that brings together bulk video downloading, Facebook Page scheduling with safety pacing, and a visual workflow builder — driven by an AI assistant that works with the real queue and workflow services.\n\nExplore the project page for the full breakdown of features and how it works.",
      category: "launch",
      coverImageUrl: "/images/snu-logo.png",
      relatedProductId: null,
      version: "1.0",
      isPublished: true,
      publishedAt: today,
      createdAt: today,
      updatedAt: today,
    },
    {
      id: crypto.randomUUID(),
      slug: "snu-clips-in-development",
      title: "SNU Clips is in development",
      content:
        "The next tool is on the way: turn long videos and livestreams into ready-to-post clips. Think video-to-clips, livestream-to-clips, a move-to-clip flow, and 100 caption templates. More details will be shared here as it takes shape.",
      category: "announcement",
      coverImageUrl: "/images/snu-logo.png",
      relatedProductId: null,
      version: null,
      isPublished: true,
      publishedAt: today,
      createdAt: today,
      updatedAt: today,
    },
    {
      id: crypto.randomUUID(),
      slug: "roadmap-more-platform-workflows",
      title: "On the roadmap: more platform workflows",
      content:
        "Planned updates for SNU Automation — not shipped yet: TikTok uploading workflows, Instagram automation, and YouTube workflow automation. More platform workflows will be added over time. Follow this space for real updates as they land.",
      category: "feature",
      coverImageUrl: null,
      relatedProductId: null,
      version: null,
      isPublished: true,
      publishedAt: today,
      createdAt: today,
      updatedAt: today,
    },
  ];

  for (const entry of entries) {
    // Idempotent: skip if slug already exists
    const existing = await db
      .select()
      .from(announcements)
      .where(eqSlug(entry.slug))
      .get();
    if (existing) {
      console.log(`skip (exists): ${entry.slug}`);
      continue;
    }
    await db.insert(announcements).values(entry);
    console.log(`added: ${entry.slug}`);
  }

  console.log("Done.");
}

function eqSlug(slug: string) {
  return eq(announcements.slug, slug);
}

seedAnnouncements().catch((e) => {
  console.error(e);
  process.exit(1);
});
