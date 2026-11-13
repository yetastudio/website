/* eslint-disable @next/next/no-img-element -- blob layers are vector art positioned by percentage. */

//! React Core
import type { CSSProperties, ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type TileHue = 'pink' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet';
/** Which Figma tile the geometry comes from. */
export type TileShape = 'craft' | 'craft-wide' | 'process' | 'testimonial' | 'testimonial-compact';

type Box = [left: number, top: number, width: number, height: number];
type Geometry = { base: Box; overlay: Box };

/*
 * Every Figma tile is a uniform scaling of one master group of blurred ellipses:
 * a normal-blend base and a hard-light overlay, flipped horizontally. These are
 * the measured boxes (px, relative to the tile's top-left) per tile shape and theme
 * (.design-system/specs/components-and-middle.md §0.5).
 */
const GEOMETRY: Record<TileShape, { dark: Geometry; light: Geometry }> = {
	craft: {
		dark: { base: [-242.07, -395.2, 709.33, 812.76], overlay: [-241.92, -504.44, 635.79, 922.01] },
		light: { base: [-352.24, -464.56, 1100.16, 1260.57], overlay: [-352, -634, 986.1, 1430.02] },
	},
	'craft-wide': {
		dark: { base: [-191.07, -328.2, 709.33, 812.76], overlay: [-190.92, -437.44, 635.79, 922.01] },
		light: { base: [-352.24, -464.56, 1100.16, 1260.57], overlay: [-352, -634, 986.1, 1430.02] },
	},
	process: {
		dark: { base: [-303.24, -505, 1100.16, 1260.57], overlay: [-303, -674.44, 986.1, 1430.02] },
		light: { base: [-352.24, -464.56, 1100.16, 1260.57], overlay: [-352, -634, 986.1, 1430.02] },
	},
	testimonial: {
		dark: { base: [-106.76, -281.82, 776.68, 889.93], overlay: [-106.59, -401.44, 696.16, 1009.55] },
		light: { base: [-169.74, -308.97, 788.69, 903.69], overlay: [-169.57, -430.44, 706.92, 1025.16] },
	},
	'testimonial-compact': {
		dark: { base: [-112.9, -295.59, 690.94, 791.69], overlay: [-112.75, -402, 619.31, 898.1] },
		light: { base: [-112.9, -295.59, 690.94, 791.69], overlay: [-112.75, -402, 619.31, 898.1] },
	},
};

/* Palette steps per theme. "dark"/"light" is the SITE theme; the tile itself is the inverse surface. */
const STEPS = {
	soft: { dark: '300-500', light: '200-300' },
	strong: { dark: '300-600', light: '200-400' },
} as const;

const STRONG_HUES: TileHue[] = ['pink', 'violet', 'orange'];

function boxStyle([left, top, width, height]: Box): CSSProperties {
	return { left, top, width, height };
}

function Layers({ hue, intensity, theme, shape }: { hue: TileHue; intensity: 'soft' | 'strong'; theme: 'dark' | 'light'; shape: TileShape }) {
	const steps = STEPS[intensity][theme];
	const geometry = GEOMETRY[shape][theme];
	return (
		<span className={cx(styles.layers, theme === 'dark' ? 'u-only-dark' : 'u-only-light')} aria-hidden="true">
			<span className={cx(styles.layer, styles.base)} style={boxStyle(geometry.base)}>
				<img src={`/landing/gradients/${theme}-${hue}-${steps}-base.svg`} alt="" draggable={false} />
			</span>
			<span className={cx(styles.layer, styles.overlay)} style={boxStyle(geometry.overlay)}>
				<img src={`/landing/gradients/${theme}-${hue}-${steps}-overlay.svg`} alt="" draggable={false} />
			</span>
		</span>
	);
}

export type GradientTileProps = {
	hue: TileHue;
	/** Hue used on the light site when Figma draws a different one there (Our Craft desktop). */
	hueLight?: TileHue;
	/** Geometry preset matching the Figma tile it reproduces. */
	shape?: TileShape;
	/** `strong` uses the deeper 600/400 steps (testimonials, pink · violet · orange only). */
	intensity?: 'soft' | 'strong';
	/** Content drawn above the blobs (a testimonial quote). */
	children?: ReactNode;
	/** Content drawn below the blobs, as Figma does with the tile icons. */
	underlay?: ReactNode;
	className?: string;
};

/**
 * The colour wash tile used by Craft, Process and Testimonial cards. It is the
 * inverse surface: pastel on the dark site, deep on the light site. Blob layers
 * are exported from Figma and blended with hard-light exactly as in the file.
 */
export function GradientTile({ hue, hueLight = hue, shape = 'craft', intensity = 'soft', children, underlay, className }: GradientTileProps) {
	const level = intensity === 'strong' && STRONG_HUES.includes(hue) && STRONG_HUES.includes(hueLight) ? 'strong' : 'soft';
	return (
		<div className={cx(styles.tile, 'scheme-inverse', 'u-outline', className)}>
			{underlay && <div className={styles.underlay}>{underlay}</div>}
			<Layers hue={hue} intensity={level} theme="dark" shape={shape} />
			<Layers hue={hueLight} intensity={level} theme="light" shape={shape} />
			{children && <div className={styles.content}>{children}</div>}
		</div>
	);
}

export default GradientTile;
