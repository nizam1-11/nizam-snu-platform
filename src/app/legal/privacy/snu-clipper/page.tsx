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
  name: "SNU Clipper",
  summary:
    "A fully offline Windows AI video clipper using local Whisper transcription. No account, no watermark, no limits.",
  sections: [
    {
      heading: "What this app does",
      paragraphs: [
        "SNU Clipper is a Windows app that clips videos using AI. It runs locally. It uses Whisper for speech-to-text, accepts video files or YouTube links, and supports transcript import.",
      ],
      bullets: [],
    },
    {
      heading: "Data on your device",
      paragraphs: [
        "The app does not send your videos or transcripts to us.",
        "Processing happens on your machine. Your video files, generated clips, and transcripts stay in your local storage. Nothing is uploaded to the site.",
      ],
      bullets: [],
    },
    {
      heading: "Accounts and connections",
      paragraphs: [
        "There is no account, no licence server, and no sign-in. The app works offline. There is no watermark and no usage limit.",
      ],
      bullets: [],
    },
    {
      heading: "What the website records",
      paragraphs: [
        "The site keeps only an aggregated download count for Clipper. No personal data is tied to your download.",
      ],
      bullets: [],
    },
    {
      heading: "Third parties",
      paragraphs: [
        "Clipper performs its core work without third-party services. GitHub and Cloudflare host the public release file you download. If you paste a YouTube link, YouTube is the source of that video.",
      ],
      bullets: [],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You control which files and links you open in the app. You can delete your local clips and transcripts at any time. Stopping use requires no account closure.",
      ],
      bullets: [],
    },
    {
      heading: "Changes",
      paragraphs: [
        "If Clipper's data practices change, this policy will be updated on the site with a new date.",
      ],
      bullets: [],
    },
  ],
};

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function SnuClipperPrivacyPage() {
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
