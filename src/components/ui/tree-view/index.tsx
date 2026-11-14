'use client';

//! React Core
import {
	Children,
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
} from 'react';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type TreeContextValue = {
	isExpanded: (id: string) => boolean;
	setItemExpanded: (id: string, open: boolean) => void;
	selectedId: string | null;
	select: (id: string) => void;
	selectable: boolean;
	/** The item that holds the single tab stop (roving tabindex). */
	tabStopId: string | null;
	setTabStopId: (id: string) => void;
};

const TreeContext = createContext<TreeContextValue | null>(null);
const LevelContext = createContext(1);

function useTree() {
	const context = useContext(TreeContext);
	if (!context) throw new Error('<TreeItem> must be rendered inside <TreeView>.');
	return context;
}

const TYPEAHEAD_RESET_MS = 500;

const treeItemOf = (node: Element | null) => node?.closest<HTMLElement>('[role="treeitem"]') ?? null;
const parentItemOf = (item: HTMLElement) => treeItemOf(item.parentElement);

/** Visible = every ancestor item is expanded. */
function isVisible(item: HTMLElement) {
	for (let parent = parentItemOf(item); parent; parent = parentItemOf(parent)) {
		if (parent.getAttribute('aria-expanded') !== 'true') return false;
	}
	return true;
}

export type TreeViewProps = {
	/** Accessible name of the tree. */
	label: string;
	/** `TreeItem`s. */
	children: ReactNode;
	/** Uncontrolled: ids open on first render. */
	defaultExpanded?: string[];
	/** Controlled open ids. */
	expanded?: string[];
	onExpandedChange?: (expanded: string[]) => void;
	/** Single selection (aria-selected). Off: items only expand and collapse. */
	selectable?: boolean;
	selectedId?: string | null;
	defaultSelectedId?: string | null;
	onSelect?: (id: string) => void;
	className?: string;
};

/**
 * Inspo component (component.gallery "Tree view"): the WAI-ARIA APG tree. role="tree" with nested
 * role="group" lists and role="treeitem" nodes; one tab stop (roving tabindex). Up/Down move through
 * visible nodes, Right opens a closed node or enters an open one, Left closes an open node or goes to
 * the parent, Home/End jump, `*` opens every sibling, typing moves to the next node that starts with
 * the typed text, Enter/Space select. Groups open and close with the transitions.dev Card resize.
 */
