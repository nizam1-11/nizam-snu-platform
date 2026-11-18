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

/**
 * GLOBAL MOTION OVERRIDE — runs synchronously during HTML parsing, BEFORE
 * hydration. Animations are ON by default for every visitor regardless of the
 * OS "reduce motion" setting; only a stored 'off' opts the user out.
 *
 * motion-dom calls matchMedia("(prefers-reduced-motion)") and local components
 * call matchMedia("(prefers-reduced-motion: reduce)") — both go through
 * window.matchMedia, so this single patch covers every consumer. The class on
 * <html> drives the class-based override block in globals.css. Wrapped in
 * try/catch so any failure leaves native behaviour intact.
 */
const motionOverrideScript = `(function(){try{
  var off=localStorage.getItem('nizam-motion')==='off';
  var orig=window.matchMedia.bind(window);
  window.matchMedia=function(q){
    var m=orig(q);
    if(typeof q==='string'&&q.indexOf('prefers-reduced-motion')!==-1){
      return new Proxy(m,{get:function(t,p){
        if(p==='matches')return off;
        var v=t[p];return typeof v==='function'?v.bind(t):v;
      }});
    }
    return m;
  };
  document.documentElement.classList.toggle('motion-off',off);
  window.__nizamSetMotion=function(on){
    try{localStorage.setItem('nizam-motion',on?'on':'off')}catch(e){}
    document.documentElement.classList.toggle('motion-off',!on);
    location.reload();
  };
}catch(e){}})();`;

export const metadata: Metadata = {
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
    url: "https://nizam-snu.pages.dev",
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
      </head>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <PersonSchema
          name="Syed Nizam Uddin"
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
