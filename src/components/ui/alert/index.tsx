'use client';

//! React Core
import type { HTMLAttributes, ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AlertLive = 'polite' | 'assertive' | 'off';

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> & {
	/** Status hue of the icon. Everything else stays neutral. */
	tone?: AlertTone;
	/** `inline` is a card inside the content; `banner` is a full-width glass strip at the top of a page or section. */
	variant?: 'inline' | 'banner';
	/** Short summary in the strong ink. */
	title?: ReactNode;
	/** Body copy. Without a title it takes the regular ink. */
	children?: ReactNode;
	/** One follow-up control, usually a small Button (Retry, Review). */
	action?: ReactNode;
	/** Overrides the tone's status icon; `null` removes it. */
	icon?: IconName | null;
	/** Shows a dismiss button. The parent removes the alert and decides where focus goes next. */
	onDismiss?: () => void;
	/**
	 * How assistive tech hears it. `assertive` renders `role="alert"` (interrupts), `polite` renders
	 * `role="status"`, `off` renders a static callout. Defaults: danger and warning are assertive,
	 * the rest polite. Use `off` for callouts that are part of the page from the start.
	 */
	live?: AlertLive;
};

const toneIcon: Record<AlertTone, IconName> = {
	neutral: 'info',
	info: 'info',
	success: 'circle-check',
	warning: 'triangle-alert',
	danger: 'alert',
};

const roleFor: Record<AlertLive, 'alert' | 'status' | undefined> = { assertive: 'alert', polite: 'status', off: undefined };

/**
 * Inspo component (component.gallery "Alert"): a prominent message about something that changed.
 * Neutral surface; the status hue lives only on the icon.
 */
export function Alert({
	tone = 'neutral',
	variant = 'inline',
	title,
	children,
	action,
	icon,
	onDismiss,
	live,
	className,
	...rest
}: AlertProps) {
	const t = useTranslations('common');
	const politeness = live ?? (tone === 'danger' || tone === 'warning' ? 'assertive' : 'polite');
	const iconName = icon === undefined ? toneIcon[tone] : icon;

	return (
		<div
			role={roleFor[politeness]}
			className={cx(styles.alert, styles[variant], styles[`tone-${tone}`], variant === 'inline' && 'u-bevel', className)}
			{...rest}
		>
			{iconName && (
				<span className={styles.iconSlot}>
					<Icon name={iconName} size="md" className={styles.icon} />
				</span>
			)}
			<div className={styles.content}>
				{title && <p className={styles.title}>{title}</p>}
				{children && <div className={cx(styles.body, !title && styles.bodyOnly)}>{children}</div>}
			</div>
			{action && <div className={styles.action}>{action}</div>}
			{onDismiss && <Button icon="close" label={t('dismiss')} variant="ghost" size="sm" onClick={onDismiss} className={styles.dismiss} />}
		</div>
	);
}

export default Alert;
