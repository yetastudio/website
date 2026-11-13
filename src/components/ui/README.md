# Yeta Studio design system

Live docs: **`/design-system`** (every token, component and state on a light and a dark canvas),
**`/brand`** (brand guidelines with do's & don'ts) and **`/inspo`** (not indexed: narrative proposals for the
landing and case study, with live mockups and their Mobbin references). Registry: [`/registry.json`](../../../registry.json).
Source of truth: Figma `aVpNRSY3dqDxB5gdErv2xw` — pages *Branding*, *Design System*, *Landing Page (Final Design)*.

## Foundations

| Layer | File | Rule |
|---|---|---|
| Primitive | `src/styles/tokens.css` (`--palette-*`) | Raw Figma values. Only semantic tokens read them. |
| Semantic | `src/styles/tokens.css` (`--color-*`, `--space-*`, `--radius-*`, `--text-*`, `--shadow-*`, `--duration-*`, `--ease-*`) | Components and pages read only these. |
| Utilities | `src/app/globals.css` | `.u-bevel` (Figma stroke + inner bevel), `.u-outline` (group stroke), `.u-only-light/-dark`, `.u-visually-hidden`, `.u-break-md`. |

**Theming.** Colour roles use `light-dark()`, so they follow `color-scheme`. `<html>` follows the OS unless
`data-theme="light|dark"` pins it (ThemeSwitch, persisted in `localStorage`, applied before paint). Any
subtree can flip with `.scheme-inverse` (footer band, gradient tiles) or pin with `.scheme-light/.scheme-dark`
plus `data-scheme` (showcase panels). Theme-specific raster/vector art uses `.u-only-light/.u-only-dark`.

