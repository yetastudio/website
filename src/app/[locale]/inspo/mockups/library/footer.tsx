//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

const NAV = ['ourCraft', 'ourWork', 'ourProcess', 'testimonials'] as const;
const SOCIALS = ['linkedin', 'instagram', 'threads', 'twitter'] as const;

/**
 * Library 11, Footer. A colophon, not a sitemap (Koto): one line and one action, two quiet columns,
 * then the studio's name set as a full-width serif italic sign-off (Claude Type) with warm light
 * bleeding in from the corners (Daylight). The glow is built from the accent token, so it is a
 * soft blush on light and edge lighting on dark.
 */
export function FooterMockup() {
	const t = useTranslations('footer');
	const nav = useTranslations('nav');
	const project = useTranslations('ourWork.projects.yeta');
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.footer)}>
				<div className={styles.footerTop}>
					<Text as="h3" size="2xl" weight="regular" leading="snug" tone="strong">
						{t('ready')}
					</Text>
					<Button href={BOOKING_URL} variant="glass" size="md" iconStart="calendar">
						{t('consultation')}
					</Button>
				</div>
				<div className={styles.footerColumns}>
					<div className={styles.footerColumn}>
						<Text as="span" size="xs" tone="faint">
							{t('navigation')}
						</Text>
						{NAV.map((key) => (
							<Text key={key} as="span" size="sm" tone="subtle">
								{nav(key)}
							</Text>
						))}
					</div>
					<div className={styles.footerColumn}>
						<Text as="span" size="xs" tone="faint">
							{t('socials')}
						</Text>
						{SOCIALS.map((key) => (
							<Text key={key} as="span" size="sm" tone="subtle">
								{t(`links.${key}`)}
							</Text>
						))}
					</div>
					<div className={styles.footerColumn}>
						<Text as="span" size="xs" tone="faint">
							{t('aboutTitle')}
						</Text>
						<Text size="sm" tone="subtle" leading="normal">
							{t('about')}
						</Text>
					</div>
				</div>
				<Text as="span" family="serif" italic tone="display" leading="none" className={styles.footerSign} aria-hidden="true">
					Yeta Studio
				</Text>
				<div className={styles.footerBase}>
					<Text as="span" size="xs" tone="faint">
						{t('rights', { year: 2025 })}
					</Text>
					<Text as="span" size="xs" tone="faint">
						{`Made in ${project('country')} · ${t('signature')}`}
					</Text>
				</div>
			</div>
		</div>
	);
}

export default FooterMockup;
