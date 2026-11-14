'use client';

//! React Core
import {
	cloneElement,
	isValidElement,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
} from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type TriggerProps = {
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	'aria-expanded'?: boolean;
	'aria-controls'?: string;
	'aria-haspopup'?: 'dialog';
};

export type PopoverProps = {
	/** One focusable element that opens it, usually a Button. It gets aria-expanded / aria-controls / aria-haspopup. */
	trigger: ReactElement<TriggerProps>;
	children: ReactNode;
	/** Visible title; also the popover's accessible name. */
	title?: ReactNode;
	/** Accessible name when there is no visible title. */
	label?: string;
	/** Preferred side. It flips when the viewport has no room. */
	side?: 'bottom' | 'top';
	/** Alignment with the trigger's edges. */
	align?: 'start' | 'center' | 'end';
	/** Controlled state. Leave it out to let the popover manage itself. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Close button in the header. On by default when there is a title. */
	showClose?: boolean;
	className?: string;
};

type Phase = 'closed' | 'opening' | 'open' | 'closing';
type FocusOnClose = 'always' | 'if-lost' | 'never';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function supportsPopover(element: HTMLElement) {
	return typeof element.showPopover === 'function';
}

/**
 * Inspo component (component.gallery "Popover"): interactive content that opens from a trigger on
 * click and stays anchored to it. A non-modal dialog on the native Popover API (`popover="manual"`,
 * top layer, never clipped) with the same behaviour where the API is missing: Escape, an outside
 * press or tabbing away closes it; Escape and the close button return focus to the trigger.
 * Motion is the transitions.dev "Menu dropdown", growing from the trigger's side.
 */
