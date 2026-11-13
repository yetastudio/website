'use client';

//! React Core
import { useEffect, useRef, type RefObject } from 'react';

/**
 * Runs `onReset` when the form around `ref` is reset, so a control that keeps its own state
 * (uncontrolled RadioGroup, Slider, Stepper, SearchInput) goes back to its default with the
 * native fields.
 */
export function useFormReset(ref: RefObject<HTMLElement | null>, onReset: () => void) {
	const latest = useRef(onReset);

	useEffect(() => {
		latest.current = onReset;
	});

	useEffect(() => {
		const form = ref.current?.closest('form');
		if (!form) return;
		const handle = () => latest.current();
		form.addEventListener('reset', handle);
		return () => form.removeEventListener('reset', handle);
	}, [ref]);
}
