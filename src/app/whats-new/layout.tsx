import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "What's New — Updates & Announcements | SNU Automation" },
  description:
    "Read the latest announcements, product updates, and roadmap notes from SNU Automation, including new releases, improvements, and in-development projects.",
  alternates: { canonical: "/whats-new" },
  openGraph: {
    type: "website",
    title: "What's New — Updates & Announcements | SNU Automation",
    description:
      "Read the latest announcements, product updates, and roadmap notes from SNU Automation, including new releases, improvements, and in-development projects.",
    url: "/whats-new",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function WhatsNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
