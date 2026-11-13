'use client';

//! React Core
import { useEffect, useMemo, useState, type ReactNode } from 'react';

//! UI Core
import ReactLenis, { type LenisProps } from 'lenis/react';
import 'lenis/dist/lenis.css'; // html.lenis-stopped { overflow: clip } — locks the page behind dialogs

/**
 * Lenis smooth scrolling for the whole page. Anchor links scroll with an offset
 * that clears the fixed header. Wheel smoothing is off under prefers-reduced-motion
 * (Lenis stays mounted so children never remount).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => setReduced(media.matches);
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, []);

	const options = useMemo<LenisProps['options']>(
		() => ({
			lerp: 0.1,
			smoothWheel: !reduced,
			anchors: { offset: -96, immediate: reduced },
		}),
		[reduced]
	);

	return (
		<ReactLenis root options={options}>
			{children}
		</ReactLenis>
	);
}

export default SmoothScroll;
