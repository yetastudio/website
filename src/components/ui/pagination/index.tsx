'use client';

//! React Core
import type { ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Next Core
import { Link as LocaleLink, localeHref } from '@/i18n/navigation';

//! Components
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type PaginationProps = {
	/** Current page, 1-based. */
	page: number;
	/** Total number of pages. */
	pageCount: number;
	/** Buttons mode: called with the page to show. */
	onPageChange?: (page: number) => void;
	/** Links mode (server-rendered lists): the URL of a page. Takes precedence over onPageChange. */
	getHref?: (page: number) => string;
	/** Pages shown on each side of the current one. */
	siblingCount?: number;
	/** Pages always shown at the start and the end. */
	boundaryCount?: number;
	/**
	 * `full` numbered pages, `compact` "Page 3 of 12" between two arrows,
	 * `auto` full from 480px and compact on phones.
	 */
	variant?: 'full' | 'compact' | 'auto';
	/** Landmark name; defaults to the translated "Pagination". */
	label?: string;
	/** Accessible name of a page item. */
	pageLabel?: (page: number) => string;
	/** Compact status text. */
	statusLabel?: (page: number, pageCount: number) => ReactNode;
	className?: string;
};

type Slot = number | 'start-ellipsis' | 'end-ellipsis';

const range = (start: number, end: number) => Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

/** Same number of slots on every page, so the bar never changes width while paging. */
export function paginationSlots(page: number, count: number, siblingCount = 1, boundaryCount = 1): Slot[] {
	const startPages = range(1, Math.min(boundaryCount, count));
	const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);
	const siblingsStart = Math.max(Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
	const siblingsEnd = Math.min(Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2), endPages.length > 0 ? endPages[0] - 2 : count - 1);
	return [
		...startPages,
		...(siblingsStart > boundaryCount + 2 ? (['start-ellipsis'] as const) : boundaryCount + 1 < count - boundaryCount ? [boundaryCount + 1] : []),
		...range(siblingsStart, siblingsEnd),
		...(siblingsEnd < count - boundaryCount - 1 ? (['end-ellipsis'] as const) : count - boundaryCount > boundaryCount ? [count - boundaryCount] : []),
		...endPages,
	];
}

/**
 * Inspo component (component.gallery "Pagination"): moves between pages of a long list.
 * A labelled nav landmark around a list; the current page is aria-current="page" on the header's
 * white active pill; every item is named "Page n"; ellipses are decorative. Previous / Next stay
 * focusable at the ends (aria-disabled). Not the carousel's PaginationDots.
 */
export function Pagination({
	page,
	pageCount,
	onPageChange,
	getHref,
	siblingCount = 1,
	boundaryCount = 1,
	variant = 'auto',
	label,
	pageLabel = (n) => `Page ${n}`,
	statusLabel = (n, total) => (
		<>
			Page <strong>{n}</strong> of {total}
		</>
	),
	className,
}: PaginationProps) {
	const t = useTranslations('common');
	const count = Math.max(1, pageCount);
	const current = Math.min(Math.max(1, page), count);
	const atStart = current <= 1;
	const atEnd = current >= count;

	const go = (target: number) => {
		if (target !== current && target >= 1 && target <= count) onPageChange?.(target);
	};

	const step = (direction: -1 | 1, compact: boolean) => {
		const target = current + direction;
		const blocked = direction < 0 ? atStart : atEnd;
		const name = direction < 0 ? t('previous') : t('next');
		const icon: IconName = direction < 0 ? 'arrow-left' : 'arrow-right';
		const shared = {
			variant: 'ghost' as const,
			size: 'md' as const,
			disabled: blocked,
			className: styles.step,
			...(compact ? { icon, label: name } : direction < 0 ? { iconStart: icon } : { iconEnd: icon }),
		};
		const content = compact ? undefined : name;
		if (getHref && !blocked) {
			return (
				<Button {...shared} href={getHref(target)} rel={direction < 0 ? 'prev' : 'next'}>
					{content}
				</Button>
			);
		}
		return (
			<Button {...shared} onClick={() => go(target)}>
				{content}
			</Button>
		);
	};

	const pageItem = (n: number) => {
		const isCurrent = n === current;
		const shared = {
			className: cx(styles.page, isCurrent && styles.current),
			'aria-current': isCurrent ? ('page' as const) : undefined,
			'aria-label': pageLabel(n),
		};
		if (getHref) {
			const href = getHref(n);
			return href.startsWith('#') || /^(https?:)?\/\//.test(href) ? (
				<a href={href} {...shared}>
					{n}
				</a>
			) : (
				<LocaleLink href={localeHref(href)} {...shared}>
					{n}
				</LocaleLink>
			);
		}
		return (
			<button type="button" {...shared} onClick={() => go(n)}>
				{n}
			</button>
		);
	};

	const full = (
		<ul className={cx(styles.list, styles.full, variant === 'auto' && styles.autoFull)}>
			<li className={styles.edge}>{step(-1, false)}</li>
			{paginationSlots(current, count, siblingCount, boundaryCount).map((slot) =>
				typeof slot === 'number' ? (
					<li key={slot}>{pageItem(slot)}</li>
				) : (
					<li key={slot} className={styles.ellipsis} aria-hidden="true">
						<Icon name="ellipsis" size="sm" />
					</li>
				)
			)}
			<li className={styles.edge}>{step(1, false)}</li>
		</ul>
	);

	const compact = (
		<ul className={cx(styles.list, styles.compact, variant === 'auto' && styles.autoCompact)}>
			<li>{step(-1, true)}</li>
			<li className={styles.status} aria-live="polite">
				{statusLabel(current, count)}
			</li>
			<li>{step(1, true)}</li>
		</ul>
	);

	return (
		<nav aria-label={label ?? t('pagination')} className={cx(styles.pagination, className)}>
			{variant !== 'compact' && full}
			{variant !== 'full' && compact}
		</nav>
	);
}

export default Pagination;
