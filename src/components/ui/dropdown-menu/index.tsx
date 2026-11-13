'use client';

//! React Core
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type FocusEvent,
	type KeyboardEvent,
	type MouseEvent,
	type PointerEvent as ReactPointerEvent,
	type ReactNode,
} from 'react';

//! Next Core
import { Link as LocaleLink, localeHref } from '@/i18n/navigation';

//! Components
import { Button, type ButtonRadius, type ButtonSize, type ButtonVariant } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type MenuContextValue = {
	/** Closes the menu; focus goes back to the trigger unless the caller moves it elsewhere. */
	close: (returnFocus: boolean) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

/** The menu button is always the DS Button; these are its visual props. */
export type DropdownTrigger = {
	/** Visible label. Leave it out for an icon-only button (then `label` is required). */
	children?: ReactNode;
	/** Purpose icon before the label (one icon per button: no trailing chevron). */
	iconStart?: IconName;
	/** Icon-only button. */
	icon?: IconName;
	/** Accessible name (required for icon-only). */
	label?: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	radius?: ButtonRadius;
	disabled?: boolean;
	className?: string;
};

export type DropdownMenuProps = {
	/**
	 * The menu button (a DS Button). It gets `aria-haspopup="menu"`, `aria-expanded`,
	 * `aria-controls`, the click and the arrow keys.
	 */
	trigger: DropdownTrigger;
	/** `MenuItem`, `MenuGroup` and `MenuSeparator`. */
	children: ReactNode;
	/** Edge of the trigger the menu lines up with. */
	align?: 'start' | 'end';
	/** Preferred side; flips when the viewport has no room for it. */
	side?: 'bottom' | 'top';
	/** Accessible name of the menu. Defaults to the trigger's name (aria-labelledby). */
	label?: string;
	className?: string;
};

const TYPEAHEAD_RESET_MS = 500;
const VIEWPORT_MARGIN = 8;

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function menuItems(menu: HTMLElement | null) {
	return menu ? Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];
}

/**
 * Inspo component (component.gallery "Dropdown menu"): the WAI-ARIA APG menu button.
 * Enter, Space and ArrowDown open on the first item, ArrowUp on the last; inside, arrows wrap,
 * Home/End jump, typing moves to the next item that starts with the typed text, Escape closes and
 * returns focus to the button, Tab closes and moves on. Disabled items stay focusable but do nothing.
 * Motion is the transitions.dev "Menu dropdown": origin-aware scale + fade, shorter close.
 */
