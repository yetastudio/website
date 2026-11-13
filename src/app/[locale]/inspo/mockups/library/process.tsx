//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Heading, Text } from '@/components/ui';
import { PROCESS } from '@/components/layout/content';
import { ProcessOneStep, ProcessRail } from './process-live';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './process.module.css';

/**
 * Process A, after Trawelt: the kickoff line as a light serif line over a heavy sans line, then the
 * six steps as ruled rows led by a giant thin numeral, so the numbers alone carry the hierarchy. The
 * list is cropped by a fade at its foot instead of running long. All neutral: the only colour is
 * the small hue dot each step already owns.
 */
function ProcessNumerals() {
	const t = useTranslations('ourProcess');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.numerals)}>
				<Heading level={3} family="serif" weight="light" leading="tight" tone="strong" className={styles.numeralsTitle}>
					{t.rich('kickoff', { em: (chunks) => <span className={styles.numeralsSans}>{chunks}</span> })}
				</Heading>
				<ol className={styles.numeralsRows}>
					{PROCESS.map((step, index) => (
						<li key={step.key} className={styles.numeralsRow}>
							<Text as="span" family="serif" weight="thin" tone="faint" leading="none" className={cx(styles.numeralsFigure, shared.numeral)}>
								{String(index + 1).padStart(2, '0')}
							</Text>
							<span className={styles.numeralsStep}>
								<span className={cx(shared.dot, shared.hued)} data-hue={step.hue} aria-hidden="true" />
								<Text as="span" size="xl" weight="medium" tone="strong" leading="tight">
									{t(`steps.${step.key}.title`)}
								</Text>
							</span>
							<Text size="sm" tone="subtle" leading="normal" className={styles.numeralsCopy}>
								{t(`steps.${step.key}.description`)}
							</Text>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const PROCESS_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Numerals', refs: 'Trawelt', Component: ProcessNumerals },
	{ id: 'b', label: 'Step rail', refs: 'Rox, Oevra', Component: ProcessRail },
	{ id: 'c', label: 'One step', refs: 'Atlas', Component: ProcessOneStep },
];
