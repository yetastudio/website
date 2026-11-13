'use client';

//! Hooks
import { useTranslations } from 'next-intl';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type PaginationDotsProps = {
	count: number;
	/** Zero-based active index. */
	index: number;
	onSelect?: (index: number) => void;
	/** What one page holds, for the accessible names ("Go to testimonial 2"). */
	itemLabel?: string;
	/**
	 * Autoplay: the active dot fills over `--autoplay-interval` and calls `onComplete` when full,
	 * which is the cue to advance. `paused` freezes the fill (hover, focus, off-screen).
	 */
	autoplay?: { paused: boolean; onComplete: () => void };
	className?: string;
};

/** Inspo component: the carousel position indicator. Dots are buttons when `onSelect` is set. */
export function PaginationDots({ count, index, onSelect, itemLabel, autoplay, className }: PaginationDotsProps) {
	const t = useTranslations('common');
	const noun = itemLabel ?? t('slide');
	// Keyed by index so the fill restarts from empty on every page, manual picks included.
	const fill = autoplay ? (
		<span
			key={index}
			className={styles.fill}
			data-paused={autoplay.paused || undefined}
			onAnimationEnd={autoplay.onComplete}
			aria-hidden="true"
		/>
	) : null;
	return (
		<div className={cx(styles.dots, autoplay && styles.autoplay, className)} role={onSelect ? 'group' : undefined} aria-label={t('pagination')}>
			{Array.from({ length: count }, (_, i) => {
				const active = i === index;
				return onSelect ? (
					<button
						key={i}
						type="button"
						className={cx(styles.dot, active && styles.active)}
						aria-label={t('goTo', { item: noun, number: i + 1 })}
						aria-current={active || undefined}
						onClick={() => onSelect(i)}
					>
						{active && fill}
					</button>
				) : (
					<span key={i} className={cx(styles.dot, active && styles.active)} aria-hidden="true">
						{active && fill}
					</span>
				);
			})}
		</div>
	);
}

export default PaginationDots;
