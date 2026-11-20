import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "FAQ — SNU Automation" },
  description:
    "Find answers to frequently asked questions about SNU Automation products, downloads, installation, licensing, and getting support for your software.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    title: "FAQ — SNU Automation",
    description:
      "Find answers to frequently asked questions about SNU Automation products, downloads, installation, licensing, and getting support for your software.",
    url: "/faq",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
