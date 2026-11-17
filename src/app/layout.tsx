import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { PersonSchema, OrganizationSchema } from "@/components/seo/StructuredData";
import { CursorSpotlight } from "@/components/motion/CursorSpotlight";
import "./globals.css";

/* Self-hosted via next/font — no external font requests, so CSP font-src 'self' stays valid.
   Variable names MUST match the @theme font tokens in globals.css. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nizam — AI Automation Developer & Software Creator | SNU Automation",
    template: "%s | Nizam — SNU Automation",
  },
  description:
    "Nizam builds AI-powered applications, business automation systems, and software products. Explore projects, download software, and get in touch.",
  keywords: [
    "AI automation",
    "software developer",
    "Nizam",
    "SNU Automation",
    "workflow automation",
    "AI applications",
  ],
  authors: [{ name: "Nizam" }],
  creator: "Nizam",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nizam-snu.pages.dev",
    siteName: "Nizam — SNU Automation",
    title: "Nizam — AI Automation Developer & Software Creator",
    description:
      "Building AI-powered applications, automation systems, and software products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nizam — AI Automation Developer & Software Creator",
    description:
      "Building AI-powered applications, automation systems, and software products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <PersonSchema
          name="Nizam"
          url={process.env.NEXT_PUBLIC_APP_URL || "https://nizam-snu.pages.dev"}
          jobTitle="AI Automation Developer & Software Creator"
          sameAs={[
            "https://github.com/yourusername",
            "https://linkedin.com/in/yourusername",
            "https://twitter.com/yourusername",
          ]}
        />
        <OrganizationSchema
          name="SNU Automation"
          url={process.env.NEXT_PUBLIC_APP_URL || "https://nizam-snu.pages.dev"}
        />
        <CursorSpotlight />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
