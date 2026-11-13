//! React Core
import type { CSSProperties } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Button, Heading, Icon, LogoMark, Surface, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './nav.module.css';

/** The anchors the header links to, each with the wash its section is drawn in (mymind). */
const LINKS = [
	{ key: 'ourCraft', hue: 'pink' },
	{ key: 'ourWork', hue: 'yellow' },
	{ key: 'ourProcess', hue: 'green' },
] as const;

type NavLink = (typeof LINKS)[number];

/** How far down the page the capsule's scroll readout stands, in percent. */
const SCROLLED = 24;

/** A row of anchors; with `dots`, each one carries the small dot of its section's wash. */
function Links({ links, dots, className }: { links: ReadonlyArray<NavLink>; dots?: boolean; className?: string }) {
	const t = useTranslations('nav');
	return (
		<ul className={cx(styles.links, className)}>
			{links.map((link) => (
				<li key={link.key} className={styles.link}>
					{dots && <span className={cx(shared.dot, shared.hued)} data-hue={link.hue} aria-hidden="true" />}
					<Text as="span" size="sm" tone={dots ? 'strong' : 'subtle'}>
						{t(link.key)}
					</Text>
				</li>
			))}
		</ul>
	);
}

/**
 * Nav A, after Analogue Agency and mymind: one centred frosted pill and nothing else, the mark in
 * its middle with the anchors on either side, over a soft neutral burst it blurs. Each anchor
 * carries the dot of the wash its section is drawn in (mymind); the three dots are the only colour.
 * On a phone the anchors fold into Menu.
 */
function NavPill() {
	const t = useTranslations('nav');
	const common = useTranslations('common');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.pill)}>
				<span className={styles.pillBurst} aria-hidden="true" />
				<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.pillTray}>
					<span className={styles.narrowOnly}>
						<Button variant="ghost" size="sm" iconStart="menu">
							{common('menu')}
						</Button>
					</span>
					<Links links={LINKS.slice(0, 2)} dots className={styles.pillLinks} />
					<LogoMark size={28} alt="Yeta Studio" />
					<Links links={LINKS.slice(2)} dots className={styles.pillLinks} />
					<Button href={BOOKING_URL} variant="solid" size="sm" iconStart="calendar">
						{t('getInTouch')}
					</Button>
				</Surface>
				<Heading level={3} size="5xl" tone="display" className={cx(styles.hint, styles.pillHint)} aria-hidden="true">
					Yeta Studio
				</Heading>
			</div>
		</div>
	);
}

/**
 * Nav B, after Fourmula AI and Butter: the mark and the one action parked at the edges, and
 * between them a compact capsule holding Menu, the theme switch and a scroll readout (Fourmula).
 * The action keeps a tray of its own over a pale neutral gradient (Butter). The only colour is the
 * thin line that fills with the scroll.
 */
function NavCapsule() {
	const t = useTranslations('nav');
	const common = useTranslations('common');
	const hero = useTranslations('hero');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.capsule)}>
				<div className={styles.capsuleRow}>
					<LogoMark size={28} alt="Yeta Studio" />
					<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.capsuleTray}>
						<Button variant="ghost" size="sm" iconStart="menu">
							{common('menu')}
						</Button>
						<span className={styles.theme} aria-hidden="true">
							<span className={cx(styles.themeGlyph, styles.themeOn)}>
								<Icon name="sun" size="sm" />
							</span>
							<span className={styles.themeGlyph}>
								<Icon name="moon" size="sm" />
							</span>
						</span>
						<span
							className={cx(styles.scroll, shared.hued)}
							data-hue="blue"
							style={{ '--scroll-progress': `${SCROLLED}%` } as CSSProperties}
							aria-hidden="true"
						>
							<Text as="span" size="xs" tone="strong" className={shared.numeral}>
								{SCROLLED}%
							</Text>
							<span className={styles.scrollTrack}>
								<span className={styles.scrollFill} />
							</span>
						</span>
					</Surface>
					<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.actionTray}>
						<span className={styles.wideOnly}>
							<Button href={BOOKING_URL} variant="solid" size="sm" iconStart="calendar">
								{t('getInTouch')}
							</Button>
						</span>
						<span className={styles.narrowOnly}>
							<Button href={BOOKING_URL} variant="solid" size="sm" icon="calendar" label={t('getInTouch')} />
						</span>
					</Surface>
				</div>
				<Heading
					level={3}
					size="4xl"
					weight="regular"
					leading="tight"
					tone="display"
					className={cx(styles.hint, styles.capsuleHint)}
					aria-hidden="true"
				>
					{hero.rich('slogan', { great: (chunks) => chunks, luck: (chunks) => chunks, br: () => ' ' })}
				</Heading>
			</div>
		</div>
	);
}

/**
 * Nav C, after Büro and Cosmos: the hero stays untouched and the nav docks at the foot of the
 * view (Büro), a smoked capsule pinned dark on both canvases whose anchors sit dim and end in the
 * one lit action (Cosmos). The accent is the faint tinted halo behind that action, no wider than it.
 */
function NavDock() {
	const t = useTranslations('nav');
	const common = useTranslations('common');
	const hero = useTranslations('hero');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.dock)}>
				<Heading level={3} size="4xl" weight="regular" leading="tight" tone="strong" balance className={styles.dockSlogan}>
					{hero.rich('slogan', { great: (chunks) => chunks, luck: (chunks) => <Accent>{chunks}</Accent>, br: () => ' ' })}
				</Heading>
				<div className={cx(styles.dockBar, 'scheme-dark')}>
					<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.dockCapsule}>
						<span className={styles.dockMark}>
							<LogoMark canvas="dark" size={24} alt="Yeta Studio" />
						</span>
						<span className={styles.narrowOnly}>
							<Button variant="ghost" size="sm" iconStart="menu">
								{common('menu')}
							</Button>
						</span>
						<Links links={LINKS} className={styles.dockLinks} />
						<span className={cx(styles.dockLit, shared.hued)} data-hue="violet">
							<span className={styles.dockHalo} aria-hidden="true" />
							<span className={cx(styles.dockInk, 'scheme-light')}>
								<Button href={BOOKING_URL} variant="solid" size="sm" iconStart="calendar">
									{t('getInTouch')}
								</Button>
							</span>
						</span>
					</Surface>
				</div>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const NAV_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Centred pill', refs: 'Analogue Agency, mymind', Component: NavPill },
	{ id: 'b', label: 'Edge capsule', refs: 'Fourmula AI, Butter', Component: NavCapsule },
	{ id: 'c', label: 'Docked', refs: 'Büro, Cosmos', Component: NavDock },
];
