import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Projects — AI Applications & Automation Systems" },
  description:
    "Browse a portfolio of real projects from SNU Automation, including AI applications, automation systems, the SNU Automation app, and SNU Clips.",
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    title: "Projects — AI Applications & Automation Systems",
    description:
      "Browse a portfolio of real projects from SNU Automation, including AI applications, automation systems, the SNU Automation app, and SNU Clips.",
    url: "/projects",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
