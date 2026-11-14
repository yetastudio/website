/* eslint-disable @next/next/no-img-element -- static vector lettering exported from Figma. */

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Link } from '@/components/ui/link';
import { LocaleSwitch } from '@/components/ui/locale-switch';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { Link as LocaleLink } from '@/i18n/navigation';
import { BOOKING_URL, SECTIONS, SOCIALS } from '../sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** "You Entered The Agency" block lettering: ink on the light band, metallic on the dark one. */
function Lettering({ label }: { label: string }) {
	return (
		<div className={styles.lettering} role="img" aria-label={label}>
			{/* Site dark → footer light → ink. Site light → footer dark → metallic. */}
			<span className={styles.letteringDesktop}>
				<img loading="lazy" decoding="async" src="/landing/footer/you-entered-the-agency-ink.svg" alt="" className="u-only-dark" width={864} height={83} />
				<img loading="lazy" decoding="async" src="/landing/footer/you-entered-the-agency-metallic.svg" alt="" className="u-only-light" width={864} height={83} />
			</span>
			<span className={styles.letteringMobile}>
				<img loading="lazy" decoding="async" src="/landing/footer/you-entered-the-agency-ink-mobile.svg" alt="" className="u-only-dark" width={342} height={140} />
				<img loading="lazy" decoding="async" src="/landing/footer/you-entered-the-agency-metallic-mobile.svg" alt="" className="u-only-light" width={342} height={140} />
			</span>
		</div>
	);
}

/**
 * Figma Footer: a full-bleed band in the opposite theme (light on the dark site,
 * Dark Secondary on the light site), built by flipping `color-scheme` so every
 * token inverts on its own.
 */
export function Footer() {
	const t = useTranslations('footer');
	const nav = useTranslations('nav');
	const year = new Date().getFullYear();

	return (
		<footer className={cx(styles.footer, 'scheme-inverse')}>
			<div className={styles.columns}>
				<div className={styles.column}>
					<Lettering label={t('agency')} />
					<nav aria-labelledby="footer-socials" className={cx(styles.list, styles.socials)}>
						<h2 id="footer-socials" className={styles.label}>
							{t('socials')}
						</h2>
						<ul>
							{SOCIALS.map((social) => (
								<li key={social.key}>
									{social.href ? (
										<a href={social.href} target="_blank" rel="noopener noreferrer" className={styles.item}>
											{t(`links.${social.key}`)}
										</a>
									) : (
										<span className={styles.item}>{t(`links.${social.key}`)}</span>
									)}
								</li>
							))}
						</ul>
					</nav>
				</div>

				<span className={styles.rule} aria-hidden="true" />

				<div className={styles.column}>
					<div className={styles.about}>
						<h2 className={styles.label}>{t('aboutTitle')}</h2>
						<p className={styles.body}>{t('about')}</p>
					</div>
					<p className={cx(styles.label, styles.cta)}>
						{t('ready')}{' '}
						<Link href={BOOKING_URL} showExternalIcon={false} className={styles.ctaLink}>
							{t('consultation')}
						</Link>
					</p>
					<nav aria-labelledby="footer-navigation" className={cx(styles.list, styles.navigation)}>
						<h2 id="footer-navigation" className={styles.label}>
							{t('navigation')}
						</h2>
						<ul>
							{SECTIONS.map((section) => (
								<li key={section.id}>
									<LocaleLink href={{ pathname: '/', hash: section.id }} className={styles.item}>
										{nav(section.footerKey)}
									</LocaleLink>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>

			<div className={styles.bottom}>
				<p>{t('rights', { year })}</p>
				<div className={styles.switches}>
					<ThemeSwitch />
					<LocaleSwitch />
				</div>
				<p>{t('signature')}</p>
			</div>
		</footer>
	);
}

export default Footer;
