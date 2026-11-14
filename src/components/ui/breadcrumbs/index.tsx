//! React Core
import type { ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { DropdownMenu, MenuItem } from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Link } from '@/components/ui/link';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type BreadcrumbItem = {
	label: string;
	/** Ancestor URL. The last item is the current page and never renders as a link. */
	href?: string;
};

export type BreadcrumbsProps = {
	/** Least to most specific; the last one is the current page. */
	items: ReadonlyArray<BreadcrumbItem>;
	/** Landmark name, so it is told apart from the main navigation. */
	label?: string;
	separator?: 'chevron' | 'slash';
	/** Collapse the middle of the trail into an overflow menu past this many items. */
	maxItems?: number;
	/** Items kept before the overflow menu (the root). */
	itemsBeforeCollapse?: number;
	/** Items kept after it (the parent and the current page). */
	itemsAfterCollapse?: number;
	/** Accessible name of the overflow button. */
	moreLabel?: string;
	size?: 'sm' | 'md';
	className?: string;
};

/**
 * Inspo component (component.gallery "Breadcrumbs"): a labelled nav landmark around an ordered
 * list. Separators are decorative (aria-hidden), the current page carries aria-current="page" and
 * is plain text. Long trails keep the root and the last levels and fold the rest into a
 * DropdownMenu of links. Links are locale-aware (the DS Link).
 */
export function Breadcrumbs({
	items,
	label,
	separator = 'chevron',
	maxItems = 4,
	itemsBeforeCollapse = 1,
	itemsAfterCollapse = 2,
	moreLabel,
	size = 'md',
	className,
}: BreadcrumbsProps) {
	const ui = useTranslations('common.ui.breadcrumbs');
	const moreText = moreLabel ?? ui('more');
	const collapse = items.length > maxItems && itemsBeforeCollapse + itemsAfterCollapse < items.length;
	const head = collapse ? items.slice(0, itemsBeforeCollapse) : items;
	const hidden = collapse ? items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse) : [];
	const tail = collapse ? items.slice(items.length - itemsAfterCollapse) : [];
	const last = items.length - 1;

	const sep = (
		<span className={styles.separator} aria-hidden="true">
			{separator === 'chevron' ? <Icon name="chevron-right" size="sm" /> : '/'}
		</span>
	);

	const crumb = (item: BreadcrumbItem, index: number): ReactNode => {
		const current = index === last;
		return (
			<li key={`${index}-${item.label}`} className={styles.item}>
				{index > 0 && sep}
				{current || !item.href ? (
					<span className={cx(styles.text, current && styles.current)} aria-current={current ? 'page' : undefined} title={item.label}>
						{item.label}
					</span>
				) : (
					<Link href={item.href} variant="nav" className={styles.link} title={item.label}>
						<span className={styles.text}>{item.label}</span>
					</Link>
				)}
			</li>
		);
	};

	return (
		<nav aria-label={label ?? ui('label')} className={cx(styles.breadcrumbs, styles[size], className)}>
			<ol className={styles.list}>
				{head.map((item, index) => crumb(item, index))}
				{collapse && (
					<li className={styles.item}>
						{sep}
						<DropdownMenu
							label={moreText}
							trigger={{ variant: 'ghost', size: 'sm', icon: 'ellipsis', label: moreText, className: styles.more }}
						>
							{hidden.map((item) => (
								<MenuItem key={item.label} href={item.href}>
									{item.label}
								</MenuItem>
							))}
						</DropdownMenu>
					</li>
				)}
				{tail.map((item, index) => crumb(item, items.length - itemsAfterCollapse + index))}
			</ol>
		</nav>
	);
}

export default Breadcrumbs;