**Motion.** Interaction motion comes from [transitions.dev](https://transitions.dev) snippets, copied
verbatim into `vendor/transitions-dev/transitions.css` inside `@layer transitions` (so component CSS always
wins on geometry and colour), with their tunables in `tokens.css`: Modal and Panel reveal (Dialog), Tabs
sliding (SegmentedControl, header nav underline), Tooltip, Texts reveal (Reveal: hero and section headers),
Card resize (Accordion), Icon swap (ThemeSwitch cycle) and Error state shake (Input/Textarea). Every snippet keeps its
`prefers-reduced-motion` guard.

**Product scenes (Stageshow).** Faux product UI comes from the Stageshow kit vendored in `vendor/stageshow`
(MIT). Its default theme here is `yeta` (`vendor/stageshow/yeta.css`, registered in `looks.ts`): every `--ss-*`
token reads a semantic token above, so a scene follows whatever scheme it sits in (page theme, a
`.scheme-inverse` gradient tile, a pinned showcase panel) with no prop. It also gives the classic arrow cursor
(black outline, white body), brand-hue avatars, the bevel on controls, inverse ink on filled marks and the
brand's dark for terminals. A scene only sets what is its own: geometry, and its accent (`--ss-accent`, e.g. the
tile's hue). `yeta.css` is a `tokenSources` entry of the DS check, so `--ss-*` reads are parity-checked.

**Checks.** `npm run check:ds` (raw values, palette use, overrides, traps; allowlist only shrinks) and
`npm run typecheck`.

## Components

Status: **stable** = drawn in Figma; **inspo** = added to fill a gap, same visual language.

| Component | Status | Figma | Variants · key props | States | Accessibility |
|---|---|---|---|---|---|
| `Text`, `Heading`, `Accent` | stable | type styles | size `2xs…5xl, display`; weight; tone `default·strong·subtle·faint·inverse·danger·display`; family `sans·serif`; `Accent` italic/upright/underline | — | Heading `level` is independent of `size`. |
| `Icon` | stable | 27 icon sets | `name` (brand glyphs + extra + supplemental Lucide), size `sm 14·md 18·lg 20·xl 24` | — | Decorative unless `label` is given (`role="img"`). |
| `Button` | stable | 170:199 | size `sm 30·md 34·lg 36·xl 48·2xl 60`; variant `solid·glass·ghost`; radius `default 5·rounded 12`; `iconStart/iconEnd/icon`, `iconNode` (custom icon-only content); `href` | rest, hover, pressed (scale .98), focus ring, `disabled`, `loading` (label kept, spinner on top, `aria-busy`) | Disabled/loading use `aria-disabled` so focus stays. Icon-only needs `label`. External links open in a new tab. |
| `Chip` | stable | 576:399 | size `xs (Small)·sm (×1.2 eyebrow)·lg (Large)·xl (×1.40625 feature)`; fill `tint·solid`; `icon` + `tone` | hover when `as="button"/"a"` | Static by default. |
| `Surface` | stable | card shells | tone `canvas·raised·glass·tint·none`; radius; padding; `bevel` | — | — |
| `BrandMark`, `LogoMark`, `MessyBrandMark` | stable | 110:77 · 110:60 · 110:84 | `canvas auto·inverse·light·dark`; `fill filled·transparent`; `size` (px or CSS length) | — | `alt` defaults to "Yeta Studio"; pass `""` when decorative. `inverse` swaps the artwork inside `.scheme-inverse` bands. |
| `Wordmark` | stable | hero lockup | `canvas`, `alt`; sized by `font-size` | — | "Yeta [logo mark] Studio" as the hero draws it. Use it wherever the name is a logo, never a typed "Yeta ✹ Studio". |
| `Cursor` | stable | 1059:1339 | — | hides over interactive elements | Mounted only on fine pointers; native cursor shows on controls. |
| `SectionHeader` | stable | section title frames | `title`, `eyebrow`, children (lead) | — | Renders the section `h2`; pass `titleId` for `aria-labelledby`. |
| `GradientTile` | stable | tile ellipses | `hue` ×6; `shape craft·craft-wide·process·testimonial·testimonial-compact`; `intensity soft·strong`; `underlay`/children | — | Blobs are `aria-hidden`. Inverse surface. |
| `CraftCard` | stable | 1472:4250 | `layout row·stacked·responsive` | — | `article` + heading level prop. |
| `ProcessCard` | stable | 1204:1323 | `step` (announced "Step n:") | — | — |
| `TestimonialCard` | stable | 1213:1430 | `size desktop·mobile` | — | `figure` / `blockquote` / `figcaption`. |
| `ProjectCard`, `CaseStudy`, `CaseStudyDialog` | stable | 987:1594 | `size desktop·mobile`; `onOpen` → render ONE `CaseStudyDialog` per gallery, outside breakpoint-hidden containers and card stacks; `project.slug` adds a "View full case study" footer link to `/work/[slug]`; `CaseStudy showSections={false}` drops the About/Challenge/Result rows (detail page sheet); `Shot` renders one light/dark screen | image strip dots, dialog open | "See more" has `aria-haspopup="dialog"`; the dialog can never end up inside a hidden or `inert` subtree. |
| `SummaryCard` | stable | 786:762 / 786:805 | — | Idle; Active on hover or focus-within | Focusable so keyboard users see the Active state. |
| `Carousel` | stable | mobile tracks | `gap sm·md`, `showDots` | position via dots | Native scroll + snap; `aria-roledescription="carousel"`; dots are buttons. |
| `CardStack` | stable | 1231:1787 · 1010:2036 | `variant fan·deck`, `initialIndex` | swipe, arrows, dots | Back cards are `inert`; position announced politely. |
| `SegmentedControl` | inspo | — | options with icons, `size sm·md` | selected (Tabs sliding pill) | `radiogroup`; arrow keys move and select. |
| `ThemeSwitch` | inspo | header (cycle) | `variant segmented·cycle`, `withLabels`, `size`, `buttonVariant` | system · light · dark; cycle: one button, Icon swap | Labels are translated; the cycle button's name says the current mode and the next one. |
| `LocaleSwitch` | inspo | — | — | en · es · pt | Visible "EN", accessible "English". |
| `Link` | inspo | footer / CTAs | `variant inline·nav·bullet` | hover underline | External links announce "opens in a new tab". |
| `Divider` | inspo | footer rules | `orientation`, `semantic` | — | Decorative unless `semantic`. |
| `Avatar`, `AvatarGroup` | inspo | testimonial author | `size sm·md·lg`, `max` | image / initials | `alt` = name. |
| `PaginationDots` | inspo | — | `onSelect` makes dots buttons, `autoplay` fills the active dot | current, filling (paused) | `aria-current`, "Go to {item} n". |
| `Tooltip` | inspo | — | `side top·bottom` | hover (80ms delay, fade + scale in, instant out), focus | `role="tooltip"` + `aria-describedby`; never the only label; not on touch. |
| `Accordion`, `AccordionItem` | inspo | case-study Show rows | `defaultOpen` | open / closed (Card resize) | Button with `aria-expanded` / `aria-controls`; region labelled by its trigger. |
| `Dialog` | inspo | — | `placement center·right·bottom`, `size`, `footer` | Modal (center) or Panel reveal (sheets), shorter close, reduced motion | Native `<dialog>`: focus trapped, Escape and backdrop close, focus returns to opener, page scroll paused. |
| `ProcessScene` | inspo | Process Card tile (342×160) | `step` discover·define·design·develop·integrate·launch; copy from `ourProcess.scenes.<step>`; pass as `ProcessCard scene` | poster on server and under reduced motion; loops only while on screen | Stageshow kit (`vendor/stageshow`). Decorative: `aria-hidden`, nothing focusable, no pointer events. |
| `Reveal`, `revealLine` | inspo | hero, section headers | `trigger view·mount`, `as` | hidden → shown (once) | Texts reveal; lines visible without JS (`<noscript>`) and without motion under reduced motion. |
| `ToastProvider`, `useToast` | inspo | — | tone `neutral·success·danger` | auto-dismiss 4s, pauses on hover/focus | Polite live region; dismiss button. |
| `Input`, `Textarea` | inspo | — | `hint`, `error`, `optional` | rest, hover, focus, invalid (shake on a new error), disabled | Labelled; `aria-invalid` + `aria-describedby`; no error shown on disabled. |
| `Checkbox`, `Switch` | inspo | — | `description` | checked, focus, disabled | Real `<input type="checkbox">` (`role="switch"` for Switch). |
| `WhyScene` | inspo | Why Yeta feature chips (288×148) | `scene` insight·together·luck·defy·pixel·vision·goals; `playing` plays the story once and holds it; copy from `whyYeta.tour.<scene>`; transparent, the host draws the surface | poster on server, while not playing and under reduced motion; plays only while on screen | Stageshow kit (`vendor/stageshow`). Decorative: `aria-hidden`, nothing focusable, no pointer events. Toured on the landing by `layout/why-yeta/tour`. |

## Fidelity to Figma

The landing follows the Figma frames literally, including their per-theme and per-breakpoint quirks:
header in flow on desktop and fixed on phones; CTA instances at radius 16; the hero padded 22/40;
the light desktop craft board's hue order (pink, yellow, green, blue, violet, orange) while light
mobile keeps the dark order; the light mobile "Why Yeta" opening line ("We craft pixel-perfect
websites…"); the longer mobile quote for Jorge R.; the same case-study card three times; Figma's
leading trim (`text-box: trim-both cap alphabetic`) on lead copy, slogan and calls to action.

Section-by-section comparison against native renders of the Figma frames (1920 and 390, dark and
light), aligned within ±80px: mean absolute RGB difference 1.7–4.9 / 255 on desktop
(≤ 4.8% of pixels differ by more than 32) and 6.2–16.5 on mobile (≤ 13.7%), with section heights
within ±14px on desktop and +0…+33px on mobile. The mobile footer starts ~600px earlier than in
Figma because the Figma frame leaves an empty 652px gap above it.

**Browser support.** Inverse subtrees need `light-dark()` to stay native, so `package.json`
pins `browserslist` to Chrome/Edge 123, Firefox 120 and Safari/iOS 17.5. With Next 16's default
targets, Lightning CSS lowers `light-dark()` into values resolved once on `:root`, and the
footer band and gradient tiles stop inverting.

Inspo additions do not change the drawn layout: carousel dots and card-stack controls sit in the
gaps Figma already leaves; the footer's theme/language switches float in the bottom bar (phones get
them in the menu sheet).

## Decisions recorded during the build

- One icon per button. When a CTA has an icon chosen for its purpose (calendar, leaf), it keeps that leading icon and drops the generic trailing arrow; a generic arrow alone is fine when nothing more specific fits. The size specimens on `/design-system` still show both icon slots of the Figma Button.
- The header is fixed at every width (the user's call; Figma draws it in flow on desktop). A single theme button that cycles System → Light → Dark sits beside the brand mark, so both sides of the centred nav pill weigh about the same and longer locales never crowd it. The full theme and language switches stay in the footer and the menu sheet.
- Light-theme icon accents (`#c93a05`, `#a46f04`, `#088d40`, `#007cff`, `#c8110d`) are used by the Figma landing but are not Figma variables: added as `--palette-*-700`.
- Funnel Display SemiBold (600), used by Figma for the hero wordmark and craft subtitles, ships as `public/fonts/FunnelDisplay-SemiBold.woff2` (latin subset from `@fontsource/funnel-display`, OFL-1.1).
- Footer social links have no URLs in Figma: they render as text until `SOCIALS[].href` is filled in `src/components/layout/sections.ts`.
- Figma's mobile frame leaves 652px of empty canvas above the footer; the code keeps the 48px section rhythm instead (a canvas artefact, not a layout).
- `app/[locale]/not-found.tsx` must not import design-system components that carry a CSS module: in Next 15.3 dev (Turbopack) any CSS module shared with the page moves into the not-found chunk and the landing renders unstyled. The 404 uses its own module + tokens.
- Between 390 and 1920 (not drawn): floating "Why Yeta" chips appear from 1440 (scaled 0.7–1), a wrapped chip row from 768, the mobile chip card below.
