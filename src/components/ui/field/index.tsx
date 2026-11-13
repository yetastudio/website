'use client';

//! React Core
import { forwardRef, useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type FieldChrome = {
	label: string;
	/** Helper text under the control. */
	hint?: ReactNode;
	/** Error message. Sets aria-invalid and replaces the hint. Not shown on a disabled field. */
	error?: string;
	/** Marks the label with "(optional)" when false is not the default you want; required fields get aria-required. */
	optional?: boolean;
	className?: string;
};

function useFieldIds() {
	const id = useId();
	return { inputId: `${id}-input`, hintId: `${id}-hint`, errorId: `${id}-error` };
}

function Chrome({
	label,
	hint,
	error,
	optional,
	disabled,
	inputId,
	hintId,
	errorId,
	className,
	children,
}: FieldChrome & { disabled?: boolean; inputId: string; hintId: string; errorId: string; children: ReactNode }) {
	const t = useTranslations('common');
	const showError = Boolean(error) && !disabled;
	const fieldRef = useRef<HTMLDivElement>(null);
	const shownError = useRef(showError ? error : undefined);

	// transitions.dev Error state shake: replay the shake when an error appears or changes
	// (not for an error already present on first render). The message stays until fixed.
	useEffect(() => {
		const next = showError ? error : undefined;
		const previous = shownError.current;
		shownError.current = next;
		if (!next || next === previous) return;
		const control = fieldRef.current?.querySelector<HTMLElement>('.t-input');
		if (!control) return;
		control.classList.remove('is-shaking');
		void control.offsetWidth;
		control.classList.add('is-shaking');
		const style = getComputedStyle(control);
		const ms = (name: string, fallback: number) => parseFloat(style.getPropertyValue(name)) || fallback;
		const shakeMs = ms('--shake-dur-a', 80) * 2 + ms('--shake-dur-b', 60) * 2;
		const timer = window.setTimeout(() => control.classList.remove('is-shaking'), shakeMs + 20);
		return () => window.clearTimeout(timer);
	}, [showError, error]);

	return (
		<div ref={fieldRef} className={cx(styles.field, showError && styles.invalid, disabled && styles.disabled, className)}>
			<label htmlFor={inputId} className={styles.label}>
				{label}
				{optional && <span className={styles.optional}> ({t('optional')})</span>}
			</label>
			{children}
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

export type InputProps = FieldChrome & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

/** Inspo component: labelled text input with hint and error states. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ label, hint, error, optional, className, disabled, required, ...rest },
	ref
) {
	const ids = useFieldIds();
	const showError = Boolean(error) && !disabled;
	return (
		<Chrome {...{ label, hint, error, optional, className, disabled }} {...ids}>
			<input
				ref={ref}
				id={ids.inputId}
				className={cx(styles.control, 't-input')}
				disabled={disabled}
				required={required}
				aria-invalid={showError || undefined}
				aria-describedby={showError ? ids.errorId : hint ? ids.hintId : undefined}
				{...rest}
			/>
		</Chrome>
	);
});

export type TextareaProps = FieldChrome & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>;

/** Inspo component: the multi-line sibling of Input. Grows with its content. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
	{ label, hint, error, optional, className, disabled, required, rows = 4, ...rest },
	ref
) {
	const ids = useFieldIds();
	const showError = Boolean(error) && !disabled;
	return (
		<Chrome {...{ label, hint, error, optional, className, disabled }} {...ids}>
			<textarea
				ref={ref}
				id={ids.inputId}
				rows={rows}
				className={cx(styles.control, styles.textarea, 't-input')}
				disabled={disabled}
				required={required}
				aria-invalid={showError || undefined}
				aria-describedby={showError ? ids.errorId : hint ? ids.hintId : undefined}
				data-lenis-prevent
				{...rest}
			/>
		</Chrome>
	);
});
