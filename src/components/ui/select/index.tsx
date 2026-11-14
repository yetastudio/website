'use client';

//! React Core
import { forwardRef, useId, useRef, type ReactNode, type SelectHTMLAttributes } from 'react';

//! Components
import { Icon } from '@/components/ui/icon';
import { FieldMessage, Label, describedBy } from '@/components/ui/label';
import { useErrorShake } from '@/components/ui/label/use-error-shake';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectOptionGroup = { group: string; options: ReadonlyArray<SelectOption> };
export type SelectSize = 'sm' | 'md' | 'lg';

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'size' | 'multiple'> & {
	label: string;
	hideLabel?: boolean;
	hint?: ReactNode;
	/** Error message. Sets aria-invalid and replaces the hint. Not shown on a disabled select. */
	error?: string;
	optional?: boolean;
	/** sm 30 · md 34 · lg 36 (default, Input's height). */
	size?: SelectSize;
	/** Empty first option ("Choose a budget"). Hidden from the list when the select is required. */
	placeholder?: string;
	/** Options as data; or pass `<option>` / `<optgroup>` children instead. */
	options?: ReadonlyArray<SelectOption | SelectOptionGroup>;
	className?: string;
	children?: ReactNode;
};

const labelSizeFor = { sm: 'sm', md: 'md', lg: 'md' } as const;

/**
 * Inspo component (component.gallery "Select"): a native `<select>` dressed as Input. The list,
 * keyboard (type-ahead, arrows, Enter / Space) and mobile pickers stay the platform's.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{ id: idProp, label, hideLabel, hint, error, optional, size = 'lg', placeholder, options, className, disabled, required, value, defaultValue, children, ...rest },
	ref
) {
	const id = useId();
	const selectId = idProp ?? `${id}-select`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const boxRef = useRef<HTMLDivElement>(null);
	const showError = Boolean(error) && !disabled;
	useErrorShake(boxRef, showError ? error : undefined);

	// With a placeholder and no value, start on the empty option instead of the first real one.
	const initial = placeholder && value === undefined && defaultValue === undefined ? '' : defaultValue;

	return (
		<div className={cx(styles.field, styles[size], showError && styles.invalid, className)}>
			<Label htmlFor={selectId} size={labelSizeFor[size]} optional={optional} disabled={disabled} className={cx(hideLabel && 'u-visually-hidden')}>
				{label}
			</Label>
			<div ref={boxRef} className={cx(styles.box, 't-input')}>
				<select
					ref={ref}
					id={selectId}
					className={styles.control}
					disabled={disabled}
					required={required}
					value={value}
					defaultValue={value === undefined ? initial : undefined}
					aria-invalid={showError || undefined}
					aria-describedby={describedBy({ hintId, errorId, hint, error: showError ? error : undefined })}
					{...rest}
				>
					{placeholder && (
						<option value="" disabled={required} hidden={required}>
							{placeholder}
						</option>
					)}
					{children ??
						options?.map((item) =>
							'group' in item ? (
								<optgroup key={item.group} label={item.group}>
									{item.options.map((option) => (
										<option key={option.value} value={option.value} disabled={option.disabled}>
											{option.label}
										</option>
									))}
								</optgroup>
							) : (
								<option key={item.value} value={item.value} disabled={item.disabled}>
									{item.label}
								</option>
							)
						)}
				</select>
				<Icon name="chevron-down" size={size === 'lg' ? 'md' : 'sm'} className={styles.chevron} />
			</div>
			<FieldMessage hintId={hintId} errorId={errorId} hint={hint} error={showError ? error : undefined} />
		</div>
	);
});

export default Select;
