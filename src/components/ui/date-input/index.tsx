'use client';

//! React Core
import { useEffect, useId, useMemo, useRef, useState, type FocusEvent, type ReactNode } from 'react';

//! Hooks
import { useLocale, useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type DateSegment = 'day' | 'month' | 'year';
export type DateParts = Record<DateSegment, string>;

export type DateInputMessages = {
	/** Required and nothing entered. */
	required: string;
	/** Some segments are missing; receives their (localised) names. */
	missing: (segments: string[]) => string;
	/** The numbers do not make a real date (31 February). */
	invalid: string;
	/** The year has fewer than 4 digits. */
	year: string;
	/** Earlier than `min`; receives the formatted limit. */
	min: (date: string) => string;
	/** Later than `max`; receives the formatted limit. */
	max: (date: string) => string;
};

export type DateInputProps = {
	/** The question, rendered as the fieldset legend. */
	label: string;
	hint?: ReactNode;
	/** Error from the page (server validation). Overrides the built-in check. */
	error?: string;
	/** Segments to mark invalid with `error`. Defaults to all of them. */
	errorSegments?: DateSegment[];
	optional?: boolean;
	required?: boolean;
	disabled?: boolean;
	value?: DateParts;
	defaultValue?: DateParts;
	/** Every keystroke: the raw parts and the ISO date (`YYYY-MM-DD`) when they make a valid one. */
	onChange?: (parts: DateParts, iso: string | null) => void;
	/** Earliest accepted date, ISO `YYYY-MM-DD`. */
	min?: string;
	/** Latest accepted date, ISO `YYYY-MM-DD`. */
	max?: string;
	/** Submits `name[day]`, `name[month]` and `name[year]`. */
	name?: string;
	/** `bday` fills a date of birth from the browser (bday-day, bday-month, bday-year). */
	autoComplete?: 'bday';
	/** Segment order. Defaults to the locale's (day-month-year, or month-day-year in en-US). */
	order?: DateSegment[];
	messages?: Partial<DateInputMessages>;
	className?: string;
};

const EMPTY: DateParts = { day: '', month: '', year: '' };

/** Default messages in the page language; `missing` joins the segment names as a list ("day and month"). */
function useDefaultMessages(locale: string): DateInputMessages {
	const t = useTranslations('common.ui.dateInput');
	return {
		required: t('required'),
		missing: (segments) => t('missing', { segments: new Intl.ListFormat(locale, { type: 'conjunction' }).format(segments) }),
		invalid: t('invalid'),
		year: t('year'),
		min: (date) => t('min', { date }),
		max: (date) => t('max', { date }),
	};
}

const pad = (n: number, size = 2) => String(n).padStart(size, '0');

/** ISO date for parts that make a real date, else null. */
export function partsToIso({ day, month, year }: DateParts): string | null {
	if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year)) return null;
	const d = Number(day);
	const m = Number(month);
	const y = Number(year);
	const date = new Date(y, m - 1, d);
	if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
	return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
}

function localeOrder(locale: string): DateSegment[] {
	const parts = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(new Date(2000, 0, 31));
	const order = parts.map((part) => part.type).filter((type): type is DateSegment => type === 'day' || type === 'month' || type === 'year');
	return order.length === 3 ? order : ['day', 'month', 'year'];
}

function segmentNames(locale: string): Record<DateSegment, string> {
	const fallback = { day: 'Day', month: 'Month', year: 'Year' };
	try {
		const names = new Intl.DisplayNames(locale, { type: 'dateTimeField' });
		const cap = (text: string | undefined, key: DateSegment) =>
			text ? text.charAt(0).toLocaleUpperCase(locale) + text.slice(1) : fallback[key];
		return { day: cap(names.of('day'), 'day'), month: cap(names.of('month'), 'month'), year: cap(names.of('year'), 'year') };
	} catch {
		return fallback;
	}
}

function formatIso(iso: string, locale: string) {
	const [y, m, d] = iso.split('-').map(Number);
	return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
}

/**
 * Inspo component (component.gallery "Date input", after GOV.UK's): a memorable date typed as
 * day, month and year in three numeric boxes, in the locale's order and with the locale's
 * segment names. A fieldset groups them under the question; when focus leaves the group the
 * date is checked (missing parts, a real date, 4-digit year, min / max) and only the faulty
 * segments are marked, with the Input's error shake. Use it for dates people already know
 * (a birthday); a Datepicker suits picking a near date.
 */
