'use client';

//! React Core
import { useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';

//! Components
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type FieldsetProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'className'> & {
	/** Names the group. Screen readers read it before each field inside. */
	legend: ReactNode;
	/** Keep the legend for assistive tech but hide it visually (the page already titles the group). */
	hideLegend?: boolean;
	/** One line about the whole group, read with the group. */
	description?: ReactNode;
	/** Error for the group as a whole ("Choose at least one service"). Not shown while disabled. */
	error?: string;
	/** `plain` stacks the fields; `card` frames them on a raised surface. */
	variant?: 'plain' | 'card';
	/** Appends "(optional)" to the legend, like Input's label. */
	optional?: boolean;
	className?: string;
	children: ReactNode;
};

/**
 * Inspo component (component.gallery "Fieldset"): a native `<fieldset>` + `<legend>` that groups
 * related fields. `disabled` disables every control inside natively; the group error sits under
 * the legend so it is read before the fields.
 */
export function Fieldset({
	legend,
	hideLegend,
	description,
	error,
	variant = 'plain',
	optional,
	disabled,
	className,
	children,
	...rest
}: FieldsetProps) {
	const id = useId();
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;
	const showError = Boolean(error) && !disabled;
	const describedBy = [description && descriptionId, showError && errorId].filter(Boolean).join(' ') || undefined;

	return (
		<fieldset
			className={cx(styles.fieldset, styles[variant], showError && styles.invalid, variant === 'card' && 'u-bevel', className)}
			disabled={disabled}
			aria-describedby={describedBy}
			{...rest}
		>
			<Label as="legend" size="lg" optional={optional} disabled={disabled} className={cx(styles.legend, hideLegend && 'u-visually-hidden')}>
				{legend}
			</Label>
			<div className={styles.body}>
				{(description || showError) && (
					<div className={styles.meta}>
						{description && (
							<p id={descriptionId} className={styles.description}>
								{description}
							</p>
						)}
						{showError && (
							<p id={errorId} className={styles.error}>
								<Icon name="alert" size="sm" />
								<span>{error}</span>
							</p>
						)}
					</div>
				)}
				<div className={styles.content}>{children}</div>
			</div>
		</fieldset>
	);
}

export default Fieldset;
