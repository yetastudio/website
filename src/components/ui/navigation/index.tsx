'use client';

//! React Core
import { useEffect, useId, useLayoutEffect, useRef, type MouseEventHandler, type ReactNode } from 'react';

//! Next Core
import { Link as LocaleLink, localeHref } from '@/i18n/navigation';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

// useLayoutEffect warns during server rendering; the pill is measured on the client only.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export type NavigationProps = {
	/** Landmark name ("Project", "Account settings"). */
	label: string;
	/** `vertical` is a sidebar list; `horizontal` is a glass bar like the header's nav pill. */
	orientation?: 'vertical' | 'horizontal';
	/** `NavItem`s and `NavGroup`s. */
	children: ReactNode;
	className?: string;
};

/**
 * Inspo component (component.gallery "Navigation"): a nav landmark with a list of links.
 * The current link carries aria-current and sits on the header's active pill (`--color-nav-active-*`:
 * black with white type on light, white with black type on dark). In the horizontal bar the pill is the
 * transitions.dev "Tabs sliding" pill: it slides when the current link changes and snaps on
 * first paint and resize.
 */
export function Navigation({ label, orientation = 'vertical', children, className }: NavigationProps) {
	const navRef = useRef<HTMLElement>(null);
	const pillRef = useRef<HTMLSpanElement>(null);
	const horizontal = orientation === 'horizontal';

	useIsomorphicLayoutEffect(() => {
		const nav = navRef.current;
		const pill = pillRef.current;
		if (!horizontal || !nav || !pill) return;
		const list = pill.closest('ul') as HTMLElement;

		const moveTo = (animate: boolean) => {
			const link = list.querySelector<HTMLElement>('[aria-current]:not([aria-current="false"])');
			if (!link) {
				nav.dataset.pill = 'none';
				return;
			}
			if (!animate) pill.style.transition = 'none';
			pill.style.transform = `translateX(${link.offsetLeft}px)`;
			pill.style.width = `${link.offsetWidth}px`;
			if (!animate) {
				void pill.offsetWidth;
				pill.style.transition = '';
			}
			nav.dataset.pill = 'ready';
		};

		moveTo(false);
		// The current link changing is the user's move: slide. Fonts and resizes: snap.
		const mutations = new MutationObserver(() => moveTo(true));
		mutations.observe(list, { attributes: true, attributeFilter: ['aria-current'], subtree: true });
		const resize = new ResizeObserver(() => moveTo(false));
		resize.observe(list);
		list.querySelectorAll('a, [aria-disabled]').forEach((item) => resize.observe(item));
		return () => {
			mutations.disconnect();
			resize.disconnect();
		};
	}, [horizontal]);

	return (
		<nav ref={navRef} aria-label={label} className={cx(styles.nav, styles[orientation], className)}>
			<ul className={cx(styles.list, horizontal && cx('t-tabs', 'u-bevel'))}>
				{/* The pill needs a slot inside the list (valid HTML); it is hidden from assistive tech. */}
				{horizontal && (
					<li className={styles.pillSlot} aria-hidden="true">
						<span ref={pillRef} className={cx('t-tabs-pill', styles.pill)} />
					</li>
				)}
				{children}
			</ul>
		</nav>
	);
}

export type NavGroupProps = {
	/** Visible heading; it also names the group's list. */
	heading: string;
	children: ReactNode;
	className?: string;
};

/** A titled run of NavItems inside a vertical Navigation. */
export function NavGroup({ heading, children, className }: NavGroupProps) {
	const id = useId();
	return (
		<li className={cx(styles.group, className)}>
			<span id={id} className={styles.heading}>
				{heading}
			</span>
			<ul className={styles.list} aria-labelledby={id}>
				{children}
			</ul>
		</li>
	);
}

export type NavItemProps = {
	href: string;
	children: ReactNode;
	/** Purpose icon before the label. */
	icon?: IconName;
	/** Count or short status after the label ("3", "New"). */
	badge?: ReactNode;
	/** Accessible text for a numeric badge ("3 unread"). */
	badgeLabel?: string;
	/** Marks the current page (`true` = "page"); use "location" for sections of one page. */
	current?: boolean | 'page' | 'location' | 'step';
	/** Not available yet: rendered as text, out of the tab order. */
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	className?: string;
};

const EXTERNAL = /^(https?:)?\/\//;

/** One link of a Navigation. Internal routes keep the locale; external ones open a new tab. */
export function NavItem({ href, children, icon, badge, badgeLabel, current, disabled, onClick, className }: NavItemProps) {
	const ariaCurrent = current === true ? 'page' : current || undefined;
	const classes = cx(styles.item, ariaCurrent && styles.current, disabled && styles.disabled, className);
	const content = (
		<>
			{icon && <Icon name={icon} size="md" className={styles.icon} />}
			<span className={styles.label}>{children}</span>
			{badge !== undefined && (
				<span className={cx(styles.badge, 'u-bevel')}>
					<span aria-hidden={badgeLabel ? true : undefined}>{badge}</span>
					{badgeLabel && <span className="u-visually-hidden">{badgeLabel}</span>}
				</span>
			)}
		</>
	);

	if (disabled) {
		return (
			<li>
				<span className={classes} aria-disabled="true">
					{content}
				</span>
			</li>
		);
	}

	const external = EXTERNAL.test(href) || href.startsWith('mailto:');
	const shared = { className: classes, 'aria-current': ariaCurrent, onClick } as const;
	return (
		<li>
			{external || href.startsWith('#') ? (
				<a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...shared}>
					{content}
				</a>
			) : (
				<LocaleLink href={localeHref(href)} {...shared}>
					{content}
				</LocaleLink>
			)}
		</li>
	);
}

export default Navigation;
