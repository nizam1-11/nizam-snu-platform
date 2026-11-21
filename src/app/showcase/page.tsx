"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronDown,
  Download,
  Monitor,
  Scissors,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SpotlightCard } from "@/components/interactive";
import { CoverAmbience } from "@/components/interactive/CoverAmbience";
import { cn } from "@/lib/utils";

/* ── Shared class recipes (tokens from globals.css / layout spec) ─────── */

const NEW_PILL =
  "inline-flex items-center rounded-full border border-accent-electric/30 bg-accent-electric/10 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-accent-electric";

const PRIMARY_CTA =
  "shine inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-blue/25 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

const SECONDARY_CTA =
  "inline-flex items-center justify-center gap-2.5 rounded-xl glass border border-accent-electric/20 px-8 py-4 font-medium text-text-primary transition-colors duration-300 hover:border-accent-electric/50 hover:bg-surface-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

/** Download is served from this site's own release queue (R2), not GitHub. */
const FINAL_CTA_URL = "/download";

/* ── Static content — transcribed from docs/snu-showcase-copy.md ─────── */

type Pillar = {
  id: string;
  icon: LucideIcon;
  title: string;
  urdu: string;
  bullets: React.ReactNode[];
};

const pillars: Pillar[] = [
  {
    id: "bulk-downloader",
    icon: Download,
    title: "Bulk downloader",
    urdu: "ایک لنک سے پوری بیچ ڈاؤن لوڈ کریں",
    bullets: [
      <>Paste a YouTube channel or profile link to fetch a whole batch — dozens at once.</>,
      <>Source tabs for YouTube, TikTok, Instagram and Bilibili, with entry points for Snapchat, X and Pinterest.</>,
      <>
        Quick chips for 20, 30, 50 or 100 videos; quality choices of 4K, 1080p,
        720p or audio-only; save to a local folder or a Google Drive folder, with
        per-channel folders and Saved Channels.
      </>,
      <>
        Up to four videos download in parallel, and each one is fully downloaded,
        edited and saved before the next batch begins.
      </>,
      <>
        A local download archive prevents re-downloads by default.{" "}
        <span className={NEW_PILL}>New</span>{" "}
        &quot;Re-download already downloaded videos&quot; option in manual bulk;
        scheduled and workflow runs keep duplicate protection.
      </>,
      <>
        Auto-retry with a visible countdown, cancel per batch, and plain errors
        for an expired session, a private video, or a cookie refresh. There is a
        YouTube cookie/session refresh helper, and emoji or non-ASCII titles are
        handled cleanly.
      </>,
    ],
  },
  {
    id: "quick-edit-studio",
    icon: Scissors,
    title: "Quick Edit Studio",
    urdu: "ایڈٹ کے تمام اختیارات ایک جگہ",
    bullets: [
      <>
        A wide drawer with six goal groups: Basics · Text &amp; subtitles · Look
        &amp; colour · Sound · Branding · Output &amp; file. Plain labels, optional
        Urdu helper, (?) tooltips, search, a Simple/Advanced mode and a local
        EN/UR toggle.
      </>,
      <>
        <span className={NEW_PILL}>New</span> Every effect has its own ON/OFF
        toggle. Stack 11 filters in order: Vivid, B&amp;W, Sepia, Vintage, Noir,
        Warm, Cool, Bright, Soft, Sharpen, Dramatic.
      </>,
      <>
        Trim start/end, speed 0.5–2×, crop shapes 9:16 / 1:1 / 4:5 / 16:9, a soft
        blurred background for vertical video instead of black bars, smart
        reframe, rotate and flip. Two-line text burn-in, .srt/.vtt subtitle
        burn-in, AI subtitles with{" "}
        <strong className="font-semibold text-text-primary">
          bring your own local engine/model
        </strong>{" "}
        (no model is shipped), and title or intro/outro cards.
      </>,
      <>
        Look and sound: .cube LUTs, auto colour levels, less grain, less shake,
        fades, chroma key green screen; loudness normalisation, hiss removal,
        silence stripping, and background music with auto ducking.
      </>,
      <>
        Branding and output: logo/watermark with position, size % and visibility
        % plus file validation; encoding presets, custom thumbnail, bulk rename
        template {"{title}_{platform}_{date}"}, compress to a target MB, optional
        keep-original. One-click Reels/Shorts, YouTube, Square and Reset all
        presets; preview on a sample and Open result.
      </>,
      <>
        By default the downloaded file is replaced in place with the edited
        version, same filename — <span className={NEW_PILL}>New</span>{" "}
        &quot;Keep both original and edited copies&quot; is opt-in. Settings stay
        on your PC and travel through Settings Export/Import, with logo, subtitle
        and music files packed in.
      </>,
    ],
  },
  {
    id: "workflow-builder",
    icon: Workflow,
    title: "Workflow builder",
    urdu: "بلاکوں کو جوڑ کر پورا کام ترتیب دیں",
    bullets: [
      <>Drag and connect nodes to build a run. Each platform has its own source node with a distinct icon and colour.</>,
      <>
        11 starter templates, including YouTube channel → Facebook, TikTok
        profile, Instagram profile, Bilibili space, Google Sheet + Drive links,
        folder input and save to library.
      </>,
      <>Google Sheet + Drive work through shared links — no sign-in needed for public or shared files.</>,
      <>
        Image and video generation, voiceover, clip stitching and
        delete-after-post. A &quot;Take N&quot; source enqueues all selected
        videos, and duplicate commands are deduped.
      </>,
      <>
        Graph validation checks cycles, disconnected nodes and missing required
        settings before a run. Import/export JSON. Scheduling handles timezones
        and DST, with run history, run log, progress and cleanup, plus a safe
        handoff to the Facebook queue.
      </>,
    ],
  },
  {
    id: "facebook-automation",
    icon: ShieldCheck,
    title: "Facebook automation with safety",
    urdu: "محفوظ رفتار کے ساتھ فیس بک پوسٹنگ",
    bullets: [
      <>Connect Pages through Meta OAuth and manage multiple Pages with per-Page settings.</>,
      <>
        A posting queue with dry-run validation. Human pacing uses a maximum
        posts per day, minimum spacing, jitter and posting-hour windows.
      </>,
      <>Duplicate detection, token and pause checks, health auto-pause, and clear health warnings and alerts.</>,
      <>
        <span className={NEW_PILL}>New</span> Safety bypass toggle for manual Run
        now — OFF (default) keeps all safety on; ON lets a manual Run now upload
        directly. Scheduled posts always follow safety, and pause, token,
        duplicate and content checks are never bypassed.
      </>,
      <>
        Resumable chunked uploads with progress, caption templates with rotation,
        per-Page and per-video analytics, and a Calendar view.
      </>,
      <>
        A unified Progress Center shows live download → edit → post status with
        filters, search, and Cancel / Retry / Run now.
      </>,
    ],
  },
];

