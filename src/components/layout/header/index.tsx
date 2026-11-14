'use client';

//! React Core
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

//! Components
import { Link as LocaleLink } from '@/i18n/navigation';
import { BrandMark } from '@/components/ui/brand';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { BOOKING_URL, SECTIONS, type SectionId } from '../sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/**
 * The section the reading line is in, as a tiny external store. The scroll handler writes it and
 * only the two link lists read it, so a section change re-renders five links, not the whole header
 * (theme switches, the CTA, the menu dialog).
 */
type ActiveStore = {
	get: () => SectionId | null;
	set: (id: SectionId | null) => void;
	subscribe: (onChange: () => void) => () => void;
};

function createActiveStore(): ActiveStore {
	let active: SectionId | null = null;
	const listeners = new Set<() => void>();
	return {
		get: () => active,
		set: (id) => {
			if (id === active) return;
			active = id;
			listeners.forEach((listener) => listener());
		},
		subscribe: (onChange) => {
			listeners.add(onChange);
			return () => listeners.delete(onChange);
		},
	};
}

const serverActive = () => null;

/**
 * The white active pill is the landing's index (landing only). A reading line sits at 40% of the
 * viewport; the active link is the last section whose top has crossed it, so the pill does not
 * follow the scroll: when the section changes it hands over, sliding to the new link with the
 * transitions.dev "Tabs sliding" tween. A click hands over at once to the link clicked and holds
 * it while the page scrolls there, so the pill never steps through the sections in between.
 * Above the first section the pill fades out.
 */
function useScrollNav(enabled: boolean, store: ActiveStore) {
	const navRef = useRef<HTMLElement>(null);
	const indicatorRef = useRef<HTMLSpanElement>(null);
	const target = useRef<SectionId | null>(null);

	useEffect(() => {
		const nav = navRef.current;
		const indicator = indicatorRef.current;
		if (!enabled || !nav || !indicator) return;
		let frame = 0;
		let placed = false;
		let releaseTimer = 0;
		let shown: SectionId | null = null;

		// Move the pill to a link. The first placement (and any resize) lands without the tween.
		const place = (id: SectionId | null, instant: boolean) => {
			const link = id ? nav.querySelector<HTMLElement>(`a[href="#${id}"]`) : null;
			if (instant) indicator.style.transition = 'none';
			if (link) {
				const box = nav.getBoundingClientRect();
				const rect = link.getBoundingClientRect();
				// Pad the link by the nav's padding minus the pill's inset, so the pill keeps the inset on every side.
				const pad = parseFloat(getComputedStyle(nav).paddingLeft) - parseFloat(getComputedStyle(indicator).top);
				indicator.style.transform = `translateX(${rect.left - box.left - nav.clientLeft - pad}px)`;
				indicator.style.width = `${rect.width + pad * 2}px`;
			}
			indicator.style.opacity = link ? '1' : '0';
			if (instant) {
				void indicator.offsetWidth;
				indicator.style.removeProperty('transition');
			}
		};

		const sectionAtLine = (): SectionId | null => {
			const line = window.innerHeight * 0.4;
			let current: SectionId | null = null;
			for (const { id } of SECTIONS) {
				const node = document.getElementById(id);
				if (node && node.getBoundingClientRect().top - line <= 0) current = id;
			}
			return current;
		};

		const update = (instant = false) => {
			frame = 0;
			const next = target.current ?? sectionAtLine();
			if (next === shown && placed && !instant) return;
			place(next, instant || !placed);
			placed = true;
			shown = next;
			store.set(next);
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(() => update());
		};
		const relayout = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => update(true));
		};

		// A click hands the pill over now; the lock lifts once the scroll it started has settled.
		const release = () => {
			window.clearTimeout(releaseTimer);
			releaseTimer = window.setTimeout(() => {
				target.current = null;
				schedule();
			}, 160);
		};
		const onClick = (event: MouseEvent) => {
			const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
			const id = link?.getAttribute('href')?.slice(1) as SectionId | undefined;
			if (!id || !SECTIONS.some((section) => section.id === id)) return;
			target.current = id;
			update();
			release();
		};
		const onScroll = () => {
			if (target.current) release();
			schedule();
		};

		nav.dataset.pill = 'ready';
		update(true);
		nav.addEventListener('click', onClick);
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', relayout);
		const observer = new ResizeObserver(relayout);
		observer.observe(nav);
		return () => {
			cancelAnimationFrame(frame);
			window.clearTimeout(releaseTimer);
			nav.removeEventListener('click', onClick);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', relayout);
			observer.disconnect();
		};
	}, [enabled, store]);

	return { navRef, indicatorRef };
}

