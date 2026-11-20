import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Blog — AI Automation & Software Guides" },
  description:
    "Practical articles on Facebook Page automation safety, bulk video downloading, and visual workflow tools, written by developer Syed Nizam Uddin.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Blog — AI Automation & Software Guides",
    description:
      "Practical articles on Facebook Page automation safety, bulk video downloading, and visual workflow tools, written by developer Syed Nizam Uddin.",
    url: "/blog",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
