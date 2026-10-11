# UI guidelines (Refresh v3)

These rules guide the v3 UI/UX refresh tracked in #91. They are a small, practical layer on top of TocasUI, not a new design system. Each page change lands in its own PR and follows these rules.

**Core principle:** keep the KageRyo personality, improve how information is presented; keep the engineering depth, lower the cost of reading it.

## What stays

- Vue 3 + TocasUI 5.7, the four main routes (`/`, `/about`, `/projects`, `/contact`) and optional `/projects/:slug` detail pages.
- zh-TW / en / ja, light / dark themes, the deliberate mixed-language copy (for example "A Student && Developer from Taiwan." next to Chinese text).
- Personal elements: the KageRyo illustration in the Home hero carousel, the greeting, the Quote, the two activity photos within that carousel, profile photos, and the shared career headline under every page title.
- Noto Sans TC, the TocasUI palette and the existing focus ring. No new fonts or animation libraries; the only added color is the KageRyo accent (see below).

## Choose the container by content type

Cards are for **choosing between things**. Everything else is laid out with typography, whitespace and hairline dividers.

| Content           | Pattern                                    | Why                                                                          |
| ----------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| Home hero         | Three-slide carousel + greeting box        | Pairs the illustration and real activity photos with the introduction        |
| Home card row     | Swipeable row of cards at the bottom       | The original home cards (KageRyo Developer + projects); visitors browse them |
| Education         | Horizontal entries, no border              | Only two short entries                                                       |
| Experience        | Full-width rows: period, role, highlights  | Longer text reads better at full width, without empty space on the right     |
| Expertise         | One tinted panel: area, description, chips | The only boxed block on About; follows the CV's areas of expertise           |
| Certificates      | Plain table, always shown                  | The owner wants the full list visible                                        |
| Projects overview | Cards with a picture and coverage links    | Visitors compare and choose projects; evidence sits on the card              |
| Project detail    | Article with side headings                 | Continuous reading; diagrams and evidence are the visual anchors             |
| Media / coverage  | Thumbnail + source + headline rows         | Like a news list, only when real coverage exists                             |

A bordered `ts-box` is appropriate when the block is one choosable item among peers, or a self-contained widget (modal, form, table). It is **not** appropriate to wrap a paragraph, a timeline entry, or a whole page section.

## Layout

- **Container:** TocasUI `ts-container` (unchanged). Page banners and the content below share one left edge: banners only add vertical padding, and containers are never nested.
- **Sections:** `.editorial-section` (in `assets/css/style.css`) gives each page section `3rem` vertical padding (`2rem` below 768px) and separates consecutive sections with a 1px `--ts-gray-300` rule.
- **Reading width:** prose and long lists use `.reading-width` (max `44rem`, about 45 CJK or 75 Latin characters per line).
- **Side headings:** on project detail pages, a section's kicker and `h2` sit in a narrow left column (about 30%) with the content on the right at 768px and up; they stack below 768px.
- **Experience rows (About):** period, role and organization, then highlights in three columns at 1024px and up; two columns on tablets; one on mobile.
- **Home hero:** at 1200px and up the 16:9 carousel and contact links sit on the left of the introduction, with the visual group vertically centered; from 768px to 1199.98px the introduction comes first, then the carousel and contact links, while the greeting and details form two columns inside the introduction box; below 768px the introduction and its contents stack before the carousel.
- **Spacing:** multiples of `0.25rem`; in practice `0.5 / 1 / 1.5 / 2 / 3rem`. Inside a section, related items are `1–1.5rem` apart; sections are `3rem` apart.
- **Breakpoints:** TocasUI's (`mobile` < 768px, `tablet` 768–1023px, `desktop` ≥ 1024px) still apply across the site; the Home hero separately changes its two-column layout at 1200px. Every page must fit a 390px viewport without horizontal scrolling.

## Typography

| Role                               | Implementation                                      |
| ---------------------------------- | --------------------------------------------------- |
| Page title (banner)                | `h1.ts-header.is-huge.is-heavy` (30px), unchanged   |
| Section kicker (project details)   | `SectionKicker` component, see below                |
| Section heading                    | `h2.ts-header.is-big.is-heavy` (24px)               |
| Entry title                        | `h3.ts-header.is-heavy` (17px)                      |
| Meta (dates, organisation, status) | `ts-text is-description`, tabular figures for dates |
| Body                               | 15px TocasUI base, line-height 1.75                 |

The section kicker is a small label above a section heading, such as `02 / Problem`: 0.8rem, uppercase, `0.12em` tracking, `--ts-gray-600`, with the number in the KageRyo accent. It is always English, like the shared headline, and `aria-hidden` because the `h2` carries the meaning.

Headings stay sequential (`h1` → `h2` → `h3`). Numbered kickers are only used where the sections really are a sequence: the project detail story (contributions → problem → … → outcomes). About and Home use plain `h2` headings; numbering sections that are not a sequence reads as template chrome. A heading may be visually hidden (`.visually-hidden`) when the content explains itself, as for the Home card row, but it stays in the document for screen readers.