export function DropdownMenu({ trigger, children, align = 'start', side = 'bottom', label, className }: DropdownMenuProps) {
	const baseId = useId();
	const triggerId = `${baseId}-trigger`;
	const menuId = `${baseId}-menu`;
	const wrapRef = useRef<HTMLSpanElement>(null);
	const triggerRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	// The menu stays in the tree (not hidden) until its closing transition ends.
	const [present, setPresent] = useState(false);
	const focusOnOpen = useRef<'first' | 'last'>('first');
	const closeTimer = useRef<number | undefined>(undefined);
	const typeahead = useRef({ text: '', timer: 0 });

	const show = useCallback((target: 'first' | 'last') => {
		window.clearTimeout(closeTimer.current);
		focusOnOpen.current = target;
		setPresent(true);
		setOpen(true);
	}, []);

	const close = useCallback((returnFocus: boolean) => {
		const menu = menuRef.current;
		setOpen(false);
		if (returnFocus) triggerRef.current?.focus();
		if (!menu || reduceMotion()) {
			menu?.classList.remove('is-open');
			setPresent(false);
			return;
		}
		menu.classList.remove('is-open');
		menu.classList.add('is-closing');
		const closeMs = parseFloat(getComputedStyle(menu).getPropertyValue('--dropdown-close-dur')) || 150;
		window.clearTimeout(closeTimer.current);
		closeTimer.current = window.setTimeout(() => {
			menu.classList.remove('is-closing');
			setPresent(false);
		}, closeMs);
	}, []);

	useEffect(() => () => window.clearTimeout(closeTimer.current), []);

	// Open: place the menu (flip to the other side when it would leave the viewport), then run the
	// snippet's is-open transition and move focus into it.
	useLayoutEffect(() => {
		const menu = menuRef.current;
		if (!open || !menu) return;
		menu.classList.remove('is-closing');
		menu.dataset.side = side;
		const rect = menu.getBoundingClientRect();
		const anchor = wrapRef.current?.getBoundingClientRect();
		if (anchor) {
			const below = window.innerHeight - anchor.bottom - VIEWPORT_MARGIN;
			const above = anchor.top - VIEWPORT_MARGIN;
			if (side === 'bottom' && rect.height > below && above > below) menu.dataset.side = 'top';
			if (side === 'top' && rect.height > above && below > above) menu.dataset.side = 'bottom';
		}
		const vertical = menu.dataset.side === 'top' ? 'bottom' : 'top';
		menu.dataset.origin = `${vertical}-${align === 'end' ? 'right' : 'left'}`;
		void menu.offsetWidth;
		menu.classList.add('is-open');
		const items = menuItems(menu);
		(focusOnOpen.current === 'last' ? items[items.length - 1] : items[0])?.focus({ preventScroll: true });
	}, [open, side, align]);

	// A press outside closes without stealing focus from whatever was pressed.
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (!wrapRef.current?.contains(event.target as Node)) close(false);
		};
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	}, [open, close]);

	const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (trigger.disabled) return;
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			show(event.key === 'ArrowUp' ? 'last' : 'first');
		}
	};

	const onTriggerClick = () => {
		if (open) close(true);
		else show('first');
	};

	const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const items = menuItems(menuRef.current);
		if (!items.length) return;
		const index = items.indexOf(document.activeElement as HTMLElement);
		const focusAt = (next: number) => items[(next + items.length) % items.length]?.focus();

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				focusAt(index + 1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				focusAt(index < 0 ? items.length - 1 : index - 1);
				return;
			case 'Home':
			case 'PageUp':
				event.preventDefault();
				focusAt(0);
				return;
			case 'End':
			case 'PageDown':
				event.preventDefault();
				focusAt(items.length - 1);
				return;
			case 'Escape':
				event.preventDefault();
				event.stopPropagation();
				close(true);
				return;
			case 'Tab':
				// Let the browser move focus on; the menu just closes behind it.
				close(false);
				return;
			case ' ': {
				// Buttons fire click on Space natively; menu links do not.
				const current = items[index];
				if (current?.tagName === 'A') {
					event.preventDefault();
					current.click();
				}
				return;
			}
		}

		// Type-ahead: printable characters build a short-lived search string.
		if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
			const state = typeahead.current;
			window.clearTimeout(state.timer);
			state.text += event.key.toLowerCase();
			state.timer = window.setTimeout(() => (state.text = ''), TYPEAHEAD_RESET_MS);
			// Repeating one character cycles through the items that start with it.
			const query = state.text.split('').every((char) => char === state.text[0]) ? state.text[0] : state.text;
			const start = query.length === 1 ? index + 1 : Math.max(index, 0);
			for (let step = 0; step < items.length; step += 1) {
				const candidate = items[(start + step) % items.length];
				const text = (candidate.dataset.textValue ?? candidate.textContent ?? '').trim().toLowerCase();
				if (text.startsWith(query)) {
					candidate.focus();
					break;
				}
			}
		}
	};

	const onBlur = (event: FocusEvent<HTMLSpanElement>) => {
		const next = event.relatedTarget as Node | null;
		if (open && next && !wrapRef.current?.contains(next)) close(false);
	};

	return (
		<MenuContext.Provider value={{ close }}>
			<span ref={wrapRef} className={cx(styles.root, className)} onBlur={onBlur}>
				<Button
					{...trigger}
					ref={triggerRef}
					id={triggerId}
					aria-haspopup="menu"
					aria-expanded={open}
					aria-controls={menuId}
					onClick={onTriggerClick}
					onKeyDown={onTriggerKeyDown}
				/>
				<div
					ref={menuRef}
					id={menuId}
					role="menu"
					aria-orientation="vertical"
					aria-label={label}
					aria-labelledby={label ? undefined : triggerId}
					tabIndex={-1}
					hidden={!present}
					data-align={align}
					data-side={side}
					className={cx('t-dropdown', styles.menu, 'u-bevel')}
					onKeyDown={onMenuKeyDown}
					onPointerLeave={() => {
						if (menuRef.current?.contains(document.activeElement)) menuRef.current.focus({ preventScroll: true });
					}}
				>
					{children}
				</div>
			</span>
		</MenuContext.Provider>
	);
}

