'use client';

//! React Core
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

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
	return (
		<div className={cx(styles.field, showError && styles.invalid, disabled && styles.disabled, className)}>
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
				className={styles.control}
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
				className={cx(styles.control, styles.textarea)}
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
