'use client';

//! React Core
import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

//! Context
import { useVariantHidden } from './library/variant-context';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
	const query = window.matchMedia(REDUCED_MOTION);
	query.addEventListener('change', onChange);
	return () => query.removeEventListener('change', onChange);
}

/** Server and first hydration pass assume reduced motion, so nothing autoplays before the client knows. */
export function useReducedMotion() {
	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(REDUCED_MOTION).matches,
		() => true,
	);
}

/**
 * Autoplay for a mockup: plays only on screen, pauses while hovered or focused within,
 * and never plays under reduced motion. Pass the root's ref and spread `handlers` on
 * that root. `seen` latches the first time the root is on screen.
 */
export function useAutoplay<T extends HTMLElement>(
	ref: RefObject<T | null>,
): {
	enabled: boolean;
	paused: boolean;
	seen: boolean;
	handlers: {
		onPointerEnter: () => void;
		onPointerLeave: () => void;
		onFocus: () => void;
		onBlur: (event: React.FocusEvent<T>) => void;
	};
} {
	const reduceMotion = useReducedMotion();
	// A library proposal that is not on show holds still.
	const hidden = useVariantHidden();
	const [inView, setInView] = useState(false);
	const [seen, setSeen] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node || reduceMotion) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				setInView(entry.isIntersecting);
				if (entry.isIntersecting) setSeen(true);
			},
			{ threshold: 0.4 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [ref, reduceMotion]);

	return {
		enabled: !reduceMotion,
		paused: hovered || focused || !inView || hidden,
		seen,
		handlers: {
			onPointerEnter: () => setHovered(true),
			onPointerLeave: () => setHovered(false),
			onFocus: () => setFocused(true),
			onBlur: (event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
			},
		},
	};
}
