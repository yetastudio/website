//! React Core
import type { HTMLAttributes } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export type SpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'role'> & {
	/** The icon scale: sm 14 · md 18 · lg 20 · xl 24. */
	size?: SpinnerSize;
	/**
	 * What is loading ("Loading projects"). With it the spinner is a `role="status"` region and the
	 * label is read (visually hidden unless `showLabel`). Without it the ring is decorative: use that
	 * inside a control that already says it is busy (a Button with `loading` sets `aria-busy`).
	 */
	label?: string;
	/** Shows the label beside the ring. */
	showLabel?: boolean;
};

/**
 * Inspo component (component.gallery "Spinner"): an indeterminate wait, for a part of the page that
 * is not ready yet. Takes the current text colour; with reduced motion the ring stands still.
 */
export function Spinner({ size = 'md', label, showLabel, className, ...rest }: SpinnerProps) {
	return (
		<span
			role={label ? 'status' : undefined}
			aria-hidden={label ? undefined : true}
			className={cx(styles.spinner, styles[size], className)}
			{...rest}
		>
			<svg className={styles.ring} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
				<circle className={styles.track} cx="12" cy="12" r="9" />
				<circle className={styles.arc} cx="12" cy="12" r="9" pathLength={100} />
			</svg>
			{label && <span className={showLabel ? styles.label : 'u-visually-hidden'}>{label}</span>}
		</span>
	);
}

export default Spinner;
