//! React Core
import type { HTMLAttributes, ReactNode } from 'react';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';
import { Heading, Text } from '@/components/ui/text';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
	/** What is empty, said plainly ("No projects yet"). */
	title: string;
	/** Why it is empty and what to do next. One or two sentences. */
	children?: ReactNode;
	/** A purpose icon on the neutral tile. */
	icon?: IconName;
	/** A small illustration instead of the icon; it sits on the same tile. Mark it decorative. */
	illustration?: ReactNode;
	/** One primary action, usually a Button with a purpose icon ("New project" + plus). */
	action?: ReactNode;
	/** An optional secondary way out, usually a Link ("Read the guide"). */
	secondaryAction?: ReactNode;
	/** `page` fills an empty view; `inline` sits inside a card, list or table. */
	size?: 'page' | 'inline';
	/** Heading level of the title in the page outline. Defaults to 2 for page, 3 for inline. */
	headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/**
 * Inspo component (component.gallery "Empty state"): says that there is nothing to show yet and
 * offers the way forward. Neutral throughout; the tile is the only graphic.
 */
export function EmptyState({
	title,
	children,
	icon = 'inbox',
	illustration,
	action,
	secondaryAction,
	size = 'page',
	headingLevel,
	className,
	...rest
}: EmptyStateProps) {
	const page = size === 'page';
	return (
		<div className={cx(styles.empty, styles[size], className)} {...rest}>
			<span className={cx(styles.tile, illustration ? styles.art : undefined, 'u-bevel')} aria-hidden="true">
				{illustration ?? <Icon name={icon} size={page ? 'xl' : 'lg'} />}
			</span>
			<div className={styles.copy}>
				<Heading level={headingLevel ?? (page ? 2 : 3)} size={page ? 'xl' : 'md'} weight="medium" tone="strong" leading="snug" align="center" balance>
					{title}
				</Heading>
				{children && (
					<Text as="div" size="sm" tone="subtle" align="center" className={styles.body}>
						{children}
					</Text>
				)}
			</div>
			{(action || secondaryAction) && (
				<div className={styles.actions}>
					{action}
					{secondaryAction}
				</div>
			)}
		</div>
	);
}

export default EmptyState;
