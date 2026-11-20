import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "About Syed Nizam Uddin — AI Automation Developer" },
  description:
    "Meet Syed Nizam Uddin, an independent developer building AI-powered applications, automation systems, and software products under the SNU Automation brand.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: "About Syed Nizam Uddin — AI Automation Developer",
    description:
      "Meet Syed Nizam Uddin, an independent developer building AI-powered applications, automation systems, and software products under the SNU Automation brand.",
    url: "/about",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
