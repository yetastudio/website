'use client';

/*
 * Design system gallery · Feedback.
 * Components from component.gallery that the site's library was missing, one ShowcaseSection each.
 * NAV feeds the showcase's side navigation; ids must match each ShowcaseSection id.
 */

//! React Core
import { useEffect, useRef, useState } from 'react';

//! Components
import { Cell, ShowcaseSection, SpecTable, Specimen, ThemePair } from '@/components/showcase';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/field';
import { Link } from '@/components/ui/link';
import { Popover } from '@/components/ui/popover';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ProgressIndicator, type ProgressStep } from '@/components/ui/progress-indicator';
import { Skeleton, SkeletonReveal } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import { useToast } from '@/components/ui/toast';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './feedback.module.css';

const GROUP = 'Gallery · Feedback';

export const NAV: Array<{ id: string; label: string; group: string }> = [
	{ id: 'alert', label: 'Alert', group: GROUP },
	{ id: 'badge', label: 'Badge', group: GROUP },
	{ id: 'spinner', label: 'Spinner', group: GROUP },
	{ id: 'skeleton', label: 'Skeleton', group: GROUP },
	{ id: 'progress-bar', label: 'Progress bar', group: GROUP },
	{ id: 'progress-indicator', label: 'Progress indicator', group: GROUP },
	{ id: 'empty-state', label: 'Empty state', group: GROUP },
	{ id: 'popover', label: 'Popover', group: GROUP },
];

const EYEBROW = 'Gallery · Feedback';

function Usage({ use, avoid }: { use: string; avoid: string }) {
	return (
		<dl className={styles.usage}>
			<Text as="dt" size="sm" weight="regular">
				Use it for
			</Text>
			<Text as="dd" size="sm" tone="subtle">
				{use}
			</Text>
			<Text as="dt" size="sm" weight="regular">
				Don’t use it for
			</Text>
			<Text as="dd" size="sm" tone="subtle">
				{avoid}
			</Text>
		</dl>
	);
}

function code(text: string) {
	return <code key={text}>{text}</code>;
}

/* ───────────────────────── Alert ───────────────────────── */

