'use client';

//! React Core
import {
	Children,
	useEffect,
	useId,
	useRef,
	useState,
	type HTMLAttributes,
	type ReactNode,
	type TdHTMLAttributes,
	type ThHTMLAttributes,
} from 'react';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type TableSize = 'sm' | 'md';
export type TableSort = 'ascending' | 'descending' | 'none';

export type TableProps = Omit<HTMLAttributes<HTMLTableElement>, 'children'> & {
	children: ReactNode;
	/** What the table holds. It names the table and its scroll region, so it is required; hide it with `captionHidden`. */
	caption: ReactNode;
	/** Keep the caption for assistive tech only (when a visible heading right above already says it). */
	captionHidden?: boolean;
	/** Cell density: sm (compact rows) · md. */
	size?: TableSize;
	/** Tint every other body row. */
	zebra?: boolean;
	/** Tint the row under the pointer (read-across aid for wide tables). */
	hover?: boolean;
	/** Keep the header row visible while the body scrolls. The table scrolls inside a frame of fixed max height. */
	stickyHeader?: boolean;
	/** Class for the outer frame (layout only). */
	className?: string;
};

/**
 * Inspo component (component.gallery "Table"): a native table in a framed, scrollable region.
 * When the table is wider (or, with `stickyHeader`, taller) than its frame, the region becomes
 * focusable and labelled by the caption, so keyboard users can scroll it, and soft edge shadows
 * show which way there is more.
 */
export function Table({ children, caption, captionHidden, size = 'md', zebra, hover, stickyHeader, className, ...rest }: TableProps) {
	const captionId = useId();
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [overflow, setOverflow] = useState({ scrollable: false, start: false, end: false, top: false });

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		const measure = () => {
			const { scrollLeft, scrollWidth, clientWidth, scrollTop, scrollHeight, clientHeight } = scroller;
			// scrollLeft is negative in right-to-left layouts.
			const left = Math.abs(scrollLeft);
			const next = {
				scrollable: scrollWidth > clientWidth + 1 || scrollHeight > clientHeight + 1,
				start: left > 1,
				end: left + clientWidth < scrollWidth - 1,
				top: scrollTop > 1,
			};
			setOverflow((current) =>
				current.scrollable === next.scrollable && current.start === next.start && current.end === next.end && current.top === next.top ? current : next
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(scroller);
		if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
		scroller.addEventListener('scroll', measure, { passive: true });
		return () => {
			observer.disconnect();
			scroller.removeEventListener('scroll', measure);
		};
	}, []);

	return (
		<div
			className={cx(styles.frame, 'u-outline', stickyHeader && styles.sticky, captionHidden && styles.captionHidden, className)}
			data-overflow-start={overflow.start || undefined}
			data-overflow-end={overflow.end || undefined}
			data-scrolled={overflow.top || undefined}
		>
			{/* The visible caption sits outside the scroll area so it never scrolls away; the table keeps its own
			    (visually hidden) caption for its name, so this copy is hidden from assistive tech. */}
			{!captionHidden && (
				<div className={styles.caption} aria-hidden="true">
					{caption}
				</div>
			)}
			<div className={styles.viewport}>
				<span className={cx(styles.edge, styles.edgeStart)} aria-hidden="true" />
				<span className={cx(styles.edge, styles.edgeEnd)} aria-hidden="true" />
				<div
					ref={scrollerRef}
					className={styles.scroller}
					// Only a region that actually scrolls needs to be a tab stop.
					role={overflow.scrollable ? 'region' : undefined}
					aria-labelledby={overflow.scrollable ? captionId : undefined}
					tabIndex={overflow.scrollable ? 0 : undefined}
				>
					<table className={cx(styles.table, styles[`size-${size}`], zebra && styles.zebra, hover && styles.hover)} {...rest}>
						<caption id={captionId} className="u-visually-hidden">
							{caption}
						</caption>
						{children}
					</table>
				</div>
			</div>
		</div>
	);
}

export function TableHead({ className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
	return (
		<thead className={cx(styles.head, className)} {...rest}>
			{children}
		</thead>
	);
}

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> & {
	/** Shown in one full-width row when the body has no rows ("No invoices yet"). */
	empty?: ReactNode;
	/** Columns the empty row spans: the table's column count. */
	colSpan?: number;
};

export function TableBody({ empty, colSpan = 1, className, children, ...rest }: TableBodyProps) {
	const isEmpty = Children.toArray(children).length === 0;
	return (
		<tbody className={cx(styles.body, className)} {...rest}>
			{isEmpty && empty !== undefined ? (
				<tr className={styles.emptyRow}>
					<td colSpan={colSpan} className={styles.empty}>
						{empty}
					</td>
				</tr>
			) : (
				children
			)}
		</tbody>
	);
}

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
	/** A selected row (checkbox column): tinted. Pair with a checked Checkbox in the row. */
	selected?: boolean;
};

export function TableRow({ selected, className, children, ...rest }: TableRowProps) {
	return (
		<tr className={cx(styles.row, selected && styles.selected, className)} {...rest}>
			{children}
		</tr>
	);
}

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
	/** Numbers: end-aligned in tabular figures, so digits line up down the column. */
	numeric?: boolean;
};

export function TableCell({ numeric, className, children, ...rest }: TableCellProps) {
	return (
		<td className={cx(styles.cell, numeric && styles.numeric, className)} {...rest}>
			{children}
		</td>
	);
}

export type TableHeaderCellProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, 'onClick'> & {
	/** Numbers: end-aligned, like the cells below. */
	numeric?: boolean;
	/** Current sort of this column. Any value makes the header a sort button; `none` = sortable but unsorted. */
	sort?: TableSort;
	/** Called when the sort button is pressed. Cycle the sort in your state (none → ascending → descending). */
	onSort?: () => void;
};

/**
 * A column (`scope="col"`, default) or row (`scope="row"`) header. Sortable headers hold a button that
 * carries the column name; `aria-sort` sits on the header only while the column is sorted, as in the
 * WAI-ARIA APG sortable table.
 */
export function TableHeaderCell({ numeric, sort, onSort, scope = 'col', className, children, ...rest }: TableHeaderCellProps) {
	const sortable = sort !== undefined;
	const icon = sort === 'ascending' ? 'arrow-up' : sort === 'descending' ? 'arrow-down' : 'arrow-up-down';
	return (
		<th
			scope={scope}
			aria-sort={sortable && sort !== 'none' ? sort : undefined}
			className={cx(styles.headerCell, scope === 'row' && styles.rowHeader, numeric && styles.numeric, sortable && styles.sortable, className)}
			{...rest}
		>
			{sortable ? (
				<button type="button" className={cx(styles.sortButton, sort !== 'none' && styles.sorted)} onClick={onSort}>
					<span>{children}</span>
					<Icon name={icon} size="sm" className={styles.sortIcon} />
				</button>
			) : (
				children
			)}
		</th>
	);
}

export default Table;
