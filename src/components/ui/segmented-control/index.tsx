'use client';

//! React Core
import { useId, useRef, type KeyboardEvent } from 'react';

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

/**
 * Inspo component (not drawn in Figma): a radio group styled as the nav pill.
 * Arrow keys move and select, like a native radio group.
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
	const refs = useRef<Array<HTMLButtonElement | null>>([]);

	const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
		const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = (index + step + options.length) % options.length;
		onChange(options[next].value);
		refs.current[next]?.focus();
	};

	return (
		<div role="radiogroup" aria-label={label} className={cx(styles.group, styles[size], 'u-bevel', className)}>
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
						className={cx(styles.segment, selected && styles.selected, selected && 'u-bevel')}
						onClick={() => onChange(option.value)}
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
