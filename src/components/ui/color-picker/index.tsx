'use client';

//! React Core
import { useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ColorSwatch = {
	label: string;
	/** A hex colour, or the name of a colour token (`--color-swatch-pink`) read from the page. */
	value: string;
};

export type ColorPickerLabels = {
	/** Name of the hex field. */
	hex: string;
	/** Name of the native picker (any colour). */
	custom: string;
	/** Typed text that is not a hex colour. */
	invalid: string;
};

export type ColorPickerProps = {
	/** The question, rendered as the fieldset legend. */
	label: string;
	/** Defaults to the brand accents (`BRAND_SWATCHES`). */
	swatches?: ReadonlyArray<ColorSwatch>;
	/** Hex colour or swatch token (controlled). */
	value?: string | null;
	defaultValue?: string | null;
	/** Always a lowercase `#rrggbb`. */
	onChange?: (hex: string) => void;
	hint?: ReactNode;
	error?: string;
	optional?: boolean;
	disabled?: boolean;
	/** Shows the hex field and the native picker for colours outside the swatches. */
	allowCustom?: boolean;
	/** Submits the hex under this name (hidden input). */
	name?: string;
	labels?: Partial<ColorPickerLabels>;
	className?: string;
};

/** The brand accents (500 steps), read from tokens so the hex values live in tokens.css only. */
export const BRAND_SWATCHES: ReadonlyArray<ColorSwatch> = [
	{ label: 'Pink', value: '--color-swatch-pink' },
	{ label: 'Orange', value: '--color-swatch-orange' },
	{ label: 'Yellow', value: '--color-swatch-yellow' },
	{ label: 'Green', value: '--color-swatch-green' },
	{ label: 'Blue', value: '--color-swatch-blue' },
	{ label: 'Violet', value: '--color-swatch-violet' },
];

function useDefaultLabels(): ColorPickerLabels {
	const t = useTranslations('common.ui.colorPicker');
	return {
		hex: t('hex'),
		custom: t('custom'),
		invalid: t('invalid'),
	};
}

/** `#abc`, `abc`, `#aabbcc` or `aabbcc` → `#aabbcc`; anything else → null. */
export function normalizeHex(text: string | null | undefined): string | null {
	const match = text?.trim().replace(/^#/, '').toLowerCase().match(/^([0-9a-f]{3}|[0-9a-f]{6})$/);
	if (!match) return null;
	const digits = match[1].length === 3 ? [...match[1]].map((digit) => digit + digit).join('') : match[1];
	return `#${digits}`;
}

/** Ink with the better contrast on a swatch: the dark one above ~18% luminance. */
function inkFor(hex: string | null) {
	if (!hex) return 'var(--color-swatch-ink)';
	const [r, g, b] = [1, 3, 5].map((start) => {
		const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
		return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
	});
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	return luminance > 0.179 ? 'var(--color-swatch-ink)' : 'var(--color-swatch-ink-inverse)';
}

// Swatch tokens resolve on the client only (computed style); the server renders the fills with var().
const NO_TOKENS: Readonly<Record<string, string>> = {};
const tokenSnapshots = new Map<string, Record<string, string>>();
const subscribeNothing = () => () => {};

function readTokens(key: string) {
	let snapshot = tokenSnapshots.get(key);
	if (!snapshot) {
		const root = getComputedStyle(document.documentElement);
		snapshot = {};
		for (const token of key.split('|')) {
			if (!token.startsWith('--')) continue;
			const hex = normalizeHex(root.getPropertyValue(token));
			if (hex) snapshot[token] = hex;
		}
		tokenSnapshots.set(key, snapshot);
	}
	return snapshot;
}

const fillOf = (value: string) => (value.startsWith('--') ? `var(${value})` : value);

/**
 * Inspo component (component.gallery "Color picker"): brand swatches as a radio group (arrow keys
 * move and pick, like SegmentedControl), plus a hex field and the browser's own colour picker for
 * anything else. The value is always reported as a lowercase hex; swatches can name colour tokens,
 * so the brand hexes stay in tokens.css.
 */
export function ColorPicker({
	label,
	swatches: swatchesProp,
	value,
	defaultValue = null,
	onChange,
	hint,
	error,
	optional,
	disabled,
	allowCustom = true,
	name,
	labels,
	className,
}: ColorPickerProps) {
	const t = useTranslations('common');
	const copy = { ...useDefaultLabels(), ...labels };
	const ui = useTranslations('common.ui.colorPicker');
	// The brand accents are named in the page language; custom swatches keep the labels they were given.
	const swatches = useMemo(
		() => swatchesProp ?? BRAND_SWATCHES.map((swatch) => ({ ...swatch, label: ui(`swatches.${swatch.value.replace('--color-swatch-', '')}`) })),
		[swatchesProp, ui]
	);
	const id = useId();
	const legendId = `${id}-legend`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const hexId = `${id}-hex`;

	const tokenKey = swatches.map((swatch) => swatch.value).join('|');
	const tokens = useSyncExternalStore(
		subscribeNothing,
		() => readTokens(tokenKey),
		() => NO_TOKENS
	);
	const resolve = (raw: string | null | undefined) => (raw?.startsWith('--') ? (tokens[raw] ?? null) : normalizeHex(raw));

	const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
	const raw = value !== undefined ? value : innerValue;
	const hex = resolve(raw);
	const checkedIndex = swatches.findIndex((swatch) => swatch.value === raw || (hex !== null && resolve(swatch.value) === hex));
	const isCustom = hex !== null && checkedIndex < 0;

	const [draft, setDraft] = useState<string | null>(null);
	const [hexError, setHexError] = useState<string | null>(null);
	const swatchRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const message = disabled ? undefined : (error ?? hexError ?? undefined);

	const choose = (next: string) => {
		const nextHex = resolve(next);
		setDraft(null);
		setHexError(null);
		if (value === undefined) setInnerValue(next);
		if (nextHex && nextHex !== hex) onChange?.(nextHex);
	};

	const onSwatchKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
		const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = (index + step + swatches.length) % swatches.length;
		choose(swatches[next].value);
		swatchRefs.current[next]?.focus();
	};

	const commitDraft = () => {
		if (draft === null) return;
		if (!draft.trim()) {
			setDraft(null);
			setHexError(null);
			return;
		}
		const next = normalizeHex(draft);
		if (!next) {
			setHexError(copy.invalid);
			return;
		}
		choose(next);
	};

	const describedBy = [hint ? hintId : null, message ? errorId : null].filter(Boolean).join(' ') || undefined;
	const hexText = draft ?? (hex ? hex.slice(1).toUpperCase() : '');

	return (
		<fieldset className={cx(styles.fieldset, disabled && styles.disabled, className)} disabled={disabled} aria-describedby={describedBy}>
			<legend id={legendId} className={styles.legend}>
				{label}
				{optional && <span className={styles.optional}> ({t('optional')})</span>}
			</legend>
			{hint && (
				<p id={hintId} className={styles.hint}>
					{hint}
				</p>
			)}
			<div className={styles.row}>
				<div role="radiogroup" aria-labelledby={legendId} className={styles.swatches}>
					{swatches.map((swatch, index) => {
						const checked = index === checkedIndex;
						const swatchHex = resolve(swatch.value);
						return (
							<button
								key={swatch.value}
								ref={(node) => {
									swatchRefs.current[index] = node;
								}}
								type="button"
								role="radio"
								aria-checked={checked}
								aria-label={swatch.label}
								title={swatchHex ? `${swatch.label} ${swatchHex.toUpperCase()}` : swatch.label}
								tabIndex={checked || (checkedIndex < 0 && index === 0) ? 0 : -1}
								className={cx(styles.swatch, checked && styles.checked)}
								style={{ backgroundColor: fillOf(swatch.value), color: inkFor(swatchHex) }}
								onClick={() => choose(swatch.value)}
								onKeyDown={(event) => onSwatchKeyDown(event, index)}
							>
								<Icon name="check" size="sm" className={styles.check} />
							</button>
						);
					})}
				</div>
				{allowCustom && (
					<label
						className={cx(styles.swatch, styles.custom, isCustom && styles.checked)}
						style={isCustom && hex ? { backgroundColor: hex, color: inkFor(hex) } : undefined}
						title={copy.custom}
					>
						{/* Uncontrolled: it opens on the current colour (or the first swatch), set just before the picker shows. */}
						<input
							type="color"
							className={styles.native}
							disabled={disabled}
							onClick={(event) => {
								const start = hex ?? resolve(swatches[0]?.value);
								if (start) event.currentTarget.value = start;
							}}
							onChange={(event) => choose(event.target.value)}
						/>
						<Icon name={isCustom ? 'check' : 'palette'} size="sm" className={styles.customIcon} />
						<span className="u-visually-hidden">{copy.custom}</span>
					</label>
				)}
			</div>
			{allowCustom && (
				<div className={styles.hexRow}>
					<label htmlFor={hexId} className={styles.hexLabel}>
						{copy.hex}
					</label>
					<div className={cx(styles.hexBox, message && styles.hexInvalid)}>
						<span className={styles.preview} style={hex ? { background: hex } : undefined} aria-hidden="true" />
						<span className={styles.hash} aria-hidden="true">
							#
						</span>
						<input
							id={hexId}
							type="text"
							className={styles.hexInput}
							value={hexText}
							maxLength={7}
							spellCheck={false}
							autoComplete="off"
							disabled={disabled}
							aria-invalid={Boolean(message) || undefined}
							aria-describedby={message ? errorId : undefined}
							onChange={(event) => {
								setDraft(event.target.value);
								if (hexError) setHexError(null);
							}}
							onBlur={commitDraft}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									event.preventDefault();
									commitDraft();
								}
							}}
						/>
					</div>
				</div>
			)}
			{message && (
				<p id={errorId} className={styles.error}>
					<Icon name="alert" size="sm" />
					{message}
				</p>
			)}
			{name && <input type="hidden" name={name} value={hex ?? ''} />}
		</fieldset>
	);
}

export default ColorPicker;
