'use client';

//! React Core
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';
import { useLenis } from 'lenis/react';

//! Components
import { Button } from '@/components/ui/button';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type DialogProps = {
	open: boolean;
	onClose: () => void;
	/** Visible title; also the dialog's accessible name. */
	title: ReactNode;
	/** Hide the title visually but keep it for assistive tech. */
	hideTitle?: boolean;
	children: ReactNode;
	/** `center` is a modal card. `right` and `bottom` are sheets (mobile menu, case study on phones). */
	placement?: 'center' | 'right' | 'bottom';
	size?: 'sm' | 'md' | 'lg';
	footer?: ReactNode;
	className?: string;
};

/**
 * Inspo component built on the native <dialog>: focus is trapped by the browser,
 * Escape and the backdrop close it, focus returns to the opener, and page scroll
 * (Lenis) pauses while it is open.
 */
export function Dialog({
	open,
	onClose,
	title,
	hideTitle,
	children,
	placement = 'center',
	size = 'md',
	footer,
	className,
}: DialogProps) {
	const t = useTranslations('common');
	const ref = useRef<HTMLDialogElement>(null);
	const opener = useRef<HTMLElement | null>(null);
	// Backdrop closes only when the press both starts and ends on it (a text drag that ends outside must not close).
	const pressedBackdrop = useRef(false);
	const [closing, setClosing] = useState(false);
	const titleId = useId();
	const lenis = useLenis();

	const finishClose = useCallback(() => {
		const dialog = ref.current;
		setClosing(false);
		if (dialog?.open) dialog.close();
		opener.current?.focus?.();
	}, []);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (open && !dialog.open) {
			opener.current = document.activeElement as HTMLElement | null;
			dialog.showModal();
			lenis?.stop();
		} else if (!open && dialog.open) {
			lenis?.start();
			const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (reduce) {
				finishClose();
				return;
			}
			setClosing(true);
			// animationend normally finishes the close; this fallback covers paused or
			// throttled animations (background tabs, automation) so the dialog never sticks.
			const exitMs = parseFloat(getComputedStyle(dialog).getPropertyValue('--duration-exit')) || 200;
			const timer = window.setTimeout(finishClose, exitMs + 80);
			return () => window.clearTimeout(timer);
		}
	}, [open, lenis, finishClose]);

	useEffect(() => () => lenis?.start(), [lenis]);

	return (
		<dialog
			ref={ref}
			className={cx(styles.dialog, styles[placement], styles[size], closing && styles.closing, className)}
			aria-labelledby={titleId}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			onPointerDown={(event) => {
				pressedBackdrop.current = event.target === event.currentTarget;
			}}
			onClick={(event) => {
				if (pressedBackdrop.current && event.target === event.currentTarget) onClose();
				pressedBackdrop.current = false;
			}}
			onAnimationEnd={(event) => {
				if (closing && event.target === event.currentTarget) finishClose();
			}}
		>
			<div className={cx(styles.panel, 'u-bevel')}>
				<header className={styles.header}>
					<h2 id={titleId} className={cx(styles.title, hideTitle && 'u-visually-hidden')}>
						{title}
					</h2>
					<Button icon="close" label={t('close')} variant="ghost" size="md" onClick={onClose} className={styles.close} />
				</header>
				{/* Only the scrolling body opts out of Lenis; everything else stays locked while open. */}
				<div className={styles.body} data-lenis-prevent>
					{children}
				</div>
				{footer && <footer className={styles.footer}>{footer}</footer>}
			</div>
		</dialog>
	);
}

export default Dialog;
