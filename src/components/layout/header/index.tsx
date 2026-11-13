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

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/**
 * The white active pill follows the scroll (landing only). A reading line sits at 40% of the
 * viewport; between two sections the pill travels from one link to the next in proportion to how
 * far that line has gone from the first section's top to the next one's, so it moves while you
 * scroll instead of jumping. Above the first section it fades in as that section nears the line.
 * The link the pill mostly covers is the active one (aria-current). It is the transitions.dev
 * "Tabs sliding" pill, driven by scroll instead of a tween.
 */
function useScrollNav(enabled: boolean) {
	const navRef = useRef<HTMLElement>(null);
	const indicatorRef = useRef<HTMLSpanElement>(null);
	const [active, setActive] = useState<SectionId | null>(null);

	useEffect(() => {
		const nav = navRef.current;
		const indicator = indicatorRef.current;
		if (!enabled || !nav || !indicator) return;
		indicator.style.transition = 'none'; // the scroll is the animation
		nav.dataset.pill = 'ready';
		let frame = 0;

		const update = () => {
			frame = 0;
			const sections = SECTIONS.map(({ id }) => document.getElementById(id));
			const links = SECTIONS.map(({ id }) => nav.querySelector<HTMLElement>(`a[href="#${id}"]`));
			if (sections.some((node) => !node) || links.some((node) => !node)) return;

			const line = window.innerHeight * 0.4;
			const tops = sections.map((node) => node!.getBoundingClientRect().top - line);
			const box = nav.getBoundingClientRect();
			// Pad each link by the nav's padding minus the pill's inset, so the pill keeps the inset on every side.
			const pad = parseFloat(getComputedStyle(nav).paddingLeft) - parseFloat(getComputedStyle(indicator).top);
			const geometry = links.map((link) => {
				const rect = link!.getBoundingClientRect();
				return { x: rect.left - box.left - nav.clientLeft - pad, width: rect.width + pad * 2 };
			});

			const last = SECTIONS.length - 1;
			let index = -1;
			tops.forEach((top, i) => {
				if (top <= 0) index = i;
			});

			let x: number;
			let width: number;
			let opacity = 1;
			let current: number | null;
			if (index < 0) {
				opacity = clamp(1 - tops[0] / (window.innerHeight * 0.5));
				({ x, width } = geometry[0]);
				current = opacity >= 0.5 ? 0 : null;
			} else if (index >= last) {
				({ x, width } = geometry[last]);
				current = last;
			} else {
				const progress = clamp(-tops[index] / (tops[index + 1] - tops[index]));
				x = lerp(geometry[index].x, geometry[index + 1].x, progress);
				width = lerp(geometry[index].width, geometry[index + 1].width, progress);
				current = progress < 0.5 ? index : index + 1;
			}

			indicator.style.transform = `translateX(${x}px)`;
			indicator.style.width = `${width}px`;
			indicator.style.opacity = String(opacity);
			setActive(current === null ? null : SECTIONS[current].id);
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		schedule();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
		const observer = new ResizeObserver(schedule);
		observer.observe(nav);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			observer.disconnect();
		};
	}, [enabled]);

	return { navRef, indicatorRef, active };
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
	const { navRef, indicatorRef, active } = useScrollNav(onLanding);
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
							<BrandMark size={48} alt="" className={styles.markDesktop} />
							<BrandMark size={40} alt="" className={styles.markMobile} />
						</LocaleLink>
						<ThemeSwitch variant="cycle" size="xl" buttonVariant="glass" className={styles.cycleDesktop} />
						<ThemeSwitch variant="cycle" size="lg" buttonVariant="ghost" className={styles.cycleMobile} />
					</div>

					<nav ref={navRef} aria-label={t('label')} className={cx(styles.pill, 'u-bevel')}>
						<span ref={indicatorRef} className={cx('t-tabs-pill', styles.indicator)} aria-hidden="true" />
						<ul className={styles.navList}>{navLinks('pill')}</ul>
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
