'use client';

//! React Core
import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';

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
	const titleId = useId();
	const lenis = useLenis();

	const panelRef = useRef<HTMLDivElement>(null);
	const isSheet = placement !== 'center';

	// Motion is transitions.dev: a centred dialog is a Modal (.t-modal + is-open / is-closing),
	// sheets are a Panel reveal (.t-panel-slide + data-open). The states live on the elements,
	// not in React state: they only drive CSS.
	const finishClose = useCallback(() => {
		const dialog = ref.current;
		panelRef.current?.classList.remove('is-closing');
		if (dialog) delete dialog.dataset.closing;
		if (dialog?.open) dialog.close();
		opener.current?.focus?.();
	}, []);

	useEffect(() => {
		const dialog = ref.current;
		const panel = panelRef.current;
		if (!dialog || !panel) return;
		if (open && !dialog.open) {
			opener.current = document.activeElement as HTMLElement | null;
			panel.classList.remove('is-closing');
			dialog.showModal();
			lenis?.stop();
			// The dialog was display:none; reflow so the panel transitions from its resting pre-open state.
			void panel.offsetWidth;
			if (isSheet) panel.dataset.open = 'true';
			else panel.classList.add('is-open');
		} else if (!open && dialog.open) {
			lenis?.start();
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				if (isSheet) panel.dataset.open = 'false';
				else panel.classList.remove('is-open');
				finishClose();
				return;
			}
			dialog.dataset.closing = 'true';
			if (isSheet) {
				panel.dataset.open = 'false';
			} else {
				panel.classList.remove('is-open');
				panel.classList.add('is-closing');
			}
			// Same close-then-cleanup timing as the snippet: read the close duration from CSS.
			const closeMs = parseFloat(getComputedStyle(dialog).getPropertyValue('--dialog-exit')) || 150;
			const timer = window.setTimeout(finishClose, closeMs);
			return () => window.clearTimeout(timer);
		}
	}, [open, lenis, finishClose, isSheet]);

	useEffect(() => () => lenis?.start(), [lenis]);

	return (
		<dialog
			ref={ref}
			className={cx(styles.dialog, styles[placement], styles[size], className)}
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
		>
			<div ref={panelRef} className={cx(styles.panel, 'u-bevel', isSheet ? 't-panel-slide' : 't-modal')}>
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