function AlertSection() {
	const [dismissed, setDismissed] = useState(false);
	const [bannerDismissed, setBannerDismissed] = useState(false);
	const [longDismissed, setLongDismissed] = useState(false);
	return (
		<ShowcaseSection
			id="alert"
			eyebrow={EYEBROW}
			title="Alert"
			description="A prominent message about something that changed. The status hue sits on the icon only; surface, title and copy stay neutral. Danger and warning interrupt (role=alert), the rest wait their turn (role=status), and static callouts opt out with live='off'."
		>
			<Specimen title="Tones" note="Neutral · info · success · warning · danger. One optional follow-up action, a small Button with its purpose icon.">
				<ThemePair layout="column" align="start">
					<div className={styles.stack}>
						<Alert title="Drafts save as you type">Close the tab whenever you like: your brief will be here when you come back.</Alert>
						<Alert tone="info" title="Case studies now read in Portuguese">The work section is available in English, Spanish and Portuguese.</Alert>
						<Alert tone="success" title="Brief sent">We reply within one business day with a plan, not a pitch.</Alert>
						<Alert tone="warning" title="Your session ends in 5 minutes" action={<Button size="sm">Stay signed in</Button>}>
							Unsaved changes are kept for 24 hours.
						</Alert>
						<Alert
							tone="danger"
							title="The upload failed"
							action={
								<Button size="sm" iconStart="upload">
									Upload again
								</Button>
							}
						>
							brief.pdf is larger than 20 MB. Compress it or share a link instead.
						</Alert>
					</div>
				</ThemePair>
			</Specimen>

			<Specimen
				title="Dismissible, body only, static, long content"
				note="The dismiss button is a ghost icon Button (30px target, Button focus ring). The parent removes the alert and decides where focus goes. Hover and focus states come from Button."
			>
				<ThemePair layout="column" align="start">
					<div className={styles.stack}>
						{dismissed ? (
							<Button size="sm" variant="glass" onClick={() => setDismissed(false)}>
								Show the alert again
							</Button>
						) : (
							<Alert tone="info" onDismiss={() => setDismissed(true)}>
								Body only: without a title the copy takes the regular ink.
							</Alert>
						)}
						<Alert tone="neutral" icon={null} live="off" title="Static callout">
							Part of the page from the start, so it is not a live region and carries no icon.
						</Alert>
						{longDismissed ? (
							<Button size="sm" variant="glass" onClick={() => setLongDismissed(false)}>
								Show the long alert again
							</Button>
						) : (
							<Alert
								tone="warning"
								title="A long title that wraps onto a second line once the container gets narrow enough"
								onDismiss={() => setLongDismissed(true)}
								action={
									<>
										<Button size="sm" iconStart="calendar">
											Reschedule
										</Button>
										<Button size="sm" variant="ghost">
											Keep the date
										</Button>
									</>
								}
							>
								The kickoff call overlaps with a public holiday in Argentina. We can keep the date and meet with part of the team, or move it to the next
								business day so everyone who signed off on the brief can join. Either way the timeline does not move.
							</Alert>
						)}
					</div>
				</ThemePair>
			</Specimen>

			<Specimen title="Banner" note="Edge to edge at the top of a page or section: the nav pill's glass over a hairline. Below 640px the action drops under the copy.">
				<ThemePair layout="column" align="start">
					<div className={styles.frame}>
						{bannerDismissed ? (
							<div className={styles.frameBody}>
								<Button size="sm" variant="glass" onClick={() => setBannerDismissed(false)}>
									Show the banner again
								</Button>
							</div>
						) : (
							<Alert variant="banner" tone="info" title="Booking opens for March." action={<Link href="/#our-work">See recent work</Link>} onDismiss={() => setBannerDismissed(true)}>
								Two project slots left this quarter.
							</Alert>
						)}
						<div className={styles.frameBody}>
							<Text size="lg" weight="regular">
								Our work
							</Text>
							<Text size="sm" tone="subtle">
								The page content starts under the banner.
							</Text>
						</div>
					</div>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('tone'), 'neutral | info | success | warning | danger', 'neutral', 'Colours the icon only'],
					[code('variant'), 'inline | banner', 'inline', 'Raised card with bevel, or full-width glass strip'],
					[code('title · children'), 'ReactNode', '—', 'Body alone takes the regular ink'],
					[code('action'), 'ReactNode', '—', 'One small Button (or a Link in a banner)'],
					[code('icon'), 'IconName | null', 'by tone', 'null removes it'],
					[code('onDismiss'), '() => void', '—', 'Shows the dismiss button ("Dismiss", translated)'],
					[code('live'), 'polite | assertive | off', 'by tone', 'role=status · role=alert · static'],
				]}
			/>
			<Usage use="A change the reader should notice in context: a failed upload, a session about to end, a sent form." avoid="Transient confirmations (Toast), field validation (the Input error) or marketing copy." />
		</ShowcaseSection>
	);
}

/* ───────────────────────── Badge ───────────────────────── */

