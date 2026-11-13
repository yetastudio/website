'use client';

//! React Core
import { Children, cloneElement, isValidElement, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';

//! Components
import type { ButtonSize } from '@/components/ui/button';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ButtonGroupProps = {
	/** Buttons (the DS Button) that act on the same thing. */
	children: ReactNode;
	/** Accessible name of the group ("Text alignment", "Pagination"). */
	label: string;
	/** `attached` joins the buttons into one bevelled bar; `spaced` keeps them apart with a small gap. */
	variant?: 'attached' | 'spaced';
	orientation?: 'horizontal' | 'vertical';
	/** Size for every button that does not set its own. */
	size?: ButtonSize;
	/**
	 * Toolbar semantics (`role="toolbar"`): one tab stop for the whole group, arrow keys move between the
	 * buttons, Home/End jump to the ends. Use it for a set of tool controls; leave it off for a few
	 * unrelated actions (a dialog's Cancel / Save), which stay separate tab stops.
	 */
	toolbar?: boolean;
	className?: string;
};

type ItemProps = { size?: ButtonSize; tabIndex?: number; disabled?: boolean };

/**
 * Inspo component (component.gallery "Button group"): related Buttons as one unit. Attached buttons share
 * one bar (inner corners squared, seams drawn by each button's own hairline); `toolbar` adds the WAI-ARIA
 * APG toolbar keyboard model with a roving tabindex.
 */
export function ButtonGroup({ children, label, variant = 'attached', orientation = 'horizontal', size, toolbar = false, className }: ButtonGroupProps) {
	const groupRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const items = Children.toArray(children).filter(isValidElement) as Array<ReactElement<ItemProps>>;
	const current = Math.min(active, Math.max(items.length - 1, 0));

	const nodes = () => Array.from(groupRef.current?.querySelectorAll<HTMLElement>('[data-group-item]') ?? []);

	const onFocus = (event: FocusEvent<HTMLDivElement>) => {
		const index = nodes().indexOf(event.target as HTMLElement);
		if (index >= 0) setActive(index);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const list = nodes();
		const index = list.indexOf(event.target as HTMLElement);
		if (index < 0) return;
		const forward = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
		const backward = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
		let next = -1;
		if (event.key === forward) next = (index + 1) % list.length;
		else if (event.key === backward) next = (index - 1 + list.length) % list.length;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = list.length - 1;
		if (next < 0) return;
		event.preventDefault();
		setActive(next);
		list[next]?.focus();
	};

	return (
		<div
			ref={groupRef}
			role={toolbar ? 'toolbar' : 'group'}
			aria-label={label}
			aria-orientation={toolbar ? orientation : undefined}
			className={cx(styles.group, styles[variant], styles[orientation], className)}
			onFocus={toolbar ? onFocus : undefined}
			onKeyDown={toolbar ? onKeyDown : undefined}
		>
			{items.map((child, index) =>
				cloneElement(child, {
					size: child.props.size ?? size,
					// Roving tabindex: only the last-focused button is in the tab order.
					tabIndex: toolbar ? (index === current ? 0 : -1) : child.props.tabIndex,
					'data-group-item': '',
				} as ItemProps & { 'data-group-item': string })
			)}
		</div>
	);
}

export default ButtonGroup;
