/* eslint-disable @next/next/no-img-element -- static brand SVGs: next/image adds nothing and would rasterise them. */

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** Which canvas the mark sits on. `auto` follows the site theme; `inverse` is for `.scheme-inverse` bands. */
export type BrandCanvas = 'auto' | 'inverse' | 'light' | 'dark';

type MarkProps = {
	/** Rendered size: px number or any CSS length (marks are square). */
	size?: number | string;
	canvas?: BrandCanvas;
	/** Accessible name. Pass an empty string when the mark is decorative next to the wordmark. */
	alt?: string;
	className?: string;
};

type FillableMarkProps = MarkProps & {
	/** `filled` sits on the bevelled tile; `transparent` is the bare artwork. */
	fill?: 'filled' | 'transparent';
};

/*
 * File naming follows Figma: "light" artwork is drawn for a LIGHT canvas
 * (dark shapes), "dark" artwork for a DARK canvas (light, metallic shapes).
 */
function src(name: string, canvas: 'light' | 'dark', fill?: string) {
	return fill ? `${name}-${canvas}-${fill}` : `${name}-${canvas}`;
}

function Mark({ name, fill, size = 60, canvas = 'auto', alt, className }: MarkProps & { name: string; fill?: string }) {
	const px = typeof size === 'number' ? size : 96;
	const common = { width: px, height: px, draggable: false, decoding: 'async' as const };
	if (canvas === 'light' || canvas === 'dark') {
		return (
			<img
				src={`/brand/${src(name, canvas, fill)}.svg`}
				alt={alt ?? ''}
				className={cx(styles.mark, className)}
				style={{ width: size, height: size }}
				{...common}
			/>
		);
	}
	// On an inverse band the canvas is the opposite of the site theme, so each theme shows the other artwork.
	const [onLightSite, onDarkSite] = canvas === 'inverse' ? (['dark', 'light'] as const) : (['light', 'dark'] as const);
	return (
		<span className={cx(styles.frame, className)} style={{ width: size, height: size }} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
			<img src={`/brand/${src(name, onLightSite, fill)}.svg`} className={cx(styles.mark, 'u-only-light')} {...common} alt="" />
			<img src={`/brand/${src(name, onDarkSite, fill)}.svg`} className={cx(styles.mark, 'u-only-dark')} {...common} alt="" />
		</span>
	);
}

/** The "YETA" block monogram. Primary identifier in the header and footer. */
export function BrandMark({ fill = 'transparent', alt = 'Yeta Studio', ...rest }: FillableMarkProps) {
	return <Mark name="brand-mark" fill={fill} alt={alt} {...rest} />;
}

/** The ✹ sunburst symbol. Used as the hero tile, favicon and avatar. */
export function LogoMark({ fill = 'filled', alt = 'Yeta Studio', ...rest }: FillableMarkProps) {
	return <Mark name="logo-mark" fill={fill} alt={alt} {...rest} />;
}

export type WordmarkProps = {
	canvas?: BrandCanvas;
	/** Accessible name. Pass an empty string when the name is already said next to it. */
	alt?: string;
	className?: string;
};

/**
 * The "Yeta ✹ Studio" lockup as the hero draws it: Funnel Display Bold in the display gradient with
 * the filled logo mark between the words (mark = 1.0714em, gap 16/89.6 of the type). Size it with
 * font-size. Use it wherever the studio's name appears as a logo, never a typed stand-in.
 */
export function Wordmark({ canvas = 'auto', alt = 'Yeta Studio', className }: WordmarkProps) {
	return (
		<span className={cx(styles.wordmark, className)} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
			<span className={styles.wordmarkWord} aria-hidden="true">
				Yeta
			</span>
			<LogoMark canvas={canvas} size="1.0714em" alt="" />
			<span className={styles.wordmarkWord} aria-hidden="true">
				Studio
			</span>
		</span>
	);
}

/** The expressive, rearranged monogram. Large, playful moments only. */
export function MessyBrandMark({ alt = 'Yeta Studio', ...rest }: MarkProps) {
	return <Mark name="messy-brand-mark" alt={alt} {...rest} />;
}

