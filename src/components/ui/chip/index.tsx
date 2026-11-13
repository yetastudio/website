//! React Core
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ChipTone = 'neutral' | 'pink' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet' | 'red';
export type ChipSize = 'xs' | 'sm' | 'lg' | 'xl';

export type ChipProps = HTMLAttributes<HTMLElement> & {
	children?: ReactNode;
	/**
	 * xs  Figma Size=Small (19px, 10px label)
	 * sm  section subtitle (22.8px, 12px label) — Small ×1.2 on the landing
	 * lg  Figma Size=Large (30px, 14px label, 14px icon)
	 * xl  floating feature chip (42.5px, 19.7px label) — Large ×1.40625 on the landing
	 */
	size?: ChipSize;
	/** `tint` is the frosted 5% fill (default). `solid` uses the control surface, as the feature chips do. */
	fill?: 'tint' | 'solid';
	/** Leading icon. */
	icon?: IconName;
	/** Colour of the leading icon. The label always stays neutral. */
	tone?: ChipTone;
	/** Element to render; pass `button` or `a` to get the hover state. */
	as?: ElementType;
	href?: string;
};

const iconSize = { xs: 'sm', sm: 'sm', lg: 'sm', xl: 'lg' } as const;

/** The Figma Chip / Badge: a frosted pill used for section eyebrows and feature tags. */
export function Chip({ children, size = 'sm', fill = 'tint', icon, tone = 'neutral', as: Component = 'span', className, ...rest }: ChipProps) {
	const interactive = Component === 'button' || Component === 'a';
	return (
		<Component
			className={cx(styles.chip, styles[size], styles[fill], interactive && styles.interactive, 'u-bevel', className)}
			{...(Component === 'button' ? { type: 'button' } : {})}
			{...rest}
		>
			{icon && <Icon name={icon} size={iconSize[size]} className={cx(styles.icon, styles[`tone-${tone}`])} />}
			{children}
		</Component>
	);
}

export default Chip;
