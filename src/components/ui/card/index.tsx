//! React Core
import { Children, isValidElement, type ElementType, type HTMLAttributes, type ReactNode } from 'react';

//! Next Core
import NextImage, { type ImageProps as NextImageProps } from 'next/image';

//! Components
import { Link } from '@/components/ui/link';
import { Surface } from '@/components/ui/surface';
import { Heading, Text } from '@/components/ui/text';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type CardVariant = 'elevated' | 'outlined' | 'glass';
export type CardLayout = 'stacked' | 'row' | 'responsive';
export type CardPadding = 'sm' | 'md' | 'lg';
export type CardRadius = 'lg' | 'xl' | '2xl';
export type CardMediaAspect = '16/9' | '3/2' | '4/3' | '1/1' | '21/9';

export type CardProps = HTMLAttributes<HTMLElement> & {
	children: ReactNode;
	/** Element to render. Defaults to `article`; use `li` inside a list of cards, `div` when it holds no heading. */
	as?: ElementType;
	/**
	 * `elevated`: the raised surface with the Figma bevel (default).
	 * `outlined`: no fill, the grouping stroke (sits on any canvas).
	 * `glass`: the translucent nav material, for cards over imagery or the pattern.
	 */
	variant?: CardVariant;
	/** Media on top (`stacked`), beside the text (`row`), or stacked on phones and beside from 768px (`responsive`). */
	layout?: CardLayout;
	/** Inner padding: sm 8 · md 12 · lg 16. The media frame's radius follows (card radius − padding). */
	padding?: CardPadding;
	radius?: CardRadius;
};

/**
 * Inspo component (component.gallery "Card"): one entity (a project, an article, a person) on a Surface.
 * Put the card's one primary link on `CardHeader href`: its hit area covers the whole card and the card
 * lifts on hover. Other buttons and links stay separate targets above it. Without a link it stays still.
 */
export function Card({
	as = 'article',
	variant = 'elevated',
	layout = 'stacked',
	padding = 'md',
	radius = 'xl',
	className,
	children,
	...rest
}: CardProps) {
	const media: ReactNode[] = [];
	const content: ReactNode[] = [];
	Children.toArray(children).forEach((child) => {
		if (isValidElement(child) && child.type === CardMedia) media.push(child);
		else content.push(child);
	});

	return (
		<Surface
			as={as}
			tone={variant === 'elevated' ? 'raised' : variant === 'glass' ? 'glass' : 'none'}
			radius={radius}
			bevel={variant !== 'outlined'}
			className={cx(
				styles.card,
				styles[layout],
				styles[`padding-${padding}`],
				styles[`radius-${radius}`],
				variant === 'outlined' && 'u-outline',
				media.length > 0 && styles.hasMedia,
				className
			)}
			{...rest}
		>
			{media}
			{content.length > 0 && <div className={styles.content}>{content}</div>}
		</Surface>
	);
}

export type CardMediaProps = {
	/** Image source. Leave it out and pass children (a GradientTile, a scene, a video) to fill the frame instead. */
	src?: NextImageProps['src'];
	/** Artwork for the dark canvas, paired with `src` like the brand marks (`u-only-light` / `u-only-dark`). */
	srcDark?: NextImageProps['src'];
	/** Alt text. Empty (decorative) by default, because the card's title already names the entity. */
	alt?: string;
	sizes?: string;
	priority?: boolean;
	/** Frame ratio in the stacked layout. In a row the frame fills the card's height. */
	aspect?: CardMediaAspect;
	children?: ReactNode;
	className?: string;
};

/** The card's media frame: inset by the card padding, its radius nested inside the card's. */
export function CardMedia({ src, srcDark, alt = '', sizes = '(min-width: 768px) 40vw, 100vw', priority, aspect = '16/9', children, className }: CardMediaProps) {
	return (
		<div className={cx(styles.media, styles[`aspect-${aspect.replace('/', '-')}`], 'u-outline', className)}>
			{src !== undefined ? (
				<>
					<NextImage src={src} alt={alt} fill sizes={sizes} priority={priority} className={cx(styles.mediaImage, srcDark !== undefined && 'u-only-light')} />
					{srcDark !== undefined && <NextImage src={srcDark} alt={alt} fill sizes={sizes} priority={priority} className={cx(styles.mediaImage, 'u-only-dark')} />}
				</>
			) : (
				children
			)}
		</div>
	);
}

export type CardHeaderProps = {
	title: ReactNode;
	/** Small line above the title ("Case study", a date). */
	eyebrow?: ReactNode;
	/** Heading level for the title. Defaults to 3 (cards usually sit under a section's h2). */
	level?: 2 | 3 | 4 | 5 | 6;
	/** The card's primary link. Its hit area covers the whole card; external URLs open in a new tab. */
	href?: string;
	/** One trailing element beside the title (an icon Button, a Chip). Stays clickable above the card link. */
	action?: ReactNode;
	className?: string;
};

export function CardHeader({ title, eyebrow, level = 3, href, action, className }: CardHeaderProps) {
	return (
		<div className={cx(styles.header, className)}>
			<div className={styles.heading}>
				<Heading level={level} size="lg" weight="medium" tone="strong" leading="snug" className={styles.title}>
					{href ? (
						<Link href={href} variant="nav" className={styles.primaryLink}>
							{title}
						</Link>
					) : (
						title
					)}
				</Heading>
				{/* After the heading in the DOM so the title is read first; drawn above it. */}
				{eyebrow && (
					<Text as="p" size="xs" tone="subtle" leading="snug" className={styles.eyebrow}>
						{eyebrow}
					</Text>
				)}
			</div>
			{action && <div className={styles.action}>{action}</div>}
		</div>
	);
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cx(styles.body, className)} {...rest}>
			{children}
		</div>
	);
}

/** Actions and facts at the bottom. Pinned to the bottom edge when cards in a grid share a height. */
export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cx(styles.footer, className)} {...rest}>
			{children}
		</div>
	);
}

export default Card;
