//! React Core
import type { HTMLAttributes, ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

type BaseProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	/** sm 16px · md 20px tall. */
	size?: BadgeSize;
	/** Status hue. It only ever colours the dot; the label and the count stay neutral. */
	tone?: BadgeTone;
};

type LabelBadge = BaseProps & {
	variant?: 'label';
	/** Short status or metadata: one or two words. */
	children: ReactNode;
	label?: undefined;
	count?: undefined;
	max?: undefined;
	showZero?: undefined;
};

type DotBadge = BaseProps & {
	variant: 'dot';
	/** What the dot means ("New messages"). Read by assistive tech; without it the dot is decorative. */
	label?: string;
	children?: undefined;
	count?: undefined;
	max?: undefined;
	showZero?: undefined;
};

type CountBadge = BaseProps & {
	variant: 'count';
	count: number;
	/** Above it the badge reads `{max}+`. Defaults to 99. */
	max?: number;
	/** Show the badge at 0 (hidden by default). */
	showZero?: boolean;
	/** What is counted ("unread messages"): read as "3 unread messages", with the exact number past `max`. */
	label?: string;
	children?: undefined;
};

export type BadgeProps = LabelBadge | DotBadge | CountBadge;

/**
 * Inspo component (component.gallery "Badge"): a small status or metadata label that sits next to,
 * or on, something bigger. Distinct from `Chip`, the frosted pill for tags, eyebrows and filters:
 * a Badge is smaller, squarer, never interactive, and states the condition of the thing it annotates.
 */
export function Badge({ variant = 'label', size = 'md', tone = 'neutral', label, count = 0, max = 99, showZero, children, className, ...rest }: BadgeProps) {
	if (variant === 'dot') {
		return (
			<span className={cx(styles.dotOnly, styles[`dot-${size}`], styles[`tone-${tone}`], className)} {...rest}>
				{label && <span className="u-visually-hidden">{label}</span>}
			</span>
		);
	}

	if (variant === 'count') {
		if (count <= 0 && !showZero) return null;
		const shown = count > max ? `${max}+` : String(count);
		return (
			<span className={cx(styles.badge, styles.count, styles[size], className)} {...rest}>
				<span aria-hidden={label ? true : undefined}>{shown}</span>
				{label && <span className="u-visually-hidden">{`${count} ${label}`}</span>}
			</span>
		);
	}

	return (
		<span className={cx(styles.badge, styles.label, styles[size], 'u-bevel', className)} {...rest}>
			{tone !== 'neutral' && <span className={cx(styles.dot, styles[`tone-${tone}`])} aria-hidden="true" />}
			{children}
		</span>
	);
}

export default Badge;
