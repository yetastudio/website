//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Text } from '@/components/ui';
import { PROCESS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

/**
 * Library 06, Our Process. The whole section on one wash (Ragged Edge), the kickoff line in the
 * Editorial serif, then the six steps as ruled rows led by a giant thin numeral (Trawelt): the
 * numbers carry the hierarchy, each step keeps its own dot of colour. The list fades out at the
 * foot instead of running long (fade crop).
 */
export function ProcessMockup() {
	const t = useTranslations('ourProcess');
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.process, styles.hued, 'scheme-light')} data-hue="green">
				<Text as="h3" size="3xl" family="serif" weight="regular" leading="tight" tone="strong" className={styles.processClaim}>
					{t.rich('kickoff', { em: (chunks) => <Accent>{chunks}</Accent> })}
				</Text>
				<ol className={styles.processRows}>
					{PROCESS.map((step, index) => (
						<li key={step.key} className={styles.processRow}>
							<Text as="span" family="serif" weight="light" tone="strong" leading="none" className={cx(styles.processNumeral, styles.numeral)}>
								{String(index + 1).padStart(2, '0')}
							</Text>
							<span className={styles.processText}>
								<span className={styles.processTitle}>
									<span className={cx(styles.navDot, styles.hued)} data-hue={step.hue} aria-hidden="true" />
									<Text as="span" size="xl" weight="medium" tone="strong">
										{t(`steps.${step.key}.title`)}
									</Text>
								</span>
								<Text size="sm" tone="subtle" leading="normal" className={styles.processCopy}>
									{t(`steps.${step.key}.description`)}
								</Text>
							</span>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}

export default ProcessMockup;
