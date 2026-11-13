'use client';

//! React Core
import {
	forwardRef,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
	useState,
	useSyncExternalStore,
	type FormEvent,
	type InputHTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
} from 'react';

//! Components
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { useFormReset } from '@/components/ui/label/use-form-reset';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'className' | 'value' | 'defaultValue' | 'onChange'> & {
	/** Accessible name. Visually hidden unless `showLabel` (the icon and placeholder carry it on screen). */
	label: string;
	showLabel?: boolean;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Enter (or the keyboard's search key) submits; receives the trimmed query. */
	onSearch?: (value: string) => void;
	/** Called after the clear button (or Escape) empties the field. */
	onClear?: () => void;
	/** Without `onSearch`, Enter submits natively (GET) to this URL. */
	action?: string;
	/** sm 30 · md 34 · lg 36 (default, Input's height). */
	size?: 'sm' | 'md' | 'lg';
	/** `field` matches Input; `glass` is the translucent nav material, for search over content. */
	variant?: 'field' | 'glass';
	/** Shows a ⌘K / Ctrl K hint and focuses the field from anywhere on the page with it. */
	shortcut?: boolean;
	/** Accessible name of the clear button. */
	clearLabel?: string;
	/** Inside another form: render `<div role="search">` (no nested form); Enter still calls onSearch. */
	nested?: boolean;
	hint?: ReactNode;
	className?: string;
};

const subscribeNoop = () => () => {};
const isApplePlatform = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform);

/** A numeric tunable (px, unitless). */
function readNumber(style: CSSStyleDeclaration, name: string, fallback: number) {
	const value = parseFloat(style.getPropertyValue(name));
	return Number.isFinite(value) ? value : fallback;
}

/** A time tunable in ms. The CSS build may serialise 1000ms as 1s, so units are read, not assumed. */
function readTime(style: CSSStyleDeclaration, name: string, fallback: number) {
	const raw = style.getPropertyValue(name).trim();
	const value = parseFloat(raw);
	if (!Number.isFinite(value)) return fallback;
	return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value;
}

