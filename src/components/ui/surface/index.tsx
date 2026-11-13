//! React Core
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SurfaceProps = HTMLAttributes<HTMLElement> & {
	as?: ElementType;
	children?: ReactNode;
	/** Fill: page canvas, one step raised, translucent glass, faint tint, or none. */
	tone?: 'canvas' | 'raised' | 'glass' | 'tint' | 'none';
	radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill';
	padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
	/** The Figma hairline stroke + inset bevel. On by default. */
	bevel?: boolean;
};

/** The shell every card, panel and bar is built from. */
export function Surface({
	as: Component = 'div',
	tone = 'canvas',
	radius = 'xl',
	padding = 'none',
	bevel = true,
	className,
	children,
	...rest
}: SurfaceProps) {
	return (
		<Component
			className={cx(
				styles.surface,
				styles[`tone-${tone}`],
				styles[`radius-${radius}`],
				styles[`padding-${padding}`],
				bevel && 'u-bevel',
				className
			)}
			{...rest}
		>
			{children}
		</Component>
	);
}

export default Surface;
