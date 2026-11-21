# SNU Automation — Showcase Layout / Design Spec

Status: implementation-ready spec (design only). No source files, build, or live site were changed.

## 0. Ground rules

- **Copy is fixed.** Source of truth is `docs/snu-showcase-copy.md` (sections 1–8). Paste text verbatim; do not reword, add claims, or add numbers. Do not surface the "Copy notes" section publicly.
- **No buzzwords, no emojis, no secrets/internals.** The `[icon]` markers in the copy are lucide icon slots, not literal text.
- **Palette note:** in this codebase the "cyan/blue" aliases are actually gold/champagne (`accent-blue` = primary gold, `accent-cyan` = champagne). Use the real tokens in §4; do not try to force a literal cyan/blue hue.

## 1. Section order

Render in this exact order (mirrors the copy doc):

1. Hero
2. About intro
3. Four feature pillars
4. How it works (3 steps)
5. Built for safety band
6. FAQ (6 items, accordion)
7. Final CTA
8. Urdu variant (compact block, placed after the final CTA)

Every section sits inside `section-container` (max-width 80rem / `7xl`, `px-4 sm:px-6 lg:px-8`). Section rhythm: `py-20 lg:py-28` (heavy CTA/safety bands may go `py-24 lg:py-32`). Section header to content: `mb-12 lg:mb-16`.

### 1.1 Hero
- Desktop (`lg`): 2 columns, `grid lg:grid-cols-2 gap-12 items-center`. **Text left, visual right.**
  - Left: `<h1>` headline ("Turn a channel link into a week of posts.") in `font-heading text-5xl lg:text-6xl font-bold tracking-tight`, with the key phrase wrapped in `text-gradient-primary`.
  - Below it the body paragraph (`text-text-secondary text-lg leading-relaxed max-w-xl`), then CTA row (`mt-8 flex flex-wrap items-center gap-4`), then the SmartScreen micro-note.
  - Right (optional): app visual in a `glass gradient-border rounded-2xl` frame with `bg-atmosphere` / `hero-ambient-glow`. If no real screenshot exists, use a local `/images` asset or an abstract `GradientOrb` panel — **do not invent UI copy**. Mark decorative layers `aria-hidden`.
- Mobile: single column, text stacks above visual; visual `mt-10`, `aspect-video`.
- Urdu line: directly under the body paragraph, styled per §4.
- SmartScreen note: directly under the CTA row (see §6 for placement/styling).
- Wrap headline/body/CTA blocks in `Reveal` with small staggered `delay` (0 / 0.08 / 0.16).

### 1.2 About intro
- Single column, `max-w-3xl mx-auto text-center` (or left-aligned `max-w-3xl` to match hero — pick one and keep consistent site-wide).
- `<h2>` `font-heading text-3xl lg:text-4xl font-bold`; body `mt-6 text-text-secondary text-lg leading-relaxed`; Urdu line below.
- No card chrome — let it breathe as a quiet transition section.

### 1.3 Four feature pillars
- Section header `<h2>` centered, optional short kicker in `text-accent-electric` small caps.
- Grid of 4 cards (content is dense bullet lists). Each card: `glass gradient-border rounded-2xl p-6 lg:p-7 flex flex-col h-full`.
  - Icon in a `glass-strong rounded-xl p-3 text-2xl text-accent-electric` square (lucide, §8).
  - Card title `<h3>` `font-heading text-xl font-bold text-text-primary`; Urdu subtitle below (§4).
  - Bullet list `mt-4 space-y-2 text-sm leading-relaxed text-text-secondary`, `list-disc list-outside pl-5`.
  - Inline **New** tags styled per §4.
- Reveal with `<Stagger>` + `<StaggerItem className="h-full">` so cards enter in sequence.

### 1.4 How it works (3 steps)
- 3-column grid on desktop; numbered step markers ("1 / 2 / 3").
- Each step: `<h3>` title + body in `text-text-secondary`. Optional thin connector line between markers on desktop (`hidden lg:block`).
- Use `<Stagger>`/`<StaggerItem>`.

### 1.5 Built for safety band
- Full-width emphasis band: `glass-strong gradient-border rounded-3xl p-8 lg:p-12 text-center`, `bg-atmosphere` behind, `glow-gold` optional.
- `<h2>` + single paragraph from the copy. Calm, no motion beyond a gentle `Reveal`. Do not add claims.

### 1.6 FAQ
- Centered `<h2>`, then `max-w-3xl mx-auto` list of 6 accordion rows.
- Each row: `glass rounded-xl` (open row: `gradient-border`), a full-width `<button>` with `aria-expanded`, question text, and a `ChevronDown` icon that rotates when open (§7).
- Behaviour: §7.

