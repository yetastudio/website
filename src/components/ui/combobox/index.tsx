'use client';

//! React Core
import {
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type FocusEvent,
	type KeyboardEvent,
	type ReactNode,
} from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ComboboxOption = {
	value: string;
	label: string;
	/** Secondary line under the label. */
	description?: string;
	disabled?: boolean;
};

export type ComboboxProps = {
	label: string;
	options: ReadonlyArray<ComboboxOption>;
	/** Selected option value (controlled). `null` clears it. */
	value?: string | null;
	defaultValue?: string | null;
	onChange?: (value: string | null) => void;
	placeholder?: string;
	hint?: ReactNode;
	/** Error message. Sets aria-invalid and replaces the hint. Not shown on a disabled field. */
	error?: string;
	optional?: boolean;
	required?: boolean;
	disabled?: boolean;
	/** Submits the selected value under this name (hidden input). */
	name?: string;
	/** Shown in the popup when nothing matches what was typed. */
	emptyMessage?: string;
	/** Accessible name of the toggle button. */
	toggleLabel?: string;
	/** Polite announcement of how many options match. */
	resultsLabel?: (count: number) => string;
	className?: string;
};

type Phase = 'closed' | 'open' | 'closing';

// useLayoutEffect warns during server rendering; placement is measured on the client only.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Case- and accent-insensitive form used to match what was typed. */
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** Wraps the typed part of a label so the match reads at a glance. */
function Highlight({ label, query }: { label: string; query: string }) {
	const folded = fold(label);
	const needle = fold(query.trim());
	const start = needle ? folded.indexOf(needle) : -1;
	// Folding keeps one character per letter for precomposed text; skip the mark if it does not.
	if (start < 0 || folded.length !== label.length) return <>{label}</>;
	return (
		<>
			{label.slice(0, start)}
			<span className={styles.match}>{label.slice(start, start + needle.length)}</span>
			{label.slice(start + needle.length)}
		</>
	);
}

/**
 * Inspo component (component.gallery "Combobox"): an editable combobox with a list popup,
 * after the WAI-ARIA APG "list autocomplete" pattern. Typing filters the options; ↓ / ↑ move the
 * active option (aria-activedescendant, focus stays in the field), Enter picks it, Escape closes
 * the list and, when it is already closed, clears the field. The popup grows from the field with the
 * transitions.dev "Menu dropdown" and flips above it when there is no room below.
 */
