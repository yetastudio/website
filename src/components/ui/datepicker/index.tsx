'use client';

//! React Core
import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from 'react';

//! Hooks
import { useLocale, useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type DatepickerLabels = {
	/** Calendar button with no date yet; also the dialog's name. */
	choose: string;
	/** Calendar button once a date is set; receives the long date. */
	change: (date: string) => string;
	previousMonth: string;
	nextMonth: string;
	/** Typed text that is not a date; receives the format (dd/mm/yyyy). */
	invalid: (format: string) => string;
	/** Typed date outside min / max or unavailable. */
	unavailable: string;
};

export type DatepickerProps = {
	label: string;
	/** ISO date `YYYY-MM-DD` (controlled). `null` clears it. */
	value?: string | null;
	defaultValue?: string | null;
	onChange?: (value: string | null) => void;
	/** Earliest selectable date, ISO. */
	min?: string;
	/** Latest selectable date, ISO. */
	max?: string;
	/** Dates inside min / max that still cannot be picked (booked, closed days). */
	isDateUnavailable?: (iso: string) => boolean;
	hint?: ReactNode;
	/** Error message. Sets aria-invalid and replaces the hint. Not shown on a disabled field. */
	error?: string;
	optional?: boolean;
	required?: boolean;
	disabled?: boolean;
	/** Submits the ISO value under this name (hidden input). */
	name?: string;
	/** Month, weekday and field formats. Defaults to the page locale. */
	locale?: string;
	/** 0 Sunday … 6 Saturday. Defaults to the locale's first day of the week. */
	weekStartsOn?: number;
	labels?: Partial<DatepickerLabels>;
	className?: string;
};

type Phase = 'closed' | 'open' | 'closing';

function useDefaultLabels(): DatepickerLabels {
	const t = useTranslations('common.ui.datepicker');
	return {
		choose: t('choose'),
		change: (date) => t('change', { date }),
		previousMonth: t('previousMonth'),
		nextMonth: t('nextMonth'),
		invalid: (format) => t('invalid', { format }),
		unavailable: t('unavailable'),
	};
}

// useLayoutEffect warns during server rendering; placement is measured on the client only.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const pad = (n: number, size = 2) => String(n).padStart(size, '0');
const toIso = (date: Date) => `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function fromIso(iso: string | null | undefined): Date | null {
	const match = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
	if (!match) return null;
	const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
	return toIso(date) === iso ? date : null;
}

const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/** Same day `months` away, clamped to the last day of a shorter month. */
function addMonths(date: Date, months: number) {
	const first = new Date(date.getFullYear(), date.getMonth() + months, 1);
	const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
	return new Date(first.getFullYear(), first.getMonth(), Math.min(date.getDate(), last));
}

function firstDayOfWeek(locale: string): number {
	try {
		const info = new Intl.Locale(locale) as Intl.Locale & {
			getWeekInfo?: () => { firstDay: number };
			weekInfo?: { firstDay: number };
		};
		const week = info.getWeekInfo?.() ?? info.weekInfo;
		if (week) return week.firstDay % 7;
	} catch {
		// Older engines: fall through.
	}
	return /^(en|pt)(-(US|BR|CA))?$/i.test(locale) ? 0 : 1;
}

/** The numeric field format for a locale: its order and separators, as parts. */
function fieldFormat(locale: string) {
	const formatter = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
	const parts = formatter.formatToParts(new Date(2000, 10, 30));
	const order = parts.map((part) => part.type).filter((type) => type === 'day' || type === 'month' || type === 'year');
	const pattern = parts
		.map((part) => (part.type === 'day' ? 'dd' : part.type === 'month' ? 'mm' : part.type === 'year' ? 'yyyy' : part.value))
		.join('');
	return { formatter, order, pattern };
}

/** Typed text → ISO, in the locale's order (or ISO itself). Null when it is not a real date. */
function parseTyped(text: string, order: string[]): string | null {
	const groups = text.match(/\d+/g);
	if (!groups || groups.length !== 3) return null;
	const fields: Record<string, number> = {};
	const sequence = groups[0].length === 4 ? ['year', 'month', 'day'] : order;
	sequence.forEach((type, index) => {
		fields[type] = Number(groups[index]);
	});
	if (String(fields.year).length !== 4) return null;
	const iso = `${pad(fields.year, 4)}-${pad(fields.month)}-${pad(fields.day)}`;
	return fromIso(iso) ? iso : null;
}

/**
 * Inspo component (component.gallery "Datepicker"), after the WAI-ARIA APG "Date picker dialog":
 * a date field that also takes typing (in the locale's numeric format) and a calendar button that
 * opens a dialog with a month grid. In the grid, arrows move by day and week, Home / End go to the
 * week's ends, Page Up / Down change month (with Shift, year), Enter or Space picks the date and
 * returns focus to the button, Escape closes. Tab cycles inside the dialog; a press outside closes
 * it. Month and day names come from `Intl` in the page locale. The dialog grows from the field with
 * the transitions.dev "Menu dropdown" and flips above it when there is no room below.
 */
export function Datepicker({
	label,
	value,
	defaultValue = null,
	onChange,
	min,
	max,
	isDateUnavailable,
	hint,
	error,
	optional,
	required,
	disabled,
	name,
	locale: localeProp,
	weekStartsOn,
	labels,
	className,
}: DatepickerProps) {
	const t = useTranslations('common');
	const pageLocale = useLocale();
	const locale = localeProp ?? pageLocale;
	const copy = { ...useDefaultLabels(), ...labels };
	const id = useId();
	const inputId = `${id}-input`;
	const dialogId = `${id}-dialog`;
	const headingId = `${id}-heading`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;

	const formats = useMemo(() => {
		const field = fieldFormat(locale);
		return {
			field,
			month: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
			long: new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
			weekdayShort: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
			weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
		};
	}, [locale]);
	const weekStart = weekStartsOn ?? firstDayOfWeek(locale);

	const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
	const selected = value !== undefined ? value : innerValue;
	const selectedDate = fromIso(selected);

	const [draft, setDraft] = useState<string | null>(null);
	const [typedError, setTypedError] = useState<string | null>(null);
	const [phase, setPhase] = useState<Phase>('closed');
	const [focusIso, setFocusIso] = useState<string | null>(null);
	const [today, setToday] = useState<string | null>(null);
	const open = phase === 'open';

	const anchorRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLTableElement>(null);
	const closeTimer = useRef<number | undefined>(undefined);
	// Set when the focused day should take focus after the next render (open, keyboard moves).
	const focusGrid = useRef(false);

	const message = disabled ? undefined : (error ?? typedError ?? undefined);
	const shownMessage = useRef(message);

	const clamp = (iso: string) => (min && iso < min ? min : max && iso > max ? max : iso);
	const isAvailable = (iso: string) => !(min && iso < min) && !(max && iso > max) && !isDateUnavailable?.(iso);
	/** The first pickable day from `iso` on (within a year), so the grid never opens on a blocked day. */
	const firstAvailable = (iso: string) => {
		let date = fromIso(iso);
		for (let day = 0; date && day < 366; day += 1) {
			const candidate = toIso(date);
			if (isAvailable(candidate)) return candidate;
			if (max && candidate > max) break;
			date = addDays(date, 1);
		}
		return iso;
	};

	const select = (iso: string | null) => {
		if (value === undefined) setInnerValue(iso);
		if (iso !== selected) onChange?.(iso);
	};

	// Closing only touches refs and state setters, so it is stable for the outside-press listener.
	const startClose = useCallback(() => {
		const popup = popupRef.current;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const closeMs = reduce || !popup ? 0 : parseFloat(getComputedStyle(popup).getPropertyValue('--dropdown-close-dur')) || 150;
		setPhase('closing');
		window.clearTimeout(closeTimer.current);
		closeTimer.current = window.setTimeout(() => setPhase('closed'), closeMs);
	}, []);

	const closeCalendar = (returnFocus: boolean) => {
		if (phase !== 'open') return;
		startClose();
		if (returnFocus) buttonRef.current?.focus();
	};

	const openCalendar = () => {
		if (disabled) return;
		const now = toIso(new Date());
		setToday(now);
		setFocusIso(selected ?? firstAvailable(clamp(now)));
		focusGrid.current = true;
		window.clearTimeout(closeTimer.current);
		setPhase('open');
	};

	useEffect(() => () => window.clearTimeout(closeTimer.current), []);

	// transitions.dev Error state shake, as on Input: replay it when a message appears or changes.
	useEffect(() => {
		const previous = shownMessage.current;
		shownMessage.current = message;
		const box = boxRef.current;
		if (!message || message === previous || !box) return;
		box.classList.remove('is-shaking');
		void box.offsetWidth;
		box.classList.add('is-shaking');
		const style = getComputedStyle(box);
		const ms = (token: string, fallback: number) => parseFloat(style.getPropertyValue(token)) || fallback;
		const timer = window.setTimeout(() => box.classList.remove('is-shaking'), ms('--shake-dur-a', 80) * 2 + ms('--shake-dur-b', 60) * 2 + 20);
		return () => window.clearTimeout(timer);
	}, [message]);

	// Flip above the field when the calendar would not fit below it (written to the element: it only drives CSS).
	useIsomorphicLayoutEffect(() => {
		const popup = popupRef.current;
		const anchor = anchorRef.current;
		if (phase !== 'open' || !popup || !anchor) return;
		const rect = anchor.getBoundingClientRect();
		const below = window.innerHeight - rect.bottom;
		const up = below < popup.offsetHeight + 8 && rect.top > below;
		popup.dataset.side = up ? 'top' : 'bottom';
		popup.dataset.origin = up ? 'bottom-left' : 'top-left';
	}, [phase]);

	// Move focus to the focused day when asked (on open and on keyboard moves, not on month buttons).
	useEffect(() => {
		if (phase !== 'open' || !focusGrid.current) return;
		focusGrid.current = false;
		gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
	}, [phase, focusIso]);

	// A press anywhere outside the field and its calendar closes it, leaving focus where it went.
	useEffect(() => {
		if (phase !== 'open') return;
		const onPointerDown = (event: PointerEvent) => {
			if (!anchorRef.current?.contains(event.target as Node)) startClose();
		};
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	}, [phase, startClose]);

	const commitDraft = () => {
		if (draft === null) return;
		const text = draft.trim();
		if (!text) {
			setDraft(null);
			setTypedError(null);
			select(null);
			return;
		}
		const iso = parseTyped(text, formats.field.order);
		if (!iso) {
			setTypedError(copy.invalid(formats.field.pattern));
			return;
		}
		if (!isAvailable(iso)) {
			setTypedError(copy.unavailable);
			return;
		}
		setTypedError(null);
		setDraft(null);
		select(iso);
	};

	const pick = (iso: string) => {
		if (!isAvailable(iso)) return;
		setDraft(null);
		setTypedError(null);
		select(iso);
		closeCalendar(true);
	};

	const focusDate = fromIso(focusIso);

	const onGridKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
		if (!focusDate || !focusIso) return;
		const column = (focusDate.getDay() - weekStart + 7) % 7;
		let next: Date;
		switch (event.key) {
			case 'ArrowLeft':
				next = addDays(focusDate, -1);
				break;
			case 'ArrowRight':
				next = addDays(focusDate, 1);
				break;
			case 'ArrowUp':
				next = addDays(focusDate, -7);
				break;
			case 'ArrowDown':
				next = addDays(focusDate, 7);
				break;
			case 'Home':
				next = addDays(focusDate, -column);
				break;
			case 'End':
				next = addDays(focusDate, 6 - column);
				break;
			case 'PageUp':
				next = addMonths(focusDate, event.shiftKey ? -12 : -1);
				break;
			case 'PageDown':
				next = addMonths(focusDate, event.shiftKey ? 12 : 1);
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				pick(focusIso);
				return;
			default:
				return;
		}
		event.preventDefault();
		focusGrid.current = true;
		setFocusIso(clamp(toIso(next)));
	};

	const onDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			closeCalendar(true);
			return;
		}
		if (event.key !== 'Tab') return;
		// Keep Tab inside the dialog (it is modal for assistive tech).
		const focusables = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]')
		);
		if (!focusables.length) return;
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	// The month on show is the focused date's: six weeks from the week holding its 1st.
	const weeks = useMemo(() => {
		const anchorDate = fromIso(focusIso);
		if (!anchorDate) return [];
		const first = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
		const start = addDays(first, -((first.getDay() - weekStart + 7) % 7));
		return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)));
	}, [focusIso, weekStart]);

	const shownMonth = focusDate?.getMonth();
	const prevMonthEnd = focusDate ? toIso(new Date(focusDate.getFullYear(), focusDate.getMonth(), 0)) : null;
	const nextMonthStart = focusDate ? toIso(new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, 1)) : null;
	const prevDisabled = Boolean(min && prevMonthEnd && prevMonthEnd < min);
	const nextDisabled = Boolean(max && nextMonthStart && nextMonthStart > max);

	const text = draft ?? (selectedDate ? formats.field.formatter.format(selectedDate) : '');
	const describedBy = message ? errorId : hint ? hintId : undefined;

	return (
		<div className={cx(styles.field, message && styles.invalid, disabled && styles.disabled, className)}>
			<label htmlFor={inputId} className={styles.label}>
				{label}
				{optional && <span className={styles.optional}> ({t('optional')})</span>}
			</label>
			<div ref={anchorRef} className={styles.anchor}>
				<div ref={boxRef} className={cx(styles.box, 't-input')}>
					<input
						id={inputId}
						type="text"
						className={styles.input}
						value={text}
						placeholder={formats.field.pattern}
						disabled={disabled}
						required={required}
						autoComplete="off"
						spellCheck={false}
						aria-invalid={Boolean(message) || undefined}
						aria-describedby={describedBy}
						onChange={(event) => {
							setDraft(event.target.value);
							if (typedError) setTypedError(null);
						}}
						onBlur={commitDraft}
						onKeyDown={(event) => {
							if (event.key === 'Enter' && draft !== null) {
								event.preventDefault();
								commitDraft();
							} else if (event.key === 'ArrowDown' && event.altKey) {
								event.preventDefault();
								openCalendar();
							}
						}}
					/>
					<button
						ref={buttonRef}
						type="button"
						className={styles.trigger}
						disabled={disabled}
						aria-label={selectedDate ? copy.change(formats.long.format(selectedDate)) : copy.choose}
						aria-haspopup="dialog"
						aria-expanded={open}
						aria-controls={dialogId}
						onClick={() => (open ? closeCalendar(true) : openCalendar())}
					>
						<Icon name="calendar" size="md" />
					</button>
				</div>
				{name && <input type="hidden" name={name} value={selected ?? ''} />}

				<div
					ref={popupRef}
					id={dialogId}
					role="dialog"
					aria-modal="true"
					aria-label={copy.choose}
					className={cx(
						't-dropdown',
						styles.popup,
						'u-bevel',
						phase === 'open' && 'is-open',
						phase === 'closing' && 'is-closing',
						phase === 'closed' && styles.closed
					)}
					inert={phase !== 'open'}
					onKeyDown={onDialogKeyDown}
				>
					{phase !== 'closed' && focusDate && (
						<>
							<div className={styles.header}>
								<Button
									variant="ghost"
									size="sm"
									icon="chevron-left"
									label={copy.previousMonth}
									disabled={prevDisabled}
									onClick={() => setFocusIso(clamp(toIso(addMonths(focusDate, -1))))}
								/>
								<h2 id={headingId} className={styles.month} aria-live="polite">
									{formats.month.format(focusDate)}
								</h2>
								<Button
									variant="ghost"
									size="sm"
									icon="chevron-right"
									label={copy.nextMonth}
									disabled={nextDisabled}
									onClick={() => setFocusIso(clamp(toIso(addMonths(focusDate, 1))))}
								/>
							</div>
							<table ref={gridRef} role="grid" aria-labelledby={headingId} className={styles.grid} onKeyDown={onGridKeyDown}>
								<thead>
									<tr>
										{weeks[0]?.map((date) => (
											<th key={date.getDay()} scope="col" abbr={formats.weekdayLong.format(date)} className={styles.weekday}>
												{formats.weekdayShort.format(date)}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{weeks.map((week) => (
										<tr key={toIso(week[0])}>
											{week.map((date) => {
												const iso = toIso(date);
												const isSelected = iso === selected;
												const available = isAvailable(iso);
												return (
													<td
														key={iso}
														role="gridcell"
														tabIndex={iso === focusIso ? 0 : -1}
														aria-selected={isSelected}
														aria-current={iso === today ? 'date' : undefined}
														aria-disabled={!available || undefined}
														aria-label={formats.long.format(date)}
														className={cx(
															styles.day,
															date.getMonth() !== shownMonth && styles.outside,
															iso === today && styles.today,
															isSelected && styles.selected,
															!available && styles.unavailable
														)}
														onClick={() => {
															setFocusIso(iso);
															pick(iso);
														}}
													>
														<span className={styles.dayLabel}>{date.getDate()}</span>
													</td>
												);
											})}
										</tr>
									))}
								</tbody>
							</table>
						</>
					)}
				</div>
			</div>
			{message ? (
				<p id={errorId} className={styles.error}>
					<Icon name="alert" size="sm" />
					{message}
				</p>
			) : (
				hint && (
					<p id={hintId} className={styles.hint}>
						{hint}
					</p>
				)
			)}
		</div>
	);
}

export default Datepicker;
