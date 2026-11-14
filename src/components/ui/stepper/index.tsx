'use client';

//! React Core
import {
	forwardRef,
	useEffect,
	useId,
	useRef,
	useState,
	type CSSProperties,
	type InputHTMLAttributes,
	type KeyboardEvent,
	type MouseEvent,
	type PointerEvent,
	type ReactNode,
} from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';
import { FieldMessage, Label, describedBy } from '@/components/ui/label';
import { useErrorShake } from '@/components/ui/label/use-error-shake';
import { useFormReset } from '@/components/ui/label/use-form-reset';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type StepperBase = {
	label: string;
	hideLabel?: boolean;
	hint?: ReactNode;
	/** Error message. Sets aria-invalid and replaces the hint. Not shown while disabled. */
	error?: string;
	optional?: boolean;
	min?: number;
	max?: number;
	/** Arrow keys and the buttons. Decimals follow the step (0.5 → one decimal). */
	step?: number;
	/** Page Up / Page Down. Defaults to ten steps. */
	largeStep?: number;
	/** sm 30 · md 34 · lg 36 (default, Input's height). */
	size?: 'sm' | 'md' | 'lg';
	/** Spoken value ("3 seats"); sets aria-valuetext. The field itself shows the plain number. */
	formatValue?: (value: number) => string;
	decrementLabel?: string;
	incrementLabel?: string;
	disabled?: boolean;
	className?: string;
};

export type StepperProps = StepperBase &
	Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size' | 'className' | 'min' | 'max' | 'step' | keyof StepperBase> & {
		value?: number;
		defaultValue?: number;
		onValueChange?: (value: number) => void;
	};

type Pop = { key: number; dir: 1 | -1; from: string; to: string };

const REPEAT_DELAY = 400;
const REPEAT_EVERY = 70;

/**
 * Inspo component (component.gallery "Stepper", a.k.a. quantity / number field): a number with
 * − and + buttons. The field is an APG spinbutton: ↑ / ↓ step, Page Up / Down take ten steps,
 * Home / End jump to min / max, typing a number commits on Enter or blur (clamped and snapped).
 * The buttons repeat while held and stay out of the tab order (the keys do the same job).
 * A stepped value re-enters with transitions.dev "Number pop-in": up rises, down drops.
 */