function BadgeSection() {
	return (
		<ShowcaseSection
			id="badge"
			eyebrow={EYEBROW}
			title="Badge"
			description="A small status or metadata mark next to, or on, something bigger. Squarer and smaller than the Chip, never interactive, tabular figures. The status hue is only ever the dot."
		>
			<Specimen title="Label · tones × sizes" note="md 20px · sm 16px. Neutral has no dot.">
				<ThemePair layout="column">
					<div className={styles.row}>
						<Badge>Draft</Badge>
						<Badge tone="info">In review</Badge>
						<Badge tone="success">Live</Badge>
						<Badge tone="warning">Paused</Badge>
						<Badge tone="danger">Overdue</Badge>
					</div>
					<div className={styles.row}>
						<Badge size="sm">Draft</Badge>
						<Badge size="sm" tone="info">
							In review
						</Badge>
						<Badge size="sm" tone="success">
							Live
						</Badge>
						<Badge size="sm" tone="warning">
							Paused
						</Badge>
						<Badge size="sm" tone="danger">
							Overdue
						</Badge>
					</div>
				</ThemePair>
			</Specimen>

			<Specimen title="Count & dot" note="Counts are an ink pill; past max they read 99+ (assistive tech hears the exact number). 0 hides the badge unless showZero. A dot needs a label unless it is decorative.">
				<ThemePair>
					<Cell label="count">
						<div className={styles.row}>
							<Badge variant="count" count={3} label="unread messages" />
							<Badge variant="count" count={12} />
							<Badge variant="count" count={120} label="notifications" />
							<Badge variant="count" count={0} showZero size="sm" />
						</div>
					</Cell>
					<Cell label="dot">
						<div className={styles.row}>
							<Badge variant="dot" label="Draft" />
							<Badge variant="dot" tone="success" label="Online" />
							<Badge variant="dot" tone="warning" label="Away" />
							<Badge variant="dot" tone="danger" size="sm" label="Offline" />
						</div>
					</Cell>
					<Cell label="on an icon button">
						<div className={styles.row}>
							<span className={styles.corner}>
								<Button variant="glass" size="lg" icon="notebook" label="Messages, 3 unread" />
								<Badge variant="count" count={3} size="sm" className={styles.cornerBadge} aria-hidden="true" />
							</span>
							<span className={styles.corner}>
								<Button variant="glass" size="lg" icon="calendar" label="Calendar, new invitations" />
								<Badge variant="dot" tone="info" className={styles.cornerDot} aria-hidden="true" />
							</span>
						</div>
					</Cell>
				</ThemePair>
			</Specimen>

			<Specimen title="Badge vs Chip, long content" note="Chip: frosted pill for tags, eyebrows and filters (can be a button). Badge: the state of the thing it annotates. A long badge never wraps; keep it to one or two words.">
				<ThemePair>
					<Cell label="chip = tag">
						<Chip size="lg" icon="design-spline">
							Brand identity
						</Chip>
					</Cell>
					<Cell label="badge = status">
						<span className={styles.inlineText}>
							<Text as="span" size="sm">
								Yeta Studio site
							</Text>
							<Badge tone="success">Live</Badge>
						</span>
					</Cell>
					<Cell label="long">
						<Badge tone="warning">Awaiting client feedback</Badge>
					</Cell>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('variant'), 'label | dot | count', 'label', 'Dot and count take a label for assistive tech'],
					[code('tone'), 'neutral | info | success | warning | danger', 'neutral', 'Colours the dot only'],
					[code('size'), 'sm | md', 'md', '16 / 20px tall'],
					[code('count · max · showZero'), 'number · number · boolean', '— · 99 · false', 'count only'],
				]}
			/>
			<Usage use="Short status or metadata on a card, row or icon: Live, Draft, 3 unread." avoid="Tags, filters or anything clickable (Chip, Button); sentences; decoration without meaning." />
		</ShowcaseSection>
	);
}

/* ───────────────────────── Spinner ───────────────────────── */

function SpinnerSection() {
	return (
		<ShowcaseSection
			id="spinner"
			eyebrow={EYEBROW}
			title="Spinner"
			description="An indeterminate wait for a part of the page that is not ready yet. A ring on the icon stroke (1.5) that takes the current text colour. With a label it is a status region; under reduced motion the ring stands still."
		>
			<Specimen title="Sizes" note="The icon scale: sm 14 · md 18 · lg 20 · xl 24. Decorative here (no label).">
				<ThemePair>
					<Cell label="sm">
						<Spinner size="sm" />
					</Cell>
					<Cell label="md">
						<Spinner size="md" />
					</Cell>
					<Cell label="lg">
						<Spinner size="lg" />
					</Cell>
					<Cell label="xl">
						<Spinner size="xl" />
					</Cell>
				</ThemePair>
			</Specimen>

			<Specimen title="Labels & colour" note="label → role=status with the text visually hidden; showLabel prints it. Colour is inherited: subtle copy, danger copy, a Button.">
				<ThemePair>
					<Cell label="visible label">
						<Text as="span" size="sm" tone="subtle">
							<Spinner label="Loading projects" showLabel />
						</Text>
					</Cell>
					<Cell label="hidden label">
						<Spinner size="lg" label="Loading projects" />
					</Cell>
					<Cell label="inherits colour">
						<Text as="span" size="sm" tone="danger" className={styles.inlineText}>
							<Spinner size="sm" label="Retrying" showLabel />
						</Text>
					</Cell>
					<Cell label="in a Button (loading)">
						<Button size="lg" loading>
							Sending
						</Button>
					</Cell>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('size'), 'sm | md | lg | xl', 'md', '14 / 18 / 20 / 24px'],
					[code('label'), 'string', '—', 'Makes it role=status; without it the ring is aria-hidden'],
					[code('showLabel'), 'boolean', 'false', 'Prints the label beside the ring'],
				]}
			/>
			<Usage use="Short, unknown waits inside a region or control: loading a list, retrying a request." avoid="Waits with a known length (ProgressBar), whole layouts that are loading (Skeleton), or a busy Button (its own loading state)." />
		</ShowcaseSection>
	);
}

