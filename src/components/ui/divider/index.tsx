//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type DividerProps = {
	orientation?: 'horizontal' | 'vertical';
	/** Purely visual by default. Set to true when it separates groups for assistive tech. */
	semantic?: boolean;
	className?: string;
};

/** Inspo component: the hairline used between footer columns and in case-study rows. */
export function Divider({ orientation = 'horizontal', semantic = false, className }: DividerProps) {
	return (
		<div
			className={cx(styles.divider, styles[orientation], className)}
			{...(semantic ? { role: 'separator', 'aria-orientation': orientation } : { 'aria-hidden': true })}
		/>
	);
}

export default Divider;
