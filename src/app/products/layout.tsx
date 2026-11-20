import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Products — Software by SNU Automation" },
  description:
    "Discover downloadable software products and tools from SNU Automation, including the SNU Automation Windows app for AI and workflow automation.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: "Products — Software by SNU Automation",
    description:
      "Discover downloadable software products and tools from SNU Automation, including the SNU Automation Windows app for AI and workflow automation.",
    url: "/products",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
