'use client';

//! React Core
import { useId } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** Where the arrow's tip sits inside the glyph at its default 20px size: the point that clicks. */
export const YETA_CURSOR_HOTSPOT = { x: 2, y: 1.5 } as const;

export type YetaCursorProps = {
	className?: string;
};

/**
 * The Figma Cursor glyph: a bevelled arrow, metallic body with an ink rim on a light canvas and
 * the reverse on a dark one. It is only drawn inside Stageshow scenes and tours (the kit's `yeta`
 * cursor style and the Why Yeta tour); the site never replaces the visitor's own pointer.
 * Gradient ids come from useId, so any number of cursors can share a page.
 */
export function YetaCursor({ className }: YetaCursorProps) {
	const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
	const fill = `yeta-cursor-fill-${id}`;
	const stroke = `yeta-cursor-stroke-${id}`;
	return (
		<svg className={cx(styles.cursor, className)} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path
				fill={`url(#${fill})`}
				stroke={`url(#${stroke})`}
				strokeWidth={1.5}
				d="M1.464 2.825c.995 5.4 2.578 10.843 3.997 15.788a1.003 1.003 0 0 0 1.752.343l4.102-5.22a1 1 0 0 1 .47-.33l5.302-1.768a.996.996 0 0 0 .245-1.77C12.854 6.843 8.16 3.822 3.538 1.322a1.41 1.41 0 0 0-2.074 1.502Z"
			/>
			<defs>
				<linearGradient id={fill} x1={10} x2={10} y1={0} y2={20.5} gradientUnits="userSpaceOnUse">
					<stop className={styles.fillTop} />
					<stop offset={1} className={styles.fillBottom} />
				</linearGradient>
				<linearGradient id={stroke} x1={10} x2={10} y1={0} y2={20.5} gradientUnits="userSpaceOnUse">
					<stop className={styles.strokeTop} />
					<stop offset={1} className={styles.strokeBottom} />
				</linearGradient>
			</defs>
		</svg>
	);
}

export default YetaCursor;
