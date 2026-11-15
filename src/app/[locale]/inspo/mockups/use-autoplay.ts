'use client';

//! React Core
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

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

type Handlers<T extends HTMLElement> = {
	onPointerEnter: () => void;
	onPointerLeave: () => void;
	onFocus: () => void;
	onBlur: (event: React.FocusEvent<T>) => void;
};

/**
 * Whether a mockup is held (off screen, hovered or focused within), reported through `onHeld` each
 * time it flips instead of through React state: visibility, hover and focus change nothing on their
 * own, so they never re-render the mockup. Nothing is reported while its library proposal is
 * hidden, which holds it still anyway.
 */
function useHeld<T extends HTMLElement>(ref: RefObject<T | null>, onHeld: (held: boolean) => void) {
	const reduceMotion = useReducedMotion();
	// A library proposal that is not on show holds still.
	const hidden = useVariantHidden();
	const signals = useRef({ inView: false, hovered: false, focused: false, hidden, held: true, onHeld });
	const sync = useCallback(() => {
		const s = signals.current;
		const held = s.hovered || s.focused || !s.inView;
		if (s.hidden || held === s.held) return;
		s.held = held;
		s.onHeld(held);
	}, []);

	useEffect(() => {
		signals.current.onHeld = onHeld;
	}, [onHeld]);

	useEffect(() => {
		signals.current.hidden = hidden;
		sync();
	}, [hidden, sync]);

	useEffect(() => {
		const node = ref.current;
		if (!node || reduceMotion) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				signals.current.inView = entry.isIntersecting;
				sync();
			},
			{ threshold: 0.4 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [ref, reduceMotion, sync]);

	const set = (key: 'hovered' | 'focused', value: boolean) => {
		signals.current[key] = value;
		sync();
	};
	const handlers: Handlers<T> = {
		onPointerEnter: () => set('hovered', true),
		onPointerLeave: () => set('hovered', false),
		onFocus: () => set('focused', true),
		onBlur: (event) => {
			if (!event.currentTarget.contains(event.relatedTarget as Node | null)) set('focused', false);
		},
	};

	return { enabled: !reduceMotion, hidden, handlers };
}

/**
 * Autoplay for a mockup that shows its pause (a filling dot, a running bar): plays only on screen,
 * pauses while hovered or focused within, and never plays under reduced motion. Pass the root's ref
 * and spread `handlers` on that root. It re-renders only when `paused` flips.
 */
export function useAutoplay<T extends HTMLElement>(
	ref: RefObject<T | null>,
): { enabled: boolean; paused: boolean; handlers: Handlers<T> } {
	const [held, setHeld] = useState(true);
	const { enabled, hidden, handlers } = useHeld(ref, setHeld);
	return { enabled, paused: held || hidden, handlers };
}

/**
 * Autoplay for a mockup that only advances on a timer: calls `onTick` `hold` ms after each
 * `restart` change (the step it shows) while it plays, under the same rules as useAutoplay. Pausing
 * and resuming start and stop the timer directly, so they never re-render the mockup.
 */
export function useAutoplayTimer<T extends HTMLElement>(
	ref: RefObject<T | null>,
	hold: number,
	onTick: () => void,
	restart: unknown,
): { enabled: boolean; handlers: Handlers<T> } {
	const timer = useRef(0);
	const run = useRef({ held: true, live: false, hold, onTick });
	const arm = useCallback(() => {
		window.clearTimeout(timer.current);
		const r = run.current;
		if (r.live && !r.held) timer.current = window.setTimeout(() => run.current.onTick(), r.hold);
	}, []);
	const onHeld = useCallback(
		(held: boolean) => {
			run.current.held = held;
			arm();
		},
		[arm],
	);
	const { enabled, hidden, handlers } = useHeld(ref, onHeld);

	useEffect(() => {
		run.current.onTick = onTick;
	}, [onTick]);

	useEffect(() => {
		Object.assign(run.current, { live: enabled && !hidden, hold });
		arm();
		return () => window.clearTimeout(timer.current);
	}, [enabled, hidden, hold, restart, arm]);

	return { enabled, handlers };
}