export function Combobox({
	label,
	options,
	value,
	defaultValue = null,
	onChange,
	placeholder,
	hint,
	error,
	optional,
	required,
	disabled,
	name,
	emptyMessage,
	toggleLabel,
	resultsLabel,
	className,
}: ComboboxProps) {
	const t = useTranslations('common');
	const ui = useTranslations('common.ui.combobox');
	const id = useId();
	const inputId = `${id}-input`;
	const listId = `${id}-listbox`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;

	const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
	const selectedValue = value !== undefined ? value : innerValue;
	const selected = options.find((option) => option.value === selectedValue) ?? null;

	// What the person typed since the last pick; null shows the selected option's label.
	const [draft, setDraft] = useState<string | null>(null);
	const text = draft ?? selected?.label ?? '';
	const query = draft ?? '';
	const filtered = useMemo(() => {
		const needle = fold(query.trim());
		return needle ? options.filter((option) => fold(option.label).includes(needle)) : options;
	}, [options, query]);

	const [phase, setPhase] = useState<Phase>('closed');
	const [active, setActive] = useState(-1);
	const open = phase === 'open';

	const anchorRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
	const closeTimer = useRef<number | undefined>(undefined);

	const showError = Boolean(error) && !disabled;
	const shownError = useRef(showError ? error : undefined);

	useEffect(() => () => window.clearTimeout(closeTimer.current), []);

	// transitions.dev Error state shake, as on Input: replay it when an error appears or changes.
	useEffect(() => {
		const next = showError ? error : undefined;
		const previous = shownError.current;
		shownError.current = next;
		const box = boxRef.current;
		if (!next || next === previous || !box) return;
		box.classList.remove('is-shaking');
		void box.offsetWidth;
		box.classList.add('is-shaking');
		const style = getComputedStyle(box);
		const ms = (token: string, fallback: number) => parseFloat(style.getPropertyValue(token)) || fallback;
		const timer = window.setTimeout(() => box.classList.remove('is-shaking'), ms('--shake-dur-a', 80) * 2 + ms('--shake-dur-b', 60) * 2 + 20);
		return () => window.clearTimeout(timer);
	}, [showError, error]);

	// Flip above the field when the list would not fit below it. Written to the element (not state):
	// it only drives CSS, and transform-origin must be in place before the open transition starts.
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

	useEffect(() => {
		if (active >= 0) optionRefs.current[active]?.scrollIntoView({ block: 'nearest' });
	}, [active]);

	const openPopup = () => {
		if (disabled) return;
		window.clearTimeout(closeTimer.current);
		setPhase('open');
	};

	const closePopup = () => {
		setActive(-1);
		if (phase !== 'open') return;
		const popup = popupRef.current;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const closeMs = reduce || !popup ? 0 : parseFloat(getComputedStyle(popup).getPropertyValue('--dropdown-close-dur')) || 150;
		setPhase('closing');
		closeTimer.current = window.setTimeout(() => setPhase('closed'), closeMs);
	};

	const commit = (option: ComboboxOption | null) => {
		if (option?.disabled) return;
		const next = option?.value ?? null;
		setDraft(null);
		if (value === undefined) setInnerValue(next);
		if (next !== selectedValue) onChange?.(next);
	};

	/** The next enabled option from `from` in `step` direction, wrapping; -1 when none is enabled. */
	const move = (from: number, step: 1 | -1) => {
		const count = filtered.length;
		const start = from < 0 ? (step > 0 ? -1 : count) : from;
		for (let i = 1; i <= count; i += 1) {
			const index = (((start + step * i) % count) + count) % count;
			if (!filtered[index].disabled) return index;
		}
		return -1;
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.nativeEvent.isComposing) return;
		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				if (!open) {
					openPopup();
					if (event.altKey) return;
					const current = filtered.findIndex((option) => option.value === selectedValue);
					setActive(current >= 0 ? current : move(-1, 1));
					return;
				}
				setActive(move(active, 1));
				return;
			}
			case 'ArrowUp': {
				event.preventDefault();
				if (!open) {
					openPopup();
					setActive(move(-1, -1));
					return;
				}
				if (event.altKey) {
					if (active >= 0) commit(filtered[active]);
					closePopup();
					return;
				}
				setActive(move(active, -1));
				return;
			}
			case 'Enter': {
				if (!open || active < 0) return;
				event.preventDefault();
				commit(filtered[active]);
				closePopup();
				return;
			}
			case 'Escape': {
				if (open) {
					event.preventDefault();
					closePopup();
				} else if (text) {
					event.preventDefault();
					commit(null);
				}
				return;
			}
			case 'Tab': {
				if (open) closePopup();
				return;
			}
		}
	};

	const onBlur = (event: FocusEvent<HTMLInputElement>) => {
		// A press on the list (its scrollbar, padding) keeps the field focused.
		if (event.relatedTarget && popupRef.current?.contains(event.relatedTarget as Node)) {
			inputRef.current?.focus();
			return;
		}
		closePopup();
		if (draft === null) return;
		const typed = fold(draft.trim());
		if (!typed) {
			commit(null);
			return;
		}
		// An exact match picks itself; anything else returns to the last pick.
		const exact = options.find((option) => !option.disabled && fold(option.label) === typed);
		if (exact) commit(exact);
		else setDraft(null);
	};

	const activeId = open && active >= 0 ? `${id}-option-${active}` : undefined;
	const describedBy = showError ? errorId : hint ? hintId : undefined;

	return (
		<div className={cx(styles.field, showError && styles.invalid, disabled && styles.disabled, className)}>
			<label htmlFor={inputId} className={styles.label}>
				{label}
				{optional && <span className={styles.optional}> ({t('optional')})</span>}
			</label>
			{/* The box shakes on a new error; the popup is its sibling so no transform ever wraps it. */}
			<div ref={anchorRef} className={styles.anchor}>
				<div ref={boxRef} className={cx(styles.box, 't-input')}>
				<input
					ref={inputRef}
					id={inputId}
					type="text"
					role="combobox"
					className={styles.input}
					value={text}
					placeholder={placeholder}
					disabled={disabled}
					required={required}
					autoComplete="off"
					spellCheck={false}
					aria-autocomplete="list"
					aria-expanded={open}
					aria-controls={listId}
					aria-activedescendant={activeId}
					aria-invalid={showError || undefined}
					aria-describedby={describedBy}
					onChange={(event) => {
						setDraft(event.target.value);
						setActive(-1);
						openPopup();
					}}
					onClick={() => {
						if (!open) openPopup();
					}}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
				/>
				<button
					type="button"
					tabIndex={-1}
					className={styles.toggle}
					aria-label={toggleLabel ?? ui('toggle')}
					aria-expanded={open}
					aria-controls={listId}
					disabled={disabled}
					// Keep focus in the field: the press must not blur it (which would close the list).
					onMouseDown={(event) => event.preventDefault()}
					onClick={() => {
						if (open) closePopup();
						else openPopup();
						inputRef.current?.focus();
					}}
				>
					<Icon name="chevron-down" size="md" className={styles.chevron} />
				</button>
				</div>
				{name && <input type="hidden" name={name} value={selectedValue ?? ''} />}

				<div
					ref={popupRef}
					className={cx(
						't-dropdown',
						styles.popup,
						'u-bevel',
						phase === 'open' && 'is-open',
						phase === 'closing' && 'is-closing',
						phase === 'closed' && styles.closed
					)}
					inert={phase !== 'open'}
				>
					<ul id={listId} role="listbox" aria-label={label} tabIndex={-1} className={styles.listbox} data-lenis-prevent>
						{filtered.map((option, index) => {
							const isSelected = option.value === selectedValue;
							return (
								<li
									key={option.value}
									ref={(node) => {
										optionRefs.current[index] = node;
									}}
									id={`${id}-option-${index}`}
									role="option"
									aria-selected={index === active}
									aria-disabled={option.disabled || undefined}
									className={cx(styles.option, index === active && styles.active, isSelected && styles.selected)}
									onMouseDown={(event) => event.preventDefault()}
									onMouseMove={() => {
										if (!option.disabled && index !== active) setActive(index);
									}}
									onClick={() => {
										if (option.disabled) return;
										commit(option);
										closePopup();
									}}
								>
									<span className={styles.optionText}>
										<span className={styles.optionLabel}>
											<Highlight label={option.label} query={query} />
										</span>
										{option.description && <span className={styles.optionDescription}>{option.description}</span>}
									</span>
									{isSelected && <Icon name="check" size="md" className={styles.check} />}
								</li>
							);
						})}
					</ul>
					{filtered.length === 0 && <p className={styles.empty}>{emptyMessage ?? ui('empty')}</p>}
				</div>
			</div>
			<span role="status" className="u-visually-hidden">
				{open && draft !== null ? (resultsLabel ? resultsLabel(filtered.length) : ui('results', { count: filtered.length })) : ''}
			</span>
			{showError ? (
				<p id={errorId} className={styles.error}>
					<Icon name="alert" size="sm" />
					{error}
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

export default Combobox;
