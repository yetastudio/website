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
	children: ReactElement<{ 'aria-describedby'?: string; className?: string }>;
	side?: 'top' | 'bottom';
	className?: string;
};

/**
 * Inspo component: shows on hover and keyboard focus, never on touch.
 * The trigger references it with aria-describedby. Motion is the transitions.dev
 * "Tooltip": a short delay and a fade + scale in, an instant fade out (pure CSS).
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
	const id = useId();
	const trigger = isValidElement(children)
		? cloneElement(children, { 'aria-describedby': id, className: cx(children.props.className, 't-tt-trigger') })
		: children;
	return (
		<span className={cx('t-tt-wrap', styles.wrapper, className)}>
			{trigger}
			<span role="tooltip" id={id} className={cx('t-tt', styles.tooltip, styles[side])}>
				{content}
			</span>
		</span>
	);
}

export default Tooltip;
