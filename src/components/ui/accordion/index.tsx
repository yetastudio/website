'use client';

//! React Core
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type AccordionItemProps = {
	title: ReactNode;
	children: ReactNode;
	defaultOpen?: boolean;
	className?: string;
};

/**
 * One disclosure row, as drawn in the Figma case study ("About the client", "The challenge",
 * "The result" with a Show toggle). The trigger is a real button with aria-expanded.
 * The panel height tweens open and closed with the transitions.dev Card resize.
 */
export function AccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
	const t = useTranslations('common');
	const [open, setOpen] = useState(defaultOpen);
	// The panel stays rendered until its closing height tween ends (transitions.dev Card resize).
	const [present, setPresent] = useState(defaultOpen);
	const panelRef = useRef<HTMLDivElement>(null);
	const firstRun = useRef(true);
	const panelId = useId();
	const triggerId = useId();

	const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const toggle = () => {
		if (!open) setPresent(true);
		else if (reduceMotion()) setPresent(false);
		setOpen(!open);
	};

	useLayoutEffect(() => {
		if (firstRun.current) {
			firstRun.current = false;
			return;
		}
		const panel = panelRef.current;
		if (!panel || reduceMotion()) return;
		const resizeMs = parseFloat(getComputedStyle(panel).getPropertyValue('--resize-dur')) || 300;
		// Tween between measured pixel heights, then hand the height back to the content.
		if (open) {
			panel.style.height = '0px';
			void panel.offsetHeight;
			panel.style.height = `${panel.scrollHeight}px`;
		} else {
			panel.style.height = `${panel.scrollHeight}px`;
			void panel.offsetHeight;
			panel.style.height = '0px';
		}
		const timer = window.setTimeout(() => {
			panel.style.height = '';
			if (!open) setPresent(false);
		}, resizeMs);
		return () => window.clearTimeout(timer);
	}, [open]);

	return (
		<div className={cx(styles.item, open && styles.open, className)}>
			<h4 className={styles.heading}>
				<button
					id={triggerId}
					type="button"
					className={styles.trigger}
					aria-expanded={open}
					aria-controls={panelId}
					onClick={toggle}
				>
					<span className={styles.title}>{title}</span>
					<span className={cx(styles.toggle, 'u-bevel')} aria-hidden="true">
						{open ? t('hide') : t('show')}
						<Icon name="chevron-down" size="sm" className={styles.chevron} />
					</span>
				</button>
			</h4>
			<div ref={panelRef} id={panelId} role="region" aria-labelledby={triggerId} className={cx(styles.panel, 't-resize')} hidden={!present}>
				<div className={styles.panelInner}>{children}</div>
			</div>
		</div>
	);
}

export type AccordionProps = { children: ReactNode; className?: string };

/** A stack of AccordionItems separated by hairlines. Items open independently. */
export function Accordion({ children, className }: AccordionProps) {
	return <div className={cx(styles.accordion, className)}>{children}</div>;
}

export default Accordion;