/** Minimal cubic-bezier(x1, y1, x2, y2) sampler so the per-frame easing matches the CSS tunables. */
function bezier(source: string) {
	const match = source.replace(/\s+/g, '').match(/cubic-bezier\(([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+)\)/);
	if (!match) return (t: number) => t;
	const [x1, y1, x2, y2] = match.slice(1).map(parseFloat);
	const cx1 = 3 * x1;
	const bx = 3 * (x2 - x1) - cx1;
	const ax = 1 - cx1 - bx;
	const cy1 = 3 * y1;
	const by = 3 * (y2 - y1) - cy1;
	const ay = 1 - cy1 - by;
	return (t: number) => {
		if (t <= 0) return 0;
		if (t >= 1) return 1;
		let s = t;
		for (let i = 0; i < 8; i++) {
			const dx = ((ax * s + bx) * s + cx1) * s - t;
			const d = (3 * ax * s + 2 * bx) * s + cx1;
			if (Math.abs(dx) < 1e-6 || d === 0) break;
			s -= dx / d;
		}
		return ((ay * s + by) * s + cy1) * s;
	};
}

/** True when the field's ink is light, i.e. the field sits on a dark scheme. */
function onDarkScheme(element: HTMLElement) {
	const [r = 0, g = 0, b = 0] = (getComputedStyle(element).color.match(/[\d.]+/g) ?? []).map(Number);
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
}

/**
 * Inspo component (component.gallery "Search input"): a search landmark (`role="search"`) with a
 * labelled `type="search"` field. Enter submits, Escape or the clear button empties it with the
 * transitions.dev "Input clear with dissolve" (text flies down and blurs over a per-word streak,
 * the placeholder falls in) and focus stays in the field. Optional ⌘K / Ctrl K shortcut.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
	{
		id: idProp,
		label,
		showLabel,
		value,
		defaultValue,
		onValueChange,
		onSearch,
		onClear,
		action,
		size = 'lg',
		variant = 'field',
		shortcut,
		clearLabel = 'Clear search',
		nested,
		hint,
		placeholder,
		disabled,
		className,
		onKeyDown,
		...rest
	},
	ref
) {
	const id = useId();
	const inputId = idProp ?? `${id}-input`;
	const hintId = `${id}-hint`;
	const inputRef = useRef<HTMLInputElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const mirrorRef = useRef<HTMLDivElement>(null);
	const placeholderRef = useRef<HTMLDivElement>(null);
	const glowRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<CanvasRenderingContext2D | null>(null);
	const frameRef = useRef(0);
	const clearingRef = useRef(false);
	useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

	const [inner, setInner] = useState(defaultValue ?? '');
	const [clearing, setClearing] = useState(false);
	useFormReset(boxRef, () => setInner(defaultValue ?? ''));
	const current = value ?? inner;
	const hasValue = current.length > 0;
	const apple = useSyncExternalStore(subscribeNoop, isApplePlatform, () => true);

	const setValue = (next: string) => {
		if (value === undefined) setInner(next);
		onValueChange?.(next);
	};

	useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

	// ⌘K / Ctrl K focuses the field. The first field to handle the key claims it.
	useEffect(() => {
		if (!shortcut) return;
		const onShortcut = (event: globalThis.KeyboardEvent) => {
			if (event.defaultPrevented || event.altKey || event.shiftKey || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
			const input = inputRef.current;
			if (!input || input.disabled) return;
			event.preventDefault();
			input.focus();
			input.select();
		};
		document.addEventListener('keydown', onShortcut);
		return () => document.removeEventListener('keydown', onShortcut);
	}, [shortcut]);

	const buildGlow = (text: string, input: HTMLInputElement, wrap: HTMLElement, spread: number) => {
		const context = (canvasRef.current ??= document.createElement('canvas').getContext('2d'));
		if (!context) return '';
		const inputStyle = getComputedStyle(input);
		context.font = inputStyle.font;
		if ('letterSpacing' in context) context.letterSpacing = inputStyle.letterSpacing;
		const width = wrap.clientWidth || 280;
		const start = (parseFloat(inputStyle.paddingLeft) || 12) - input.scrollLeft;
		const layers: string[] = [];
		let x = 0;
		text.split(/(\s+)/).forEach((segment) => {
			const segmentWidth = context.measureText(segment).width;
			if (segment.trim()) {
				const centre = start + x + segmentWidth / 2;
				const half = Math.max(segmentWidth * 0.45, 8) * spread;
				(
					[
						[0, 0.8, 7, 22],
						[half * 0.45, 0.55, 8, 18],
						[-half * 0.4, 0.65, 6, 16],
						[half * 0.15, 0.9, 5, 14],
					] as const
				).forEach(([dx, widthRatio, height, alpha]) => {
					const left = (((centre + dx) / width) * 100).toFixed(2);
					const radius = Math.max(half * widthRatio, 2).toFixed(1);
					// The streak is the field's own ink: dark on light schemes, light on dark ones.
					layers.push(`radial-gradient(ellipse ${radius}px ${height}px at ${left}% 100%, color-mix(in srgb, var(--color-text-strong) ${alpha}%, transparent), transparent)`);
				});
			}
			x += segmentWidth;
		});
		return layers.join(', ');
	};

	const clear = () => {
		const input = inputRef.current;
		const wrap = boxRef.current;
		const mirror = mirrorRef.current;
		const phold = placeholderRef.current;
		const glow = glowRef.current;
		if (!input || !wrap || !mirror || !phold || !glow || clearingRef.current || !input.value) return;
		const text = input.value;
		input.focus({ preventScroll: true });
		setValue('');
		onClear?.();
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		clearingRef.current = true;
		setClearing(true);
		mirror.textContent = text.replace(/ /g, ' ');
		mirror.scrollLeft = input.scrollLeft;

		const style = getComputedStyle(wrap);
		const total = readTime(style, '--clear-dur', 1000);
		const outDur = readTime(style, '--clear-out-dur', 400);
		const inDur = readTime(style, '--clear-in-dur', 400);
		const outFly = readNumber(style, '--clear-out-fly', 12);
		const inFly = readNumber(style, '--clear-in-fly', 12);
		const blur = readNumber(style, '--clear-blur', 2);
		const delay = readTime(style, '--glow-delay', 50);
		const peakAt = readNumber(style, '--glow-peak-at', 0.15);
		// Same alpha reads fainter as light-on-dark: the skill doubles it on dark schemes.
		const glowOpacity = Math.min(1, readNumber(style, '--glow-opacity', 0.42) * (onDarkScheme(input) ? 2 : 1));
		const easeOut = bezier(style.getPropertyValue('--clear-out-ease'));
		const easeIn = bezier(style.getPropertyValue('--clear-in-ease'));

		glow.style.background = buildGlow(text, input, wrap, readNumber(style, '--glow-spread', 1.5));
		glow.style.opacity = '0';
		phold.style.transform = `translateY(-${inFly}px)`;
		phold.style.opacity = '0.9';
		phold.style.filter = `blur(${blur}px)`;

		const t0 = performance.now();
		const tick = (now: number) => {
			const elapsed = now - t0;
			const out = easeOut(Math.min(1, elapsed / outDur));
			mirror.style.transform = `translateY(${(out * outFly).toFixed(1)}px)`;
			mirror.style.opacity = (1 - out).toFixed(3);
			mirror.style.filter = `blur(${(out * blur).toFixed(1)}px)`;

			const into = easeIn(Math.min(1, elapsed / inDur));
			phold.style.transform = `translateY(${(-inFly + into * inFly).toFixed(1)}px)`;
			phold.style.opacity = (0.9 + into * 0.1).toFixed(3);
			phold.style.filter = `blur(${(blur - into * blur).toFixed(1)}px)`;

			let envelope = 0;
			if (elapsed > delay) {
				const progress = Math.min(1, (elapsed - delay) / Math.max(1, total - delay));
				envelope = progress < peakAt ? progress / peakAt : 1 - (progress - peakAt) / (1 - peakAt);
			}
			glow.style.opacity = (envelope * glowOpacity).toFixed(3);

			if (elapsed < total) {
				frameRef.current = requestAnimationFrame(tick);
				return;
			}
			mirror.style.cssText = '';
			phold.style.cssText = '';
			mirror.textContent = '';
			glow.style.opacity = '0';
			glow.style.background = '';
			clearingRef.current = false;
			setClearing(false);
		};
		frameRef.current = requestAnimationFrame(tick);
	};

	const submit = () => onSearch?.(current.trim());

	const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		if (onSearch) {
			event.preventDefault();
			submit();
		} else if (!action) {
			event.preventDefault();
		}
	};

	const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		onKeyDown?.(event);
		if (event.defaultPrevented) return;
		if (event.key === 'Escape' && hasValue) {
			event.preventDefault();
			clear();
		} else if (event.key === 'Enter' && nested) {
			event.preventDefault();
			submit();
		}
	};

	const field = (
		<>
			<Label htmlFor={inputId} size={size === 'sm' ? 'sm' : 'md'} disabled={disabled} className={cx(!showLabel && 'u-visually-hidden')}>
				{label}
			</Label>
			<div
				ref={boxRef}
				className={cx(styles.box, 't-clear', hasValue && 'has-value', clearing && 'is-clearing', hasValue && styles.hasValue)}
			>
				<Icon name="search" size={size === 'lg' ? 'md' : 'sm'} className={styles.icon} />
				<input
					ref={inputRef}
					id={inputId}
					type="search"
					className={styles.input}
					value={current}
					placeholder={placeholder}
					disabled={disabled}
					enterKeyHint="search"
					autoComplete="off"
					spellCheck={false}
					aria-keyshortcuts={shortcut ? (apple ? 'Meta+K' : 'Control+K') : undefined}
					aria-describedby={hint ? hintId : undefined}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={onInputKeyDown}
					{...rest}
				/>
				<div ref={mirrorRef} className={cx('t-clear-mirror', styles.mirror)} aria-hidden="true" />
				<div ref={placeholderRef} className={cx('t-clear-placeholder', styles.placeholder)} aria-hidden="true">
					{placeholder}
				</div>
				<div ref={glowRef} className={cx('t-clear-glow', styles.glow)} aria-hidden="true" />
				{shortcut && (
					<kbd className={styles.kbd} aria-hidden="true">
						{apple ? '⌘K' : 'Ctrl K'}
					</kbd>
				)}
				<button
					type="button"
					className={cx('t-clear-btn', styles.clear)}
					aria-label={clearLabel}
					title={clearLabel}
					disabled={disabled}
					// Keep focus in the field while pressing the button (the snippet's pointer guard).
					onPointerDown={(event) => {
						if (document.activeElement === inputRef.current) event.preventDefault();
					}}
					onClick={clear}
				>
					<Icon name="close" size="sm" />
				</button>
			</div>
			{hint && (
				<p id={hintId} className={styles.hint}>
					{hint}
				</p>
			)}
		</>
	);

	const classes = cx(styles.root, styles[size], styles[variant], className);

	if (nested) {
		return (
			<div role="search" className={classes}>
				{field}
			</div>
		);
	}
	return (
		<form role="search" action={action} className={classes} onSubmit={onFormSubmit} noValidate>
			{field}
		</form>
	);
});

export default SearchInput;