/* ───────────────────────── Skeleton ───────────────────────── */

function CardSkeleton() {
	return (
		<div className={styles.card}>
			<Skeleton shape="rect" />
			<Skeleton size="md" width="55%" />
			<Skeleton size="sm" lines={2} />
		</div>
	);
}

function SkeletonSection() {
	const [loaded, setLoaded] = useState(true);
	const timer = useRef<number | undefined>(undefined);
	useEffect(() => () => window.clearTimeout(timer.current), []);

	const reload = () => {
		window.clearTimeout(timer.current);
		setLoaded(false);
		timer.current = window.setTimeout(() => setLoaded(true), 2200);
	};

	return (
		<ShowcaseSection
			id="skeleton"
			eyebrow={EYEBROW}
			title="Skeleton"
			description="A placeholder in the shape of the content that is still loading. Bones pulse with the transitions.dev Skeleton loader and cross-fade into the content with its reveal; under reduced motion nothing pulses and the swap is instant. Bones are hidden from assistive tech: the loading region is aria-busy and says so."
		>
			<Specimen title="Shapes" note="text (lines as tall as the copy they replace, last line shorter) · circle (the Avatar scale) · rect (16 / 9 by default).">
				<ThemePair layout="column" align="start">
					<div className={styles.stack}>
						<Skeleton size="xl" width="40%" />
						<Skeleton size="sm" lines={3} />
						<div className={styles.row}>
							<Skeleton shape="circle" size="sm" />
							<Skeleton shape="circle" size="md" />
							<Skeleton shape="circle" size="lg" />
							<Skeleton shape="circle" size="xl" />
						</div>
						<div className={styles.row}>
							<Skeleton shape="rect" width="45%" />
							<Skeleton shape="rect" width="25%" ratio="1 / 1" />
						</div>
					</div>
				</ThemePair>
			</Specimen>

			<Specimen title="Compositions" note="Compose bones in the same layout as the content: a card, list rows.">
				<ThemePair align="start">
					<div className={styles.wide}>
						<CardSkeleton />
					</div>
					<div className={cx(styles.stack, styles.wide)}>
						{[0, 1, 2].map((row) => (
							<div key={row} className={styles.listRow}>
								<Skeleton shape="circle" size="lg" />
								<div className={styles.listText}>
									<Skeleton size="sm" width="50%" />
									<Skeleton size="xs" width="80%" />
								</div>
							</div>
						))}
					</div>
				</ThemePair>
			</Specimen>

			<Specimen title="Loading and reveal" note="SkeletonReveal stacks skeleton and content in one grid cell, so the swap needs no fixed height. Reload replays it (2.2s).">
				<ThemePair layout="column" align="start">
					<Button size="md" variant="glass" loading={!loaded} onClick={reload}>
						Reload
					</Button>
					<div className={styles.wide}>
						<SkeletonReveal loaded={loaded} label="Loading the case study" skeleton={<CardSkeleton />}>
							<div className={styles.card}>
								<div className={styles.media} />
								<Text size="md" weight="regular">
									Yeta Studio · Case study
								</Text>
								<Text size="sm" tone="subtle">
									A design system and a landing that scale across themes and locales.
								</Text>
							</div>
						</SkeletonReveal>
					</div>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('shape'), 'text | circle | rect', 'text', '—'],
					[code('lines'), 'number', '1', 'text only'],
					[code('size'), 'xs | sm | md | lg | xl', 'md', 'text: the Text size · circle: 20 / 20 / 28 / 40 / 60'],
					[code('width · ratio'), 'CSS width · aspect ratio', '100% · 16 / 9', 'ratio is rect only'],
					[code('SkeletonReveal loaded · skeleton · label'), 'boolean · ReactNode · string', '—', 'aria-busy while loading; label is announced politely'],
				]}
			/>
			<Usage use="First loads of layouts whose shape is known: cards, lists, profile headers." avoid="Short waits inside a control (Spinner), progress with a known end (ProgressBar), or content whose shape you cannot predict." />
		</ShowcaseSection>
	);
}

/* ───────────────────────── Progress bar ───────────────────────── */

