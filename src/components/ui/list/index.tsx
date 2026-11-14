//! React Core
import { Children, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';
import { Link } from '@/components/ui/link';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ListVariant = 'unordered' | 'ordered' | 'description' | 'rows';
export type ListMarker = 'dot' | 'dash' | 'none';
export type ListTone = 'neutral' | 'pink' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet';

export type ListProps = HTMLAttributes<HTMLElement> & {
	children?: ReactNode;
	/** `unordered` (ul), `ordered` (ol, numbered 01, 02…), `description` (dl of term/value pairs), `rows` (ul of rich rows). */
	variant?: ListVariant;
	/** Unordered marker. A ListItem `icon` replaces it for that item. */
	marker?: ListMarker;
	/** Marker colour: neutral, or one brand hue kept to the marker (a dot, a number). */
	tone?: ListTone;
	/** Body size: sm 14 · md 16. Rows always use the compact scale. */
	size?: 'sm' | 'md';
	/** Description lists: term beside its value (`inline`, the case-study facts) or above it (`stacked`). */
	layout?: 'inline' | 'stacked';
	/** Rows and description lists: draw the outlined well around the list. */
	framed?: boolean;
	/** Ordered lists: the first number. */
	start?: number;
	/** Shown in place of the list when it has no items (a paragraph, so no "list, 0 items"). */
	empty?: ReactNode;
};

/**
 * Inspo component (component.gallery "List"): unordered, ordered, description and row lists.
 * Lists drop the native bullets for brand markers, so `role="list"` keeps their semantics in Safari.
 */
export function List({
	variant = 'unordered',
	marker = 'dot',
	tone = 'neutral',
	size = 'md',
	layout = 'inline',
	framed = false,
	start,
	empty,
	className,
	style,
	children,
	...rest
}: ListProps) {
	const classes = cx(
		styles.list,
		styles[variant],
		styles[`size-${size}`],
		styles[`tone-${tone}`],
		variant === 'unordered' && styles[`marker-${marker}`],
		variant === 'description' && styles[`layout-${layout}`],
		framed && styles.framed,
		framed && 'u-outline',
		className
	);

	if (Children.toArray(children).length === 0) {
		return (
			<p className={cx(classes, styles.empty)} style={style} {...rest}>
				{empty}
			</p>
		);
	}

	if (variant === 'description') {
		return (
			<dl className={classes} style={style} {...rest}>
				{children}
			</dl>
		);
	}

	if (variant === 'ordered') {
		const counter = start !== undefined ? ({ counterReset: `yeta-list ${start - 1}` } as CSSProperties) : undefined;
		return (
			<ol role="list" start={start} className={classes} style={{ ...counter, ...style }} {...rest}>
				{children}
			</ol>
		);
	}

	return (
		<ul role="list" className={classes} style={style} {...rest}>
			{children}
		</ul>
	);
}

export type ListItemProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
	/** Item content; in a row, the line under the title. */
	children?: ReactNode;
	/** Description lists: the term (`dt`); children become its value (`dd`). */
	term?: ReactNode;
	/** Unordered and ordered lists: an icon in place of the marker for this item. */
	icon?: IconName;
	/** Rows: icon tile, avatar or thumbnail before the text. */
	leading?: ReactNode;
	/** Rows: the item's name. */
	title?: ReactNode;
	/** Rows: a short fact at the end (size, date, count). Tabular numbers. */
	meta?: ReactNode;
	/** Rows: one action (an icon Button, a Chip). Sits above the row link. */
	trailing?: ReactNode;
	/** Rows: makes the whole row open this URL; the title is the link. */
	href?: string;
};

/** One item of a List. Renders a `dt`/`dd` pair when given a `term`, a rich row when given a `title`, else a plain `li`. */
export function ListItem({ term, icon, leading, title, meta, trailing, href, className, children, ...rest }: ListItemProps) {
	if (term !== undefined) {
		return (
			<div className={cx(styles.pair, className)} {...rest}>
				<dt className={styles.term}>{term}</dt>
				<dd className={styles.value}>{children}</dd>
			</div>
		);
	}

	const isRow = title !== undefined || leading !== undefined || trailing !== undefined || meta !== undefined;
	if (isRow) {
		return (
			<li className={cx(styles.row, href && styles.rowInteractive, className)} {...rest}>
				{leading !== undefined && <div className={styles.leading}>{leading}</div>}
				<div className={styles.main}>
					{title !== undefined && (
						<div className={styles.title}>
							{href ? (
								<Link href={href} variant="nav" className={styles.rowLink}>
									{title}
								</Link>
							) : (
								title
							)}
						</div>
					)}
					{children !== undefined && <div className={styles.detail}>{children}</div>}
				</div>
				{meta !== undefined && <div className={styles.meta}>{meta}</div>}
				{trailing !== undefined && <div className={styles.trailing}>{trailing}</div>}
			</li>
		);
	}

	return (
		<li className={cx(styles.item, icon && styles.hasIcon, className)} {...rest}>
			{icon && (
				<span className={styles.iconMarker} aria-hidden="true">
					<Icon name={icon} size="sm" />
				</span>
			)}
			{children}
		</li>
	);
}

export default List;