const steps = [
  {
    number: "1",
    title: "Connect a source.",
    body: "Paste a channel or profile link, or start from a template, a shared Google Sheet or a folder, and pick the videos.",
  },
  {
    number: "2",
    title: "Choose your edits.",
    body: "Adjust effects yourself or apply a preset — captions, colour, sound, logo and output size.",
  },
  {
    number: "3",
    title: "Let it run safely.",
    body: "Up to four videos move from download to edit to save at a time; each one finishes completely before the next group starts. Finished videos move into a paced posting queue for your Pages.",
  },
];

const faqs = [
  {
    id: "1",
    question: "Is it Windows only?",
    answer: "Yes. It is a Windows 10/11 desktop app. There is no web or mobile version.",
  },
  {
    id: "2",
    question: "Do I need a licence key?",
    answer:
      "Yes. It uses a machine-bound licence key with configurable seats. If you change PCs, you can reactivate from the operator dashboard.",
  },
  {
    id: "3",
    question: "Does it bypass platform rules?",
    answer:
      "No. It works through your own connected accounts and follows platform safety limits — daily caps, spacing, posting windows and duplicate checks stay on.",
  },
  {
    id: "4",
    question: "Can I use my own logo, captions and music on another PC?",
    answer:
      "Yes. Settings Export/Import packs your logo, subtitle and music files with the settings, so you can move them to another PC.",
  },
  {
    id: "5",
    question: "What if a download fails?",
    answer:
      "The app retries automatically with a visible countdown. Errors are plain messages — an expired session, a private video, or a cookie refresh being needed — and there is a YouTube cookie/session refresh helper. You can cancel a batch at any time.",
  },
  {
    id: "6",
    question: "Will I see a SmartScreen warning when installing?",
    answer:
      "Windows may show a SmartScreen warning because the installer is not code-signed yet. A signed build is planned when a code-signing certificate is available.",
  },
];

