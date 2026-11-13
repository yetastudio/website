'use client';

//! React Core
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
	label: ReactNode;
	description?: ReactNode;
	/** Renders the control as a switch (role="switch"). */
	variant?: 'checkbox' | 'switch';
	className?: string;
};

/**
 * Inspo components: Checkbox and Switch. Both keep a real <input type="checkbox">
 * so form submission, keyboard and screen readers behave natively.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{ label, description, variant = 'checkbox', className, disabled, ...rest },
	ref
) {
	const id = useId();
	const descriptionId = `${id}-description`;
	return (
		<label htmlFor={id} className={cx(styles.row, disabled && styles.disabled, className)}>
			<input
				ref={ref}
				id={id}
				type="checkbox"
				role={variant === 'switch' ? 'switch' : undefined}
				className={styles.input}
				disabled={disabled}
				aria-describedby={description ? descriptionId : undefined}
				{...rest}
			/>
			{variant === 'switch' ? (
				<span className={cx(styles.track, 'u-bevel')} aria-hidden="true">
					<span className={styles.thumb} />
				</span>
			) : (
				<span className={cx(styles.box, 'u-bevel')} aria-hidden="true">
					<Icon name="check" size="sm" className={styles.check} />
				</span>
			)}
			<span className={styles.text}>
				<span className={styles.label}>{label}</span>
				{description && (
					<span id={descriptionId} className={styles.description}>
						{description}
					</span>
				)}
			</span>
		</label>
	);
});

export type SwitchProps = Omit<CheckboxProps, 'variant'>;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(props, ref) {
	return <Checkbox ref={ref} variant="switch" {...props} />;
});

export default Checkbox;
