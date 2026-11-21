import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { AIAssistant } from "@/components/interactive/AIAssistant";
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

/**
 * GLOBAL MOTION OVERRIDE — runs synchronously during HTML parsing, BEFORE
 * hydration. Motion is ALWAYS ON for every visitor, regardless of the OS
 * "reduce motion" setting — there is no toggle and no opt-out.
 *
 * motion-dom calls matchMedia("(prefers-reduced-motion)") and local components
 * call matchMedia("(prefers-reduced-motion: reduce)") — both go through
 * window.matchMedia, so this single patch covers every consumer by forcing
 * `matches` to false for any prefers-reduced-motion query. Wrapped in
 * try/catch so any unexpected failure leaves native behaviour intact.
 */
const motionOverrideScript = `(function(){try{
  var orig=window.matchMedia.bind(window);
  window.matchMedia=function(q){
    var m=orig(q);
    if(typeof q==='string'&&q.indexOf('prefers-reduced-motion')!==-1){
      return new Proxy(m,{get:function(t,p){
        if(p==='matches')return false;
        var v=t[p];return typeof v==='function'?v.bind(t):v;
      }});
    }
    return m;
  };
}catch(e){}})();`;

/**
 * Site-wide structured data. Verified facts only: no invented social profiles,
 * and no WebSite SearchAction (the search rich result was retired in Nov 2024).
 */
const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Syed Nizam Uddin",
    url: "https://nizam-snu-platform.nizam-snu-platform.workers.dev",
    jobTitle: "AI Automation Developer & Software Creator",
    description:
      "Syed Nizam Uddin builds AI-powered applications, business automation systems, and software products. Explore projects, download software, and get in touch.",
    image: "/images/profile.jpg",
    sameAs: ["https://github.com/nizam1-11"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Syed Nizam Uddin — SNU Automation",
    url: "https://nizam-snu-platform.nizam-snu-platform.workers.dev",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://nizam-snu-platform.nizam-snu-platform.workers.dev"),
  alternates: { canonical: "/" },
  title: {
    default:
      "Syed Nizam Uddin — AI Automation Developer & Software Creator | SNU Automation",
    template: "%s | Syed Nizam Uddin — SNU Automation",
  },
  description:
    "Syed Nizam Uddin builds AI-powered applications, business automation systems, and software products. Explore projects, download software, and get in touch.",
  keywords: [
    "AI automation",
    "software developer",
    "Nizam",
    "SNU Automation",
    "workflow automation",
    "AI applications",
  ],
  authors: [{ name: "Syed Nizam Uddin" }],
  creator: "Syed Nizam Uddin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nizam-snu-platform.nizam-snu-platform.workers.dev",
    siteName: "Syed Nizam Uddin — SNU Automation",
    title: "Syed Nizam Uddin — AI Automation Developer & Software Creator",
    description:
      "Building AI-powered applications, automation systems, and software products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Nizam Uddin — AI Automation Developer & Software Creator",
    description:
      "Building AI-powered applications, automation systems, and software products.",
  },
  icons: {
    icon: "/favicon.png",
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
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionOverrideScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <CursorSpotlight />
        <SiteChrome>{children}</SiteChrome>
        <AIAssistant />
      </body>
    </html>
  );
}
