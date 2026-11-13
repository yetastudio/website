'use client';

//! React Core
import { useEffect, useState } from 'react';

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
 * Figma Header: brand mark, a centred glass nav pill and the "Get in touch" CTA
 * on desktop; brand mark + menu icon on mobile, opening a side sheet.
 */
export function Header() {
	const t = useTranslations('nav');
	const tc = useTranslations('common');
	const pathname = usePathname();
	const onLanding = pathname === '/';
	const active = useActiveSection(onLanding);
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
					<LocaleLink href="/" className={styles.home} aria-label={tc('home')}>
						<BrandMark size={60} alt="" className={styles.markDesktop} />
						<BrandMark size={40} alt="" className={styles.markMobile} />
					</LocaleLink>

					<nav aria-label={t('label')} className={cx(styles.pill, 'u-bevel')}>
						<ul className={styles.navList}>{navLinks('pill')}</ul>
					</nav>

					<div className={styles.actions}>
						<ThemeSwitch className={styles.themeSwitch} />
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
