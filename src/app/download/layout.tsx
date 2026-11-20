import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Download Center — SNU Automation Installers" },
  description:
    "Find official downloads and release notes for SNU Automation, with version details and download information for the SNU Automation Windows desktop app.",
  alternates: { canonical: "/download" },
  openGraph: {
    type: "website",
    title: "Download Center — SNU Automation Installers",
    description:
      "Find official downloads and release notes for SNU Automation, with version details and download information for the SNU Automation Windows desktop app.",
    url: "/download",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
