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
| `YetaCursor` | stable | 1059:1339 | `className`; `YETA_CURSOR_HOTSPOT` | light / dark inks | Glyph only. Used solely inside Stageshow scenes (the kit's `yeta` cursor style, its default here) and the Why Yeta tour; the site never replaces the visitor's pointer. |
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
| `Label` | inspo | component.gallery | `as label·span·legend`, size `sm·md·lg`, `required`, `optional` | disabled | md = Input's label; asterisk aria-hidden, the control carries `required`. Also exports `FieldMessage`, `describedBy`, `useErrorShake`, `useFormReset`. |
| `Fieldset` | inspo | component.gallery | `legend`, `description`, `error`, variant `plain·card`, `hideLegend` | error, disabled (native) | `<fieldset>`/`<legend>`; description and error via aria-describedby, error under the legend. |
| `Form`, `FormRow`, `FormActions` | inspo | component.gallery | `errors` (summary), `density`, FormActions `align`, `note` | error summary | The summary takes focus after a failed submit; each link focuses its field. |
| `RadioGroup`, `Radio` | inspo | component.gallery | orientation, variant `default·card`, `description`, `icon` | checked, invalid, disabled | Native radios + `role=radiogroup`; arrows move and select. |
| `Select` | inspo | component.gallery | size `sm·md·lg`, `placeholder`, `options`/groups, `hint`, `error` | placeholder, error (shake), disabled | Native `<select>`; 16px on touch. |
| `SearchInput` | inspo | component.gallery | size, variant `field·glass`, `shortcut`, `onSearch`, `nested` | value + clear (Input clear with dissolve), disabled | `role=search`; Enter searches, Escape/× clear, ⌘K focuses. |
| `Slider` | inspo | component.gallery | `min/max/step`, `formatValue`, valueDisplay `inline·bubble·none`, `showMinMax` | hover, focus, drag, disabled | Native range; `aria-valuetext` from formatValue. |
| `Stepper` | inspo | component.gallery | `min/max/step/largeStep`, size, `formatValue` | limits, editing, error, disabled | APG spinbutton; buttons out of the Tab order; Number pop-in. |
| `Combobox` | inspo | component.gallery | `options` (description, disabled), `value/defaultValue/onChange`, `placeholder`, `hint`, `error`, `name`, `emptyMessage` | closed / open (Menu dropdown, flips up), active option, filtered + match mark, no results, invalid (shake), disabled | APG combobox list autocomplete: focus stays in the field, `aria-activedescendant`, ↓↑ Enter Esc, polite result count. |
| `DateInput` | inspo | component.gallery | `value/defaultValue/onChange(parts, iso)`, `min/max`, `required`, `error` + `errorSegments`, `autoComplete="bday"`, `order`, `messages` | empty, filled, checked on group blur (missing parts, real date, 4-digit year, range), per-segment invalid + shake, disabled | Fieldset + legend; locale order and segment names from Intl; numeric keypad; no auto-advance. |
| `Datepicker` | inspo | component.gallery | `value/defaultValue/onChange` (ISO), `min/max`, `isDateUnavailable`, `locale`, `weekStartsOn`, `labels` | typed date (locale format) + error, calendar open (Menu dropdown), today dot, selected, unavailable (struck), outside days, disabled | APG date picker dialog: grid with roving focus, arrows / Home End / PgUp PgDn (+Shift year), Enter picks and returns focus, Esc, Tab trapped, outside press closes. |
| `ColorPicker` | inspo | component.gallery | `swatches` (hex or token, default `BRAND_SWATCHES`), `value/onChange` (hex), `allowCustom`, `name` | checked swatch (ring + contrast check), custom colour, hex invalid, disabled | Swatches are a radiogroup (arrows move and pick); native colour input and a labelled hex field for any colour. |
| `File` | inspo | component.gallery | `name`, `size`, `type`, `status idle·uploading·success·error`, `progress`, `error`, `href` (download), `onRemove`, `as` | type icon, uploading (bar, determinate or not), success (Success check), error | Actions named after the file; `role="progressbar"`; full name in `title` when truncated. |
| `FileUpload` | inspo | component.gallery | `accept`, `maxSize`, `maxFiles`, `multiple`, `onUpload(file, report)`, `onChange`, `name` | idle, drag-over, listed files with progress / success / refused, limit error, disabled | Real file input behind a Button (labelled with the field label); drop handled natively; polite announcements; focus returns to the button after a remove. |
| `RichTextEditor` | inspo | component.gallery | `defaultValue` (HTML), `onChange(html)`, `placeholder`, `hint`, `error`, `disabled`, `name` | empty (placeholder), tools pressed by selection, link bar, invalid, disabled | `role="textbox"` multiline; APG toolbar (one tab stop, arrows / Home / End, `aria-pressed`); ⌘/Ctrl B·I·K; plain-text paste. |
| `Rating` | inspo | component.gallery | `readOnly`, `value/defaultValue/onChange`, `max`, `size sm·md·lg`, `showValue`, `count`, `label`, `error` | partial stars (tenths), empty, hover preview, checked, invalid, disabled | Read-only: `role="img"` "Rated x out of n". Interactive: native radios in a fieldset, →↓ add / ←↑ remove, 24px+ targets. |
| `Alert` | inspo | component.gallery | tone `neutral·info·success·warning·danger`; variant `inline·banner`; `title`, `action`, `icon`, `onDismiss`, `live` | dismissible, body only, static callout | role=alert (danger/warning) · role=status (rest) · none with `live="off"`; hue on the icon only; dismiss = ghost Button "Dismiss". |
| `Badge` | inspo | component.gallery | variant `label·dot·count`; tone; size `sm 16·md 20`; `count`, `max` (99+), `showZero` | — | Hue only on the dot; dot/count read their `label` (exact count). Not interactive; Chip stays for tags. |
| `Spinner` | inspo | component.gallery | size `sm·md·lg·xl` (icon scale); `label`, `showLabel` | spinning; still ring under reduced motion | With `label`: role=status + hidden text; without: aria-hidden. Inherits colour. |
| `Skeleton`, `SkeletonReveal` | inspo | component.gallery | shape `text·circle·rect`; `lines`, `size`, `width`, `ratio`; Reveal `loaded`, `skeleton`, `label` | pulse (loops), reveal cross-fade (Skeleton loader and reveal) | Bones aria-hidden; region aria-busy + polite label; content inert until revealed. |
| `ProgressBar` | inspo | component.gallery | `value`/`max` (none = indeterminate), `valueText`, `size sm·md·lg`, tone `neutral·success·warning·danger`, `hint` | determinate, indeterminate sweep (fade under reduced motion) | role=progressbar + aria-valuenow/min/max/valuetext; label is the name; hint via aria-describedby. |
| `ProgressIndicator` | inspo | component.gallery | `steps`, `current`, orientation `horizontal·vertical`, `statusLabels` | complete · current · upcoming · error | `<ol>` with `aria-current="step"`; each status spelled out (visually hidden). |
| `EmptyState` | inspo | component.gallery | `icon`/`illustration` on a neutral tile, `action`, `secondaryAction`, size `page·inline`, `headingLevel` | — | Heading level follows the outline; tile decorative. |
| `Popover` | inspo | component.gallery | `trigger`, `title`/`label`, side `bottom·top`, align `start·center·end`, `open`/`defaultOpen`/`onOpenChange`, `showClose` | open/close (Menu dropdown), flips to fit | Non-modal dialog on the Popover API (top layer); aria-expanded/controls/haspopup; focus in on open; Escape + close return focus; outside press / tab-out close. |
| `Breadcrumbs` | inspo | component.gallery | `items`, `separator chevron·slash`, `maxItems`/`itemsBeforeCollapse`/`itemsAfterCollapse`, `size sm·md` | ancestors hover, current page, collapsed (overflow menu), truncated | nav landmark + `ol`; separators aria-hidden; `aria-current="page"`; locale-aware Links. |
| `Navigation`, `NavGroup`, `NavItem` | inspo | component.gallery | `orientation vertical·horizontal`; item `icon`, `badge`/`badgeLabel`, `current`, `disabled` | hover, current (white nav pill; slides in horizontal), disabled | nav landmark; `aria-current` (page·location·step); groups labelled by their heading. |
| `Pagination` | inspo | component.gallery | `page`, `pageCount`, `onPageChange` or `getHref`, `siblingCount`, `boundaryCount`, `variant full·compact·auto` | current (white pill), ends (aria-disabled arrows), ellipsis, compact | nav landmark; "Page n" names; `aria-current="page"`; compact status is a polite live region. Not PaginationDots. |
| `Tabs`, `TabList`, `Tab`, `TabPanel` | inspo | component.gallery | `orientation`, `activation automatic·manual`, `size sm·md`, `fullWidth`; tab `icon`, `badge`, `disabled` | selected (Tabs sliding pill), focus, disabled | APG tabs: roving tabindex, arrows/Home/End, `aria-selected`/`aria-controls`; disabled tabs focusable, never selected. |
| `DropdownMenu`, `MenuItem`, `MenuGroup`, `MenuSeparator` | inspo | component.gallery | `trigger` (DS Button props), `align start·end`, `side bottom·top` (auto-flip); item `icon`, `shortcut`, `tone danger`, `disabled`, `href` | open/close (Menu dropdown, origin-aware), highlighted, destructive, disabled | APG menu button: `aria-haspopup="menu"`, arrows/Home/End/type-ahead, Escape returns focus, Tab and outside press close. |
| `Drawer` | inspo | component.gallery | `side right·bottom`, `title`, `description`, `footer` | open/close (Panel reveal), reduced motion | Built on Dialog: native `<dialog>`, focus trapped, Escape/backdrop close, focus returns to the opener. |
| `SkipLink` | inspo | component.gallery | `targetId`, `position fixed·absolute` | hidden → shown on keyboard focus | First tab stop; plain in-page anchor; translated default text. |
| `TreeView`, `TreeItem` | inspo | component.gallery | `selectable`, `selectedId`, `expanded`/`defaultExpanded`; item `icon`, `meta`, `disabled` | expanded (Card resize), selected (control pill), focus, disabled | APG tree: roving tabindex, ↑↓→←, Home/End, `*`, type-ahead, Enter/Space; nested `role="group"`. |
| `Card`, `CardMedia`, `CardHeader`, `CardBody`, `CardFooter` | inspo | component.gallery | variant `elevated·outlined·glass`; layout `stacked·row·responsive`; padding; radius; media `src/srcDark/aspect`; header `href/action/level` | lift on hover + focus ring only when linked | One primary link stretched over the card; other controls stay separate targets above it. |
| `Stack` | inspo | component.gallery | direction `vertical·horizontal·responsive`; gap (`--space-*`); align; justify; wrap; dividers; `as` | — | ul/ol keep `role="list"`; dividers add no elements. |
| `List`, `ListItem` | inspo | component.gallery | variant `unordered·ordered·description·rows`; marker `dot·dash·none`; tone; size; layout; framed; start; empty; item `term·icon·leading/title/meta/trailing/href` | row hover/focus when linked; empty | `role="list"`; dl pairs; row link with a separate trailing action. |
| `Quote` | inspo | component.gallery | variant `block·pull`; size `sm·md·lg`; align; author/role/company/avatar; source; cite; tone | — | figure > blockquote + figcaption; `cite` only for a work's title; ✹ hidden from AT. |
| `Table` + parts | inspo | component.gallery | caption(Hidden); size `sm·md`; zebra; hover; stickyHeader; header `sort/onSort/numeric/scope`; cell `numeric`; body `empty/colSpan` | sorted, zebra, hover, selected, empty, overflow shadows | `aria-sort` on the sorted column only; sort is a button; scrolling region is focusable and labelled by the caption. |
| `Image` | inspo | component.gallery | `srcDark`; aspect; fit; frame; radius; caption; skeleton; fallbackLabel | loading (Skeleton reveal), loaded, error | `alt` required; failed load keeps the frame and reads the alt. |
| `Video` | inspo | component.gallery | src/sources; poster; title; tracks; autoPlay; loop; muted; aspect; radius; caption; labels | poster, playing (Icon swap), muted, captions on, waiting, error, full screen | Real buttons + range; K/Space M C F ←/→; autoplay muted, on screen only, off under reduced motion. |
| `ButtonGroup` | inspo | component.gallery | variant `attached·spaced`; orientation; size passthrough; toolbar | pressed toggles (`aria-pressed`) | `role="group"` or `toolbar` with roving tabindex, arrows + Home/End. |
| `VisuallyHidden` | inspo | component.gallery | `as`; focusable | shown on focus (glass pill) | Wraps `u-visually-hidden`; focusable variant for skip links. |

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