export function TreeView({
	label,
	children,
	defaultExpanded = [],
	expanded,
	onExpandedChange,
	selectable = true,
	selectedId,
	defaultSelectedId = null,
	onSelect,
	className,
}: TreeViewProps) {
	const treeRef = useRef<HTMLUListElement>(null);
	const [innerExpanded, setInnerExpanded] = useState<string[]>(defaultExpanded);
	const [innerSelected, setInnerSelected] = useState<string | null>(defaultSelectedId);
	const open = expanded ?? innerExpanded;
	const selected = selectedId !== undefined ? selectedId : innerSelected;
	const firstId = Children.toArray(children).find(isValidElement)?.props as { id?: string } | undefined;
	const [tabStopId, setTabStopId] = useState<string | null>(selected ?? firstId?.id ?? null);
	const typeahead = useRef({ text: '', timer: 0 });

	const setOpen = useCallback(
		(next: string[]) => {
			if (expanded === undefined) setInnerExpanded(next);
			onExpandedChange?.(next);
		},
		[expanded, onExpandedChange]
	);

	const setItemExpanded = useCallback(
		(id: string, value: boolean) => {
			if (value === open.includes(id)) return;
			// Closing a branch that holds the tab stop hands it to the branch itself.
			if (!value) {
				const item = treeRef.current?.querySelector<HTMLElement>(`[role="treeitem"][data-id="${CSS.escape(id)}"]`);
				const stop = treeRef.current?.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]');
				if (item && stop && stop !== item && item.contains(stop)) setTabStopId(id);
			}
			setOpen(value ? [...open, id] : open.filter((entry) => entry !== id));
		},
		[open, setOpen]
	);

	const select = useCallback(
		(id: string) => {
			if (selectedId === undefined) setInnerSelected(id);
			onSelect?.(id);
		},
		[selectedId, onSelect]
	);

	// The tab stop must always be a visible node; if it sits in a closed branch, lift it to the
	// nearest visible ancestor (or the first node).
	useLayoutEffect(() => {
		const tree = treeRef.current;
		if (!tree) return;
		const stop = tree.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]');
		if (stop && isVisible(stop)) return;
		let candidate = stop ? parentItemOf(stop) : null;
		while (candidate && !isVisible(candidate)) candidate = parentItemOf(candidate);
		const fallback = candidate ?? tree.querySelector<HTMLElement>('[role="treeitem"]');
		if (fallback?.dataset.id) setTabStopId(fallback.dataset.id);
	}, [tabStopId, open]);

	const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
		const tree = treeRef.current;
		const current = treeItemOf(event.target as Element);
		if (!tree || !current || event.altKey || event.ctrlKey || event.metaKey) return;
		const items = Array.from(tree.querySelectorAll<HTMLElement>('[role="treeitem"]')).filter(isVisible);
		const index = items.indexOf(current);
		const id = current.dataset.id ?? '';
		const isParent = current.hasAttribute('aria-expanded');
		const isOpen = current.getAttribute('aria-expanded') === 'true';
		const disabled = current.getAttribute('aria-disabled') === 'true';
		const focus = (item: HTMLElement | null | undefined) => item?.focus();

		switch (event.key) {
			case 'ArrowDown':
				focus(items[index + 1]);
				break;
			case 'ArrowUp':
				focus(items[index - 1]);
				break;
			case 'ArrowRight':
				if (!isParent) return;
				if (!isOpen) {
					if (!disabled) setItemExpanded(id, true);
				}
				else focus(current.querySelector<HTMLElement>('[role="group"] [role="treeitem"]'));
				break;
			case 'ArrowLeft':
				if (isParent && isOpen && !disabled) setItemExpanded(id, false);
				else focus(parentItemOf(current));
				break;
			case 'Home':
				focus(items[0]);
				break;
			case 'End':
				focus(items[items.length - 1]);
				break;
			case 'Enter':
			case ' ':
				if (disabled) break;
				if (selectable) select(id);
				else if (isParent) setItemExpanded(id, !isOpen);
				break;
			case '*': {
				// Open every sibling branch at this level.
				const group = current.parentElement;
				const siblings = Array.from(group?.children ?? []).filter((node): node is HTMLElement => node.getAttribute('role') === 'treeitem');
				const ids = siblings
					.filter((node) => node.hasAttribute('aria-expanded') && node.getAttribute('aria-disabled') !== 'true')
					.map((node) => node.dataset.id ?? '');
				setOpen(Array.from(new Set([...open, ...ids])));
				break;
			}
			default: {
				if (event.key.length !== 1) return;
				const state = typeahead.current;
				window.clearTimeout(state.timer);
				state.text += event.key.toLowerCase();
				state.timer = window.setTimeout(() => (state.text = ''), TYPEAHEAD_RESET_MS);
				const query = state.text.split('').every((char) => char === state.text[0]) ? state.text[0] : state.text;
				const start = query.length === 1 ? index + 1 : index;
				for (let step = 0; step < items.length; step += 1) {
					const candidate = items[(start + step) % items.length];
					if ((candidate.dataset.label ?? '').toLowerCase().startsWith(query)) {
						candidate.focus();
						break;
					}
				}
			}
		}
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<TreeContext.Provider
			value={{
				isExpanded: (id) => open.includes(id),
				setItemExpanded,
				selectedId: selected,
				select,
				selectable,
				tabStopId,
				setTabStopId,
			}}
		>
			<ul ref={treeRef} role="tree" aria-label={label} className={cx(styles.tree, className)} onKeyDown={onKeyDown}>
				<LevelContext.Provider value={1}>{children}</LevelContext.Provider>
			</ul>
		</TreeContext.Provider>
	);
}

