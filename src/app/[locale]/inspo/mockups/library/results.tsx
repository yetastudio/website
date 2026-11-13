//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Text } from '@/components/ui';

//! Types
import type { ResultFacts } from '../results';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

/** The clients from the testimonials, plus us; one is lit in its brand hue (Craft Agency). */
const CLIENTS = ['jorge', 'marcelo', 'lisette'] as const;

/**
 * Library 07, Results and clients. Three figures as a ledger in the sky band (Metalab, Giga): a
 * large serif numeral, one caption and its source, between hairlines. Under it the clients set as
 * serif wordmarks running edge to edge, one lit (Craft Agency). Figures are read from the code, so
 * nothing here is made up.
 */
export function ResultsLedgerMockup({ facts }: { facts: ResultFacts }) {
	const t = useTranslations('testimonials');
	const figures = [
		{ value: facts.locales, label: 'languages, one codebase' },
		{ value: facts.themes, label: 'themes from one set of tokens' },
		{ value: facts.components, label: 'components in the registry' },
	];
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.ledger)}>
				<div className={cx(styles.sky, styles.ledgerSky)}>
					<Text as="span" size="lg" family="serif" italic tone="strong">
						Impact
					</Text>
					<ol className={styles.ledgerRows}>
						{figures.map((figure) => (
							<li key={figure.label} className={styles.ledgerRow}>
								<Text as="span" family="serif" weight="light" tone="strong" leading="none" className={cx(styles.ledgerFigure, styles.numeral)}>
									{figure.value}
								</Text>
								<span className={styles.ledgerCaption}>
									<Text as="span" size="sm" tone="strong">
										{figure.label}
									</Text>
									<Text as="span" size="xs" tone="subtle">
										Yeta Studio, 2025
									</Text>
								</span>
							</li>
						))}
					</ol>
				</div>
				<ul className={styles.ledgerClients} aria-label="Clients">
					{CLIENTS.map((client, index) => (
						<li key={client}>
							<Text
								as="span"
								family="serif"
								tone={index === 1 ? 'strong' : 'faint'}
								className={cx(styles.ledgerWordmark, index === 1 && styles.ledgerLit)}
							>
								{t(`items.${client}.company`)}
							</Text>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default ResultsLedgerMockup;
