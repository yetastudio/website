'use client';

//! React Core
import { useId, useState, type ReactNode } from 'react';

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
 */
export function AccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
	const t = useTranslations('common');
	const [open, setOpen] = useState(defaultOpen);
	const panelId = useId();
	const triggerId = useId();

	return (
		<div className={cx(styles.item, open && styles.open, className)}>
			<h4 className={styles.heading}>
				<button
					id={triggerId}
					type="button"
					className={styles.trigger}
					aria-expanded={open}
					aria-controls={panelId}
					onClick={() => setOpen((value) => !value)}
				>
					<span className={styles.title}>{title}</span>
					<span className={cx(styles.toggle, 'u-bevel')} aria-hidden="true">
						{open ? t('hide') : t('show')}
						<Icon name="chevron-down" size="sm" className={styles.chevron} />
					</span>
				</button>
			</h4>
			<div id={panelId} role="region" aria-labelledby={triggerId} className={styles.panel} hidden={!open}>
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