export type MenuItemProps = {
	children: ReactNode;
	/** Purpose icon, before the label. */
	icon?: IconName;
	/** Visible shortcut hint ("⌘D"). Pair it with `keyshortcuts` for assistive tech. */
	shortcut?: string;
	/** `aria-keyshortcuts` value ("Meta+D"). */
	keyshortcuts?: string;
	/** `danger` for destructive actions (delete, remove, leave). */
	tone?: 'default' | 'danger';
	/** Focusable (APG) but cannot be activated. */
	disabled?: boolean;
	/** Runs on click, Enter or Space; the menu then closes and focus returns to the button. */
	onSelect?: () => void;
	/** Renders a link item (navigation inside a menu). External URLs open in a new tab. */
	href?: string;
	/** Text for type-ahead when the label is not plain text. */
	textValue?: string;
	className?: string;
};

const EXTERNAL = /^(https?:)?\/\//;

/** One action (or link) inside a DropdownMenu. */
export function MenuItem({ children, icon, shortcut, keyshortcuts, tone = 'default', disabled, onSelect, href, textValue, className }: MenuItemProps) {
	const menu = useContext(MenuContext);
	const classes = cx(styles.item, tone === 'danger' && styles.danger, disabled && styles.disabled, className);
	const content = (
		<>
			{icon && <Icon name={icon} size="md" className={styles.icon} />}
			<span className={styles.label}>{children}</span>
			{shortcut && (
				<kbd className={styles.shortcut} aria-hidden="true">
					{shortcut}
				</kbd>
			)}
		</>
	);
	const shared = {
		role: 'menuitem',
		tabIndex: -1,
		'aria-disabled': disabled || undefined,
		'aria-keyshortcuts': keyshortcuts,
		'data-text-value': textValue,
		className: classes,
		onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
			if (document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
		},
	} as const;

	const activate = (event: MouseEvent<HTMLElement>) => {
		if (disabled) {
			event.preventDefault();
			return;
		}
		onSelect?.();
		// A link navigates away; an action hands focus back to the menu button.
		menu?.close(!href);
	};

	if (href) {
		const external = EXTERNAL.test(href);
		if (external || href.startsWith('#')) {
			return (
				<a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...shared} onClick={activate}>
					{content}
				</a>
			);
		}
		return (
			<LocaleLink href={localeHref(href)} {...shared} onClick={activate}>
				{content}
			</LocaleLink>
		);
	}

	return (
		<button type="button" {...shared} onClick={activate}>
			{content}
		</button>
	);
}

export type MenuGroupProps = {
	/** Visible group heading; it also names the group. */
	label: string;
	children: ReactNode;
	className?: string;
};

/** A labelled run of items (role="group"). */
export function MenuGroup({ label, children, className }: MenuGroupProps) {
	const id = useId();
	return (
		<div role="group" aria-labelledby={id} className={cx(styles.group, className)}>
			<div id={id} className={styles.groupLabel}>
				{label}
			</div>
			{children}
		</div>
	);
}

/** A hairline between groups of items. */
export function MenuSeparator({ className }: { className?: string }) {
	return <div role="separator" className={cx(styles.separator, className)} />;
}

export default DropdownMenu;
