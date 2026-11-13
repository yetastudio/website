'use client';

//! React Core
import { useEffect, useRef, useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

//! Components
import { Link as LocaleLink } from '@/i18n/navigation';
import { BrandMark, Button, Dialog, ThemeSwitch } from '@/components/ui';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { BOOKING_URL, SECTIONS, type SectionId } from '../sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** Highlights the nav item of the section in view (landing only). */
function useActiveSection(enabled: boolean) {
	const [active, setActive] = useState<SectionId | null>(null);

	useEffect(() => {
		if (!enabled) return;
		const targets = SECTIONS.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible) setActive(visible.target.id as SectionId);
			},
			{ rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] }
		);
		targets.forEach((target) => observer.observe(target));
		return () => observer.disconnect();
	}, [enabled]);

	return active;
}

/**
 * transitions.dev "Tabs sliding", drawn as the nav underline: JS writes the active link's
 * offset and width onto one indicator and CSS tweens it, so it slides from section to
 * section as you scroll. It snaps (no tween) when it first appears and on resize.
 */
function useNavIndicator(active: SectionId | null) {
	const navRef = useRef<HTMLElement>(null);
	const indicatorRef = useRef<HTMLSpanElement>(null);
	const visible = useRef(false);

	useEffect(() => {
		const nav = navRef.current;
		const indicator = indicatorRef.current;
		if (!nav || !indicator) return;

		const moveTo = (animate: boolean) => {
			const link = active ? nav.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
			if (!link) {
				delete nav.dataset.pill;
				return false;
			}
			const box = nav.getBoundingClientRect();
			const rect = link.getBoundingClientRect();
			const write = () => {
				indicator.style.transform = `translateX(${rect.left - box.left - nav.clientLeft}px)`;
				indicator.style.width = `${rect.width}px`;
				indicator.style.top = `${rect.bottom - box.top - nav.clientTop}px`;
			};
			if (!animate) {
				const prev = indicator.style.transition;
				indicator.style.transition = 'none';
				write();
				void indicator.offsetWidth;
				indicator.style.transition = prev;
			} else {
				write();
			}
			nav.dataset.pill = 'ready';
			return true;
		};

		visible.current = moveTo(visible.current);
		const observer = new ResizeObserver(() => moveTo(false));
		observer.observe(nav);
		return () => observer.disconnect();
	}, [active]);

	return { navRef, indicatorRef };
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
	const active = useActiveSection(onLanding);
	const { navRef, indicatorRef } = useNavIndicator(active);
	const [menuOpen, setMenuOpen] = useState(false);

	const navLinks = (variant: 'pill' | 'sheet') =>
		SECTIONS.map(({ id, key }) => {
			const shared = {
				className: cx(styles.navLink, variant === 'sheet' && styles.sheetLink),
				'aria-current': active === id ? ('location' as const) : undefined,
				onClick: () => setMenuOpen(false),
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
							<BrandMark size={60} alt="" className={styles.markDesktop} />
							<BrandMark size={40} alt="" className={styles.markMobile} />
						</LocaleLink>
						<ThemeSwitch variant="cycle" size="2xl" buttonVariant="glass" className={styles.cycleDesktop} />
						<ThemeSwitch variant="cycle" size="lg" buttonVariant="ghost" className={styles.cycleMobile} />
					</div>

					<nav ref={navRef} aria-label={t('label')} className={cx(styles.pill, 'u-bevel')}>
						<span ref={indicatorRef} className={cx('t-tabs-pill', styles.indicator)} aria-hidden="true" />
						<ul className={styles.navList}>{navLinks('pill')}</ul>
					</nav>

					<div className={styles.actions}>
						<Button href={BOOKING_URL} size="2xl" iconEnd="external-link" className={styles.cta}>
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

			<Dialog open={menuOpen} onClose={() => setMenuOpen(false)} title={tc('menu')} placement="right">
				<nav aria-label={t('label')} className={styles.sheet}>
					<ul className={styles.sheetList}>{navLinks('sheet')}</ul>
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
