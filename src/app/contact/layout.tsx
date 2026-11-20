import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact Syed Nizam Uddin | SNU Automation" },
  description:
    "Get in touch with Syed Nizam Uddin via email or WhatsApp (+923239163815) to discuss projects, collaboration, or questions about SNU Automation.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact Syed Nizam Uddin | SNU Automation",
    description:
      "Get in touch with Syed Nizam Uddin via email or WhatsApp (+923239163815) to discuss projects, collaboration, or questions about SNU Automation.",
    url: "/contact",
    siteName: "Syed Nizam Uddin — SNU Automation",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
