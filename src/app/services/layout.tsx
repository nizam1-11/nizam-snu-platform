import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Services — AI Automation & Custom Software | SNU Automation" },
  description:
    "Explore AI applications, business automation, workflow systems, and custom software products built by Syed Nizam Uddin under the SNU Automation brand.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    title: "Services — AI Automation & Custom Software | SNU Automation",
    description:
      "Explore AI applications, business automation, workflow systems, and custom software products built by Syed Nizam Uddin under the SNU Automation brand.",
    url: "/services",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