export type TreeItemProps = {
	/** Unique within the tree. */
	id: string;
	/** Visible name (also used for type-ahead). */
	label: string;
	/** Defaults to folder / open folder for branches and file for leaves. */
	icon?: IconName;
	/** Short trailing text ("2.4 MB", "3"). */
	meta?: ReactNode;
	/** Focusable (APG) but cannot be selected. */
	disabled?: boolean;
	/** Nested `TreeItem`s make this node a branch. */
	children?: ReactNode;
	className?: string;
};

/** One node. Branches toggle on click (row or chevron) and select at the same time when the tree is selectable. */
export function TreeItem({ id, label, icon, meta, disabled, children, className }: TreeItemProps) {
	const tree = useTree();
	const level = useContext(LevelContext);
	const isParent = Children.toArray(children).some(isValidElement);
	const open = isParent && tree.isExpanded(id);
	const selected = tree.selectedId === id;
	const groupRef = useRef<HTMLUListElement>(null);
	// The group stays rendered until its closing height tween ends (transitions.dev Card resize).
	const [present, setPresent] = useState(open);
	const firstRun = useRef(true);

	if (open && !present) setPresent(true);

	useLayoutEffect(() => {
		if (firstRun.current) {
			firstRun.current = false;
			return;
		}
		const group = groupRef.current;
		if (!group) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const resizeMs = reduce ? 0 : parseFloat(getComputedStyle(group).getPropertyValue('--resize-dur')) || 300;
		if (!reduce) {
			const from = open ? 0 : group.scrollHeight;
			const to = open ? group.scrollHeight : 0;
			group.style.height = `${from}px`;
			void group.offsetHeight;
			group.style.height = `${to}px`;
		}
		const timer = window.setTimeout(() => {
			group.style.height = '';
			if (!open) setPresent(false);
		}, resizeMs);
		return () => window.clearTimeout(timer);
	}, [open]);

	const onClick = (event: MouseEvent<HTMLLIElement>) => {
		if (treeItemOf(event.target as Element) !== event.currentTarget) return;
		tree.setTabStopId(id);
		if (disabled) return;
		if (isParent) tree.setItemExpanded(id, !open);
		if (tree.selectable) tree.select(id);
	};

	return (
		<li
			role="treeitem"
			aria-expanded={isParent ? open : undefined}
			aria-selected={tree.selectable ? selected : undefined}
			aria-disabled={disabled || undefined}
			aria-level={level}
			tabIndex={tree.tabStopId === id ? 0 : -1}
			data-id={id}
			data-label={label}
			className={cx(styles.item, selected && styles.selected, disabled && styles.disabled, className)}
			onClick={onClick}
			onFocus={(event) => {
				if (event.target === event.currentTarget) tree.setTabStopId(id);
			}}
		>
			<span className={styles.row} style={{ '--tree-level': level - 1 } as CSSProperties}>
				<span className={styles.chevron} aria-hidden="true">
					{isParent && <Icon name="chevron-right" size="sm" />}
				</span>
				<Icon name={icon ?? (isParent ? (open ? 'folder-open' : 'folder') : 'file')} size="md" className={styles.icon} />
				<span className={styles.label} title={label}>
					{label}
				</span>
				{meta !== undefined && <span className={styles.meta}>{meta}</span>}
			</span>
			{isParent && (
				<ul
					ref={groupRef}
					role="group"
					className={cx(styles.group, 't-resize')}
					style={{ '--tree-level': level - 1 } as CSSProperties}
					hidden={!present}
				>
					<LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
				</ul>
			)}
		</li>
	);
}

export default TreeView;
