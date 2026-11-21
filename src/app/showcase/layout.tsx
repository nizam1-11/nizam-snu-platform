import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "SNU Automation — Showcase | Syed Nizam Uddin" },
  description:
    "A Windows desktop app for bulk video downloading, automatic editing, visual workflows and safety-paced Facebook Page posting. See what SNU Automation does.",
  alternates: { canonical: "/showcase" },
  openGraph: {
    type: "website",
    title: "SNU Automation — Showcase",
    description:
      "From a channel link to a week of posts: download, edit and post through one repeatable, safety-paced pipeline.",
    url: "/showcase",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