export function Popover({
	trigger,
	children,
	title,
	label,
	side = 'bottom',
	align = 'start',
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	showClose,
	className,
}: PopoverProps) {
	const t = useTranslations('common');
	const id = useId();
	const panelId = `${id}-popover`;
	const titleId = `${id}-title`;
	const anchorRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	// Where focus goes once the popover has closed. Set by whatever closes it; a close from the parent
	// (controlled `open`) keeps the default, which only rescues focus that would be lost.
	const [focusOnClose, setFocusOnClose] = useState<FocusOnClose>('if-lost');
	// Only a popover that was shown has focus to hand back (not the first, closed render).
	const wasShownRef = useRef(false);

	const controlled = openProp !== undefined;
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const open = controlled ? openProp : uncontrolledOpen;

	const setOpen = useCallback(
		(next: boolean) => {
			if (!controlled) setUncontrolledOpen(next);
			onOpenChange?.(next);
		},
		[controlled, onOpenChange]
	);

	const requestClose = useCallback(
		(focus: FocusOnClose) => {
			setFocusOnClose(focus);
			setOpen(false);
		},
		[setOpen]
	);

	// The open state drives a short phase machine: closed → opening (shown at the snippet's rest
	// state) → open (.is-open) → closing (.is-closing) → closed.
	const [phase, setPhase] = useState<Phase>('closed');
	const [previousOpen, setPreviousOpen] = useState(false);
	if (open !== previousOpen) {
		setPreviousOpen(open);
		setPhase(open ? 'opening' : 'closing');
		if (open) setFocusOnClose('if-lost');
	}

	const place = useCallback(() => {
		const anchor = anchorRef.current;
		const panel = panelRef.current;
		if (!anchor || !panel) return;
		const rect = anchor.getBoundingClientRect();
		const width = panel.offsetWidth;
		const height = panel.offsetHeight;
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
		const gap = rem * 0.5; // --space-8
		const edge = rem; // --space-16, the page gutter
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = window.innerHeight;

		let actualSide = side;
		const below = rect.bottom + gap;
		const above = rect.top - gap - height;
		if (side === 'bottom' && below + height > viewportHeight - edge && above >= edge) actualSide = 'top';
		if (side === 'top' && above < edge && below + height <= viewportHeight - edge) actualSide = 'bottom';
		const top = actualSide === 'bottom' ? below : above;

		let left = rect.left;
		if (align === 'center') left = rect.left + rect.width / 2 - width / 2;
		if (align === 'end') left = rect.right - width;
		left = Math.min(Math.max(left, edge), Math.max(edge, viewportWidth - width - edge));

		panel.style.setProperty('--popover-x', `${Math.round(left)}px`);
		panel.style.setProperty('--popover-y', `${Math.round(top)}px`);
		const horizontal = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
		panel.dataset.origin = `${actualSide === 'bottom' ? 'top' : 'bottom'}-${horizontal}`;
	}, [side, align]);

	// Phase effects. State only changes inside callbacks; the DOM work (top layer, position, focus) happens here.
	useEffect(() => {
		const panel = panelRef.current;
		if (!panel) return;

		if (phase === 'opening') {
			wasShownRef.current = true;
			if (supportsPopover(panel) && !panel.matches(':popover-open')) panel.showPopover();
			place();
			const first = bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE);
			(first ?? panel).focus({ preventScroll: true });
			// Resolve the rest state, then transition to .is-open on the next frame.
			void panel.offsetWidth;
			const frame = requestAnimationFrame(() => setPhase('open'));
			return () => cancelAnimationFrame(frame);
		}

		if (phase === 'closing') {
			const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const closeMs = reduced ? 0 : parseFloat(getComputedStyle(panel).getPropertyValue('--dropdown-close-dur')) || 150;
			const timer = window.setTimeout(() => setPhase('closed'), closeMs);
			return () => window.clearTimeout(timer);
		}

		if (phase === 'closed') {
			if (!wasShownRef.current) return;
			wasShownRef.current = false;
			const focus = focusOnClose;
			const active = document.activeElement;
			const focusWasInside = panel.contains(active);
			if (supportsPopover(panel) && panel.matches(':popover-open')) panel.hidePopover();
			const triggerElement = anchorRef.current?.firstElementChild as HTMLElement | null;
			const lost = focusWasInside || active === document.body || active === null;
			if (focus === 'always' || (focus === 'if-lost' && lost)) triggerElement?.focus({ preventScroll: true });
		}
	}, [phase, place, focusOnClose]);

	// While open: Escape, an outside press and tabbing away close it; scroll and resize keep it anchored.
	useEffect(() => {
		if (phase !== 'opening' && phase !== 'open') return;
		const panel = panelRef.current;
		const anchor = anchorRef.current;
		if (!panel || !anchor) return;

		let frame = 0;
		const reposition = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(place);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape' || event.defaultPrevented) return;
			event.preventDefault();
			requestClose('always');
		};
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (target && (panel.contains(target) || anchor.contains(target))) return;
			requestClose('if-lost');
		};
		const onFocusOut = (event: FocusEvent) => {
			const next = event.relatedTarget as Node | null;
			if (!next || panel.contains(next) || anchor.contains(next)) return;
			requestClose('never');
		};

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('pointerdown', onPointerDown, true);
		panel.addEventListener('focusout', onFocusOut);
		window.addEventListener('scroll', reposition, { capture: true, passive: true });
		window.addEventListener('resize', reposition);
		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('pointerdown', onPointerDown, true);
			panel.removeEventListener('focusout', onFocusOut);
			window.removeEventListener('scroll', reposition, { capture: true });
			window.removeEventListener('resize', reposition);
		};
	}, [phase, place, requestClose]);

	const triggerElement = isValidElement(trigger)
		? cloneElement(trigger, {
				'aria-expanded': open,
				'aria-controls': panelId,
				'aria-haspopup': 'dialog',
				onClick: (event: MouseEvent<HTMLElement>) => {
					trigger.props.onClick?.(event);
					if (event.defaultPrevented) return;
					if (open) requestClose('if-lost');
					else setOpen(true);
				},
			})
		: trigger;

	const withClose = showClose ?? Boolean(title);

	return (
		<div ref={anchorRef} className={styles.anchor}>
			{triggerElement}
			<div
				ref={panelRef}
				id={panelId}
				popover="manual"
				role="dialog"
				aria-labelledby={title ? titleId : undefined}
				aria-label={title ? undefined : label}
				tabIndex={-1}
				hidden={phase === 'closed'}
				className={cx(styles.panel, 't-dropdown', phase === 'open' && 'is-open', phase === 'closing' && 'is-closing', className)}
			>
				<div className={cx(styles.surface, 'u-bevel')}>
					{(title || withClose) && (
						<div className={styles.header}>
							{title && (
								<p id={titleId} className={styles.title}>
									{title}
								</p>
							)}
							{withClose && (
								<Button icon="close" label={t('close')} variant="ghost" size="sm" onClick={() => requestClose('always')} className={styles.close} />
							)}
						</div>
					)}
					<div ref={bodyRef} className={styles.body}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Popover;
