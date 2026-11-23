import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  Globe,
  Scissors,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

/* ── Copy transcribed verbatim from privacy-copy.json (source of truth) ── */

const INTRO =
  "This policy covers the SNU Automation portfolio site and its two desktop apps, SNU Automation and SNU Clipper. The site is a portfolio for Syed Nizam Uddin, who operates as SNU Automation. The two apps are local-first: they keep your project and job data on your own Windows machine. This policy explains what the website handles, what stays on your device, and which services are involved.";

type PolicySection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

type ProductLink = {
  slug: string;
  name: string;
  summary: string;
  icon: LucideIcon;
};

const PRODUCTS: ProductLink[] = [
  {
    slug: "snu-automation",
    name: "SNU Automation",
    summary:
      "A Windows 10/11 app for bulk video downloading, Facebook Page scheduling, visual workflows, and an AI assistant. Job and workflow data is stored locally.",
    icon: FolderKanban,
  },
  {
    slug: "snu-clipper",
    name: "SNU Clipper",
    summary:
      "A fully offline Windows AI video clipper using local Whisper transcription. No account, no watermark, no limits.",
    icon: Scissors,
  },
];

const SITE_SECTIONS: PolicySection[] = [
  {
    heading: "What we collect",
    paragraphs: [
      "The site collects what you send it directly. The contact form stores your message and the details you enter, then sends them to us by email. The AI chat widget sends the messages you type to Google Gemini to generate a response.",
    ],
    bullets: [
      "Contact form messages, stored in D1 and emailed via Resend.",
      "Chat messages, sent to Google Gemini.",
      "An aggregated download count, with no personal data attached.",
      "Basic analytics and network data handled by Cloudflare, including IP addresses.",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: [
      "We use contact form messages to reply to your inquiry and keep them until the inquiry is resolved. Chat messages are used to generate replies during your session. The download count is used only as a total. We do not sell your information.",
    ],
    bullets: [],
  },
  {
    heading: "Cookies and analytics",
    paragraphs: [
      "The site uses privacy-friendly analytics provided by Cloudflare. Cloudflare also sees network information such as your IP address as part of serving and protecting the site.",
    ],
    bullets: [],
  },
  {
    heading: "Third-party services",
    paragraphs: ["The site relies on a small set of providers to run."],
    bullets: [
      "Cloudflare: hosting, CDN, security, D1 database, R2 storage, and analytics.",
      "Resend: sending contact form emails.",
      "Google Gemini: processing AI chat messages.",
      "GitHub: hosting public release downloads.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You can ask us to access, correct, or delete the information you sent through the contact form. Write to us using the details below and we will respond to reasonable requests. Chat messages are processed by Google Gemini under Google's own policies.",
    ],
    bullets: [],
  },
  {
    heading: "Changes",
    paragraphs: [
      "We may update this policy as the site or apps change. The current version is always posted here with a revision date.",
    ],
    bullets: [],
  },
  {
    heading: "Contact",
    paragraphs: [
      "Questions about this policy can be sent to nizam14010@gmail.com or WhatsApp +923239163815.",
    ],
    bullets: [],
  },
];

const CARD_LINK =
  "glass gradient-border no-underline! group flex h-full flex-col rounded-2xl p-6 transition-colors duration-300 hover:border-accent-electric/40 hover:bg-surface-elevated/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

const READ_MORE =
  "mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-electric";

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function PrivacyIndexPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero */}
      <Reveal>
        <header className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-electric">
            LEGAL
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Privacy Policies
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-text-secondary">
            {INTRO}
          </p>
          <p className="mt-4 text-xs text-text-secondary">
            Last updated: November 2026
          </p>
        </header>
      </Reveal>

      {/* Product policies */}
      <section className="mt-12" aria-label="Product privacy policies">
        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            return (
              <StaggerItem key={product.slug} className="h-full">
                <Link
                  href={`/legal/privacy/${product.slug}`}
                  aria-label={`Read the ${product.name} privacy policy`}
                  className={CARD_LINK}
                >
                  <span className="glass-strong inline-flex w-fit rounded-xl p-3 text-accent-electric">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 font-heading text-xl font-bold text-text-primary">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {product.summary}
                  </p>
                  <span className={READ_MORE}>
                    Read policy
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}

          {/* Compact card → on-page website section */}
          <StaggerItem className="md:col-span-2">
            <a
              href="#website"
              aria-label="Read the website privacy policy on this page"
              className={`${CARD_LINK} flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
            >
              <span className="flex items-start gap-4">
                <span className="glass-strong inline-flex w-fit shrink-0 rounded-xl p-3 text-accent-electric">
                  <Globe aria-hidden="true" className="h-6 w-6" />
                </span>
                <span className="block">
                  <span className="block font-heading text-lg font-bold text-text-primary">
                    Website &amp; contact data
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-text-secondary">
                    What the site collects, how it is used, and how to reach us.
                  </span>
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent-electric">
                Read on this page
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </a>
          </StaggerItem>
        </Stagger>
      </section>

      {/* Full website policy, rendered on this page */}
      <section
        id="website"
        tabIndex={-1}
        className="mt-16 scroll-mt-24"
        aria-labelledby="website-heading"
      >
        <Reveal>
          <h2
            id="website-heading"
            className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Website Privacy
          </h2>
        </Reveal>
        <Stagger className="mt-6 space-y-4">
          {SITE_SECTIONS.map((section) => (
            <StaggerItem key={section.heading}>
              <div className="glass gradient-border rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  {section.heading}
                </h3>
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mt-3 text-sm leading-relaxed text-text-secondary"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets.length > 0 && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary marker:text-accent-electric/60">
                    {section.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
