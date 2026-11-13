'use client';

//! React Core
import { useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent } from 'react';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SegmentedOption<T extends string> = {
	value: T;
	label: string;
	icon?: IconName;
	/** Hide the visible label and keep it as the accessible name (icon-only segment). */
	iconOnly?: boolean;
	/** Longer accessible name when the visible label is an abbreviation ("EN" → "English"). */
	ariaLabel?: string;
};

export type SegmentedControlProps<T extends string> = {
	/** Accessible name for the group. */
	label: string;
	options: ReadonlyArray<SegmentedOption<T>>;
	value: T;
	onChange: (value: T) => void;
	size?: 'sm' | 'md';
	className?: string;
};

// useLayoutEffect warns during server rendering; the pill is measured on the client only.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Inspo component (not drawn in Figma): a radio group styled as the nav pill.
 * Arrow keys move and select, like a native radio group. The selected background is a
 * transitions.dev "Tabs sliding" pill: it slides between segments when the user picks one,
 * and snaps (no animation) on first paint, resize and changes the user did not make.
 */
export function SegmentedControl<T extends string>({
	label,
	options,
	value,
	onChange,
	size = 'md',
	className,
}: SegmentedControlProps<T>) {
	const name = useId();
	const groupRef = useRef<HTMLDivElement>(null);
	const pillRef = useRef<HTMLSpanElement>(null);
	const refs = useRef<Array<HTMLButtonElement | null>>([]);
	// Only a pick made inside the group animates (not a theme restored after hydration).
	const userPicked = useRef(false);
	const selectedIndex = options.findIndex((option) => option.value === value);

	useIsomorphicLayoutEffect(() => {
		const group = groupRef.current;
		const pill = pillRef.current;
		if (!group || !pill) return;

		const moveTo = (animate: boolean) => {
			const tab = refs.current[selectedIndex];
			if (!tab) return;
			if (!animate) {
				const prev = pill.style.transition;
				pill.style.transition = 'none';
				pill.style.transform = `translateX(${tab.offsetLeft}px)`;
				pill.style.width = `${tab.offsetWidth}px`;
				void pill.offsetWidth;
				pill.style.transition = prev;
			} else {
				pill.style.transform = `translateX(${tab.offsetLeft}px)`;
				pill.style.width = `${tab.offsetWidth}px`;
			}
			group.dataset.pill = 'ready';
		};

		moveTo(userPicked.current);
		userPicked.current = false;

		// Fonts loading or a locale change resize the segments: snap, never animate.
		const observer = new ResizeObserver(() => moveTo(false));
		observer.observe(group);
		return () => observer.disconnect();
	}, [selectedIndex]);

	const pick = (next: T) => {
		userPicked.current = true;
		onChange(next);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
		const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = (index + step + options.length) % options.length;
		pick(options[next].value);
		refs.current[next]?.focus();
	};

	return (
		<div ref={groupRef} role="radiogroup" aria-label={label} className={cx('t-tabs', styles.group, styles[size], 'u-bevel', className)}>
			<span ref={pillRef} className={cx('t-tabs-pill', styles.pill, 'u-bevel')} aria-hidden="true" />
			{options.map((option, index) => {
				const selected = option.value === value;
				return (
					<button
						key={option.value}
						ref={(node) => {
							refs.current[index] = node;
						}}
						type="button"
						role="radio"
						name={name}
						aria-checked={selected}
						aria-label={option.ariaLabel ?? (option.iconOnly ? option.label : undefined)}
						title={option.ariaLabel ?? (option.iconOnly ? option.label : undefined)}
						tabIndex={selected ? 0 : -1}
						className={cx('t-tab', styles.segment, selected && styles.selected)}
						onClick={() => pick(option.value)}
						onKeyDown={(event) => onKeyDown(event, index)}
					>
						{option.icon && <Icon name={option.icon} size={size === 'sm' ? 'sm' : 'md'} />}
						{!option.iconOnly && <span>{option.label}</span>}
					</button>
				);
			})}
		</div>
	);
}

export default SegmentedControl;