export const Stepper = forwardRef<HTMLInputElement, StepperProps>(function Stepper(
	{
		id: idProp,
		label,
		hideLabel,
		hint,
		error,
		optional,
		value,
		defaultValue,
		onValueChange,
		min,
		max,
		step = 1,
		largeStep,
		size = 'lg',
		formatValue,
		decrementLabel,
		incrementLabel,
		disabled,
		required,
		className,
		onBlur,
		onKeyDown,
		...rest
	},
	ref
) {
	const ui = useTranslations('common.ui.stepper');
	const id = useId();
	const inputId = idProp ?? `${id}-input`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const boxRef = useRef<HTMLDivElement>(null);
	const showError = Boolean(error) && !disabled;
	useErrorShake(boxRef, showError ? error : undefined);

	const decimals = (String(step).split('.')[1] ?? '').length;
	const show = (n: number) => n.toFixed(decimals);
	const round = (n: number) => Number(n.toFixed(decimals));
	const clamp = (n: number) => round(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)));
	const snap = (n: number) => {
		const base = min ?? 0;
		return round(base + Math.round((n - base) / step) * step);
	};

	const [inner, setInner] = useState(() => clamp(defaultValue ?? min ?? 0));
	const current = value ?? inner;
	const [draft, setDraft] = useState<string | null>(null);
	const [pop, setPop] = useState<Pop | null>(null);
	useFormReset(boxRef, () => {
		setInner(clamp(defaultValue ?? min ?? 0));
		setDraft(null);
		setPop(null);
	});
	const currentRef = useRef(current);
	currentRef.current = current;

	/** Sets a new value. Returns false when it did not change (at a bound). */
	const commit = (next: number, animate: boolean) => {
		const previous = currentRef.current;
		const settled = clamp(next);
		setDraft(null);
		if (settled === previous) return false;
		currentRef.current = settled;
		if (value === undefined) setInner(settled);
		onValueChange?.(settled);
		if (animate) setPop((last) => ({ key: (last?.key ?? 0) + 1, dir: settled > previous ? 1 : -1, from: show(previous), to: show(settled) }));
		return true;
	};

	const parsedDraft = () => {
		if (draft === null) return null;
		const parsed = parseFloat(draft.replace(',', '.'));
		return Number.isFinite(parsed) ? snap(parsed) : null;
	};

	const stepBy = (delta: number) => commit((parsedDraft() ?? currentRef.current) + delta, true);

	const commitDraft = () => {
		if (draft === null) return;
		const parsed = parsedDraft();
		if (parsed === null) setDraft(null);
		else commit(parsed, false);
	};

	// Press-and-hold repeat on the buttons.
	const repeat = useRef<{ timeout: number; interval: number } | null>(null);
	const pointerStepped = useRef(false);
	const stopRepeat = () => {
		if (!repeat.current) return;
		window.clearTimeout(repeat.current.timeout);
		window.clearInterval(repeat.current.interval);
		repeat.current = null;
	};
	useEffect(() => stopRepeat, []);

	const onButtonPointerDown = (event: PointerEvent<HTMLButtonElement>, delta: number) => {
		if (event.button !== 0) return;
		// Keep focus where it is (the field, mid-edit) instead of moving it to the button.
		event.preventDefault();
		pointerStepped.current = true;
		stopRepeat();
		if (!stepBy(delta)) return;
		const timeout = window.setTimeout(() => {
			if (!repeat.current) return;
			repeat.current.interval = window.setInterval(() => {
				if (!stepBy(delta)) stopRepeat();
			}, REPEAT_EVERY);
		}, REPEAT_DELAY);
		repeat.current = { timeout, interval: 0 };
	};

	const onButtonClick = (event: MouseEvent<HTMLButtonElement>, delta: number) => {
		// A pointer press already stepped; a click from the keyboard or a screen reader steps here.
		if (pointerStepped.current) {
			pointerStepped.current = false;
			return;
		}
		event.preventDefault();
		stepBy(delta);
	};

	const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		onKeyDown?.(event);
		if (event.defaultPrevented) return;
		const big = largeStep ?? step * 10;
		const moves: Record<string, () => void> = {
			ArrowUp: () => stepBy(step),
			ArrowDown: () => stepBy(-step),
			PageUp: () => stepBy(big),
			PageDown: () => stepBy(-big),
			...(min !== undefined && { Home: () => commit(min, true) }),
			...(max !== undefined && { End: () => commit(max, true) }),
		};
		const move = moves[event.key];
		if (move) {
			event.preventDefault();
			move();
		} else if (event.key === 'Enter') {
			commitDraft();
		} else if (event.key === 'Escape' && draft !== null) {
			event.preventDefault();
			setDraft(null);
		}
	};

	// Digits to animate: right-aligned against the previous value, from the first place that changed.
	const shown = show(current);
	const animating = pop && pop.to === shown && draft === null ? pop : null;
	let firstChanged = shown.length;
	if (animating) {
		const width = Math.max(animating.from.length, shown.length);
		const before = animating.from.padStart(width);
		const after = shown.padStart(width);
		const offset = width - shown.length;
		for (let i = 0; i < width; i++) {
			if (before[i] !== after[i]) {
				firstChanged = Math.max(0, i - offset);
				break;
			}
		}
	}

	const chars = Math.max(show(max ?? 999).length, show(min ?? 0).length, 2);
	const atMin = min !== undefined && current <= min;
	const atMax = max !== undefined && current >= max;

	return (
		<div className={cx(styles.field, styles[size], showError && styles.invalid, className)}>
			<Label htmlFor={inputId} size={size === 'sm' ? 'sm' : 'md'} optional={optional} disabled={disabled} className={cx(hideLabel && 'u-visually-hidden')}>
				{label}
			</Label>
			<div ref={boxRef} className={cx(styles.box, 't-input', draft !== null && styles.editing)} style={{ '--stepper-chars': chars } as CSSProperties}>
				<button
					type="button"
					tabIndex={-1}
					className={styles.button}
					aria-label={decrementLabel ?? ui('decrease')}
					aria-controls={inputId}
					disabled={disabled || atMin}
					onPointerDown={(event) => onButtonPointerDown(event, -step)}
					onPointerUp={stopRepeat}
					onPointerLeave={stopRepeat}
					onPointerCancel={stopRepeat}
					onClick={(event) => onButtonClick(event, -step)}
				>
					<Icon name="minus" size={size === 'lg' ? 'md' : 'sm'} />
				</button>
				<span className={styles.value}>
					<input
						ref={ref}
						id={inputId}
						type="text"
						inputMode={decimals ? 'decimal' : 'numeric'}
						role="spinbutton"
						autoComplete="off"
						className={styles.input}
						value={draft ?? shown}
						disabled={disabled}
						required={required}
						aria-valuenow={current}
						aria-valuemin={min}
						aria-valuemax={max}
						aria-valuetext={formatValue?.(current)}
						aria-invalid={showError || undefined}
						aria-describedby={describedBy({ hintId, errorId, hint, error: showError ? error : undefined })}
						onChange={(event) => setDraft(event.target.value.replace(/[^\d.,-]/g, ''))}
						onKeyDown={onInputKeyDown}
						onBlur={(event) => {
							commitDraft();
							onBlur?.(event);
						}}
						{...rest}
					/>
					<span className={styles.mirror} aria-hidden="true">
						<span
							key={animating?.key ?? 0}
							className={cx('t-digit-group', animating && 'is-animating')}
							style={animating ? ({ '--digit-dir-y': animating.dir } as CSSProperties) : undefined}
						>
							{shown.split('').map((char, index) => {
								const order = index - firstChanged;
								return order >= 0 ? (
									<span key={index} className="t-digit" data-stagger={order === 1 ? '1' : order >= 2 ? '2' : undefined}>
										{char}
									</span>
								) : (
									<span key={index}>{char}</span>
								);
							})}
						</span>
					</span>
				</span>
				<button
					type="button"
					tabIndex={-1}
					className={styles.button}
					aria-label={incrementLabel ?? ui('increase')}
					aria-controls={inputId}
					disabled={disabled || atMax}
					onPointerDown={(event) => onButtonPointerDown(event, step)}
					onPointerUp={stopRepeat}
					onPointerLeave={stopRepeat}
					onPointerCancel={stopRepeat}
					onClick={(event) => onButtonClick(event, step)}
				>
					<Icon name="plus" size={size === 'lg' ? 'md' : 'sm'} />
				</button>
			</div>
			<FieldMessage hintId={hintId} errorId={errorId} hint={hint} error={showError ? error : undefined} />
		</div>
	);
});

export default Stepper;
