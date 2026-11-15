'use client';

//! React Core
import { useId } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/*
 * The "YETA" block monogram drawn inline, from the same artwork as
 * /brand/brand-mark-{light,dark}-transparent.svg (480 canvas, four tiles, one vertical gradient each).
 * The header uses it: an <img> mark waits for its own request, and on a slow phone connection that
 * request (queued behind the page's scripts) was the landing's largest contentful paint. Inline, the
 * mark paints with the first frame. Gradient ids come from useId, so any number of marks can share
 * a page.
 */

const TILES = [
	{
		d: 'M55.5725 50.5C53.8816 50.5 50.5 51.7681 50.5 56.8406V192.529C50.5 194.22 51.5145 197.601 55.5725 197.601H58.1087H108.833V197.9V220.428C108.833 222.118 109.848 225.5 113.906 225.5H162.094C163.785 225.5 167.167 224.486 167.167 220.428V197.601H220.428C222.118 197.601 225.5 196.646 225.5 192.825V55.5725C225.5 53.8816 224.486 50.5 220.428 50.5H166.75L138 79.25L109.25 50.5H55.5725Z',
		x: 138,
		top: 50.5,
		bottom: 225.5,
	},
	{
		d: 'M259.572 50.5C257.882 50.5 254.5 51.7681 254.5 56.8406V192.529V219.25C254.5 223 257 225.5 259.5 225.5H424.5C427 225.5 429.5 223 429.5 219.25V196.75C429.5 193 427 190.5 424.5 190.5H399V179.25H424.355C426.022 179.25 429.355 178.25 429.355 174.25L429.428 140.5C429.428 138.833 428.428 135.5 424.428 135.5H399V124.25H424.355C426.855 124.25 429.355 121.75 429.355 119.25L429.5 55.5C429.5 53.8092 428.486 50.5 424.428 50.5H259.572Z',
		x: 342,
		top: 50.5,
		bottom: 225.5,
	},
	{
		d: 'M55.5725 254.5C53.8816 254.5 50.5 255.768 50.5 260.841V396.529C50.5 398.22 51.5145 401.602 55.5725 401.602H58.1087H108.833V401.901V424.428C108.833 426.119 109.848 429.5 113.906 429.5H162.094C163.785 429.5 167.167 428.486 167.167 424.428V401.602H220.428C222.118 401.602 225.5 400.646 225.5 396.825V259.573C225.5 257.882 224.486 254.5 220.428 254.5H55.5725Z',
		x: 138,
		top: 254.5,
		bottom: 429.5,
	},
	{
		d: 'M259.572 254.5C257.882 254.5 254.5 255.768 254.5 260.841V396.529V423.25C254.5 428.25 257.833 429.5 259.5 429.5H307C309.795 429.49 312 427 312 424.5V399.5H342H372V424.5C372 427 374.047 429.499 377 429.5H422C428 429.5 429.5 425.333 429.5 423.25V396.825V259.572C429.5 257.882 428.486 254.5 424.428 254.5H259.572Z',
		x: 342,
		top: 254.5,
		bottom: 429.5,
	},
] as const;

/**
 * The two canvases' fills, as the files draw them: ink for a light canvas, metal for a dark one.
 * Each stop's colour is a token, set by its class (see styles.module.css).
 */
const STOPS: Record<'light' | 'dark', ReadonlyArray<readonly [number, string]>> = {
	light: [
		[0, styles.inkTop],
		[0.6, styles.inkMid],
		[1, styles.inkBottom],
	],
	dark: [
		[0, styles.metalTop],
		[1, styles.metalBottom],
	],
};

function Glyph({ canvas, className }: { canvas: 'light' | 'dark'; className?: string }) {
	// useId's characters are not all safe inside url(#…), so keep only the plain ones
	const id = `bm-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
	return (
		<svg viewBox="0 0 480 480" fill="none" aria-hidden="true" focusable="false" className={className}>
			{TILES.map((tile, index) => (
				<path key={index} d={tile.d} fill={`url(#${id}-${index})`} />
			))}
			<defs>
				{TILES.map((tile, index) => (
					<linearGradient key={index} id={`${id}-${index}`} x1={tile.x} y1={tile.top} x2={tile.x} y2={tile.bottom} gradientUnits="userSpaceOnUse">
						{STOPS[canvas].map(([offset, stop]) => (
							<stop key={offset} offset={offset} className={stop} />
						))}
					</linearGradient>
				))}
			</defs>
		</svg>
	);
}

/** BrandMark (canvas="auto", transparent) drawn inline. Decorative: label the link around it. Size it with CSS. */
export function InlineBrandMark({ className }: { className?: string }) {
	return (
		<span className={cx(styles.frame, className)} aria-hidden="true">
			<Glyph canvas="light" className={cx(styles.mark, 'u-only-light')} />
			<Glyph canvas="dark" className={cx(styles.mark, 'u-only-dark')} />
		</span>
	);
}
