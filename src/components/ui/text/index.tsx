//! React Core
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'display';
export type TextTone = 'default' | 'strong' | 'subtle' | 'faint' | 'inverse' | 'danger' | 'display';
export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'thin';

export type TextProps = HTMLAttributes<HTMLElement> & {
	/** Element to render. Defaults to `p`. */
	as?: ElementType;
	children?: ReactNode;
	/** Type scale step. Defaults to `md` (16px). */
	size?: TextSize;
	/** Defaults to `light`, the weight Figma uses for running text. */
	weight?: TextWeight;
	/** Colour role. `display` paints the metallic/ink display gradient. */
	tone?: TextTone;
	/** `serif` is PP Editorial New, the editorial accent. */
	family?: 'sans' | 'serif';
	italic?: boolean;
	align?: 'start' | 'center' | 'end';
	/** Line height. Defaults to `normal`. */
	leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
	/** Balanced wrapping for short centred copy. */
	balance?: boolean;
};

/**
 * The text primitive. Every visible string goes through Text, Heading or Accent,
 * so size, weight, colour and tracking always come from tokens.
 */
export function Text({
	as: Component = 'p',
	size = 'md',
	weight = 'light',
	tone = 'default',
	family = 'sans',
	italic,
	align,
	leading = 'normal',
	balance,
	className,
	children,
	...rest
}: TextProps) {
	return (
		<Component
			className={cx(
				styles.text,
				styles[`size-${size}`],
				styles[`weight-${weight}`],
				styles[`tone-${tone}`],
				styles[`leading-${leading}`],
				family === 'serif' && styles.serif,
				italic && styles.italic,
				align && styles[`align-${align}`],
				balance && styles.balance,
				className
			)}
			{...rest}
		>
			{children}
		</Component>
	);
}

export type HeadingProps = Omit<TextProps, 'as'> & {
	/** Semantic level. Size is independent: pick it with `size`. */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
};

/** Headings default to Funnel Display Bold at the tight (1.1) line height, the Figma Headline role. */
export function Heading({ level = 2, size = '4xl', weight = 'bold', leading = 'tight', ...rest }: HeadingProps) {
	const tag = `h${level}` as ElementType;
	return <Text as={tag} size={size} weight={weight} leading={leading} {...rest} />;
}

export type AccentProps = HTMLAttributes<HTMLElement> & {
	children: ReactNode;
	/** Editorial italic (default) or upright serif. */
	italic?: boolean;
	/** Hand-drawn feel underline used on calls to action ("free consultation", "kick things off"). */
	underline?: boolean;
};

/** An emphasised word set in PP Editorial New inside Funnel Display copy. */
export function Accent({ italic = true, underline, className, children, ...rest }: AccentProps) {
	return (
		<em className={cx(styles.accent, !italic && styles.upright, underline && styles.underline, className)} {...rest}>
			{children}
		</em>
	);
}

export default Text;