function ProgressBarSection() {
	const [upload, setUpload] = useState(0);
	const interval = useRef<number | undefined>(undefined);
	useEffect(() => () => window.clearInterval(interval.current), []);

	const simulate = () => {
		window.clearInterval(interval.current);
		setUpload(0);
		interval.current = window.setInterval(() => {
			setUpload((value) => {
				const next = Math.min(100, value + 7 + Math.round(Math.random() * 12));
				if (next >= 100) window.clearInterval(interval.current);
				return next;
			});
		}, 450);
	};

	return (
		<ShowcaseSection
			id="progress-bar"
			eyebrow={EYEBROW}
			title="Progress bar"
			description="How far a long task has got, continuously. role=progressbar with aria-valuenow, min and max; an indeterminate bar omits the value and sweeps. Neutral ink fill; status tones only when the state changes (done, stalled, failed)."
		>
			<Specimen title="Determinate · sizes" note="sm 4 · md 6 · lg 8px track. The value is visible text and aria-valuenow; valueText replaces the percentage.">
				<ThemePair layout="column" align="start">
					<div className={cx(styles.stack, styles.wide)}>
						<ProgressBar size="sm" label="Uploading brief.pdf" value={24} />
						<ProgressBar label="Uploading moodboard.zip" value={45} />
						<ProgressBar size="lg" label="Exporting assets" value={3} max={8} valueText="3 of 8 files" />
						<ProgressBar label="Not started" value={0} />
					</div>
				</ThemePair>
			</Specimen>

			<Specimen title="Indeterminate, status tones, hidden label, long label" note="Indeterminate sweeps a 40% segment (a slow fade under reduced motion). Tones only for status, with the reason in the hint.">
				<ThemePair layout="column" align="start">
					<div className={cx(styles.stack, styles.wide)}>
						<ProgressBar label="Preparing your workspace" />
						<ProgressBar label="Upload complete" value={100} tone="success" valueText="Done" />
						<ProgressBar label="Syncing with Figma" value={62} tone="warning" hint="The connection dropped. Retrying in 10 seconds." />
						<ProgressBar label="Upload failed" value={30} tone="danger" valueText="Failed" hint="Check your connection and upload again." />
						<ProgressBar label="Storage used" hideLabel value={72} size="sm" />
						<ProgressBar label="Rendering the case-study video for every breakpoint and both themes before publishing" value={88} />
					</div>
				</ThemePair>
			</Specimen>

			<Specimen title="Live" note="The fill eases on width changes (instant under reduced motion).">
				<ThemePair layout="column" align="start">
					<div className={cx(styles.stack, styles.wide)}>
						<ProgressBar label="Uploading case-study.mp4" value={upload} tone={upload >= 100 ? 'success' : 'neutral'} valueText={upload >= 100 ? 'Done' : undefined} />
						<Button size="md" variant="glass" iconStart="upload" onClick={simulate}>
							Simulate upload
						</Button>
					</div>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('label · hideLabel'), 'string · boolean', '—', 'Always the accessible name'],
					[code('value · max'), 'number | null · number', '— · 100', 'No value = indeterminate'],
					[code('valueText · showValue'), 'string · boolean', '— · true', 'aria-valuetext; shown instead of the %'],
					[code('size'), 'sm | md | lg', 'md', '4 / 6 / 8px track'],
					[code('tone'), 'neutral | success | warning | danger', 'neutral', 'Status only'],
					[code('hint'), 'ReactNode', '—', 'aria-describedby'],
				]}
			/>
			<Usage use="Uploads, exports and installs where the amount done is known, or at least that something is moving." avoid="Discrete steps (ProgressIndicator), quantities that are not progress such as storage used against a quota (a meter), or a two-second wait (Spinner)." />
		</ShowcaseSection>
	);
}

/* ───────────────────────── Progress indicator ───────────────────────── */

const processSteps: ProgressStep[] = [
	{ label: 'Discover', description: 'Goals and audience' },
	{ label: 'Define', description: 'Scope and plan' },
	{ label: 'Design', description: 'Flows and screens' },
	{ label: 'Develop', description: 'Build and test' },
	{ label: 'Launch', description: 'Ship and measure' },
];

