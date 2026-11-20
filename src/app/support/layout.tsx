import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Support — SNU Automation" },
  description:
    "Learn how to get help with SNU Automation products, including installation guides, system requirements, release notes, and ways to contact support.",
  alternates: { canonical: "/support" },
  openGraph: {
    type: "website",
    title: "Support — SNU Automation",
    description:
      "Learn how to get help with SNU Automation products, including installation guides, system requirements, release notes, and ways to contact support.",
    url: "/support",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
