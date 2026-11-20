import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { getDbAsync } from "@/lib/db";
import { projects } from "@/lib/db/schema";

type Props = { params: Promise<{ slug: string }> };

const SITE_NAME = "Syed Nizam Uddin — SNU Automation";
const FALLBACK_TITLE = "Projects";
const FALLBACK_DESCRIPTION =
  "Browse a portfolio of real projects from SNU Automation, including AI applications, automation systems, the SNU Automation app, and SNU Clips.";

/** Trim real description text to ~155 chars without cutting a word in half. */
function trimDescription(value: unknown, max = 155): string {
  if (typeof value !== "string") return "";
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

/** One metadata shape for both the real item and the safe fallback. */
function buildMetadata(
  slug: string,
  title: string,
  description: string,
  image?: string | null
): Metadata {
  const canonicalPath = `/projects/${slug}`;
  const resolvedTitle = title.trim() || FALLBACK_TITLE;
  const resolvedDescription = description || FALLBACK_DESCRIPTION;
  const imageUrl = typeof image === "string" && image.trim() ? image.trim() : null;

  return {
    title: { absolute: `${resolvedTitle} | ${SITE_NAME}` },
    description: resolvedDescription,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalPath,
      siteName: SITE_NAME,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const db = await getDbAsync();
    if (!db) return buildMetadata(slug, FALLBACK_TITLE, FALLBACK_DESCRIPTION);

    const rows = await db
      .select({
        title: projects.title,
        description: projects.description,
        coverImageUrl: projects.coverImageUrl,
      })
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.isPublished, true)))
      .limit(1);

    const item = rows[0];
    if (!item) return buildMetadata(slug, FALLBACK_TITLE, FALLBACK_DESCRIPTION);

    return buildMetadata(
      slug,
      item.title,
      trimDescription(item.description),
      item.coverImageUrl
    );
  } catch {
    // DB unavailable or query error — never break the page's metadata.
    return buildMetadata(slug, FALLBACK_TITLE, FALLBACK_DESCRIPTION);
  }
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
