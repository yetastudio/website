'use client';

/*
 * Design system gallery · Layout & content.
 * Components from component.gallery that the site's library was missing, one ShowcaseSection each.
 * NAV feeds the showcase's side navigation; ids must match each ShowcaseSection id.
 */

//! React Core
import { useState, type ReactNode } from 'react';

//! Components
import { Cell, ShowcaseSection, SpecTable, Specimen, ThemePair } from '@/components/showcase';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardBody, CardFooter, CardHeader, CardMedia } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Link } from '@/components/ui/link';
import { List, ListItem } from '@/components/ui/list';
import { Quote } from '@/components/ui/quote';
import { Stack } from '@/components/ui/stack';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, type TableSort } from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { Video } from '@/components/ui/video';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

//! Styles
import styles from './content.module.css';

const GROUP = 'Gallery · Layout & content';

export const NAV: Array<{ id: string; label: string; group: string }> = [
	{ id: 'card', label: 'Card', group: GROUP },
	{ id: 'stack', label: 'Stack', group: GROUP },
	{ id: 'list', label: 'List', group: GROUP },
	{ id: 'quote', label: 'Quote', group: GROUP },
	{ id: 'table', label: 'Table', group: GROUP },
	{ id: 'image', label: 'Image', group: GROUP },
	{ id: 'video', label: 'Video', group: GROUP },
	{ id: 'button-group', label: 'Button group', group: GROUP },
	{ id: 'visually-hidden', label: 'Visually hidden', group: GROUP },
];

/** "Use it for / Don't use it for", one line each. */
function Usage({ use, avoid }: { use: ReactNode; avoid: ReactNode }) {
	return (
		<div className={styles.usage}>
			<Text size="sm" tone="subtle">
				<strong>Use it for</strong> {use}
			</Text>
			<Text size="sm" tone="subtle">
				<strong>Don’t use it for</strong> {avoid}
			</Text>
		</div>
	);
}

const SHOT = {
	one: { light: '/landing/our-work/project-shot-1-light.png', dark: '/landing/our-work/project-shot-1-dark.png' },
	two: { light: '/landing/our-work/project-shot-2-light.png', dark: '/landing/our-work/project-shot-2-dark.png' },
	three: { light: '/landing/our-work/project-shot-3-light.png', dark: '/landing/our-work/project-shot-3-dark.png' },
};
const AVATAR = {
	lisette: '/landing/testimonials/avatar-lisette-t.jpg',
	jorge: '/landing/testimonials/avatar-jorge-r.jpg',
	marcelo: '/landing/testimonials/avatar-marcelo-z.png',
};
const LONG_TITLE = 'A rebrand, a design system and a marketing site shipped together in eleven weeks for a fintech in three markets';

/* ───────────────────────── Card ───────────────────────── */

/** A full-width cell: the specimen above its label (Cell centres and shrinks its content). */
function Labelled({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className={styles.labelled}>
			{children}
			<Text as="span" size="2xs" tone="faint">
				{label}
			</Text>
		</div>
	);
}