const urduPillars = [
  "بیچ ڈاؤن لوڈر",
  "کوئیک ایڈٹ اسٹوڈیو",
  "ورک فلو بلڈر",
  "فیس بک آٹومیشن (حفاظت کے ساتھ)",
];

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function ShowcasePage() {
  // Single-open FAQ accordion — all closed by default.
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-text-primary">
      {/* Ambient background: existing token-driven atmosphere only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-atmosphere opacity-50" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      <main className="relative z-10">
        {/* 1 ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative py-20 lg:py-28">
          <div className="section-container">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <Reveal y={16}>
                  <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-text-primary lg:text-6xl">
                    Turn a channel link into{" "}
                    <span className="text-gradient-primary">
                      a week of posts.
                    </span>
                  </h1>
                </Reveal>

                <Reveal delay={0.08}>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
                    SNU Automation is a Windows 10/11 desktop app for creators
                    who post the same kind of video every week. Paste a channel
                    link, edit the batch in one place, then post to your Facebook
                    Pages at a human pace — a small tool by Nizam.
                  </p>
                  <span
                    lang="ur"
                    dir="rtl"
                    className="mt-4 block text-sm leading-relaxed text-text-secondary"
                  >
                    ہر ہفتے بار بار ویڈیو پوسٹ کرنے والوں کے لیے: ایک لنک، ڈاؤن لوڈ، ایڈٹ، اور محفوظ پوسٹنگ۔
                  </span>
                </Reveal>

                <Reveal delay={0.16}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href="/download" className={PRIMARY_CTA}>
                      <Download aria-hidden="true" className="h-5 w-5" />
                      Download for Windows
                    </Link>
                    <Link href="#how-it-works" className={SECONDARY_CTA}>
                      See how it works
                    </Link>
                  </div>
                  <p className="mt-5 max-w-xl text-xs leading-relaxed text-text-secondary">
                    Windows may show a SmartScreen warning because the installer
                    is not code-signed yet. A signed build is planned when a
                    code-signing certificate is available.
                  </p>
                </Reveal>
              </div>

              {/* Decorative app frame — real logo, no invented UI copy. */}
              <div className="relative mt-10 lg:mt-0">
                <Reveal direction="left" delay={0.1}>
                  <SpotlightCard className="w-full rounded-2xl">
                    <TiltCard intensity={4} glare={false} className="w-full rounded-2xl">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl glass-strong gradient-border bg-atmosphere sm:aspect-video">
                        <div aria-hidden="true" className="hero-ambient-glow" />
                        <div aria-hidden="true" className="absolute inset-0 grid-overlay opacity-30" />
                        <CoverAmbience />
                        <div className="relative z-10 flex h-full w-full items-center justify-center p-8">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/snu-logo.png"
                            alt="SNU Automation logo"
                            className="h-32 w-32 object-contain drop-shadow-[0_10px_30px_rgb(181_121_74_/_0.45)] sm:h-40 sm:w-40"
                          />
                        </div>
                      </div>
                    </TiltCard>
                  </SpotlightCard>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* 2 ── ABOUT ──────────────────────────────────────────────────── */}
        <section className="relative py-20 lg:py-28">
          <div className="section-container">
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-lg leading-relaxed text-text-secondary lg:text-xl">
                  For creators who publish the same style of video each week,
                  the small repeated steps are what take the time: fetching
                  clips, trimming them, adding text or captions, uploading to
                  each Page. This Windows app puts those steps into one
                  repeatable pipeline. You connect your own accounts, choose
                  your edits, and let a queued run carry the work from download
                  to post. Safety limits stay in place, so the rhythm remains
                  yours.
                </p>
                <span
                  lang="ur"
                  dir="rtl"
                  className="mt-5 block text-center text-sm leading-relaxed text-text-secondary"
                >
                  یہ ایپ ہر ہفتے بار بار آنے والے ویڈیو کام کو ایک سادہ، محفوظ اور دہرائے جانے والے عمل میں بدل دیتی ہے۔
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3 ── FOUR FEATURE PILLARS ───────────────────────────────────── */}
        <section className="relative py-20 lg:py-28">
          <div className="section-container">
            <Reveal>
              <div className="mb-12 text-center lg:mb-16">
                <h2 className="font-heading text-3xl font-bold text-text-primary lg:text-4xl">
                  Four feature pillars
                </h2>
              </div>
            </Reveal>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <StaggerItem key={pillar.id} className="h-full">
                    <article className="glass gradient-border flex h-full flex-col rounded-2xl p-6 lg:p-7">
                      <div className="glass-strong inline-flex w-fit rounded-xl p-3 text-accent-electric">
                        <Icon aria-hidden="true" className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-xl font-bold text-text-primary">
                        {pillar.title}
                      </h3>
                      <span
                        lang="ur"
                        dir="rtl"
                        className="mt-1 block text-sm text-text-secondary"
                      >
                        {pillar.urdu}
                      </span>
                      <ul className="mt-4 list-disc list-outside space-y-2 pl-5 text-sm leading-relaxed text-text-secondary marker:text-accent-electric/60">
                        {pillar.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* 4 ── HOW IT WORKS ───────────────────────────────────────────── */}
        <section id="how-it-works" className="relative scroll-mt-20 py-20 lg:py-28">
          <div className="section-container">
            <Reveal>
              <div className="mb-12 text-center lg:mb-16">
                <h2 className="font-heading text-3xl font-bold text-text-primary lg:text-4xl">
                  How it works
                </h2>
              </div>
            </Reveal>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <StaggerItem key={step.number} className="h-full">
                  <div className="glass gradient-border flex h-full flex-col rounded-2xl p-6 lg:p-7">
                    <span
                      aria-hidden="true"
                      className="glass-strong inline-flex h-11 w-11 items-center justify-center rounded-xl font-heading text-lg font-bold text-accent-electric"
                    >
                      {step.number}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-bold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {step.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* 5 ── BUILT FOR SAFETY ───────────────────────────────────────── */}
        <section className="relative py-24 lg:py-32">
          <div className="section-container">
            <Reveal>
              <div className="glass-strong gradient-border glow-gold rounded-3xl bg-atmosphere p-8 text-center lg:p-12">
                <ShieldCheck aria-hidden="true" className="mx-auto h-8 w-8 text-accent-electric" />
                <h2 className="mt-5 font-heading text-3xl font-bold text-text-primary lg:text-4xl">
                  Built for safety
                </h2>
                <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-text-secondary lg:text-lg">
                  Posting keeps a human rhythm. The app works through your own
                  connected accounts and follows platform safety limits. Daily
                  caps, minimum spacing, jitter, posting-hour windows, duplicate
                  protection and dry-run validation all run by default. If a
                  Page&apos;s health looks off, posting auto-pauses. A manual Run
                  now can opt into a safety bypass; scheduled posts and the
                  pause, token, duplicate and content checks are never bypassed.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 6 ── FAQ ────────────────────────────────────────────────────── */}
        <section className="relative py-20 lg:py-28">
          <div className="section-container">
            <Reveal>
              <div className="mb-12 text-center lg:mb-16">
                <h2 className="font-heading text-3xl font-bold text-text-primary lg:text-4xl">
                  FAQ
                </h2>
              </div>
            </Reveal>

            <div className="mx-auto max-w-3xl space-y-4">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                const buttonId = `showcase-faq-button-${faq.id}`;
                const panelId = `showcase-faq-panel-${faq.id}`;

                return (
                  <Reveal key={faq.id} y={14}>
                    <div
                      className={cn(
                        "glass rounded-xl overflow-hidden transition-colors duration-300",
                        isOpen && "gradient-border glow-gold"
                      )}
                    >
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        className="flex w-full items-start justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-electric"
                      >
                        <span className="font-medium text-text-primary transition-colors duration-300">
                          {faq.question}
                        </span>
                        <motion.span
                          aria-hidden="true"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                          className="mt-0.5 shrink-0 text-text-secondary"
                        >
                          <ChevronDown className="h-5 w-5" />
                        </motion.span>
                      </button>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                      >
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="answer"
                              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                              transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="px-5 pb-5 text-sm leading-relaxed text-text-secondary">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7 ── FINAL CTA ──────────────────────────────────────────────── */}
        <section className="relative py-24 lg:py-32">
          <div className="section-container">
            <Reveal>
              <div className="glass-strong gradient-border glow-gold rounded-3xl p-8 text-center lg:p-12">
                <Download aria-hidden="true" className="mx-auto h-8 w-8 text-accent-electric" />
                <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-bold leading-tight text-text-primary lg:text-4xl">
                  Keep your weekly posting steady without repeating the same
                  manual steps.
                </h2>
                <div className="mt-8">
                  <a
                    href={FINAL_CTA_URL}
                    className={PRIMARY_CTA}
                  >
                    <Monitor aria-hidden="true" className="h-5 w-5" />
                    Download for Windows
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 8 ── URDU VARIANT ───────────────────────────────────────────── */}
        <section className="relative py-20 lg:py-28">
          <div className="section-container">
            <Reveal>
              <div dir="rtl" className="mx-auto max-w-3xl">
                <h2
                  lang="ur"
                  className="font-heading text-2xl font-bold leading-relaxed text-text-primary"
                >
                  ہر ہفتے بار بار ویڈیو پوسٹ کرنے والوں کے لیے ایک سادہ حل
                </h2>
                <p
                  lang="ur"
                  className="mt-4 text-base leading-relaxed text-text-secondary"
                >
                  ایک لنک سے ویڈیو ڈاؤن لوڈ کریں، ایک ہی جگہ ایڈٹ کریں، اور اپنے فیس بک پیجز پر محفوظ رفتار سے پوسٹ کریں۔ ونڈوز 10/11 کے لیے۔
                </p>
                <ol className="mt-6 list-decimal space-y-2 pr-6 text-base leading-relaxed text-text-secondary marker:text-accent-electric">
                  {urduPillars.map((pillar) => (
                    <li key={pillar}>
                      <span lang="ur">{pillar}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
