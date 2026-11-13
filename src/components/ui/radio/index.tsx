'use client';

//! React Core
import { createContext, forwardRef, useContext, useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';
import { FieldMessage, Label, describedBy } from '@/components/ui/label';
import { useFormReset } from '@/components/ui/label/use-form-reset';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type RadioContextValue = {
	name: string;
	value: string | undefined;
	select: (value: string) => void;
	disabled?: boolean;
	required?: boolean;
	invalid: boolean;
	variant: 'default' | 'card';
};

const RadioContext = createContext<RadioContextValue | null>(null);

export type RadioGroupProps = {
	/** Names the group (rendered as its label, wired with aria-labelledby). */
	label: ReactNode;
	hideLabel?: boolean;
	/** Form field name. Defaults to a unique id. */
	name?: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	hint?: ReactNode;
	/** Error for the group. Not shown while disabled. */
	error?: string;
	required?: boolean;
	optional?: boolean;
	disabled?: boolean;
	/** `vertical` (default) stacks the options; `horizontal` lines them up and wraps. */
	orientation?: 'vertical' | 'horizontal';
	/** `card` turns each option into a selectable card (plans, delivery speeds). */
	variant?: 'default' | 'card';
	className?: string;
	children: ReactNode;
};

/**
 * Inspo component (component.gallery "Radio button"): one choice from a short list. Real
 * `<input type="radio">`s sharing a name, so the browser gives the APG keyboard model: Tab enters
 * at the checked option, arrow keys move and select (wrapping), Space selects the focused one.
 */
export function RadioGroup({
	label,
	hideLabel,
	name,
	value,
	defaultValue,
	onValueChange,
	hint,
	error,
	required,
	optional,
	disabled,
	orientation = 'vertical',
	variant = 'default',
	className,
	children,
}: RadioGroupProps) {
	const id = useId();
	const labelId = `${id}-label`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const groupRef = useRef<HTMLDivElement>(null);
	const [inner, setInner] = useState(defaultValue);
	useFormReset(groupRef, () => setInner(defaultValue));
	const current = value !== undefined ? value : inner;
	const showError = Boolean(error) && !disabled;

	const select = (next: string) => {
		if (value === undefined) setInner(next);
		onValueChange?.(next);
	};

	return (
		<div ref={groupRef} className={cx(styles.group, className)}>
			<Label as="span" id={labelId} optional={optional} disabled={disabled} className={cx(hideLabel && 'u-visually-hidden')}>
				{label}
			</Label>
			<div
				role="radiogroup"
				aria-labelledby={labelId}
				aria-describedby={describedBy({ hintId, errorId, hint, error: showError ? error : undefined })}
				aria-required={required || undefined}
				aria-invalid={showError || undefined}
				aria-disabled={disabled || undefined}
				className={cx(styles.options, styles[orientation], styles[variant], showError && styles.invalid)}
			>
				<RadioContext.Provider value={{ name: name ?? id, value: current, select, disabled, required, invalid: showError, variant }}>
					{children}
				</RadioContext.Provider>
			</div>
			<FieldMessage hintId={hintId} errorId={errorId} hint={hint} error={showError ? error : undefined} />
		</div>
	);
}

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'value' | 'checked' | 'defaultChecked' | 'onChange' | 'className'> & {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	/** Card variant only: an icon that names the option. */
	icon?: IconName;
	className?: string;
};

/** One option of a RadioGroup. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ value, label, description, icon, disabled, className, ...rest }, ref) {
	const group = useContext(RadioContext);
	const id = useId();
	const descriptionId = `${id}-description`;
	if (!group) throw new Error('Radio must be rendered inside a RadioGroup.');

	const isDisabled = Boolean(disabled || group.disabled);
	const card = group.variant === 'card';

	return (
		<label htmlFor={id} className={cx(styles.option, card && styles.cardOption, isDisabled && styles.disabled, className)}>
			<input
				ref={ref}
				id={id}
				type="radio"
				name={group.name}
				value={value}
				checked={group.value === value}
				onChange={() => group.select(value)}
				disabled={isDisabled}
				required={group.required}
				aria-describedby={description ? descriptionId : undefined}
				className={styles.input}
				{...rest}
			/>
			{card && icon && <Icon name={icon} size="lg" className={styles.cardIcon} />}
			<span className={styles.text}>
				<span className={styles.label}>{label}</span>
				{description && (
					<span id={descriptionId} className={styles.description}>
						{description}
					</span>
				)}
			</span>
			<span className={cx(styles.dot, 'u-bevel')} aria-hidden="true">
				<span className={styles.pip} />
			</span>
		</label>
	);
});

export default RadioGroup;
