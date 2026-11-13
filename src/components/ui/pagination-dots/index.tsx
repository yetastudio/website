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
	className?: string;
};

/** Inspo component: the carousel position indicator. Dots are buttons when `onSelect` is set. */
export function PaginationDots({ count, index, onSelect, itemLabel, className }: PaginationDotsProps) {
	const t = useTranslations('common');
	const noun = itemLabel ?? t('slide');
	return (
		<div className={cx(styles.dots, className)} role={onSelect ? 'group' : undefined} aria-label={t('pagination')}>
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
					/>
				) : (
					<span key={i} className={cx(styles.dot, active && styles.active)} aria-hidden="true" />
				);
			})}
		</div>
	);
}

export default PaginationDots;