## Content sources

- About, Home and Projects copy follows the owner's Chinese CV, with the 104 resume as a secondary source. The English autobiography on About is the CV's own English text.
- Never publish contact details, addresses, referees or transcripts from those documents.
- Related links (news coverage, program pages, papers, repositories) come from the CV and keep their original source name and headline, marked with `lang`.

## Images, diagrams and media

- Only real, public-safe assets with a known source and permission. Never mock screenshots or invent coverage.
- Always declare `width` / `height`; serve right-sized WebP; `loading="lazy"` below the fold; meaningful `alt`, and a visible caption with source or credit when the image is evidence.
- Recommended ratios: the Home carousel uses a fixed 16:9 image frame for all three slides; screenshots retain their native ratio (16:10 or 16:9). The two event photos are cropped within the carousel frame, with their descriptions and source links overlaid inside the image.
- Diagrams are built in HTML/CSS when they are simple flows, so they translate, adapt to dark mode and stay readable by screen readers. Cite the source (for example the pull request) in the caption.
- Missing media renders nothing on project detail pages — no placeholders, no empty sections.
- **Home card row:** the cards keep the original home card style: a 16:9 picture on top, a centered title, a short paragraph and round icon links. The first card is KageRyo Developer, followed by the projects listed in `homeCards` (`src/config/featuredProjects.js`). Project pictures are owner-provided public images, cropped to 16:9 and served as 800×450 WebP without metadata; a project without one shows the KageRyo cover (the illustration's black background, a striped circle and a neon-green ring with a project icon, `aria-hidden`).
- The row scrolls sideways (touch, trackpad, or the previous / next buttons, which disable at either end), snaps to cards and shows part of the next card as a hint: about 3¼ cards on desktop, 2¼ on tablets and 1¼ on mobile. It never auto-rotates.
- Card text in narrow columns is left-aligned, not justified, so long identifiers don't stretch the lines.

## Links, buttons and states

- One filled (primary) button per block; the rest are outlined. On Home the primary action is **View Projects**.
- Inline links keep the underline; external links use `is-external-link` and open in a new tab with `rel="noopener noreferrer"`.
- Evidence links (PRs, issues, publications) show their status as text, never by color alone.
- The global focus ring (3px `#005fcc`, 3px offset) applies to every interactive element, including TocasUI buttons; don't remove it. Non-interactive regions focused by script (the main region after navigation) don't draw it.
- Avoid template tells: no `→` appended to link text.

## Color and theming

- Use TocasUI tokens (`--ts-gray-*`, `--ts-link-700`, `ts-content is-tertiary`), which already switch through `light-dark()`, plus the KageRyo accent. No raw hex values in components, except the fixed colors of the KageRyo cover, which copy the illustration.
- **KageRyo accent:** `--kageryo-green` (`#b0ff30`, the illustration's neon green) for dark surfaces such as the top bar and the project covers, and `--kageryo-accent`, which is `#457000` on light backgrounds (about 5.9:1 on white) and the illustration green in dark mode. Spend it in a few places only: the active navigation tab, the project covers and the kicker numbers.
- Text contrast is at least 4.5:1 in both themes: `--ts-gray-600` on the page background is about 7:1 in light mode, and `--ts-gray-500` / `--ts-gray-600` are 8:1 or more in dark mode.
- Dividers use `--ts-gray-300`, which is visible in both themes.

## Motion

The Home hero carousel advances every 5 seconds and offers previous / next, slide dots, and play / pause controls. Its timer stops while the pointer hovers over it, focus is within it, or the page is hidden; reduced-motion preference pauses playback by default. The separate Home card row scrolls only when the visitor swipes or uses its previous / next buttons. Other hover and focus changes may transition color only; the global `prefers-reduced-motion` rule stays in place.

## Wireframes

### Home — desktop (≥ 1200px)

```text
┌ banner ─────────────────────────────────────────────────────────┐
│ Chien-Hsun Chang                                                │
│ Backend / Platform Engineer | AI Systems / MLOps                │
│ ┌ carousel: 16:9 ───────────────────┐  ┌ introduction ───────┐ │
│ │ 1 KageRyo illustration           │  │ Hello / I'm …       │ │
│ │ 2 Ministry of Education photo    │  │ 張健勳              │ │
│ │ 3 COSCUP photo                   │  │ intro · status      │ │
│ │ activity caption + source inside │  │ [View Projects]     │ │
│ └───────────────────────────────────┘  │ [Download Resume]   │ │
│ [play/pause] [‹] [1] [2] [3] [›]       └──────────────────────┘ │
│ (Discord) (GitHub) (LinkedIn)  email                             │
└─────────────────────────────────────────────────────────────────┘
 Quote
 (visually hidden h2)
 ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──
 │ [photo]  │ │ [image]  │ │ [image]  │ │ [ima
 │ KageRyo  │ │  KServe  │ │ TAG-Twin │ │ Feder
 │Developer │ │ text …   │ │ text …   │ │ text
 │ text …   │ │ (○)(○)(○)│ │   (○)    │ │   (○
 │(○)(○)(○)(○)└──────────┘ └──────────┘ └──
 └──────────┘                      [‹] [›] manual scroll
```

From 768px to 1199.98px, the introduction comes first, with greeting and details in two columns inside its box; the carousel and contact links follow. Below 768px, the introduction contents stack, followed by the carousel and contact links; the card row shows one card and part of the next. The carousel changes slides automatically under the conditions in Motion; the card row never auto-rotates.

### About — desktop (≥ 1024px)

```text
┌ banner ─────────────────────────────────────────────────────────┐
│ Chien-Hsun Chang                                                │
│ Backend / Platform Engineer | AI Systems / MLOps                │
└─────────────────────────────────────────────────────────────────┘
 ┌─────────────┐  Chien-Hsun Chang 張健勳
 │   photo     │  A Student && Developer from Taiwan.
 │             │  (cap icon) Education — CCU M.S. student
 └─────────────┘  Summary paragraph (reading width) · motto
                  [Download Resume (PDF)] [GitHub]
                  Gender · Age (secondary line)
 ─────────────────────────────────────────────────────────────────
 Education
 2025/08 ~ 2027/08              2021/09 ~ 2025/06
 National Chung Cheng Univ.     National Taichung Univ. of S&T
 M.S. in CSIE                   B.Eng. in Intelligent Production
 ─────────────────────────────────────────────────────────────────
 Work Experience
 2025/08 ~ Present  Research Assistant /   • highlight
                    Project Lead           • highlight
                    National Chung Cheng   • highlight
 ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
 2025/08 ~ Present  System Administrator   • highlight
 ─────────────────────────────────────────────────────────────────
 Skills
 ░ Languages       [Python] [Go] [Rust] …                        ░
 ░ Backend & Data  [FastAPI] …                                   ░
 ─────────────────────────────────────────────────────────────────
 Certificates (table, always shown)
```

### About — mobile (390px)

```text
 Chien-Hsun Chang
 Backend / Platform Engineer | …
 [ photo, full width ]
 Chien-Hsun Chang 張健勳
 … summary …
 [Download Resume (PDF)]
 [GitHub]
 ───────────────
 Education
 2025/08 ~ 2027/08
 National Chung Cheng University
 M.S. in CSIE
 2021/09 ~ 2025/06
 …
 ───────────────
 Work Experience
 2025/08 ~ Present
 Research Assistant / Project Lead
 National Chung Cheng University
 • highlight …
 ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
 …
```

### Project detail (KServe) — desktop

```text
┌ banner ─────────────────────────────────────────────────────────┐
│ Open Source                                                     │
│ Contributing to KServe (CNCF)                                   │
│ One-paragraph lede: what the project is and what I changed.     │
│ Open Source Contributor · Sep 2025 – Present                    │
│ [Python] [Go] [Kubernetes] [CRD] [Helm]                         │
└─────────────────────────────────────────────────────────────────┘
 01 / CONTRIBUTIONS  │ ✓ Merged  Logging configuration fix
 Contributions at a  │           kserve#4687 · kserve#3919
 Glance              │ ○ Open    runtimeClassName support
                     │           kserve#5198 · kserve#5057
 ─────────────────────────────────────────────────────────────────
 02 / PROBLEM        │ Problem & Goal paragraphs / list
 Problem & Goal      │
 ─────────────────────────────────────────────────────────────────
 03 / ROLE           │ …
 ─────────────────────────────────────────────────────────────────
 04 / ARCHITECTURE   │ ┌ diagram: where each change takes effect ┐
 Architecture        │ │ configure_logging() → hasHandlers() → … │
                     │ └ caption: drawn from kserve#4687, #5198 ─┘
                     │ • details …
 ─────────────────────────────────────────────────────────────────
 05 / TRADE-OFFS  ·  06 / OUTCOMES  ·  07 / MEDIA (only if any)
 ← Back to Projects
```

### Project detail — mobile (390px)

```text
 Open Source
 Contributing to KServe (CNCF)
 Lede paragraph …
 Role · Period
 [Python] [Go] …
 01 / CONTRIBUTIONS
 Contributions at a Glance
 ✓ Merged
 Logging configuration fix
 kserve#4687 · kserve#3919
 ───────────────
 02 / PROBLEM
 Problem & Goal
 …
 04 / ARCHITECTURE
 [diagram steps stack vertically ↓]
```

## Review checklist for each v3 PR

- [ ] Containers follow the table above; no new boxes around prose or timeline rows.
- [ ] zh-TW, en and ja render without missing keys; mixed-language copy is intentional.
- [ ] Light and dark themes checked; contrast ≥ 4.5:1 for text.
- [ ] 1280px and 390px checked; no horizontal scrolling.
- [ ] Keyboard order follows the visual order; focus ring visible.
- [ ] Images have dimensions, alt text, lazy loading below the fold and a real source.
- [ ] No invented achievements, metrics, endorsements or coverage.
