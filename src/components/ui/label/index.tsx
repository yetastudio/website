//! React Core
import type { HTMLAttributes, ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type LabelSize = 'sm' | 'md' | 'lg';

export type LabelProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
	children: ReactNode;
	/**
	 * `label` (default) names one control through `htmlFor`. `span` names a group through
	 * `aria-labelledby` (radio group, slider pair). `legend` heads a `<fieldset>`.
	 */
	as?: 'label' | 'span' | 'legend';
	/** Id of the control this label names. Required when `as="label"`. */
	htmlFor?: string;
	/** sm 12 (sm controls) · md 14 (Input / Textarea label, the default) · lg 16 (fieldset legends, form sections). */
	size?: LabelSize;
	/** A quiet asterisk. Put `required` on the control too: that is what assistive tech announces. */
	required?: boolean;
	/** Appends "(optional)". Prefer marking the few optional fields over starring every required one. */
	optional?: boolean;
	/** Subtle tone for a disabled control or group. */
	disabled?: boolean;
};

/**
 * Inspo component (component.gallery "Label"): the text that names a form control. Same type
 * as the Input / Textarea label at `md`, so a form reads as one family.
 */
export function Label({ as = 'label', htmlFor, size = 'md', required, optional, disabled, className, children, ...rest }: LabelProps) {
	const t = useTranslations('common');
	const classes = cx(styles.label, styles[size], disabled && styles.disabled, className);
	const content = (
		<>
			{children}
			{required && (
				<span className={styles.required} aria-hidden="true">
					{' *'}
				</span>
			)}
			{optional && !required && <span className={styles.optional}> ({t('optional')})</span>}
		</>
	);

	if (as === 'legend') {
		return (
			<legend className={classes} {...rest}>
				{content}
			</legend>
		);
	}
	if (as === 'span') {
		return (
			<span className={classes} {...rest}>
				{content}
			</span>
		);
	}
	return (
		<label htmlFor={htmlFor} className={classes} {...rest}>
			{content}
		</label>
	);
}

export type FieldMessageProps = {
	/** Id for the hint paragraph (point aria-describedby at it). */
	hintId: string;
	/** Id for the error paragraph (point aria-describedby at it). */
	errorId: string;
	hint?: ReactNode;
	/** Replaces the hint while present. */
	error?: ReactNode;
	className?: string;
};

/** Hint or error line under a control, styled like Input's. The error carries the alert icon. */
export function FieldMessage({ hintId, errorId, hint, error, className }: FieldMessageProps) {
	if (error) {
		return (
			<p id={errorId} className={cx(styles.error, className)}>
				<Icon name="alert" size="sm" />
				<span>{error}</span>
			</p>
		);
	}
	if (hint) {
		return (
			<p id={hintId} className={cx(styles.hint, className)}>
				{hint}
			</p>
		);
	}
	return null;
}

/** The id aria-describedby should point at: the error while shown, else the hint, else nothing. */
export function describedBy({ hintId, errorId, hint, error }: Pick<FieldMessageProps, 'hintId' | 'errorId' | 'hint' | 'error'>) {
	if (error) return errorId;
	if (hint) return hintId;
	return undefined;
}

export default Label;