export function DateInput({
	label,
	hint,
	error,
	errorSegments,
	optional,
	required,
	disabled,
	value,
	defaultValue = EMPTY,
	onChange,
	min,
	max,
	name,
	autoComplete,
	order,
	messages,
	className,
}: DateInputProps) {
	const t = useTranslations('common');
	const locale = useLocale();
	const id = useId();
	const legendId = `${id}-legend`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;

	const [innerParts, setInnerParts] = useState<DateParts>(defaultValue);
	const parts = value ?? innerParts;
	const [check, setCheck] = useState<{ message: string; segments: DateSegment[] } | null>(null);

	const segments = useMemo(() => order ?? localeOrder(locale), [order, locale]);
	const names = useMemo(() => segmentNames(locale), [locale]);
	const copy = { ...useDefaultMessages(locale), ...messages };

	const shownMessage = disabled ? undefined : (error ?? check?.message);
	const invalidSegments: DateSegment[] = disabled ? [] : error ? (errorSegments ?? segments) : (check?.segments ?? []);

	const fieldsetRef = useRef<HTMLFieldSetElement>(null);
	const lastMessage = useRef(shownMessage);

	// transitions.dev Error state shake on the faulty segments when a new message appears.
	useEffect(() => {
		const previous = lastMessage.current;
		lastMessage.current = shownMessage;
		if (!shownMessage || shownMessage === previous) return;
		const boxes = Array.from(fieldsetRef.current?.querySelectorAll<HTMLElement>('.t-input[aria-invalid="true"]') ?? []);
		if (!boxes.length) return;
		for (const box of boxes) {
			box.classList.remove('is-shaking');
			void box.offsetWidth;
			box.classList.add('is-shaking');
		}
		const style = getComputedStyle(boxes[0]);
		const ms = (token: string, fallback: number) => parseFloat(style.getPropertyValue(token)) || fallback;
		const timer = window.setTimeout(
			() => boxes.forEach((box) => box.classList.remove('is-shaking')),
			ms('--shake-dur-a', 80) * 2 + ms('--shake-dur-b', 60) * 2 + 20
		);
		return () => window.clearTimeout(timer);
	}, [shownMessage]);

	const validate = (next: DateParts) => {
		const missing = segments.filter((segment) => !next[segment]);
		if (missing.length === 3) return required ? { message: copy.required, segments } : null;
		if (missing.length) return { message: copy.missing(missing.map((segment) => names[segment].toLocaleLowerCase(locale))), segments: missing };
		if (!/^\d{4}$/.test(next.year)) return { message: copy.year, segments: ['year'] as DateSegment[] };
		const iso = partsToIso(next);
		if (!iso) return { message: copy.invalid, segments };
		if (min && iso < min) return { message: copy.min(formatIso(min, locale)), segments };
		if (max && iso > max) return { message: copy.max(formatIso(max, locale)), segments };
		return null;
	};

	const update = (segment: DateSegment, raw: string) => {
		const next = { ...parts, [segment]: raw.replace(/\D/g, '').slice(0, segment === 'year' ? 4 : 2) };
		if (value === undefined) setInnerParts(next);
		onChange?.(next, partsToIso(next));
		// Once a message shows, it updates as the person fixes the date (and clears when it is right).
		if (check) setCheck(validate(next));
	};

	const onGroupBlur = (event: FocusEvent<HTMLFieldSetElement>) => {
		if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
		setCheck(validate(parts));
	};

	const describedBy = [hint ? hintId : null, shownMessage ? errorId : null].filter(Boolean).join(' ') || undefined;

	return (
		<fieldset
			ref={fieldsetRef}
			className={cx(styles.fieldset, disabled && styles.disabled, className)}
			disabled={disabled}
			aria-describedby={describedBy}
			onBlur={onGroupBlur}
		>
			<legend id={legendId} className={styles.legend}>
				{label}
				{optional && <span className={styles.optional}> ({t('optional')})</span>}
			</legend>
			{hint && (
				<p id={hintId} className={styles.hint}>
					{hint}
				</p>
			)}
			{shownMessage && (
				<p id={errorId} className={styles.error}>
					<Icon name="alert" size="sm" />
					{shownMessage}
				</p>
			)}
			<div className={styles.segments}>
				{segments.map((segment) => {
					const inputId = `${id}-${segment}`;
					const invalid = invalidSegments.includes(segment);
					return (
						<div key={segment} className={cx(styles.segment, styles[segment])}>
							<label htmlFor={inputId} className={styles.segmentLabel}>
								{names[segment]}
							</label>
							<input
								id={inputId}
								type="text"
								inputMode="numeric"
								className={cx(styles.control, 't-input')}
								value={parts[segment]}
								maxLength={segment === 'year' ? 4 : 2}
								name={name ? `${name}[${segment}]` : undefined}
								autoComplete={autoComplete ? `bday-${segment}` : 'off'}
								required={required}
								aria-invalid={invalid || undefined}
								onChange={(event) => update(segment, event.target.value)}
							/>
						</div>
					);
				})}
			</div>
		</fieldset>
	);
}

export default DateInput;
