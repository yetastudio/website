'use client';

//! React Core
import { useId, useState, type ReactNode } from 'react';

//! Hooks
import { useLocale, useTranslations } from 'next-intl';

//! Components
import { Icon, type IconSize } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type RatingSize = 'sm' | 'md' | 'lg';

export type RatingLabels = {
	/** Read-only name; receives the formatted value and the max ("Rated 4.5 out of 5"). */
	value: (value: string, max: number) => string;
	/** Each radio's name ("3 stars"). */
	star: (count: number) => string;
};

export type RatingProps = {
	/** Shows a value instead of asking for one: partial stars, role="img" with the value as its name. */
	readOnly?: boolean;
	/** Read-only value (fractions allowed), or the controlled interactive value. */
	value?: number;
	/** Interactive starting value (uncontrolled). */
	defaultValue?: number;
	onChange?: (value: number) => void;
	max?: number;
	/** sm 14 · md 20 · lg 24 stars; interactive stars keep a 24px+ target. */
	size?: RatingSize;
	/** Interactive: the question (fieldset legend). Read-only: replaces the default name. */
	label?: string;
	/** Read-only: shows the number beside the stars. */
	showValue?: boolean;
	/** Read-only: how many ratings it averages, shown in brackets. */
	count?: number;
	hint?: ReactNode;
	error?: string;
	optional?: boolean;
	required?: boolean;
	disabled?: boolean;
	/** Radio group name (form submission). */
	name?: string;
	labels?: Partial<RatingLabels>;
	className?: string;
};

function useDefaultLabels(): RatingLabels {
	const t = useTranslations('common.ui.rating');
	return {
		value: (value, max) => t('value', { value, max }),
		star: (count) => t('star', { count }),
	};
}

const ICON_SIZE: Record<RatingSize, IconSize> = { sm: 'sm', md: 'lg', lg: 'xl' };

/**
 * Inspo component (component.gallery "Rating"). Read-only, it draws partial stars (to a tenth) and
 * names itself "Rated 4.5 out of 5" (role img), with an optional visible number and count.
 * Interactive, it is a group of real radio inputs under a legend: Tab enters at the checked star,
 * → / ↓ add a star and ← / ↑ remove one, and hovering previews the value. The star fill is the
 * component's only hue (the yellow accent).
 */
export function Rating({
	readOnly,
	value,
	defaultValue,
	onChange,
	max = 5,
	size = 'md',
	label,
	showValue,
	count,
	hint,
	error,
	optional,
	required,
	disabled,
	name,
	labels,
	className,
}: RatingProps) {
	const t = useTranslations('common');
	const locale = useLocale();
	const copy = { ...useDefaultLabels(), ...labels };
	const id = useId();
	const groupName = name ?? `${id}-rating`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const iconSize = ICON_SIZE[size];

	const [innerValue, setInnerValue] = useState<number | undefined>(defaultValue);
	const [hover, setHover] = useState<number | null>(null);

	const stars = Array.from({ length: max }, (_, index) => index + 1);

	if (readOnly) {
		const shown = Math.min(max, Math.max(0, value ?? 0));
		const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(shown);
		const countText = count === undefined ? null : new Intl.NumberFormat(locale).format(count);
		return (
			<span className={cx(styles.display, styles[size], className)}>
				<span role="img" aria-label={label ?? copy.value(formatted, max)} className={styles.stars}>
					{stars.map((star) => {
						// Rounded to a tenth so 4.25 does not draw a sliver that reads as noise.
						const fill = Math.round(Math.min(1, Math.max(0, shown - (star - 1))) * 10) * 10;
						return (
							<span key={star} className={styles.star}>
								<Icon name="star" size={iconSize} className={styles.empty} />
								{fill > 0 && (
									<span className={styles.fill} style={fill < 100 ? { clipPath: `inset(0 ${100 - fill}% 0 0)` } : undefined}>
										<Icon name="star" size={iconSize} fill="currentColor" className={styles.full} />
									</span>
								)}
							</span>
						);
					})}
				</span>
				{showValue && (
					<span className={styles.number} aria-hidden="true">
						{formatted}
					</span>
				)}
				{countText && <span className={styles.count}>({countText})</span>}
			</span>
		);
	}

	const current = value ?? innerValue;
	const lit = hover ?? current ?? 0;
	const message = disabled ? undefined : error;
	const describedBy = [hint ? hintId : null, message ? errorId : null].filter(Boolean).join(' ') || undefined;

	const choose = (next: number) => {
		if (value === undefined) setInnerValue(next);
		onChange?.(next);
	};

	return (
		<fieldset
			className={cx(styles.fieldset, styles[size], message && styles.invalid, disabled && styles.disabled, className)}
			disabled={disabled}
			aria-describedby={describedBy}
		>
			{label && (
				<legend className={styles.legend}>
					{label}
					{optional && <span className={styles.optional}> ({t('optional')})</span>}
				</legend>
			)}
			{hint && (
				<p id={hintId} className={styles.hint}>
					{hint}
				</p>
			)}
			<div className={styles.row}>
				<div className={cx(styles.options, hover !== null && styles.previewing)} onPointerLeave={() => setHover(null)}>
					{stars.map((star) => (
						<label
							key={star}
							className={cx(styles.option, star <= lit && styles.lit)}
							onPointerEnter={(event) => {
								if (!disabled && event.pointerType === 'mouse') setHover(star);
							}}
						>
							<input
								type="radio"
								className={styles.radio}
								name={groupName}
								value={star}
								checked={current === star}
								required={required}
								onChange={() => choose(star)}
							/>
							<Icon name="star" size={iconSize} fill="currentColor" className={styles.icon} />
							<span className="u-visually-hidden">{copy.star(star)}</span>
						</label>
					))}
				</div>
				{current !== undefined && (
					<span className={styles.number} aria-hidden="true">
						{current}/{max}
					</span>
				)}
			</div>
			{message && (
				<p id={errorId} className={styles.error}>
					<Icon name="alert" size="sm" />
					{message}
				</p>
			)}
		</fieldset>
	);
}

export default Rating;
