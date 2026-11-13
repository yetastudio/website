//! React Core
import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarTone = 'neutral' | 'success' | 'warning' | 'danger';

export type ProgressBarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
	/** What is progressing ("Uploading brief.pdf"). Always the bar's accessible name. */
	label: string;
	/** Keeps the label for assistive tech only. */
	hideLabel?: boolean;
	/** Current value, 0 to `max`. Leave it out (or pass null) for an indeterminate bar. */
	value?: number | null;
	max?: number;
	/** Human reading of the value ("3 of 8 files"), shown instead of the percentage and used as aria-valuetext. */
	valueText?: string;
	/** Shows the percentage (or `valueText`) beside the label. On by default for a determinate bar. */
	showValue?: boolean;
	/** Track height: sm 4 · md 6 · lg 8. */
	size?: ProgressBarSize;
	/** Only for status: success when done, warning when stalled, danger when failed. Neutral ink otherwise. */
	tone?: ProgressBarTone;
	/** Helper text under the bar, linked with aria-describedby. */
	hint?: ReactNode;
};

/**
 * Inspo component (component.gallery "Progress bar"): how far a long task has got, continuously.
 * `role="progressbar"` with aria-valuenow / min / max; indeterminate bars omit aria-valuenow.
 * Under reduced motion the fill jumps instead of sliding and the indeterminate sweep becomes a slow fade.
 */
export function ProgressBar({
	label,
	hideLabel,
	value,
	max = 100,
	valueText,
	showValue,
	size = 'md',
	tone = 'neutral',
	hint,
	className,
	...rest
}: ProgressBarProps) {
	const id = useId();
	const labelId = `${id}-label`;
	const hintId = `${id}-hint`;
	const indeterminate = value === undefined || value === null;
	const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
	const ratio = max > 0 ? clamped / max : 0;
	const shownValue = valueText ?? `${Math.round(ratio * 100)}%`;
	const valueVisible = (showValue ?? !indeterminate) && !(indeterminate && !valueText);

	return (
		<div className={cx(styles.progress, styles[size], styles[`tone-${tone}`], indeterminate && styles.indeterminate, className)} {...rest}>
			<div className={cx(styles.header, hideLabel && !valueVisible && 'u-visually-hidden')}>
				<span id={labelId} className={cx(styles.label, hideLabel && 'u-visually-hidden')}>
					{label}
				</span>
				{valueVisible && (
					<span className={styles.value} aria-hidden="true">
						{shownValue}
					</span>
				)}
			</div>
			<div
				role="progressbar"
				aria-labelledby={labelId}
				aria-describedby={hint ? hintId : undefined}
				aria-valuemin={0}
				aria-valuemax={max}
				aria-valuenow={indeterminate ? undefined : clamped}
				aria-valuetext={valueText}
				className={styles.track}
			>
				<div className={styles.fill} style={{ '--progress': ratio } as CSSProperties} />
			</div>
			{hint && (
				<p id={hintId} className={styles.hint}>
					{hint}
				</p>
			)}
		</div>
	);
}

export default ProgressBar;
