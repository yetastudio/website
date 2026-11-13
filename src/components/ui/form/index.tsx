'use client';

//! React Core
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type FormHTMLAttributes, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type FormError = {
	/** The field's `name` (or its `id`). The summary link moves focus there. */
	field: string;
	message: string;
};

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'className'> & {
	/** Shown as an error summary at the top, one link per field. Keep each field's own `error` too. */
	errors?: ReadonlyArray<FormError>;
	/** Summary heading. */
	errorTitle?: ReactNode;
	/** Heading level of the summary title, to fit the page outline. */
	errorHeadingLevel?: 2 | 3 | 4;
	/** Move focus to the summary when a new set of errors arrives (after submit). */
	focusErrors?: boolean;
	/** Space between fields: comfortable 20 (default) or compact 12. */
	density?: 'comfortable' | 'compact';
	className?: string;
	children: ReactNode;
};

/** Focuses a field by name (the checked or first radio of a group) or by id, and scrolls it into view. */
function focusField(form: HTMLFormElement | null, field: string) {
	const named = form?.elements.namedItem(field);
	let target: HTMLElement | null = null;
	if (named instanceof RadioNodeList) {
		const items = Array.from(named) as HTMLInputElement[];
		target = items.find((item) => item.checked) ?? items[0] ?? null;
	} else if (named instanceof HTMLElement) {
		target = named;
	}
	target ??= document.getElementById(field);
	if (!target) return false;
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	target.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
	target.focus({ preventScroll: true });
	return true;
}

/**
 * Inspo component (component.gallery "Form"): the form's layout and spacing rhythm, plus an error
 * summary that lists every problem and links each one to its field. Fields keep their own errors;
 * the summary is the way in for keyboard and screen-reader users after a failed submit.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
	{ errors, errorTitle = 'Fix these to continue', errorHeadingLevel = 2, focusErrors = true, density = 'comfortable', className, children, ...rest },
	ref
) {
	const id = useId();
	const formRef = useRef<HTMLFormElement>(null);
	const summaryRef = useRef<HTMLDivElement>(null);
	useImperativeHandle(ref, () => formRef.current as HTMLFormElement);

	const list = errors ?? [];
	const errorsKey = list.map((error) => `${error.field}:${error.message}`).join('|');
	const previousKey = useRef(errorsKey);

	// A new set of errors (a failed submit) moves focus to the summary. Errors present on the
	// first render are left alone, so a page never jumps on load.
	useEffect(() => {
		const previous = previousKey.current;
		previousKey.current = errorsKey;
		if (!focusErrors || !errorsKey || errorsKey === previous) return;
		summaryRef.current?.focus();
	}, [errorsKey, focusErrors]);

	const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, field: string) => {
		if (focusField(formRef.current, field)) event.preventDefault();
	};

	const Title = `h${errorHeadingLevel}` as const;

	return (
		<form ref={formRef} className={cx(styles.form, styles[density], className)} {...rest}>
			{list.length > 0 && (
				<div ref={summaryRef} className={styles.summary} tabIndex={-1} aria-labelledby={`${id}-summary`}>
					<div role="alert" className={styles.summaryBody}>
						<Title id={`${id}-summary`} className={styles.summaryTitle}>
							<Icon name="alert" size="md" className={styles.summaryIcon} />
							{errorTitle}
						</Title>
						<ul className={styles.summaryList}>
							{list.map((error) => (
								<li key={`${error.field}-${error.message}`}>
									<a href={`#${error.field}`} className={styles.summaryLink} onClick={(event) => onLinkClick(event, error.field)}>
										{error.message}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
			{children}
		</form>
	);
});

export type FormRowProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

/** Fields side by side, as many columns as children; each wraps to its own line once narrower than a field. */
export function FormRow({ className, children, ...rest }: FormRowProps) {
	return (
		<div className={cx(styles.row, className)} {...rest}>
			{children}
		</div>
	);
}

export type FormActionsProps = HTMLAttributes<HTMLDivElement> & {
	/** `end` (default) for most forms; `between` puts the note or first action on the left; `stretch` fills phones. */
	align?: 'start' | 'end' | 'between' | 'stretch';
	/** Short reassurance beside the buttons ("We reply within one business day"). */
	note?: ReactNode;
	children: ReactNode;
};

/**
 * The submit / reset row. Order the primary action last (right) and give it the one icon that
 * names its purpose (send, book, save), never a generic arrow beside it. Secondary actions are ghost.
 */
export function FormActions({ align = 'end', note, className, children, ...rest }: FormActionsProps) {
	return (
		<div className={cx(styles.actions, styles[align], className)} {...rest}>
			{note && <p className={styles.note}>{note}</p>}
			<div className={styles.buttons}>{children}</div>
		</div>
	);
}

export default Form;
