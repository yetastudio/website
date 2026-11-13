//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Accordion, AccordionItem, Button, Heading, Icon, LogoMark, Surface, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';
import { SHOTS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './why.module.css';

const REASONS = ['insight', 'together', 'luck', 'vision', 'pixel', 'defy'] as const;

/** Studio Freight's principles: a reason as the line, and the copy that already backs it as the body. */
const PRINCIPLES = [
	{ reason: 'insight', body: 'p1' },
	{ reason: 'together', body: 'p2' },
	{ reason: 'vision', body: 'highlights.goals' },
	{ reason: 'pixel', body: 'highlights.ideas' },
] as const;

/** The reasons the brief fragment ticks off (Cursor). */
const BRIEF = ['insight', 'vision', 'pixel'] as const;

const pad = (index: number) => String(index + 1).padStart(2, '0');

/**
 * Why A, after Metalab: a serif claim, then the six reasons as numbered cells in hairline-ruled
 * columns, a calm ledger of short claims instead of a grid of icons. The only colour is the hue dot
 * beside the eyebrow.
 */
function WhyLedger() {
	const t = useTranslations('whyYeta');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.ledger)}>
				<span className={styles.eyebrow}>
					<span className={cx(shared.dot, shared.hued)} data-hue="pink" aria-hidden="true" />
					<Text as="span" size="xs" tone="subtle">
						{t('featuresLabel')}
					</Text>
				</span>
				<Heading level={3} size="4xl" family="serif" weight="regular" leading="tight" tone="strong" className={styles.ledgerClaim}>
					{t.rich('p3', { em: (chunks) => <Accent>{chunks}</Accent> })}
				</Heading>
				<ol className={styles.ledgerCells}>
					{REASONS.map((reason, index) => (
						<li key={reason} className={styles.ledgerCell}>
							<Text as="span" size="sm" family="serif" italic tone="faint" className={shared.numeral}>
								{pad(index)}
							</Text>
							<Text as="span" size="lg" tone="strong" leading="snug">
								{t(`features.${reason}`)}
							</Text>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}

/**
 * Why B, after Studio Freight: the reasons set as large serif lines that open in place, the first
 * one open with a site we built and the paragraph behind it. The system Accordion carries the
 * motion (card resize). The accent is the open line's numeral, which takes the hue.
 */
function WhyPrinciples() {
	const t = useTranslations('whyYeta');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, shared.hued, styles.principles)} data-hue="violet">
				<header className={styles.principlesHead}>
					<Text as="span" size="xs" tone="subtle">
						{t('chip')}
					</Text>
					<Heading level={3} size="xl" leading="tight" tone="strong">
						{t('title')}
					</Heading>
				</header>
				<Accordion>
					{PRINCIPLES.map((principle, index) => (
						<AccordionItem
							key={principle.reason}
							defaultOpen={index === 0}
							title={
								<span className={styles.principleTitle}>
									<Text as="span" size="sm" family="serif" italic tone="faint" className={cx(styles.principleNumber, shared.numeral)}>
										{pad(index)}
									</Text>
									<Text as="span" size="2xl" family="serif" weight="regular" leading="tight" tone="strong" className={styles.principleLine}>
										{t(`features.${principle.reason}`)}
									</Text>
								</span>
							}
						>
							<div className={cx(styles.principleBody, index === 0 && styles.principleBodyShot)}>
								{index === 0 && (
									<div className={styles.principleShot}>
										<Image src={SHOTS[0].light} alt="" fill sizes="160px" className={cx(shared.image, styles.centered, 'u-only-light')} />
										<Image src={SHOTS[0].dark} alt="" fill sizes="160px" className={cx(shared.image, styles.centered, 'u-only-dark')} />
									</div>
								)}
								<Text size="sm" tone="subtle" leading="normal">
									{t.rich(principle.body, { serif: (chunks) => <Accent>{chunks}</Accent> })}
								</Text>
							</div>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}

/**
 * Why C, after Cursor and Legora: three frosted tiles, each a short claim over a real interface
 * fragment cropped by the tile's edge instead of an icon (a brief ticking off our reasons, a site
 * we built, the booking pill). The accent is the ticks in the brief.
 */
function WhyFragments() {
	const t = useTranslations('whyYeta');
	const hero = useTranslations('hero');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.fragments)}>
				<Heading level={3} size="2xl" weight="regular" leading="snug" tone="strong" className={styles.fragmentsClaim}>
					{t.rich('p2', { serif: (chunks) => <Accent>{chunks}</Accent> })}
				</Heading>
				<ul className={styles.fragmentsRow}>
					<li className={styles.fragmentItem}>
						<Surface tone="tint" radius="lg" padding="md" bevel className={styles.fragmentTile}>
							<Text size="sm" weight="medium" tone="strong" leading="snug">
								{t('highlights.goals')}
							</Text>
							<div className={styles.fragmentCrop}>
								<Surface tone="raised" radius="md" padding="md" bevel className={styles.fragmentBrief}>
									<ul className={cx(styles.briefList, shared.hued)} data-hue="green">
										{BRIEF.map((reason) => (
											<li key={reason} className={styles.briefItem}>
												<span className={styles.briefTick}>
													<Icon name="check" size="sm" />
												</span>
												<Text as="span" size="xs" tone="strong">
													{t(`features.${reason}`)}
												</Text>
											</li>
										))}
									</ul>
								</Surface>
							</div>
						</Surface>
					</li>
					<li className={styles.fragmentItem}>
						<Surface tone="tint" radius="lg" padding="md" bevel className={styles.fragmentTile}>
							<Text size="sm" weight="medium" tone="strong" leading="snug">
								{t('highlights.ideas')}
							</Text>
							<div className={styles.fragmentCrop}>
								<div className={styles.fragmentShot}>
									<Image src={SHOTS[2].light} alt="" fill sizes="(min-width: 1024px) 200px, 80vw" className={cx(shared.image, 'u-only-light')} />
									<Image src={SHOTS[2].dark} alt="" fill sizes="(min-width: 1024px) 200px, 80vw" className={cx(shared.image, 'u-only-dark')} />
								</div>
							</div>
						</Surface>
					</li>
					<li className={styles.fragmentItem}>
						<Surface tone="tint" radius="lg" padding="md" bevel className={styles.fragmentTile}>
							<Text size="sm" weight="medium" tone="strong" leading="snug">
								{t('highlights.collab')}
							</Text>
							<div className={styles.fragmentCrop}>
								<Surface tone="raised" radius="pill" padding="xs" bevel className={styles.fragmentBooking}>
									<LogoMark size={26} alt="" />
									<Button href={BOOKING_URL} variant="solid" size="sm" iconStart="calendar">
										{hero('letsBuild')}
									</Button>
								</Surface>
							</div>
						</Surface>
					</li>
				</ul>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const WHY_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Ledger', refs: 'Metalab', Component: WhyLedger },
	{ id: 'b', label: 'Principles', refs: 'Studio Freight', Component: WhyPrinciples },
	{ id: 'c', label: 'UI tiles', refs: 'Cursor, Legora', Component: WhyFragments },
];
