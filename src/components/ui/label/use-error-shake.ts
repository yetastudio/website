'use client';

//! React Core
import { useEffect, useRef, type RefObject } from 'react';

/**
 * transitions.dev Error state shake, as Input / Textarea run it: replays `.is-shaking` on the
 * element that carries `.t-input` when an error appears or changes (not for an error already
 * present on first render). The reduced-motion guard lives in the snippet.
 */
export function useErrorShake(ref: RefObject<HTMLElement | null>, error: string | undefined) {
	const shown = useRef(error);

	useEffect(() => {
		const previous = shown.current;
		shown.current = error;
		if (!error || error === previous) return;
		const control = ref.current;
		if (!control) return;
		control.classList.remove('is-shaking');
		void control.offsetWidth;
		control.classList.add('is-shaking');
		const style = getComputedStyle(control);
		// The CSS build may serialise a duration in s, so read the unit instead of assuming ms.
		const ms = (name: string, fallback: number) => {
			const raw = style.getPropertyValue(name).trim();
			const value = parseFloat(raw);
			if (!Number.isFinite(value)) return fallback;
			return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value;
		};
		const shakeMs = ms('--shake-dur-a', 80) * 2 + ms('--shake-dur-b', 60) * 2;
		const timer = window.setTimeout(() => control.classList.remove('is-shaking'), shakeMs + 20);
		return () => window.clearTimeout(timer);
	}, [error, ref]);
}