### 1.7 Final CTA
- Centered `<h2>`/lead from copy, primary download button (§4) linking to the v2.6.10 GitHub release URL exactly as written in the copy doc. Note this differs from the hero's `/download` secondary-style link — keep both as written.

### 1.8 Urdu variant
- Compact block after the final CTA, `max-w-3xl mx-auto`, `dir="rtl"` on the container.
- Heading `font-heading text-2xl font-bold`, body `text-text-secondary`, then a 4-item `<ol>` of the pillar names.
- Each Urdu text node carries `lang="ur"` (§6). Do not translate or paraphrase.

## 2. Responsive behaviour & grid decisions

| Block | Mobile (< 640px) | md (≥ 768px) | lg (≥ 1024px) |
|---|---|---|---|
| Hero | 1 col, stacked | 2 col begins at `lg` | 2 col (text / visual) |
| Pillars (4) | 1 col | 2 col | **2 × 2** |
| Steps (3) | 1 col | 1 col (or 3 at `md`) | 3 col |
| Safety / FAQ / CTA | 1 col | centered max-width | centered max-width |

- **Pillars = 2 × 2, not 3 + 1.** A 3-column layout orphans the 4th card with unbalanced trailing whitespace; the pillar bullets are the densest content on the page and need the width. 2 × 2 is symmetrical and reads as four equal peers. (Steps stay 3-col because each is short.)
- Container: `section-container` (max `80rem`). Cards cap at `max-w-3xl` for About/FAQ, full container width for grids.
- Spacing scale (use these, don't invent): section `py-20 lg:py-28`; grid gap `gap-6` (24px); card padding `p-6 lg:p-7`; heading→content `mb-12 lg:mb-16`; step/icon internal `gap-4`.
- Fluid type via Tailwind responsive prefixes (e.g. `text-3xl lg:text-4xl`); no clamp() needed.

## 3. Motion (global mechanism, no new toggle)

- Motion is **ON by default** site-wide; add **no** showcase-specific toggle.
- Entrances: use existing `<Reveal>`, `<Stagger>`, `<StaggerItem>` from `@/components/motion/Reveal` (ease-out-expo, `whileInView`, `once: true`). Optional restrained `<TiltCard>` from `@/components/motion/TiltCard` on the hero visual only.
- These components already call `useReducedMotion()` and enable animation only after mount — **prefers-reduced-motion is honoured automatically**; rows render statically. Do not add a second reduced-motion check.
- The site also exposes a global opt-out via `html.motion-off` (set by the existing site-wide Motion control in `layout.tsx`); all CSS/SVG animation and `Reveal` freezes under it. Inherit it — do not override.
- Butterflies/stars ambience **only** via the existing `<CoverAmbience />` component (`@/components/interactive/CoverAmbience`), and only in the hero visual frame. It is `aria-hidden`, pointer-events-none, and already freezes under `motion-off`. Do not build a new particle system.

## 4. Design tokens → existing classes

| Element | Classes |
|---|---|
| Page base | `bg-bg-base text-text-primary` (optionally `bg-atmosphere` on hero/band) |
| Card | `glass gradient-border rounded-2xl p-6` (add `card-interactive` only for hoverable cards) |
| Emphasis card | `glass-strong gradient-border rounded-3xl glow-gold` |
| Heading | `font-heading font-bold tracking-tight` (Space Grotesk via `--font-space-grotesk`) |
| Body | `text-text-secondary leading-relaxed`; paragraphs `text-base lg:text-lg` |
| Gradient headline | `text-gradient-primary` (deep-gold→champagne) |
| Primary CTA | `shine inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-blue/25 hover:-translate-y-0.5 transition-transform` |
| Secondary CTA | `glass rounded-xl px-8 py-4 font-medium text-text-primary border border-accent-electric/20 hover:border-accent-electric/50` |
| **New** tag | `inline-flex items-center rounded-full border border-accent-electric/30 bg-accent-electric/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-electric` |
| Urdu subtitle | `block mt-1 text-sm text-text-secondary` with `lang="ur"`; slightly smaller than the English line, muted but still ≥ 4.5:1 |
| SmartScreen micro-note | `mt-5 text-xs text-text-secondary leading-relaxed max-w-xl` (use `text-text-secondary`, **not** `text-text-muted`, to stay accessible) |
| Focus ring | global `:focus-visible { outline: 2px solid var(--color-accent-electric); outline-offset: 2px }`; on custom controls add `focus-visible:ring-2 focus-visible:ring-accent-electric` |

Token values (from `globals.css`): `bg-base #06070b`, `surface-card #1b1d27`, `text-primary #efe6da`, `text-secondary #a2968b`, `text-muted #7a6f66`, `accent-blue/gold #b5794a`, `accent-electric #d8a46b`, `accent-purple/bronze #9a6438`, `accent-cyan/champagne #c99a63`.

## 5. Accessibility

- **Contrast:** `text-primary` (#efe6da) on `bg-base` (#06070b) ≈ 15:1; `text-secondary` (#a2968b) ≈ 6.9:1; `accent-electric` ≈ 8.6:1; white on the gold→bronze CTA gradient ≈ 5:1. All pass WCAG AA for normal text. Avoid `text-muted` (#7a6f66, ≈ 4:1) for body-sized copy — reserve it for decorative/large text only.
- **Headings:** exactly one `<h1>` (hero). Sections use `<h2>`; card/step titles use `<h3>`. No skipped levels.
- **Focus:** every link/button keeps a visible `focus-visible` ring; never `outline-none` without a replacement. Accordion `<button>` gets `focus-visible:ring-2 focus-visible:ring-accent-electric`.
- **Accordion keyboard:** native `<button>` inside each row (Enter/Space work for free), `aria-expanded` toggled, `aria-controls` pointing to the panel id; panel has `role="region"` + `aria-labelledby`. Chevron is `aria-hidden`.
- **Urdu:** wrap each Urdu string in `<span lang="ur" dir="rtl">`; the full Urdu variant block also sets `dir="rtl"`. This lets screen readers switch language/voice.
- **Images/alt:** meaningful app screenshot → descriptive `alt`; purely decorative frames, ambience, icons beside a text label → `alt=""` (or `aria-hidden="true"`). Never leave a content image without alt.
- **SmartScreen note** must remain in the DOM and readable (not hidden, not tooltip-only) at all breakpoints.

## 6. Honest SmartScreen note (placement)

- Hero: directly beneath the CTA row; also echoed as FAQ item 6. Same wording as the copy doc, verbatim.
- Styling: `text-xs text-text-secondary` — visible but quiet. Do not use `text-muted`, ≤ 11px, or `opacity` below ~0.7. Keep it out of the primary CTA label.

## 7. FAQ accordion behaviour

- **Single-open** (accordion) — recommended. Opening a question closes any other open one; clicking the open one closes it. Keeps six long answers from overwhelming the page. Implement with `useState<string | null>` holding the one open id.
- **Open first by default? No.** Start all closed (`null`). A closed default keeps the section compact and avoids biasing one answer; the question text is self-explanatory. (The site's standalone `/faq` page uses multi-open with a `Set` — that is a different component; for this showcase use single-open.)
- Animate panel height with `AnimatePresence` + `motion` + `useReducedMotion` (consistent with the existing FAQ page), instant when reduced motion is active.

## 8. Assets & icons

- **No external CDNs.** Use existing local fonts (`--font-space-grotesk` heading, `--font-inter` body, both via next/font) and local `/images` assets only.
- Icons: reuse existing `lucide-react` icons for the `[icon]` slots, e.g. `Download` (bulk downloader), `SlidersHorizontal` / `Scissors` (Quick Edit Studio), `Workflow` / `GitBranch` (workflow builder), `ShieldCheck` (Facebook automation with safety), `ChevronDown` (FAQ), `Monitor` (Windows/CTA). Import from `lucide-react` as the rest of the site does. **No emoji, no new icon library.**

## 9. Implementation checklist

1. Create the showcase section/component in the appropriate `src/app` route; keep copy imported/verbatim from the copy doc.
2. Wrap all sections in `section-container`; apply the §1 section order and §2 grids/spacing.
3. Build hero 2-col → stacked, with `Reveal` sequence; add optional visual frame with `CoverAmbience` only.
4. Build About (`max-w-3xl`), Pillars (`Stagger`, 2×2), Steps (3-col), Safety band, FAQ, Final CTA, Urdu block — using §4 token classes.
5. Style **New** tags, Urdu spans (`lang="ur"`), and the SmartScreen micro-note exactly as specified.
6. Implement single-open FAQ with `<button>` + `aria-expanded` + `aria-controls`; native keyboard; instant under reduced motion.
7. Verify one `<h1>`, correct `<h2>`/`<h3>` order, focus rings on every control, alt text, and contrast per §5.
8. Check breakpoints (375 / 768 / 1024 / 1440), `lang="ur"` rendering, and that motion freezes under `prefers-reduced-motion` / `html.motion-off` with no new toggle.
9. Confirm CTA links match the copy doc exactly (`/download` hero secondary; v2.6.10 GitHub release final CTA). No invented claims, numbers, secrets, or emojis.
