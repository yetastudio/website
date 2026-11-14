'use client';

//! React Core
import { useCallback, useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from 'react';

//! Next Core
import NextImage, { type ImageProps as NextImageProps } from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ImageAspect = '1/1' | '4/3' | '3/2' | '16/9' | '21/9' | '3/4' | '9/16';
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ImageProps = Omit<NextImageProps, 'fill' | 'className' | 'style' | 'onLoad' | 'onError'> & {
	/** Artwork for the dark canvas. Paired with `src` the way the brand marks are (`u-only-light` / `u-only-dark`). */
	srcDark?: NextImageProps['src'];
	/** Frame ratio. With it the image fills the frame (next/image `fill`, so pass `sizes`); without it, pass `width` and `height`. */
	aspect?: ImageAspect;
	/** `cover` crops to the frame, `contain` letterboxes inside it. Only with `aspect`. */
	fit?: 'cover' | 'contain';
	/** Radius + the Figma bevel. On by default; `false` draws the bare image. */
	frame?: boolean;
	radius?: ImageRadius;
	/** Renders `figure` + `figcaption`. */
	caption?: ReactNode;
	/** A pulsing placeholder until the image loads, then the transitions.dev "Skeleton reveal" cross-fade. Needs JS. */
	skeleton?: boolean;
	/** Text shown when the image fails to load. Defaults to the translated "Image unavailable". */
	fallbackLabel?: string;
	className?: string;
};

type Status = 'loading' | 'loaded' | 'error';

/**
 * Inspo component (component.gallery "Image"): next/image in the site's frame. Framed images get the
 * radius and bevel of every other surface; a light/dark pair swaps with the theme; a failed load keeps the
 * frame and shows an icon with the alt text instead of a broken image.
 */
export function Image({
	src,
	srcDark,
	alt,
	aspect,
	fit = 'cover',
	frame = true,
	radius = 'lg',
	caption,
	skeleton = false,
	fallbackLabel,
	sizes,
	width,
	height,
	className,
	...rest
}: ImageProps) {
	const ui = useTranslations('common.ui.image');
	const fallbackText = fallbackLabel ?? ui('unavailable');
	const [status, setStatus] = useState<Status>('loading');
	const [pulsing, setPulsing] = useState(skeleton);
	const lightRef = useRef<HTMLImageElement>(null);
	const darkRef = useRef<HTMLImageElement>(null);

	const onLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
		if (event.currentTarget.naturalWidth > 0) setStatus('loaded');
	}, []);
	const onError = useCallback(() => setStatus('error'), []);

	// An image that finished before hydration fires no load event React can see: read its state once.
	useEffect(() => {
		const shown = [lightRef.current, darkRef.current].find((node) => node && node.offsetParent !== null) ?? lightRef.current;
		if (!shown?.complete) return;
		setStatus(shown.naturalWidth > 0 ? 'loaded' : 'error');
	}, []);

	const revealed = status !== 'loading';
	const fill = aspect !== undefined;
	const shared = {
		alt,
		sizes: fill ? (sizes ?? '100vw') : sizes,
		fill: fill || undefined,
		// next/image refuses width/height next to fill.
		width: fill ? undefined : width,
		height: fill ? undefined : height,
		onLoad,
		onError,
		...rest,
	};

	const frameNode = (
		<div
			className={cx(
				styles.frame,
				fill ? styles.ratio : styles.intrinsic,
				aspect && styles[`aspect-${aspect.replace('/', '-')}`],
				frame && styles[`radius-${radius}`],
				frame && 'u-bevel',
				skeleton && 't-skel',
				skeleton && revealed && 'is-revealed',
				status === 'error' && styles.failed,
				caption ? undefined : className
			)}
		>
			{skeleton && (
				<div
					className={cx('t-skel-skeleton', styles.skeleton, pulsing && 'is-pulsing')}
					aria-hidden="true"
					onTransitionEnd={(event) => {
						if (event.target === event.currentTarget && revealed) setPulsing(false);
					}}
				>
					<span className={styles.bone} />
				</div>
			)}
			<div className={cx(skeleton && 't-skel-content', styles.content)}>
				<NextImage ref={lightRef} src={src} {...shared} className={cx(styles.image, styles[fit], srcDark !== undefined && 'u-only-light')} />
				{srcDark !== undefined && <NextImage ref={darkRef} src={srcDark} {...shared} className={cx(styles.image, styles[fit], 'u-only-dark')} />}
			</div>
			{status === 'error' && (
				<div className={styles.fallback} role="img" aria-label={alt || fallbackText}>
					<Icon name="image-off" size="lg" />
					<span className={styles.fallbackLabel} aria-hidden="true">
						{fallbackText}
					</span>
				</div>
			)}
		</div>
	);

	if (!caption) return frameNode;
	return (
		<figure className={cx(styles.figure, fill && styles.figureFill, className)}>
			{frameNode}
			<figcaption className={styles.caption}>{caption}</figcaption>
		</figure>
	);
}

export default Image;
