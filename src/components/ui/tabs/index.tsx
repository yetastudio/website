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
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
} from 'react';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

// useLayoutEffect warns during server rendering; the pill is measured on the client only.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type TabsContextValue = {
	baseId: string;
	value: string | undefined;
	select: (value: string) => void;
	orientation: 'horizontal' | 'vertical';
	activation: 'automatic' | 'manual';
	size: 'sm' | 'md';
	/** True while the change being rendered came from the user (click or key): the pill slides. */
	userPickedRef: RefObject<boolean>;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(part: string) {
	const context = useContext(TabsContext);
	if (!context) throw new Error(`<${part}> must be rendered inside <Tabs>.`);
	return context;
}

const slug = (value: string) => value.replace(/[^\w-]/g, '-');

export type TabsProps = {
	/** Controlled selected tab. */
	value?: string;
	/** Uncontrolled initial tab. */
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: 'horizontal' | 'vertical';
	/** `automatic` selects on focus (APG default when panels show instantly); `manual` waits for Enter or Space. */
	activation?: 'automatic' | 'manual';
	size?: 'sm' | 'md';
	children: ReactNode;
	className?: string;
};

/**
 * Inspo component (component.gallery "Tabs"): the WAI-ARIA APG tabs pattern. One tab stop
 * (roving tabindex on the selected tab), arrows move along the list and wrap (Left/Right, or
 * Up/Down when vertical), Home/End jump; selection follows focus unless `activation="manual"`.
 * Disabled tabs stay focusable (APG) but never select. The selected tab sits on the transitions.dev
 * "Tabs sliding" pill, driven like SegmentedControl: it slides on a user pick and snaps otherwise.
 */
export function Tabs({
	value,
	defaultValue,
	onValueChange,
	orientation = 'horizontal',
	activation = 'automatic',
	size = 'md',
	children,
	className,
}: TabsProps) {
	const baseId = useId();
	const [inner, setInner] = useState(defaultValue);
	const selected = value ?? inner;
	const userPickedRef = useRef(false);

	const select = useCallback(
		(next: string) => {
			userPickedRef.current = true;
			if (value === undefined) setInner(next);
			onValueChange?.(next);
		},
		[value, onValueChange]
	);

	return (
		<TabsContext.Provider value={{ baseId, value: selected, select, orientation, activation, size, userPickedRef }}>
			<div className={cx(styles.tabs, styles[orientation], className)}>{children}</div>
		</TabsContext.Provider>
	);
}

export type TabListProps = {
	/** Accessible name of the tab list. */
	label: string;
	children: ReactNode;
	/** Stretch the tabs to fill the row. */
	fullWidth?: boolean;
	className?: string;
};

/** The row (or column) of tabs: role="tablist" with the sliding pill behind the selected tab. */
export function TabList({ label, children, fullWidth, className }: TabListProps) {
	const { value, orientation, activation, size, select, userPickedRef } = useTabs('TabList');
	const listRef = useRef<HTMLDivElement>(null);
	const pillRef = useRef<HTMLSpanElement>(null);
	const vertical = orientation === 'vertical';

	useIsomorphicLayoutEffect(() => {
		const list = listRef.current;
		const pill = pillRef.current;
		if (!list || !pill) return;

		const moveTo = (animate: boolean) => {
			const tab = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
			if (!tab) {
				delete list.dataset.pill;
				return;
			}
			if (!animate) pill.style.transition = 'none';
			pill.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
			pill.style.width = `${tab.offsetWidth}px`;
			pill.style.height = `${tab.offsetHeight}px`;
			if (!animate) {
				void pill.offsetWidth;
				pill.style.transition = '';
			}
			list.dataset.pill = 'ready';
		};

		moveTo(userPickedRef.current);
		userPickedRef.current = false;

		// Fonts loading or a locale change resize the tabs: snap, never animate.
		const observer = new ResizeObserver(() => moveTo(false));
		observer.observe(list);
		list.querySelectorAll('[role="tab"]').forEach((tab) => observer.observe(tab));
		return () => observer.disconnect();
	}, [value, vertical]);

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const tabs = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
		const index = tabs.indexOf(document.activeElement as HTMLElement);
		if (index < 0) return;
		const next = vertical ? 'ArrowDown' : 'ArrowRight';
		const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
		let target: number | null = null;
		if (event.key === next) target = (index + 1) % tabs.length;
		else if (event.key === prev) target = (index - 1 + tabs.length) % tabs.length;
		else if (event.key === 'Home') target = 0;
		else if (event.key === 'End') target = tabs.length - 1;
		if (target === null) return;
		event.preventDefault();
		const tab = tabs[target];
		tab.focus();
		if (activation === 'automatic' && tab.getAttribute('aria-disabled') !== 'true' && tab.dataset.value) select(tab.dataset.value);
	};

	return (
		<div
			ref={listRef}
			role="tablist"
			aria-label={label}
			aria-orientation={orientation}
			className={cx('t-tabs', styles.list, styles[size], fullWidth && styles.fullWidth, 'u-bevel', className)}
			onKeyDown={onKeyDown}
		>
			<span ref={pillRef} className={cx('t-tabs-pill', styles.pill, 'u-bevel')} aria-hidden="true" />
			{children}
		</div>
	);
}

export type TabProps = {
	value: string;
	children: ReactNode;
	/** Purpose icon before the label. */
	icon?: IconName;
	/** Count after the label ("12"). */
	badge?: ReactNode;
	disabled?: boolean;
	className?: string;
};

/** One tab: aria-selected, aria-controls its panel; only the selected one is in the tab order. */
export function Tab({ value, children, icon, badge, disabled, className }: TabProps) {
	const { baseId, value: current, select, size } = useTabs('Tab');
	const selected = value === current;
	return (
		<button
			type="button"
			role="tab"
			id={`${baseId}-tab-${slug(value)}`}
			aria-selected={selected}
			aria-controls={`${baseId}-panel-${slug(value)}`}
			aria-disabled={disabled || undefined}
			tabIndex={selected ? 0 : -1}
			data-value={value}
			className={cx('t-tab', styles.tab, selected && styles.selected, disabled && styles.disabled, className)}
			onClick={() => {
				if (!disabled && !selected) select(value);
			}}
		>
			{icon && <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />}
			<span className={styles.label}>{children}</span>
			{badge !== undefined && <span className={styles.badge}>{badge}</span>}
		</button>
	);
}

export type TabPanelProps = {
	value: string;
	children: ReactNode;
	className?: string;
};

/** The content of one tab: role="tabpanel", labelled by its tab, focusable, hidden unless selected. */
export function TabPanel({ value, children, className }: TabPanelProps) {
	const { baseId, value: current } = useTabs('TabPanel');
	const selected = value === current;
	return (
		<div
			role="tabpanel"
			id={`${baseId}-panel-${slug(value)}`}
			aria-labelledby={`${baseId}-tab-${slug(value)}`}
			tabIndex={0}
			hidden={!selected}
			className={cx(styles.panel, className)}
		>
			{children}
		</div>
	);
}

export default Tabs;
