//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Text } from '@/components/ui/text';
import { TESTIMONIALS } from '@/components/layout/content';
import { ResultsOneFigure } from './results-live';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { ResultFacts } from '../results';
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './results.module.css';

/** The three figures, read from the code (locales, themes, registry), so none is made up. */
const figuresOf = (facts: ResultFacts) => [
	{ key: 'locales', value: facts.locales, label: 'languages, one codebase', short: 'Languages' },
	{ key: 'themes', value: facts.themes, label: 'themes from one set of tokens', short: 'Themes' },
	{ key: 'components', value: facts.components, label: 'components in the registry', short: 'Components' },
];

/** The client lit in its own hue in the wordmark band (Craft Agency lights one name). */
const LIT_CLIENT = 1;

/**
 * Results A, after Fiasco: an italic serif “Impact” label, the studio's one-line belief, then three
 * thin oversized figures, each tied to the project it comes from. Neutral throughout; the one
 * accent is the hue dot before the label.
 */
function ResultsImpact({ facts }: { facts: ResultFacts }) {
	const why = useTranslations('whyYeta');
	const work = useTranslations('ourWork');
	const source = `${work('projects.yeta.name')}, ${work('projects.yeta.year')}`;
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.impact)}>
				<div className={styles.impactHead}>
					<span className={styles.impactLabel}>
						<span className={cx(shared.dot, shared.hued)} data-hue="green" aria-hidden="true" />
						<Text as="span" size="2xl" family="serif" italic tone="strong" leading="none">
							Impact
						</Text>
					</span>
					<Text size="lg" tone="subtle" leading="snug" className={styles.impactBelief}>
						{why.rich('p2', { serif: (chunks) => <Accent>{chunks}</Accent> })}
					</Text>
				</div>
				<ul className={styles.impactFigures}>
					{figuresOf(facts).map((figure) => (
						<li key={figure.key} className={styles.impactFigure}>
							<Text as="span" family="serif" weight="thin" tone="strong" leading="none" className={cx(styles.impactValue, shared.numeral)}>
								{figure.value}
							</Text>
							<Text as="span" size="sm" tone="strong" leading="snug">
								{figure.label}
							</Text>
							<Text as="span" size="xs" tone="faint">
								{source}
							</Text>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

/**
 * Results C, after Giga and Craft Agency: three short metrics under mono labels in the sky band, a
 * neutral raised surface with a faint blue tint (Giga), then the clients as serif wordmarks running
 * edge to edge (Craft Agency). The colour is the band's tint and the one client lit in its hue.
 */
function ResultsSky({ facts }: { facts: ResultFacts }) {
	const t = useTranslations('testimonials');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.sky)}>
				<div className={cx(shared.sky, styles.skyBand)}>
					<Text as="span" size="xs" tone="subtle" className={styles.mono}>
						Yeta Studio · in numbers
					</Text>
					<ul className={styles.skyStats}>
						{figuresOf(facts).map((figure) => (
							<li key={figure.key} className={styles.skyStat}>
								<Text as="span" size="2xs" tone="subtle" className={styles.mono}>
									{figure.short}
								</Text>
								<Text as="span" weight="medium" tone="strong" leading="none" className={cx(styles.skyValue, shared.numeral)}>
									{figure.value}
								</Text>
							</li>
						))}
					</ul>
				</div>
				<ul className={styles.skyClients} aria-label="Clients">
					{TESTIMONIALS.map((item, index) => (
						<li key={item.key}>
							<Text as="span" family="serif" tone={index === LIT_CLIENT ? 'strong' : 'faint'} className={styles.skyWordmark}>
								{index === LIT_CLIENT ? (
									<span className={cx(styles.skyLit, shared.hued)} data-hue={item.hue}>
										{t(`items.${item.key}.company`)}
									</span>
								) : (
									t(`items.${item.key}.company`)
								)}
							</Text>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const RESULTS_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Impact', refs: 'Fiasco', Component: ResultsImpact },
	{ id: 'b', label: 'One figure', refs: 'Craft Agency', Component: ResultsOneFigure },
	{ id: 'c', label: 'Sky ledger', refs: 'Giga, Craft Agency', Component: ResultsSky },
];