function ProgressIndicatorSection() {
	return (
		<ShowcaseSection
			id="progress-indicator"
			eyebrow={EYEBROW}
			title="Progress indicator"
			description="Where the reader is in a series of discrete steps (steps, stepper, timeline). An ordered list: complete steps are inked, the current one has a halo and aria-current='step', upcoming ones are a hairline ring. Every status is also spelled out for assistive tech."
		>
			<Specimen title="Horizontal" note="current = 2 (Design). Connectors ink once both ends are reached. Narrow containers scroll sideways.">
				<ThemePair layout="column" align="start">
					<ProgressIndicator label="Project progress" steps={processSteps} current={2} />
				</ThemePair>
			</Specimen>

			<Specimen title="Error, all complete" note="A step's own status wins over current: error shows the alert glyph in the danger hue and says why in its description.">
				<ThemePair layout="column" align="start">
					<ProgressIndicator
						label="Publishing progress"
						current={2}
						steps={[
							{ label: 'Content' },
							{ label: 'Review' },
							{ label: 'Deploy', status: 'error', description: 'The build failed' },
							{ label: 'Announce' },
						]}
					/>
					<ProgressIndicator label="Onboarding progress" current={3} steps={[{ label: 'Account' }, { label: 'Brief' }, { label: 'Kickoff' }]} />
				</ThemePair>
			</Specimen>

			<Specimen title="Vertical timeline, long labels" note="Reads top to bottom; descriptions carry dates or detail.">
				<ThemePair align="start">
					<div className={styles.wide}>
						<ProgressIndicator
							orientation="vertical"
							label="Engagement timeline"
							current={1}
							steps={[
								{ label: 'Discovery call', description: 'Mar 4 · 30 minutes with the founders' },
								{ label: 'Proposal and estimate', description: 'Due Mar 11' },
								{ label: 'Design sprint with weekly reviews and a shared Figma file', description: 'Mar 18 – Apr 12' },
								{ label: 'Handoff', description: 'Apr 15' },
							]}
						/>
					</div>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('steps'), '{ label, description?, status? }[]', '—', 'status overrides the derived one'],
					[code('current'), 'number', '—', 'Index; earlier = complete, later = upcoming'],
					[code('orientation'), 'horizontal | vertical', 'horizontal', '—'],
					[code('label'), 'string', '—', 'Accessible name of the list'],
					[code('statusLabels'), 'Partial<Record<status, string>>', 'English', 'Pass translations'],
				]}
			/>
			<Usage use="Multi-step flows and timelines with a known sequence: onboarding, a project's phases, checkout." avoid="Continuous progress (ProgressBar), navigation between peers (Tabs), or more than about seven steps." />
		</ShowcaseSection>
	);
}

/* ───────────────────────── Empty state ───────────────────────── */

function StackIllustration() {
	return (
		<svg className={styles.illustration} viewBox="0 0 64 48" fill="none" aria-hidden="true">
			<rect x="10" y="4" width="44" height="28" rx="5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
			<rect x="6" y="10" width="52" height="30" rx="5" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />
			<rect x="2" y="16" width="60" height="30" rx="5" stroke="currentColor" strokeWidth="1.5" />
			<path d="M14 31h20M14 37h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

function EmptyStateSection() {
	return (
		<ShowcaseSection
			id="empty-state"
			eyebrow={EYEBROW}
			title="Empty state"
			description="Says that there is nothing to show yet and offers the way forward: a purpose icon (or a small illustration) on a neutral tile, a plain title, one sentence, one primary action and an optional secondary link."
		>
			<Specimen title="Page" note="Fills an empty view. Title level follows the outline (h4 here).">
				<ThemePair>
					<EmptyState
						headingLevel={4}
						icon="inbox"
						title="No briefs yet"
						action={
							<Button size="lg" iconStart="write">
								Write a brief
							</Button>
						}
						secondaryAction={<Link href="/#our-process">See how we work</Link>}
					>
						Tell us what you are building and we will come back with a plan within one business day.
					</EmptyState>
				</ThemePair>
			</Specimen>

			<Specimen title="Inline, illustration, long content" note="Inline sits inside a card, list or table. A filtered view that ends up empty should also announce it (a status region near the filters).">
				<ThemePair align="start">
					<Surface tone="raised" radius="lg" className={styles.wide}>
						<EmptyState
							size="inline"
							headingLevel={4}
							icon="search"
							title="No results for “brandng”"
							action={
								<Button size="md" variant="glass" iconStart="close">
									Clear the search
								</Button>
							}
						>
							Check the spelling or try a broader term.
						</EmptyState>
					</Surface>
					<Surface tone="raised" radius="lg" className={styles.wide}>
						<EmptyState size="inline" headingLevel={4} illustration={<StackIllustration />} title="Your saved case studies will appear here once you bookmark one from the work section">
							Bookmarks stay on this device.
						</EmptyState>
					</Surface>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('title · children'), 'string · ReactNode', '—', 'What is empty · why and what next'],
					[code('icon · illustration'), 'IconName · ReactNode', 'inbox · —', 'Both sit on the neutral tile'],
					[code('action · secondaryAction'), 'ReactNode', '—', 'One Button with a purpose icon · one Link'],
					[code('size'), 'page | inline', 'page', '60px or 40px tile'],
					[code('headingLevel'), '2–6', '2 page · 3 inline', 'Match the page outline'],
				]}
			/>
			<Usage use="First-run views, cleared lists and searches with no results." avoid="Errors (Alert), loading (Skeleton) or decoration on a page that does have content." />
		</ShowcaseSection>
	);
}

