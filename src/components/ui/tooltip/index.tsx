'use client';

//! React Core
import { cloneElement, isValidElement, useId, type ReactElement } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type TooltipProps = {
	/** Supplementary text. Never the only label: icon buttons still need their own `label`. */
	content: string;
	/** A single focusable element. */
	children: ReactElement<{ 'aria-describedby'?: string }>;
	side?: 'top' | 'bottom';
	className?: string;
};

/**
 * Inspo component: shows on hover and keyboard focus, never on touch.
 * The trigger references it with aria-describedby.
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
	const id = useId();
	const trigger = isValidElement(children) ? cloneElement(children, { 'aria-describedby': id }) : children;
	return (
		<span className={cx(styles.wrapper, className)}>
			{trigger}
			<span role="tooltip" id={id} className={cx(styles.tooltip, styles[side])}>
				{content}
			</span>
		</span>
	);
}

export default Tooltip;