/** The section links, in the pill or the menu sheet. The only part of the header that follows the scroll. */
function NavLinks({ store, variant, onLanding, onNavigate }: { store: ActiveStore; variant: 'pill' | 'sheet'; onLanding: boolean; onNavigate: () => void }) {
	const t = useTranslations('nav');
	const active = useSyncExternalStore(store.subscribe, store.get, serverActive);

	return SECTIONS.map(({ id, key }) => {
		const shared = {
			className: cx(styles.navLink, variant === 'sheet' && styles.sheetLink),
			'aria-current': active === id ? ('location' as const) : undefined,
			onClick: onNavigate,
		};
		return (
			<li key={id}>
				{/* On the landing, a plain anchor lets Lenis smooth-scroll; elsewhere, go to this locale's landing. */}
				{onLanding ? (
					<a href={`#${id}`} {...shared}>
						{t(key)}
					</a>
				) : (
					<LocaleLink href={{ pathname: '/', hash: id }} {...shared}>
						{t(key)}
					</LocaleLink>
				)}
			</li>
		);
	});
}

/**
 * Figma Header: brand mark, a centred glass nav pill and the "Get in touch" CTA
 * on desktop; brand mark + menu icon on mobile, opening a side sheet.
 */
export function Header() {
	const t = useTranslations('nav');
	const tc = useTranslations('common');
	const pathname = usePathname();
	const onLanding = pathname === '/';
	const [store] = useState(createActiveStore);
	const { navRef, indicatorRef } = useScrollNav(onLanding, store);
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = useCallback(() => setMenuOpen(false), []);

	return (
		<>
			<a href="#main" className={styles.skip}>
				{tc('skipToContent')}
			</a>
			<header className={styles.header}>
				<div className={styles.bar}>
					{/* The theme button sits beside the brand mark so both sides of the centred pill weigh the same. */}
					<div className={styles.lead}>
						<LocaleLink href="/" className={styles.home} aria-label={tc('home')}>
							<BrandMark size={48} alt="" className={styles.markDesktop} />
							<BrandMark size={40} alt="" className={styles.markMobile} />
						</LocaleLink>
						<ThemeSwitch variant="cycle" size="xl" buttonVariant="glass" className={styles.cycleDesktop} />
						<ThemeSwitch variant="cycle" size="lg" buttonVariant="ghost" className={styles.cycleMobile} />
					</div>

					<nav ref={navRef} aria-label={t('label')} className={cx(styles.pill, 'u-bevel')}>
						<span ref={indicatorRef} className={cx('t-tabs-pill', styles.indicator)} aria-hidden="true" />
						<ul className={styles.navList}>
							<NavLinks store={store} variant="pill" onLanding={onLanding} onNavigate={closeMenu} />
						</ul>
					</nav>

					<div className={styles.actions}>
						<Button href={BOOKING_URL} size="xl" iconEnd="external-link" className={styles.cta}>
							{t('getInTouch')}
						</Button>
						<Button
							variant="ghost"
							size="lg"
							icon="menu"
							label={tc('openMenu')}
							aria-expanded={menuOpen}
							aria-haspopup="dialog"
							onClick={() => setMenuOpen(true)}
							className={styles.menuButton}
						/>
					</div>
				</div>
			</header>

			<Dialog open={menuOpen} onClose={closeMenu} title={tc('menu')} placement="right">
				<nav aria-label={t('label')} className={styles.sheet}>
					<ul className={styles.sheetList}>
						<NavLinks store={store} variant="sheet" onLanding={onLanding} onNavigate={closeMenu} />
					</ul>
					<div className={styles.sheetFooter}>
						<Button href={BOOKING_URL} size="2xl" iconEnd="external-link" fullWidth>
							{t('getInTouch')}
						</Button>
						<div className={styles.sheetSwitches}>
							<ThemeSwitch size="md" />
							<LocaleSwitch size="md" />
						</div>
					</div>
				</nav>
			</Dialog>
		</>
	);
}

export default Header;
