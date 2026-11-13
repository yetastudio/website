'use client';

//! React Core
import { useState } from 'react';

//! Components
import { Button, SegmentedControl, Surface, Text } from '@/components/ui';
import { PageSlide } from '../mockups/library/variants';

//! Types
import type { ShelfId } from '../data';
import type { ShelfVariant, VariantId } from '../mockups/library/variant-types';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type PlaygroundShelf = { id: ShelfId; title: string; variants: ShelfVariant[] };

type Theme = 'light' | 'dark';
type Page = 'landing' | 'case';

/** The sections between the header and the footer, per page, in reading order. */
const PAGES: Record<Page, ShelfId[]> = {
	landing: ['hero', 'value', 'services', 'work', 'process', 'stats', 'testimonials', 'about', 'cta'],
	case: ['case', 'cta'],
};

const THEMES = [
	{ value: 'light', label: 'Light', icon: 'sun' },
	{ value: 'dark', label: 'Dark', icon: 'moon' },
] as const;

const PAGE_OPTIONS = [
	{ value: 'landing', label: 'Landing' },
	{ value: 'case', label: 'Case study' },
] as const;

/**
 * The library mounted as a page. One theme at a time, pinned on this subtree only (the site's own
 * theme preference is left alone). Every section keeps a small A/B/C switch that fades in on hover
 * or focus; the toolbar can hide them all for a clean look.
 */
export function Playground({ shelves }: { shelves: PlaygroundShelf[] }) {
	const byId = Object.fromEntries(shelves.map((shelf) => [shelf.id, shelf])) as Record<ShelfId, PlaygroundShelf>;
	const [theme, setTheme] = useState<Theme>('light');
	const [page, setPage] = useState<Page>('landing');
	const [controls, setControls] = useState(true);
	const [picks, setPicks] = useState<Record<ShelfId, VariantId>>(
		() => Object.fromEntries(shelves.map((shelf) => [shelf.id, 'a'])) as Record<ShelfId, VariantId>,
	);
	const pick = (id: ShelfId) => (variant: VariantId) => setPicks((current) => ({ ...current, [id]: variant }));

	return (
		<div
			data-playground=""
			data-scheme={theme}
			data-controls={controls || undefined}
			className={cx(styles.root, theme === 'dark' ? 'scheme-dark' : 'scheme-light')}
		>
			<header className={styles.header} data-nav={picks.nav}>
				<Slot shelf={byId.nav} active={picks.nav} onPick={pick('nav')} />
			</header>
			<main id="main" className={styles.page}>
				{PAGES[page].map((id) => (
					<Slot key={`${page}-${id}`} shelf={byId[id]} active={picks[id]} onPick={pick(id)} />
				))}
			</main>
			<footer className={styles.footer}>
				<Slot shelf={byId.footer} active={picks.footer} onPick={pick('footer')} />
			</footer>

			<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.toolbar} role="toolbar" aria-label="Playground">
				<SegmentedControl label="Page" options={PAGE_OPTIONS} value={page} onChange={setPage} size="sm" />
				<SegmentedControl
					label="Theme"
					options={THEMES.map((option) => ({ ...option, iconOnly: true, ariaLabel: option.label }))}
					value={theme}
					onChange={setTheme}
					size="sm"
				/>
				<Button variant="ghost" size="sm" iconStart="eye" aria-pressed={controls} onClick={() => setControls((on) => !on)}>
					{controls ? 'Hide switches' : 'Show switches'}
				</Button>
			</Surface>
		</div>
	);
}

/** One section of the page: the proposal on show, and its switch in the corner. */
function Slot({ shelf, active, onPick }: { shelf: PlaygroundShelf; active: VariantId; onPick: (variant: VariantId) => void }) {
	const activeIndex = shelf.variants.findIndex((variant) => variant.id === active);
	return (
		<section className={styles.slot} data-slot={shelf.id} aria-label={shelf.title}>
			<PageSlide variants={shelf.variants} activeIndex={activeIndex} />
			<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.switch}>
				<Text as="span" size="xs" tone="subtle" className={styles.switchLabel}>
					{shelf.title}
				</Text>
				<SegmentedControl
					label={`${shelf.title} proposal`}
					options={shelf.variants.map((variant) => ({
						value: variant.id,
						label: variant.id.toUpperCase(),
						ariaLabel: `${variant.id.toUpperCase()}, ${variant.label}`,
					}))}
					value={active}
					onChange={onPick}
					size="sm"
				/>
			</Surface>
		</section>
	);
}

export default Playground;