/* ───────────────────────── Popover ───────────────────────── */

function PopoverSection() {
	const { notify } = useToast();
	const shareUrl = 'https://yeta.studio/work/yeta-studio';
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			notify('Link copied to the clipboard', 'success');
		} catch {
			notify('Copy the link from the field instead', 'danger');
		}
	};

	return (
		<ShowcaseSection
			id="popover"
			eyebrow={EYEBROW}
			title="Popover"
			description="Interactive content that opens from a trigger on click and stays anchored to it: a non-modal dialog on the native Popover API (top layer, never clipped). Grows from the trigger's side with the transitions.dev Menu dropdown and flips when the viewport has no room."
		>
			<Specimen
				title="Default · title, form content"
				note="Enter or Space opens it and focus moves to the first control. Tab past the end, an outside press or Escape closes it; Escape and the close button return focus to the trigger."
			>
				<ThemePair>
					<Popover
						title="Share this project"
						trigger={
							<Button size="lg" iconStart="link">
								Share
							</Button>
						}
					>
						<Input label="Public link" readOnly defaultValue={shareUrl} />
						<Button size="md" iconStart="copy" onClick={copy}>
							Copy link
						</Button>
					</Popover>
				</ThemePair>
			</Specimen>

			<Specimen title="Sides, alignment, no title, disabled, long content" note="side top / bottom × align start / center / end. Without a title it needs a label. A disabled trigger (aria-disabled) never opens.">
				<ThemePair>
					<Popover
						side="top"
						align="center"
						title="This week"
						trigger={
							<Button size="lg" variant="glass" iconStart="calendar">
								Availability
							</Button>
						}
					>
						<Text size="sm">Two slots left for discovery calls: Thursday 10:00 and Friday 15:30 (GMT-3).</Text>
						<Button size="md" href="https://cal.com/yetastudio" iconStart="calendar">
							Book a call
						</Button>
					</Popover>
					<Popover label="About response times" align="end" trigger={<Button size="lg" variant="ghost" icon="info" label="About response times" />}>
						<Text size="sm">
							We answer every brief within one business day. Larger projects get a call before the estimate, so the numbers come from a real conversation
							and not from a form. <Link href="/#our-process">Our process</Link>
						</Text>
					</Popover>
					<Popover
						title="Unavailable"
						trigger={
							<Button size="lg" disabled iconStart="link">
								Share
							</Button>
						}
					>
						<Text size="sm">Never shown.</Text>
					</Popover>
				</ThemePair>
			</Specimen>

			<SpecTable
				columns={['Prop', 'Type', 'Default', 'Notes']}
				rows={[
					[code('trigger'), 'ReactElement', '—', 'Gets aria-expanded, aria-controls, aria-haspopup=dialog'],
					[code('title · label'), 'ReactNode · string', '—', 'Accessible name (title is visible)'],
					[code('side · align'), 'bottom | top · start | center | end', 'bottom · start', 'Flips to fit; clamped to the gutter'],
					[code('open · defaultOpen · onOpenChange'), 'boolean · boolean · fn', '— · false · —', 'Controlled or not'],
					[code('showClose'), 'boolean', 'with a title', 'Close button ("Close", translated)'],
				]}
			/>
			<Usage use="Small interactive panels tied to a control: share, quick settings, a short form or explanation with a link." avoid="Plain hints on hover (Tooltip), lists of actions (a menu), or anything long or blocking (Dialog)." />
		</ShowcaseSection>
	);
}

export default function FeedbackGallery() {
	return (
		<>
			<AlertSection />
			<BadgeSection />
			<SpinnerSection />
			<SkeletonSection />
			<ProgressBarSection />
			<ProgressIndicatorSection />
			<EmptyStateSection />
			<PopoverSection />
		</>
	);
}
