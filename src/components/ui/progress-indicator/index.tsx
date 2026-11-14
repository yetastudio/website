//! React Core
import type { HTMLAttributes, ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export type ProgressStep = {
	label: string;
	/** One short line under the label (a date, what happens in the step, what went wrong). */
	description?: ReactNode;
	/** Overrides the status derived from `current` (e.g. `error` on a step that failed). */
	status?: StepStatus;
};

export type ProgressIndicatorProps = Omit<HTMLAttributes<HTMLOListElement>, 'children'> & {
	steps: ProgressStep[];
	/** Index of the current step: earlier steps are complete, later ones upcoming. Past the end, all are complete. */
	current?: number;
	/** `horizontal` puts labels under a row of markers; `vertical` reads like a timeline. */
	orientation?: 'horizontal' | 'vertical';
	/** Accessible name of the list ("Project progress"). */
	label: string;
	/** Status words read after each step's label. Default to the page language (`common.ui.progressIndicator`). */
	statusLabels?: Partial<Record<StepStatus, string>>;
};

function useDefaultStatusLabels(): Record<StepStatus, string> {
	const t = useTranslations('common.ui.progressIndicator');
	return {
		complete: t('complete'),
		current: t('current'),
		upcoming: t('upcoming'),
		error: t('error'),
	};
}

function statusFor(index: number, current: number | undefined, own?: StepStatus): StepStatus {
	if (own) return own;
	if (current === undefined) return 'upcoming';
	if (index < current) return 'complete';
	return index === current ? 'current' : 'upcoming';
}

/**
 * Inspo component (component.gallery "Progress indicator", aka steps, stepper, timeline): where the
 * user is in a series of discrete steps. An ordered list; the current step has `aria-current="step"`
 * and every step's status is spelled out for assistive tech, never left to colour or shape.
 */
export function ProgressIndicator({
	steps,
	current,
	orientation = 'horizontal',
	label,
	statusLabels,
	className,
	...rest
}: ProgressIndicatorProps) {
	const words = { ...useDefaultStatusLabels(), ...statusLabels };
	return (
		<ol aria-label={label} className={cx(styles.steps, styles[orientation], className)} {...rest}>
			{steps.map((step, index) => {
				const status = statusFor(index, current, step.status);
				const last = index === steps.length - 1;
				const nextDone = statusFor(index + 1, current, steps[index + 1]?.status) !== 'upcoming';
				return (
					<li key={`${index}-${step.label}`} className={cx(styles.step, styles[status], last && styles.last)} aria-current={status === 'current' ? 'step' : undefined}>
						<span className={styles.marker} aria-hidden="true">
							{status === 'complete' && <Icon name="check" size="sm" />}
							{status === 'error' && <Icon name="alert" size="xl" />}
							{(status === 'current' || status === 'upcoming') && index + 1}
						</span>
						{!last && <span className={cx(styles.connector, status === 'complete' && nextDone && styles.connectorDone)} aria-hidden="true" />}
						<span className={styles.text}>
							<span className={styles.label}>
								{step.label}
								<span className="u-visually-hidden">{`, ${words[status]}`}</span>
							</span>
							{step.description && <span className={styles.description}>{step.description}</span>}
						</span>
					</li>
				);
			})}
		</ol>
	);
}

export default ProgressIndicator;
