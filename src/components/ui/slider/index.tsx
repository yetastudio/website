'use client';

//! React Core
import { forwardRef, useId, useRef, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';

//! Components
import { FieldMessage, Label } from '@/components/ui/label';
import { useFormReset } from '@/components/ui/label/use-form-reset';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type SliderBase = {
	label: string;
	hideLabel?: boolean;
	min?: number;
	max?: number;
	step?: number;
	/** Turns a value into what is shown and announced ("$1,200", "3 weeks"). Also sets aria-valuetext. */
	formatValue?: (value: number) => string;
	/** `inline` (default) prints the value beside the label; `bubble` floats it over the thumb while hovered, focused or dragged. */
	valueDisplay?: 'inline' | 'bubble' | 'none';
	/** Prints min and max under the track. */
	showMinMax?: boolean;
	hint?: ReactNode;
	disabled?: boolean;
	className?: string;
};

export type SliderProps = SliderBase &
	Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size' | 'className' | 'min' | 'max' | 'step' | keyof SliderBase> & {
		value?: number;
		defaultValue?: number;
		onValueChange?: (value: number) => void;
	};

const ratioOf = (value: number, min: number, max: number) => (max > min ? (value - min) / (max - min) : 0);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const plain = (value: number) => String(value);

/**
 * Inspo component (component.gallery "Slider"): a native `<input type="range">` styled on-brand,
 * so the platform's slider semantics and keyboard come for free (arrows ±step, Page Up / Down,
 * Home / End). The filled part of the track and the value bubble follow the thumb.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
	{
		id: idProp,
		label,
		hideLabel,
		value,
		defaultValue,
		onValueChange,
		min = 0,
		max = 100,
		step = 1,
		formatValue,
		valueDisplay = 'inline',
		showMinMax,
		hint,
		disabled,
		className,
		...rest
	},
	ref
) {
	const id = useId();
	const inputId = idProp ?? `${id}-input`;
	const hintId = `${id}-hint`;
	const rootRef = useRef<HTMLDivElement>(null);
	const [inner, setInner] = useState(defaultValue ?? min);
	useFormReset(rootRef, () => setInner(defaultValue ?? min));
	const current = clamp(value ?? inner, min, max);
	const format = formatValue ?? plain;

	return (
		<div ref={rootRef} className={cx(styles.root, className)} style={{ '--slider-ratio': ratioOf(current, min, max) } as CSSProperties}>
			<div className={cx(styles.header, hideLabel && valueDisplay !== 'inline' && 'u-visually-hidden')}>
				<Label htmlFor={inputId} disabled={disabled} className={cx(hideLabel && 'u-visually-hidden')}>
					{label}
				</Label>
				{valueDisplay === 'inline' && (
					// The slider announces its own value; the printed copy stays quiet.
					<output htmlFor={inputId} aria-live="off" className={styles.output}>
						{format(current)}
					</output>
				)}
			</div>
			<div className={styles.track}>
				<input
					ref={ref}
					id={inputId}
					type="range"
					className={styles.input}
					min={min}
					max={max}
					step={step}
					value={current}
					disabled={disabled}
					aria-valuetext={formatValue ? format(current) : undefined}
					aria-describedby={hint ? hintId : undefined}
					onChange={(event) => {
						const next = Number(event.target.value);
						if (value === undefined) setInner(next);
						onValueChange?.(next);
					}}
					{...rest}
				/>
				{valueDisplay === 'bubble' && (
					<span className={styles.bubble} aria-hidden="true">
						{format(current)}
					</span>
				)}
			</div>
			{showMinMax && (
				<div className={styles.scale} aria-hidden="true">
					<span>{format(min)}</span>
					<span>{format(max)}</span>
				</div>
			)}
			<FieldMessage hintId={hintId} errorId={`${id}-error`} hint={hint} />
		</div>
	);
});

export default Slider;
