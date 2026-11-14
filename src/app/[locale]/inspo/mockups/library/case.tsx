//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import { Wordmark } from '@/components/ui/brand';
import { BOOKING_URL } from '@/components/layout/sections';
import { SHOTS, TESTIMONIALS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';
import type { ResultFacts } from '../results';

//! Styles
import shared from './shared.module.css';
import styles from './case.module.css';

const HERO_FACTS = ['year', 'country', 'industry', 'services'] as const;
const SHEET_FACTS = ['client', 'year', 'country', 'industry', 'services', 'url'] as const;

/** The project sheet's values: Client is the project's name, the rest share their fact key. */
const SHEET_KEYS: Record<(typeof SHEET_FACTS)[number], string> = {
	client: 'name',
	year: 'year',
	country: 'country',
	industry: 'industry',
	services: 'services',
	url: 'url',
};

/** basement.studio's palette strip: the case's own neutral roles, then its six accents as slivers. */
const NEUTRALS = ['raised', 'canvas', 'control', 'subtle', 'ink'] as const;
const HUES = ['pink', 'orange', 'yellow', 'green', 'blue', 'violet'] as const;

/** A project shot in both themes, filling its frame. */
function Shot({ index, alt, sizes }: { index: number; alt: string; sizes: string }) {
	return (
		<>
			<Image src={SHOTS[index].light} alt={alt} fill sizes={sizes} className={cx(shared.image, 'u-only-light')} />
			<Image src={SHOTS[index].dark} alt="" fill sizes={sizes} className={cx(shared.image, 'u-only-dark')} />
		</>
	);
}

/**
 * Case A, after Deel and COLLINS: the hero on the site's inverse band (Deel's dark band on the light
 * page), the wordmark as the title and one line (COLLINS). The facts card
 * straddles the band's lower edge; the shots run off the frame's right edge below it.
 */
function CaseStraddle() {
	const t = useTranslations('ourWork');
	const project = (key: string) => t(`projects.yeta.${key}`);
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.straddle)}>
				<div className={cx(styles.straddleBand, 'scheme-inverse')}>
					<h3 className={styles.straddleTitle}>
						<Wordmark canvas="inverse" alt={project('name')} />
					</h3>
					<Text size="sm" tone="subtle" leading="normal" className={styles.straddleLine}>
						{project('result')}
					</Text>
				</div>
				<Surface tone="raised" radius="lg" padding="md" bevel className={styles.straddleFacts}>
					<dl className={styles.factGrid}>
						{HERO_FACTS.map((fact) => (
							<div key={fact} className={styles.fact}>
								<Text as="dt" size="xs" tone="faint">
									{t(`facts.${fact}`)}
								</Text>
								<Text as="dd" size="sm" tone="strong">
									{project(fact)}
								</Text>
							</div>
						))}
					</dl>
				</Surface>
				<div className={styles.straddleStrip}>
					{[0, 1].map((index) => (
						<div key={index} className={cx(styles.shot, styles.straddleShot)}>
							<Shot index={index} alt={index === 0 ? `${project('name')}, screen 1` : ''} sizes="(min-width: 1024px) 320px, 80vw" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Case B, after basement.studio: a compact facts table and a short narrative in a rail on the left,
 * the brand gallery on the right with a palette strip between the shots. The strip holds the case's
 * neutral roles; the accent is its last swatch, the six brand hues as thin slivers.
 */
function CaseRail() {
	const t = useTranslations('ourWork');
	const project = (key: string) => t(`projects.yeta.${key}`);
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.rail)}>
				<div className={styles.railSheet}>
					<Text as="span" size="xs" tone="faint">
						{t('caseStudy')}
					</Text>
					<Text as="h3" size="2xl" family="serif" weight="regular" leading="tight" tone="strong">
						{project('name')}
					</Text>
					<dl className={styles.railFacts}>
						{SHEET_FACTS.map((fact) => (
							<div key={fact} className={styles.railFact}>
								<Text as="dt" size="xs" tone="faint">
									{t(`facts.${fact}`)}
								</Text>
								<Text as="dd" size="xs" tone="strong">
									{project(SHEET_KEYS[fact])}
								</Text>
							</div>
						))}
					</dl>
					<Text size="sm" tone="subtle" leading="normal">
						{project('about')}
					</Text>
				</div>
				<div className={styles.railGallery}>
					<div className={styles.shot}>
						<Shot index={0} alt={`${project('name')}, screen 1`} sizes="(min-width: 1024px) 300px, 80vw" />
					</div>
					<div className={styles.railPalette}>
						<span className={styles.railSwatches} aria-hidden="true">
							{NEUTRALS.map((swatch) => (
								<span key={swatch} className={styles.railSwatch} data-swatch={swatch} />
							))}
							<span className={cx(styles.railSwatch, styles.railHues)}>
								{HUES.map((hue) => (
									<span key={hue} className={cx(styles.railSliver, shared.hued)} data-hue={hue} />
								))}
							</span>
						</span>
						<Text as="span" size="xs" tone="faint">
							Palette
						</Text>
					</div>
					<div className={styles.shot}>
						<Shot index={2} alt="" sizes="(min-width: 1024px) 300px, 80vw" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Case C, after Granola: a soft close. The case's numbers as three stat cards stacked on one tile,
 * beside a client's words in the Editorial serif and one outline call to action. The figures are
 * read from the code (locales, themes, registry). The tile is the accent: a neutral surface veiled
 * over the blue wash at 90%, so the hue only shows through as a tint.
 */
function CaseClose({ facts }: { facts: ResultFacts }) {
	const t = useTranslations('testimonials');
	const cta = useTranslations('ourProcess');
	const voice = TESTIMONIALS[0];
	const stats = [
		{ key: 'locales', value: facts.locales, label: 'languages from one codebase' },
		{ key: 'themes', value: facts.themes, label: 'themes from one set of tokens' },
		{ key: 'components', value: facts.components, label: 'components in the system' },
	];
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.close)}>
				<ul className={cx(styles.closeTile, shared.tint, shared.hued)} data-hue="blue">
					{stats.map((stat) => (
						<li key={stat.key}>
							<Surface tone="raised" radius="lg" padding="sm" bevel className={styles.closeStat}>
								<Text as="span" size="3xl" family="serif" weight="regular" leading="none" tone="strong" className={shared.numeral}>
									{stat.value}
								</Text>
								<Text as="span" size="xs" tone="subtle" leading="snug">
									{stat.label}
								</Text>
							</Surface>
						</li>
					))}
				</ul>
				<figure className={styles.closeVoice}>
					<blockquote className={styles.closeQuote}>
						<Text family="serif" size="lg" weight="regular" leading="snug" tone="strong">
							{t(`items.${voice.key}.quote`)}
						</Text>
					</blockquote>
					<figcaption className={styles.closePerson}>
						<Avatar name={t(`items.${voice.key}.name`)} src={voice.avatar} size="md" />
						<span className={styles.closeName}>
							<Text as="span" size="xs" weight="medium" tone="strong">
								{t(`items.${voice.key}.name`)}
							</Text>
							<Text as="span" size="xs" tone="faint">
								{`${t(`items.${voice.key}.role`)}, ${t(`items.${voice.key}.company`)}`}
							</Text>
						</span>
					</figcaption>
					<Button href={BOOKING_URL} variant="glass" size="md" iconStart="calendar">
						{cta('button')}
					</Button>
				</figure>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const CASE_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Straddle', refs: 'Deel, COLLINS', Component: CaseStraddle },
	{ id: 'b', label: 'Facts rail', refs: 'basement.studio', Component: CaseRail },
	{ id: 'c', label: 'Soft close', refs: 'Granola', Component: CaseClose },
];
