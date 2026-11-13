'use client';

//! React Core
import { useEffect, useRef, useState } from 'react';

//! GSAP
import { Expo, gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

//! Styles
import styles from './styles.module.css';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label[for], summary';

/**
 * The Figma Cursor: a bevelled arrow that follows a fine pointer. It hides over
 * interactive elements so the native pointer/text cursor communicates affordance.
 * Touch and coarse pointers never mount it.
 */
export default function Cursor() {
	const cursorRef = useRef<SVGSVGElement | null>(null);
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		const media = window.matchMedia('(hover: hover) and (pointer: fine)');
		const update = () => setEnabled(media.matches);
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle('has-custom-cursor', enabled);
		return () => root.classList.remove('has-custom-cursor');
	}, [enabled]);

	useGSAP(
		() => {
			const cursor = cursorRef.current;
			if (!enabled || !cursor) return;

			const moveX = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: Expo.easeOut });
			const moveY = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: Expo.easeOut });

			const onMove = (event: PointerEvent) => {
				cursor.dataset.visible = 'true';
				moveX(event.clientX);
				moveY(event.clientY);
			};
			const onOver = (event: PointerEvent) => {
				const target = event.target as Element | null;
				cursor.dataset.hidden = target?.closest(INTERACTIVE) ? 'true' : 'false';
			};
			const onLeave = () => {
				cursor.dataset.visible = 'false';
			};

			window.addEventListener('pointermove', onMove, { passive: true });
			document.addEventListener('pointerover', onOver, { passive: true });
			document.documentElement.addEventListener('pointerleave', onLeave);
			return () => {
				window.removeEventListener('pointermove', onMove);
				document.removeEventListener('pointerover', onOver);
				document.documentElement.removeEventListener('pointerleave', onLeave);
			};
		},
		{ dependencies: [enabled], revertOnUpdate: true }
	);

	if (!enabled) return null;

	return (
		<svg
			ref={cursorRef}
			className={styles.cursor}
			viewBox="0 0 20 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			data-cursor
			data-visible="false"
		>
			<path
				className={styles.arrow}
				strokeWidth={1.5}
				d="M1.464 2.825c.995 5.4 2.578 10.843 3.997 15.788a1.003 1.003 0 0 0 1.752.343l4.102-5.22a1 1 0 0 1 .47-.33l5.302-1.768a.996.996 0 0 0 .245-1.77C12.854 6.843 8.16 3.822 3.538 1.322a1.41 1.41 0 0 0-2.074 1.502Z"
			/>
			<defs>
				<linearGradient id="yeta-cursor-fill" x1={10} x2={10} y1={0} y2={20.5} gradientUnits="userSpaceOnUse">
					<stop className={styles.fillTop} />
					<stop offset={1} className={styles.fillBottom} />
				</linearGradient>
				<linearGradient id="yeta-cursor-stroke" x1={10} x2={10} y1={0} y2={20.5} gradientUnits="userSpaceOnUse">
					<stop className={styles.strokeTop} />
					<stop offset={1} className={styles.strokeBottom} />
				</linearGradient>
			</defs>
		</svg>
	);
}
