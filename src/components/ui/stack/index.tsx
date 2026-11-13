//! React Core
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** The `--space-*` steps. `gap={16}` reads `--space-16`. */
export type StackGap = 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 64 | 80 | 96 | 128;
export type StackDirection = 'vertical' | 'horizontal' | 'responsive';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between';

export type StackProps = HTMLAttributes<HTMLElement> & {
	children?: ReactNode;
	/** Element to render. Defaults to `div`. A `ul`/`ol` keeps its list role (`role="list"`). */
	as?: ElementType;
	/** `responsive` is vertical on phones and horizontal from 768px. */
	direction?: StackDirection;
	/** Space between children, from the `--space-*` scale. Defaults to 16. */
	gap?: StackGap;
	/** Cross-axis alignment. Defaults to `stretch` (vertical) and `center` (horizontal). */
	align?: StackAlign;
	/** Main-axis distribution. */
	justify?: StackJustify;
	/** Let children wrap onto new lines (horizontal stacks). */
	wrap?: boolean;
	/** A hairline between children, with the gap on both sides of it. */
	dividers?: boolean;
};

/**
 * Inspo component (component.gallery "Stack"): one direction, one gap from the space scale.
 * The layout primitive for vertical rhythm and rows of controls; it never pads or paints.
 */
export function Stack({
	as: Component = 'div',
	direction = 'vertical',
	gap = 16,
	align,
	justify,
	wrap,
	dividers,
	className,
	style,
	children,
	...rest
}: StackProps) {
	const isList = Component === 'ul' || Component === 'ol';
	const resolvedAlign = align ?? (direction === 'horizontal' ? 'center' : undefined);
	return (
		<Component
			// list-style: none drops list semantics in Safari; the explicit role keeps them.
			role={isList ? 'list' : undefined}
			className={cx(
				styles.stack,
				styles[direction],
				resolvedAlign && styles[`align-${resolvedAlign}`],
				justify && styles[`justify-${justify}`],
				wrap && styles.wrap,
				dividers && styles.dividers,
				className
			)}
			style={{ '--stack-gap': gap === 0 ? '0' : `var(--space-${gap})`, ...style } as CSSProperties}
			{...rest}
		>
			{children}
		</Component>
	);
}

export default Stack;
