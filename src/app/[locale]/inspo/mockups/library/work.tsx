//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Button, Chip, Heading, PaginationDots, Surface, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';
import { SHOTS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './work.module.css';

/** Quiet filters: the kinds of work we take on, not a count of clients. */
const FILTERS = ['All', 'Websites', 'Design systems'] as const;

/** One of our project shots, in the theme of the canvas it sits on. */
function Shot({ index, sizes, centered }: { index: number; sizes: string; centered?: boolean }) {
	return (
		<>
			<Image src={SHOTS[index].light} alt="" fill sizes={sizes} className={cx(shared.image, centered && styles.centered, 'u-only-light')} />
			<Image src={SHOTS[index].dark} alt="" fill sizes={sizes} className={cx(shared.image, centered && styles.centered, 'u-only-dark')} />
		</>
	);
}

/** The section statement, with its serif and italic words set in the Editorial accent. */
function useStatement() {
	const t = useTranslations('ourWork');
	return t.rich('intro', { serif: (chunks) => <Accent>{chunks}</Accent>, em: (chunks) => <Accent>{chunks}</Accent>, brmd: () => null });
}

/**
 * Work A, after Fiasco and Unseen Studio: a serif italic eyebrow over one calm statement, then an
 * offset pair of finished sites in neutral frames, each captioned with name and type across a
 * hairline (Unseen Studio). The last tile is left open for the next project, so the grid never
 * invents clients. The only colour is the hue dot beside the eyebrow.
 */
function WorkStaggered() {
	const t = useTranslations('ourWork');
	const statement = useStatement();
	const tiles = [
		{ shot: 0, note: t('projects.yeta.services') },
		{ shot: 1, note: `${t('projects.yeta.industry')} · ${t('projects.yeta.year')}` },
	];
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.staggered)}>
				<header className={styles.head}>
					<span className={styles.eyebrow}>
						<span className={cx(shared.dot, shared.hued)} data-hue="yellow" aria-hidden="true" />
						<Text as="span" size="lg" family="serif" italic tone="strong">
							Selected works
						</Text>
					</span>
					<Heading level={3} size="2xl" weight="regular" leading="snug" tone="strong" className={styles.statement}>
						{statement}
					</Heading>
				</header>
				<ul className={styles.staggeredGrid}>
					{tiles.map((tile) => (
						<li key={tile.shot} className={styles.staggeredItem}>
							<Surface tone="tint" radius="lg" padding="sm" bevel>
								<div className={styles.framedShot}>
									<Shot index={tile.shot} sizes="(min-width: 1024px) 260px, 90vw" />
								</div>
							</Surface>
							<div className={styles.caption}>
								<Text as="span" size="sm" weight="medium" tone="strong">
									{t('projects.yeta.name')}
								</Text>
								<Text as="span" size="xs" tone="subtle">
									{tile.note}
								</Text>
							</div>
						</li>
					))}
					<li className={cx(styles.staggeredItem, styles.open)}>
						<Text as="span" size="lg" family="serif" italic tone="subtle">
							Your project, next
						</Text>
						<Button href={BOOKING_URL} variant="ghost" size="sm" iconStart="plus">
							Start yours
						</Button>
					</li>
				</ul>
			</div>
		</div>
	);
}

/**
 * Work B, after Koto and Instrument: a narrow rail holds the serif statement, quiet pill filters
 * and one featured project card (Koto), while a tight bento of the finished site fills the rest
 * and lets the media tell the story (Instrument). The accent is the hue dot in the active filter.
 */
function WorkRail() {
	const t = useTranslations('ourWork');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.rail)}>
				<div className={styles.railIntro}>
					<Text as="span" size="xs" tone="subtle">
						{t('title')}
					</Text>
					<Heading level={3} size="2xl" family="serif" weight="regular" leading="tight" tone="strong" className={styles.railStatement}>
						{t('chip')}
					</Heading>
					<ul className={styles.filters} aria-label="Filters">
						{FILTERS.map((filter, index) => (
							<li key={filter}>
								<Chip size="sm" fill={index === 0 ? 'solid' : 'tint'}>
									{index === 0 && <span className={cx(shared.dot, shared.hued)} data-hue="green" aria-hidden="true" />}
									{filter}
								</Chip>
							</li>
						))}
					</ul>
				</div>
				<ul className={styles.bento}>
					{[0, 1, 2].map((shot) => (
						<li key={shot} className={styles.bentoTile}>
							<Shot index={shot} sizes="(min-width: 1024px) 300px, 90vw" centered />
						</li>
					))}
				</ul>
				<Surface tone="raised" radius="lg" padding="md" bevel className={styles.railCard}>
					<Text as="span" size="2xs" tone="faint">
						{t('caseStudy')}
					</Text>
					<Text as="span" size="md" weight="medium" tone="strong">
						{t('projects.yeta.name')}
					</Text>
					<Text as="span" size="xs" tone="subtle">
						{t('projects.yeta.industry')} · {t('projects.yeta.year')}
					</Text>
					<Button variant="glass" size="sm" className={styles.railCardAction}>
						{t('viewProject')}
					</Button>
				</Surface>
			</div>
		</div>
	);
}

/**
 * Work C, after Webflow and OFF+BRAND: a big centred statement on a pale band, then a peeking row
 * of large framed sites, the one in the middle carrying a frosted pill to its case (OFF+BRAND),
 * with the caption and the position under it. The only colour is the band's faint sky tint.
 */
function WorkPeek() {
	const t = useTranslations('ourWork');
	const statement = useStatement();
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.peek)}>
				<div className={cx(shared.sky, styles.peekBand)}>
					<Chip size="sm">{t('title')}</Chip>
					<Heading level={3} size="3xl" weight="regular" leading="tight" tone="strong" align="center" balance className={styles.peekTitle}>
						{statement}
					</Heading>
				</div>
				<div className={styles.peekTrack}>
					{[1, 0, 2].map((shot) => (
						<div key={shot} className={cx(styles.peekSlide, shot === 0 && styles.peekCurrent)} aria-hidden={shot !== 0 || undefined}>
							<Shot index={shot} sizes="(min-width: 1024px) 380px, 72vw" centered />
							{shot === 0 && (
								<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.peekPill}>
									<Button variant="ghost" size="sm">
										{t('viewProject')}
									</Button>
								</Surface>
							)}
						</div>
					))}
				</div>
				<div className={styles.peekFoot}>
					<Text size="xs" tone="subtle" align="center">
						<Text as="span" size="xs" weight="medium" tone="strong">
							{t('projects.yeta.name')}
						</Text>{' '}
						· {t('projects.yeta.industry')} · {t('projects.yeta.year')}
					</Text>
					<PaginationDots count={3} index={1} itemLabel={t('card')} />
				</div>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const WORK_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Staggered', refs: 'Fiasco, Unseen Studio', Component: WorkStaggered },
	{ id: 'b', label: 'Intro rail', refs: 'Koto, Instrument', Component: WorkRail },
	{ id: 'c', label: 'Peek row', refs: 'Webflow, OFF+BRAND', Component: WorkPeek },
];