function CardSection() {
	return (
		<ShowcaseSection
			id="card"
			eyebrow={GROUP}
			title="Card"
			description="One entity on a Surface: elevated (raised + bevel), outlined (grouping stroke) or glass. Media sits inset with a nested radius, on top or beside the text. The title's link covers the whole card; other controls keep their own targets above it."
		>
			<Usage use="a project, article or person shown among siblings in a grid or a row." avoid="page sections or a single block of copy (use Surface), or several unrelated actions on one tile." />
			<Specimen title="Variants" note="Elevated is the default. Hover lifts only the linked cards; the outlined card has no link, so it stays still.">
				<ThemePair layout="column" align="start">
					<div className={styles.cardGrid}>
						<Card>
							<CardMedia src={SHOT.one.light} srcDark={SHOT.one.dark} sizes="(min-width: 1024px) 20vw, 90vw" />
							<CardHeader eyebrow="Case study" title="Lumen rebrand" href="#card" />
							<CardBody>Identity, design system and a marketing site for a fintech in three markets.</CardBody>
							<CardFooter>
								<Chip size="xs">Fintech</Chip>
								<Text as="span" size="xs" tone="faint">
									2025
								</Text>
							</CardFooter>
						</Card>
						<Card variant="outlined">
							<CardHeader eyebrow="Service" title="Design systems" />
							<CardBody>Tokens, components and docs your team keeps using after we leave.</CardBody>
							<CardFooter>
								<Text as="span" size="xs" tone="faint">
									6 to 10 weeks
								</Text>
							</CardFooter>
						</Card>
						<Card variant="glass">
							<CardMedia src={SHOT.two.light} srcDark={SHOT.two.dark} aspect="3/2" sizes="(min-width: 1024px) 20vw, 90vw" />
							<CardHeader eyebrow="Journal" title="How we name tokens" href="#card" />
							<CardBody>Semantic roles first, palette second, and why light-dark() made it simple.</CardBody>
						</Card>
					</div>
				</ThemePair>
			</Specimen>
			<Specimen title="Row layout, actions and states" note="Row puts the media beside the text (responsive: stacked on phones). The footer button and the title link are two separate tab stops; focus on the title rings the whole card.">
				<ThemePair layout="column" align="start">
					<Card layout="responsive" className={styles.fill}>
						<CardMedia src={SHOT.three.light} srcDark={SHOT.three.dark} sizes="(min-width: 1024px) 20vw, 90vw" />
						<CardHeader eyebrow="Case study" title="Orbit dashboard" href="#card" action={<Button variant="ghost" size="sm" icon="copy" label="Copy link to Orbit dashboard" />} />
						<CardBody>Analytics for logistics teams: from a spreadsheet export to a live board in one quarter.</CardBody>
						<CardFooter>
							<Text as="span" size="xs" tone="faint">
								Logistics · 2024
							</Text>
							<Button size="sm" iconStart="calendar">
								Book a walkthrough
							</Button>
						</CardFooter>
					</Card>
					<div className={styles.cardGrid}>
						<Labelled label="long content">
							<Card padding="lg">
								<CardHeader eyebrow="Case study · Fintech · Three markets" title={LONG_TITLE} href="#card" />
								<CardBody>
									The brief asked for one identity that could hold three regulators, two languages and a product that changed weekly. We built the
									tokens first, so every screen after that was a composition.
								</CardBody>
							</Card>
						</Labelled>
						<Labelled label="minimal (title + one line)">
							<Card variant="outlined">
								<CardHeader title="Untitled draft" />
								<CardBody>Nothing here yet.</CardBody>
							</Card>
						</Labelled>
						<Labelled label="padding sm · radius lg">
							<Card padding="sm" radius="lg">
								<CardMedia src={SHOT.one.light} srcDark={SHOT.one.dark} aspect="21/9" sizes="(min-width: 1024px) 20vw, 90vw" />
								<CardHeader title="Compact" level={4} />
							</Card>
						</Labelled>
					</div>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Part · prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">Card variant</code>, 'elevated | outlined | glass', 'elevated', 'Surface raised + bevel · no fill + grouping stroke · glass'],
					[<code key="b">Card layout</code>, 'stacked | row | responsive', 'stacked', 'responsive = stacked below 768px'],
					[<code key="c">Card padding · radius</code>, 'sm | md | lg · lg | xl | 2xl', 'md · xl', 'Media radius = card radius − padding'],
					[<code key="d">CardMedia</code>, 'src, srcDark, alt, aspect, children', "alt ''", 'Light/dark pair like the brand marks; children fill the frame'],
					[<code key="e">CardHeader</code>, 'title, eyebrow, level, href, action', 'level 3', 'href = the one primary link; action stays clickable'],
					[<code key="f">CardBody · CardFooter</code>, 'div', '—', 'Footer pins to the bottom in equal-height grids'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── Stack ───────────────────────── */

function Box({ children, wide }: { children: ReactNode; wide?: boolean }) {
	return <div className={wide ? styles.boxWide : styles.box}>{children}</div>;
}

function StackSection() {
	return (
		<ShowcaseSection
			id="stack"
			eyebrow={GROUP}
			title="Stack"
			description="One direction, one gap from the --space-* scale. Align, justify and wrap like flexbox; dividers put a hairline between children with the gap on both sides. It never pads or paints."
		>
			<Usage use="vertical rhythm inside a card or form, and rows of controls." avoid="two-dimensional layouts (use CSS grid) or spacing that changes between children." />
			<Specimen title="Direction and gap" note="gap 4 · 16 · 32 read --space-4 / -16 / -32.">
				<ThemePair layout="column" align="start">
					<div className={styles.row}>
						{([4, 16, 32] as const).map((gap) => (
							<Cell key={gap} label={`vertical · gap ${gap}`}>
								<Stack gap={gap}>
									<Box>One</Box>
									<Box>Two</Box>
									<Box>Three</Box>
								</Stack>
							</Cell>
						))}
					</div>
					<Cell label="horizontal · gap 8 · wrap">
						<Stack direction="horizontal" gap={8} wrap>
							{['Branding', 'Design systems', 'Web', 'Product', 'Motion', 'Strategy'].map((label) => (
								<Chip key={label} size="lg">
									{label}
								</Chip>
							))}
						</Stack>
					</Cell>
				</ThemePair>
			</Specimen>
			<Specimen title="Align, justify and dividers" note="justify between spreads a toolbar; dividers work in both directions and keep ul/ol markup valid (no extra elements).">
				<ThemePair layout="column" align="start">
					<div className={styles.fill}>
						<Stack direction="horizontal" justify="between" align="center">
							<Text size="sm" weight="regular">
								3 selected
							</Text>
							<Stack direction="horizontal" gap={8}>
								<Button size="sm" variant="ghost">
									Clear
								</Button>
								<Button size="sm" iconStart="download">
									Export
								</Button>
							</Stack>
						</Stack>
					</div>
					<div className={styles.row}>
						<Cell label="vertical · dividers · as ul">
							<Stack as="ul" gap={12} dividers>
								<li>Discovery</li>
								<li>Design</li>
								<li>Development</li>
							</Stack>
						</Cell>
						<Cell label="horizontal · dividers">
							<Stack direction="horizontal" gap={12} dividers>
								<Text as="span" size="sm">
									2025
								</Text>
								<Text as="span" size="sm">
									Fintech
								</Text>
								<Text as="span" size="sm">
									11 weeks
								</Text>
							</Stack>
						</Cell>
						<Cell label="align center">
							<Stack gap={8} align="center">
								<Box wide>Wide child</Box>
								<Box>Short</Box>
							</Stack>
						</Cell>
					</div>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">direction</code>, 'vertical | horizontal | responsive', 'vertical', 'responsive = horizontal from 768px'],
					[<code key="b">gap</code>, '0 | 2 | 4 … 128', '16', 'A --space-* step'],
					[<code key="c">align · justify</code>, 'start | center | end | stretch | baseline · start | center | end | between', '—', 'Horizontal stacks centre by default'],
					[<code key="d">wrap · dividers</code>, 'boolean', 'false', 'Dividers draw on each child after the first'],
					[<code key="e">as</code>, 'ElementType', 'div', 'ul/ol get role="list"'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── List ───────────────────────── */

function ListSection() {
	return (
		<ShowcaseSection
			id="list"
			eyebrow={GROUP}
			title="List"
			description="Unordered, ordered, description and row lists. Markers are brand marks, not browser bullets: a dot or a dash in the faint ink (or one hue, kept to the marker) and numbers set 01, 02 in tabular figures like the process cards."
		>
			<Usage use="related items read in sequence: features, steps, facts, files." avoid="layout of unrelated blocks (use Stack) or tabular data with several columns (use Table)." />
			<Specimen title="Unordered and ordered" note={'role="list" keeps list semantics in Safari once the native marker is gone.'}>
				<ThemePair layout="grid" align="start">
					<Cell label="dot">
						<List>
							<ListItem>Discovery workshop</ListItem>
							<ListItem>Brand and product audit</ListItem>
							<ListItem>A roadmap you can share</ListItem>
						</List>
					</Cell>
					<Cell label="dash · sm">
						<List marker="dash" size="sm">
							<ListItem>Figma library</ListItem>
							<ListItem>Coded components</ListItem>
							<ListItem>Docs site</ListItem>
						</List>
					</Cell>
					<Cell label="tone violet">
						<List tone="violet">
							<ListItem>Tokens</ListItem>
							<ListItem>Components</ListItem>
							<ListItem>Patterns</ListItem>
						</List>
					</Cell>
					<Cell label="icon markers">
						<List size="sm">
							<ListItem icon="check">Weekly demos</ListItem>
							<ListItem icon="check">Shared Slack channel</ListItem>
							<ListItem icon="minus">Fixed-scope contracts</ListItem>
						</List>
					</Cell>
					<Cell label="ordered">
						<List variant="ordered">
							<ListItem>Discover</ListItem>
							<ListItem>Define</ListItem>
							<ListItem>Design</ListItem>
						</List>
					</Cell>
					<Cell label="ordered · start 9 · long">
						<List variant="ordered" start={9} size="sm" tone="orange">
							<ListItem>Integrate</ListItem>
							<ListItem>Launch, measure what changed against the baseline from the discovery workshop, and plan the next quarter with the team</ListItem>
						</List>
					</Cell>
				</ThemePair>
			</Specimen>
			<Specimen title="Description lists" note="inline is the case-study facts well (term beside value); stacked puts the term above.">
				<ThemePair align="start">
					<Cell label="inline · framed">
						<List variant="description" framed className={styles.listWidth}>
							<ListItem term="Client">Lumen</ListItem>
							<ListItem term="Year">2025</ListItem>
							<ListItem term="Services">Brand, design system, web</ListItem>
							<ListItem term="Team">4 people, 11 weeks</ListItem>
						</List>
					</Cell>
					<Cell label="stacked · sm">
						<List variant="description" layout="stacked" size="sm" className={styles.listWidth}>
							<ListItem term="Challenge">One identity for three regulators and two languages.</ListItem>
							<ListItem term="Result">Launch in eleven weeks; support tickets down 38%.</ListItem>
						</List>
					</Cell>
				</ThemePair>
			</Specimen>
			<Specimen title="Rows" note="Leading avatar or icon, title, detail, meta in tabular figures, one trailing action. With href the whole row is the link (hover tint, ring on focus); the trailing button stays its own target.">
				<ThemePair layout="column" align="start">
					<List variant="rows" framed className={styles.fill}>
						<ListItem
							leading={<Avatar name="Lisette T." src={AVATAR.lisette} size="lg" />}
							title="Lisette T."
							meta="2h ago"
							trailing={<Button variant="ghost" size="md" icon="ellipsis" label="More for Lisette T." />}
						>
							Head of Product · Lumen
						</ListItem>
						<ListItem
							leading={
								<span className={styles.iconTile}>
									<Icon name="file-text" size="md" />
								</span>
							}
							title="brand-guidelines.pdf"
							meta="4.2 MB"
							href="#list"
							trailing={<Button variant="ghost" size="md" icon="download" label="Download brand-guidelines.pdf" />}
						>
							Updated by Jorge R.
						</ListItem>
						<ListItem
							leading={
								<span className={styles.iconTile}>
									<Icon name="folder" size="md" />
								</span>
							}
							title="A very long file name that keeps going to show how the title wraps without pushing the meta or the action out of the row.fig"
							meta="128 KB"
							href="#list"
						/>
					</List>
					<div className={styles.fill}>
						<Labelled label="empty">
							<List variant="rows" framed empty="No files shared yet." />
						</Labelled>
					</div>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">variant</code>, 'unordered | ordered | description | rows', 'unordered', 'ul · ol · dl · ul of rows'],
					[<code key="b">marker · tone</code>, 'dot | dash | none · neutral | 6 hues', 'dot · neutral', 'A hue tints the marker only'],
					[<code key="c">size · layout · framed · start</code>, 'sm | md · inline | stacked · boolean · number', 'md · inline · false', 'layout for description lists'],
					[<code key="d">empty</code>, 'ReactNode', '—', 'A paragraph replaces the list when it has no items'],
					[<code key="e">ListItem</code>, 'term · icon · leading, title, meta, trailing, href', '—', 'term → dt/dd; title → row; else li'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── Quote ───────────────────────── */

function QuoteSection() {
	return (
		<ShowcaseSection
			id="quote"
			eyebrow={GROUP}
			title="Quote"
			description="The testimonial cards' voice outside the card: Funnel Display Light, balanced lines, attribution in a small row with the avatar and the role at 60%. Pull quotes lift a passage out of an article in PP Editorial New."
		>
			<Usage use="a client's words, a quotation in a case study, a passage worth repeating in a long article." avoid="emphasis on your own copy (use Accent) or more than one or two pull quotes per page." />
			<Specimen title="Block quote: sizes" note="figure › blockquote + figcaption: the attribution is outside the quote; cite holds a work's title, never a name.">
				<ThemePair layout="column" align="start">
					<Quote size="sm" author="Jorge R." role="CTO" company="Orbit">
						They shipped weekly and told us when something would not fit, which is rarer than it should be.
					</Quote>
					<Quote author="Lisette T." role="Head of Product" company="Lumen" avatar={AVATAR.lisette}>
						Yeta turned a messy brief into a system our own team now extends without them.
					</Quote>
					<Quote size="lg" tone="violet" author="Marcelo Z." role="Founder" company="Norte" avatar={AVATAR.marcelo}>
						The best compliment: nobody asks which parts were designed by the agency.
					</Quote>
				</ThemePair>
			</Specimen>
			<Specimen title="Centred, source and long content" note="align center is the testimonial card's composition.">
				<ThemePair align="start">
					<Cell label="center · avatar">
						<Quote align="center" author="Lisette T." role="Head of Product" company="Lumen" avatar={AVATAR.lisette}>
							Clear, fast and kind. We would hire them again tomorrow.
						</Quote>
					</Cell>
					<Cell label="source (cite) · long">
						<Quote size="sm" author="Jorge R." source="Design Systems Summit, 2025" cite="https://example.com/talk">
							<p>We stopped asking for screens and started asking for decisions. The screens took care of themselves once the tokens did.</p>
							<p>That change took a quarter, and it is the reason the dashboard still looks like one product two years later.</p>
						</Quote>
					</Cell>
				</ThemePair>
			</Specimen>
			<Specimen title="Pull quote" note="aside › figure, PP Editorial New Ultralight between two hairlines; the opening mark carries the optional hue.">
				<ThemePair layout="column" align="start">
					<Quote variant="pull" size="lg">
						Every screen after the tokens was a composition, not a design.
					</Quote>
					<Quote variant="pull" size="sm" tone="orange" author="Lisette T." role="Head of Product" company="Lumen">
						We stopped asking for screens and started asking for decisions.
					</Quote>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">variant</code>, 'block | pull', 'block', 'pull renders aside › figure in the serif'],
					[<code key="b">size · align</code>, 'sm | md | lg · start | center', 'md · start (pull: center)', 'Pull steps up to 20 / 24 / 32'],
					[<code key="c">author · role · company · avatar</code>, 'string · node · node · src', '—', 'role ✹ company, the ✹ hidden from screen readers'],
					[<code key="d">source · cite</code>, 'node · URL', '—', 'cite element (work title) · blockquote cite attribute'],
					[<code key="e">tone</code>, 'neutral | 6 hues', 'neutral', 'Only the rule or the opening mark'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── Table ───────────────────────── */

type ProjectRow = { name: string; client: string; year: number; weeks: number; budget: number };
type SortKey = keyof ProjectRow;

const PROJECTS: ProjectRow[] = [
	{ name: 'Lumen rebrand', client: 'Lumen', year: 2025, weeks: 11, budget: 84000 },
	{ name: 'Orbit dashboard', client: 'Orbit', year: 2024, weeks: 14, budget: 126500 },
	{ name: 'Norte site', client: 'Norte', year: 2025, weeks: 6, budget: 38200 },
	{ name: 'Kite design system', client: 'Kite', year: 2023, weeks: 9, budget: 71000 },
	{ name: 'Atlas onboarding', client: 'Atlas', year: 2024, weeks: 4, budget: 19800 },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function SortableTableDemo() {
	const [sort, setSort] = useState<{ key: SortKey; direction: Exclude<TableSort, 'none'> }>({ key: 'year', direction: 'descending' });
	const rows = [...PROJECTS].sort((a, b) => {
		const order = a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0;
		return sort.direction === 'ascending' ? order : -order;
	});
	const sortOf = (key: SortKey): TableSort => (sort.key === key ? sort.direction : 'none');
	const cycle = (key: SortKey) =>
		setSort((previous) => (previous.key === key ? { key, direction: previous.direction === 'ascending' ? 'descending' : 'ascending' } : { key, direction: 'ascending' }));

	return (
		<Table caption="Projects by year" zebra hover>
			<TableHead>
				<TableRow>
					<TableHeaderCell sort={sortOf('name')} onSort={() => cycle('name')}>
						Project
					</TableHeaderCell>
					<TableHeaderCell sort={sortOf('client')} onSort={() => cycle('client')}>
						Client
					</TableHeaderCell>
					<TableHeaderCell numeric sort={sortOf('year')} onSort={() => cycle('year')}>
						Year
					</TableHeaderCell>
					<TableHeaderCell numeric sort={sortOf('weeks')} onSort={() => cycle('weeks')}>
						Weeks
					</TableHeaderCell>
					<TableHeaderCell numeric sort={sortOf('budget')} onSort={() => cycle('budget')}>
						Budget
					</TableHeaderCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<TableRow key={row.name}>
						<TableHeaderCell scope="row">{row.name}</TableHeaderCell>
						<TableCell>{row.client}</TableCell>
						<TableCell numeric>{row.year}</TableCell>
						<TableCell numeric>{row.weeks}</TableCell>
						<TableCell numeric>{money.format(row.budget)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HOURS = [112, 98, 140, 131, 87, 156, 149, 76, 120, 134, 101, 92];

function TableSection() {
	return (
		<ShowcaseSection
			id="table"
			eyebrow={GROUP}
			title="Table"
			description="A native table in the raised, outlined frame of the case-study facts. Sortable headers hold a button and set aria-sort on the sorted column; numbers end-align in tabular figures. A table wider than its frame scrolls inside a focusable, captioned region with soft edge shadows on the side that hides more."
		>
			<Usage use="records compared across the same columns: projects, invoices, specs." avoid="layout, or one record's facts (use a description List)." />
			<Specimen title="Sortable, zebra and hover" note="Press a header to sort (ascending, then descending). Headers are buttons, so Tab reaches them and Enter or Space sorts.">
				<ThemePair layout="column" align="start">
					<div className={styles.fill}>
						<SortableTableDemo />
					</div>
				</ThemePair>
			</Specimen>
			<Specimen title="Overflow and sticky header" note="Left: twelve months in a narrow frame scroll sideways (Tab to the region, then arrow keys); the edge shadows follow the scroll. Right: the header stays on top while the body scrolls under the glass.">
				<ThemePair align="start">
					<div className={styles.fill}>
						<Table caption="Hours by month, 2025" size="sm">
							<TableHead>
								<TableRow>
									<TableHeaderCell>Team</TableHeaderCell>
									{MONTHS.map((month) => (
										<TableHeaderCell key={month} numeric>
											{month}
										</TableHeaderCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{['Design', 'Engineering'].map((team, row) => (
									<TableRow key={team}>
										<TableHeaderCell scope="row">{team}</TableHeaderCell>
										{HOURS.map((hours, index) => (
											<TableCell key={MONTHS[index]} numeric>
												{hours - row * 17}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<div className={styles.fill}>
						<Table caption="Invoices" stickyHeader size="sm" hover>
							<TableHead>
								<TableRow>
									<TableHeaderCell>Invoice</TableHeaderCell>
									<TableHeaderCell>Client</TableHeaderCell>
									<TableHeaderCell numeric>Amount</TableHeaderCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{HOURS.map((hours, index) => (
									<TableRow key={index}>
										<TableHeaderCell scope="row">INV-{String(2401 + index)}</TableHeaderCell>
										<TableCell>{PROJECTS[index % PROJECTS.length].client}</TableCell>
										<TableCell numeric>{money.format(hours * 95)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</ThemePair>
			</Specimen>
			<Specimen title="Empty and hidden caption" note="The empty row spans every column. A hidden caption still names the table and its scroll region.">
				<ThemePair layout="column" align="start">
					<div className={styles.fill}>
						<Table caption="Open invoices" captionHidden>
							<TableHead>
								<TableRow>
									<TableHeaderCell>Invoice</TableHeaderCell>
									<TableHeaderCell>Client</TableHeaderCell>
									<TableHeaderCell numeric>Amount</TableHeaderCell>
								</TableRow>
							</TableHead>
							<TableBody colSpan={3} empty="No open invoices. Everything is paid." />
						</Table>
					</div>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Part · prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">Table caption · captionHidden</code>, 'node · boolean', 'required · false', 'Names the table and its scroll region'],
					[<code key="b">Table size · zebra · hover · stickyHeader</code>, 'sm | md · boolean', 'md · false', 'Sticky caps the frame at 20rem'],
					[<code key="c">TableHeaderCell sort · onSort</code>, 'ascending | descending | none · () => void', '—', 'aria-sort only while sorted'],
					[<code key="d">TableHeaderCell scope · numeric</code>, 'col | row · boolean', 'col · false', 'Row headers name each row'],
					[<code key="e">TableCell numeric</code>, 'boolean', 'false', 'End-aligned, tabular figures'],
					[<code key="f">TableBody empty · colSpan</code>, 'node · number', '— · 1', 'One full-width row when there are no rows'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── Image ───────────────────────── */

function ImageSection() {
	return (
		<ShowcaseSection
			id="image"
			eyebrow={GROUP}
			title="Image"
			description="next/image in the site's frame: radius and bevel like every surface, a ratio frame or the image's own size, an optional caption, and a light/dark pair that swaps with the theme like the brand marks. A failed load keeps the frame and says so."
		>
			<Usage use="screenshots, photos and artwork in content, with real alt text." avoid="decorative backgrounds (CSS) or icons (use Icon)." />
			<Specimen title="Ratio frame, light/dark pair, caption" note="Each canvas shows its own artwork: the light screen on the light canvas, the dark one on the dark.">
				<ThemePair layout="column" align="start">
					<Image
						src={SHOT.one.light}
						srcDark={SHOT.one.dark}
						alt="Lumen dashboard: revenue chart above a table of recent transfers"
						aspect="16/9"
						sizes="(min-width: 1024px) 35vw, 90vw"
						caption="Lumen dashboard, final design. The dark artwork is a separate export, not a filter."
					/>
				</ThemePair>
			</Specimen>
			<Specimen title="Ratios, radius and frame" note="frame={false} draws the bare image.">
				<ThemePair layout="grid" align="start">
					<Cell label="1/1 · radius sm">
						<div className={styles.thumb}>
							<Image src={SHOT.two.light} srcDark={SHOT.two.dark} alt="Orbit board, cropped" aspect="1/1" radius="sm" sizes="160px" />
						</div>
					</Cell>
					<Cell label="4/3 · radius 2xl">
						<div className={styles.thumb}>
							<Image src={SHOT.three.light} srcDark={SHOT.three.dark} alt="Norte landing page" aspect="4/3" radius="2xl" sizes="160px" />
						</div>
					</Cell>
					<Cell label="3/4 · contain">
						<div className={styles.thumb}>
							<Image src={SHOT.three.light} srcDark={SHOT.three.dark} alt="Norte landing page, whole" aspect="3/4" fit="contain" sizes="160px" />
						</div>
					</Cell>
					<Cell label="intrinsic size">
						<Image src={AVATAR.jorge} alt="Jorge R." width={112} height={112} radius="xl" />
					</Cell>
					<Cell label="no frame">
						<Image src={AVATAR.lisette} alt="Lisette T." width={112} height={112} frame={false} />
					</Cell>
				</ThemePair>
			</Specimen>
			<Specimen title="Loading and failure" note="skeleton pulses until the image loads, then cross-fades (transitions.dev Skeleton reveal; still under reduced motion). The failed image keeps its frame and reads its alt text.">
				<ThemePair align="start">
					<Cell label="skeleton → loaded">
						<div className={styles.imageCell}>
							<Image src={SHOT.two.light} srcDark={SHOT.two.dark} alt="Orbit board" aspect="16/9" skeleton sizes="(min-width: 1024px) 20vw, 90vw" />
						</div>
					</Cell>
					<Cell label="error">
						<div className={styles.imageCell}>
							<Image src="/design-system/missing-shot.png" alt="Kite components overview" aspect="16/9" sizes="(min-width: 1024px) 20vw, 90vw" unoptimized />
						</div>
					</Cell>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">src · srcDark · alt</code>, 'next/image src · string', 'alt required', 'srcDark pairs artwork per canvas'],
					[<code key="b">aspect · fit</code>, '1/1 | 4/3 | 3/2 | 16/9 | 21/9 | 3/4 | 9/16 · cover | contain', '— · cover', 'With aspect pass sizes; without, width and height'],
					[<code key="c">frame · radius</code>, 'boolean · none | sm … 2xl', 'true · lg', 'Radius + bevel'],
					[<code key="d">caption · skeleton · fallbackLabel</code>, 'node · boolean · string', '—', 'figure/figcaption · Skeleton reveal · error text'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── Video ───────────────────────── */

const REEL = { src: '/design-system/demo-reel.mp4', poster: '/design-system/demo-reel-poster.jpg' };
const REEL_CAPTIONS = [{ src: '/design-system/demo-reel.en.vtt', srclang: 'en', label: 'English' }];

function VideoSection() {
	return (
		<ShowcaseSection
			id="video"
			eyebrow={GROUP}
			title="Video"
			description="The native video element with the site's controls on a glass bar: play and pause, seek, time, mute, captions and full screen, all real buttons and a slider. With focus inside: K plays, M mutes, C toggles captions, F goes full screen, arrows seek 5s. Autoplay is muted, plays only on screen and never under reduced motion."
		>
			<Usage use="product walkthroughs and case-study reels you host yourself, with captions." avoid="decorative loops behind text (motion the visitor cannot stop) or embeds from other players." />
			<Specimen title="Player" note="Poster until the first play. Controls fade after 2.5s of playback and come back on pointer movement or focus. Captions draw above the bar in the toast's ink.">
				<ThemePair layout="column" align="start">
					<Video src={REEL.src} poster={REEL.poster} title="Case study reel" tracks={REEL_CAPTIONS} aspect="16/10" caption="Case study reel, 10 seconds. Captions: English." />
				</ThemePair>
			</Specimen>
			<Specimen title="Autoplay, square and failure" note="Autoplay starts muted when half the player is on screen; with prefers-reduced-motion the poster stays until Play.">
				<ThemePair align="start">
					<Cell label="autoPlay · loop · 1/1">
						<div className={styles.imageCell}>
							<Video src={REEL.src} poster={REEL.poster} title="Looping reel" autoPlay loop aspect="1/1" radius="2xl" />
						</div>
					</Cell>
					<Cell label="error">
						<div className={styles.imageCell}>
							<Video src="/design-system/missing-reel.mp4" title="Missing reel" aspect="1/1" radius="2xl" />
						</div>
					</Cell>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">src · sources · poster</code>, 'string · {src, type}[] · string', '—', 'sources for several formats'],
					[<code key="b">title</code>, 'string', 'required', 'Accessible name of the player'],
					[<code key="c">tracks</code>, '{src, srclang, label, kind, default}[]', '[]', 'First track drives the Captions toggle'],
					[<code key="d">autoPlay · loop · muted · preload</code>, 'boolean · none | metadata | auto', 'false · metadata', 'Autoplay is muted, on screen only, off under reduced motion'],
					[<code key="e">aspect · radius · caption · labels</code>, '16/9 | 16/10 | 4/3 | 1/1 | 9/16 · md … 2xl · node · Partial<VideoLabels>', '16/9 · xl', 'labels translate the controls'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── Button group ───────────────────────── */

function FormattingToolbar() {
	const [marks, setMarks] = useState({ bold: true, italic: false });
	return (
		<ButtonGroup label="Text formatting" toolbar size="md">
			<Button icon="bold" label="Bold" aria-pressed={marks.bold} onClick={() => setMarks((m) => ({ ...m, bold: !m.bold }))} />
			<Button icon="italic" label="Italic" aria-pressed={marks.italic} onClick={() => setMarks((m) => ({ ...m, italic: !m.italic }))} />
			<Button icon="link" label="Insert link" />
			<Button icon="list" label="Bulleted list" />
			<Button icon="list-ordered" label="Numbered list" disabled />
		</ButtonGroup>
	);
}

function ButtonGroupSection() {
	return (
		<ShowcaseSection
			id="button-group"
			eyebrow={GROUP}
			title="Button group"
			description="Related Buttons as one unit. Attached joins them into one bevelled bar; spaced keeps them apart. As a toolbar the group is one tab stop: arrow keys move between buttons (Home and End jump to the ends), the WAI-ARIA toolbar pattern with a roving tabindex."
		>
			<Usage use="a set of tools on the same object (formatting, view modes) or a short pair of actions (Cancel · Save)." avoid="navigation between pages (use links) or a single choice among options (use SegmentedControl)." />
			<Specimen title="Attached: sizes" note="size passes to every Button that does not set its own.">
				<ThemePair layout="column">
					{(['sm', 'md', 'lg'] as const).map((size) => (
						<Cell key={size} label={`attached · ${size}`}>
							<ButtonGroup label={`Range, ${size}`} size={size}>
								<Button>Day</Button>
								<Button>Week</Button>
								<Button>Month</Button>
							</ButtonGroup>
						</Cell>
					))}
				</ThemePair>
			</Specimen>
			<Specimen title="Toolbar, spaced, vertical" note="Toolbar: Tab lands on one button, arrows move. The numbered-list button is disabled but still focusable (aria-disabled), as the APG allows in toolbars.">
				<ThemePair align="start">
					<Cell label="toolbar · icon buttons">
						<FormattingToolbar />
					</Cell>
					<Cell label="spaced">
						<ButtonGroup label="Dialog actions" variant="spaced" size="md">
							<Button variant="ghost">Cancel</Button>
							<Button iconStart="check">Save changes</Button>
						</ButtonGroup>
					</Cell>
					<Cell label="attached · vertical">
						<ButtonGroup label="Export format" orientation="vertical" size="md">
							<Button iconStart="file-text">PDF report</Button>
							<Button iconStart="file-image">PNG images</Button>
							<Button iconStart="file-archive">Source files (zip)</Button>
						</ButtonGroup>
					</Cell>
					<Cell label="long labels · wraps">
						<ButtonGroup label="Next steps" variant="spaced" size="sm">
							<Button>Request a proposal</Button>
							<Button iconStart="calendar">Schedule a discovery call</Button>
							<Button variant="ghost">Maybe later</Button>
						</ButtonGroup>
					</Cell>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">label</code>, 'string', 'required', 'Accessible name of the group or toolbar'],
					[<code key="b">variant · orientation</code>, 'attached | spaced · horizontal | vertical', 'attached · horizontal', 'Spaced rows wrap'],
					[<code key="c">size</code>, 'ButtonSize', '—', 'Passed to Buttons without their own'],
					[<code key="d">toolbar</code>, 'boolean', 'false', 'role="toolbar", roving tabindex, arrows + Home/End'],
				]}
			/>
		</ShowcaseSection>
	);
}

/* ───────────────────────── Visually hidden ───────────────────────── */

function VisuallyHiddenSection() {
	return (
		<ShowcaseSection
			id="visually-hidden"
			eyebrow={GROUP}
			title="Visually hidden"
			description="Words for assistive tech only, through the u-visually-hidden utility (clipped, never display:none, so screen readers still read it). focusable makes a skip link: hidden until it gets focus, then a glass pill at the top-left of its positioned container."
		>
			<Usage use="the rest of a short link's name, a table caption under a visible heading, live-region text." avoid="hiding content from everyone (use hidden) or text that sighted users also need." />
			<Specimen title="Hidden text and the focusable variant" note="The link reads “Read the case study: Lumen rebrand”. Tab into the frame on the right to see the skip link appear.">
				<ThemePair align="start">
					<Cell label="completes a link's name">
						<Text size="sm">
							<Link href="#visually-hidden">
								Read the case study<VisuallyHidden>: Lumen rebrand</VisuallyHidden>
							</Link>
						</Text>
					</Cell>
					<Cell label="focusable · skip link">
						<div className={styles.skipFrame}>
							<VisuallyHidden as="a" href="#visually-hidden" focusable>
								Skip to content
							</VisuallyHidden>
							<Text size="xs" tone="faint">
								The first Tab in this frame shows the link above
							</Text>
							<Button size="sm" variant="ghost">
								Next control
							</Button>
						</div>
					</Cell>
				</ThemePair>
			</Specimen>
			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[<code key="a">as</code>, 'ElementType', 'span', 'a (with href) for skip links'],
					[<code key="b">focusable</code>, 'boolean', 'false', 'Shown while it or a child has focus'],
				]}
			/>
		</ShowcaseSection>
	);
}

export default function LayoutGallery() {
	return (
		<>
			<CardSection />
			<StackSection />
			<ListSection />
			<QuoteSection />
			<TableSection />
			<ImageSection />
			<VideoSection />
			<ButtonGroupSection />
			<VisuallyHiddenSection />
		</>
	);
}
