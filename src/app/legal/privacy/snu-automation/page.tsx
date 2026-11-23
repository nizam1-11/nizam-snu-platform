import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ── Copy transcribed verbatim from privacy-copy.json (source of truth) ── */

type PolicySection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

type ProductPolicy = {
  name: string;
  summary: string;
  sections: PolicySection[];
};

const policy: ProductPolicy = {
  name: "SNU Automation",
  summary:
    "A Windows 10/11 app for bulk video downloading, Facebook Page scheduling, visual workflows, and an AI assistant. Job and workflow data is stored locally.",
  sections: [
    {
      heading: "What this app does",
      paragraphs: [
        "SNU Automation is a Windows 10 and 11 desktop app. It downloads videos in bulk from channel links, schedules posts to Facebook Pages, builds visual workflows, and includes an AI assistant. You install it on your own PC from this site or from GitHub releases.",
      ],
      bullets: [],
    },
    {
      heading: "Data on your device",
      paragraphs: [
        "Your workflow configuration and job data stay in local SQLite on your Windows machine.",
        "The website does not receive this data. Downloaded videos and job details remain on your PC unless you choose to move them. There is no central store for your app projects.",
      ],
      bullets: [],
    },
    {
      heading: "Accounts and connections",
      paragraphs: [
        "The app does not require a central account. It uses a machine-bound licence key with a configurable number of seats.",
        "Facebook Page scheduling uses Meta OAuth. You authorize this connection inside the app, and it applies only to the Pages you choose, up to 100+. This is the app's own connection to Meta; the website does not receive your Page data.",
        "The AI assistant uses a provider you select, such as Google Gemini, Anthropic Claude, or OpenAI GPT. Text you send through that feature is handled by the chosen provider under its own terms.",
      ],
      bullets: [],
    },
    {
      heading: "What the website records",
      paragraphs: [
        "The site keeps an aggregated download count. It does not attach your name or contact details to downloads.",
        "If you use the site's contact form or chat widget, that is handled under the site policy below. Using the app does not require you to use either.",
      ],
      bullets: [],
    },
    {
      heading: "Third parties",
      paragraphs: [
        "These services act only when you choose to use the related feature. They are not given your local job data.",
      ],
      bullets: [
        "Meta, when you authorize Facebook Page scheduling inside the app.",
        "Google Gemini, Anthropic Claude, or OpenAI GPT, when you use the AI assistant.",
        "GitHub and Cloudflare, which host the public release files you download.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You decide whether to connect Facebook Pages or use the AI assistant. You can stop using either feature at any time. You can remove the app and its local SQLite data from your PC whenever you like.",
      ],
      bullets: [],
    },
    {
      heading: "Changes",
      paragraphs: [
        "If this app's data practices change, this policy will be updated on the site with a new date.",
      ],
      bullets: [],
    },
  ],
};

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function SnuAutomationPrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/legal/privacy"
        className="group inline-flex items-center gap-2 text-sm font-medium text-accent-electric transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
        />
        All privacy policies
      </Link>

      <header className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent-electric">
          PRODUCT PRIVACY
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {policy.name} Privacy Policy
        </h1>
        <p className="mt-5 text-base leading-relaxed text-text-secondary">
          {policy.summary}
        </p>
        <p className="mt-4 text-xs text-text-secondary">
          Last updated: November 2026
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {policy.sections.map((section) => (
          <section
            key={section.heading}
            className="glass gradient-border rounded-2xl p-6"
          >
            <h2 className="font-heading text-lg font-bold text-text-primary">
              {section.heading}
            </h2>
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
          </section>
        ))}
      </div>

      <footer className="mt-10 border-t border-white/10 pt-6">
        <p className="text-sm leading-relaxed text-text-secondary">
          Questions about this policy can be sent to{" "}
          <a
            href="mailto:nizam14010@gmail.com"
            className="font-medium text-accent-electric transition-colors hover:text-text-primary"
          >
            nizam14010@gmail.com
          </a>{" "}
          or WhatsApp{" "}
          <a
            href="https://wa.me/923239163815"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent-electric transition-colors hover:text-text-primary"
          >
            +923239163815
          </a>
          .
        </p>
      </footer>
    </article>
  );
}
