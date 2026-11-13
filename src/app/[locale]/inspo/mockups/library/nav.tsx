//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, Heading, Icon, LogoMark, Surface, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

/** Each link carries the dot of the wash its section is drawn in (mymind). */
const LINKS = [
	{ key: 'ourCraft', hue: 'pink' },
	{ key: 'ourWork', hue: 'yellow' },
	{ key: 'ourProcess', hue: 'green' },
] as const;

/**
 * Library 01, Navigation. Two frosted trays over the sky band (Butter): the links with their hue
 * dots and the theme switch inside the pill (Fourmula), then the one action on its own. On a phone
 * column the links fold into Menu. The hero sits under it, cropped, for context.
 */
export function NavMockup() {
	const t = useTranslations('nav');
	const common = useTranslations('common');
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.sky, styles.navStage)}>
				<div className={styles.navRow}>
					<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.navTray}>
						<span className={styles.navMarkSlot}>
							<LogoMark size={28} alt="Yeta Studio" />
						</span>
						<ul className={styles.navLinks}>
							{LINKS.map((link) => (
								<li key={link.key} className={styles.navLink}>
									<span className={cx(styles.navDot, styles.hued)} data-hue={link.hue} aria-hidden="true" />
									<Text as="span" size="sm" tone="strong">
										{t(link.key)}
									</Text>
								</li>
							))}
						</ul>
						<span className={styles.navTheme} aria-hidden="true">
							<span className={cx(styles.navThemeGlyph, styles.navThemeOn)}>
								<Icon name="sun" size="sm" />
							</span>
							<span className={styles.navThemeGlyph}>
								<Icon name="moon" size="sm" />
							</span>
						</span>
						<Button variant="ghost" size="sm" iconStart="menu" className={styles.navMenu}>
							{common('menu')}
						</Button>
					</Surface>
					<Surface tone="glass" radius="pill" padding="xs" bevel>
						<Button href={BOOKING_URL} variant="solid" size="sm" iconStart="calendar">
							{t('getInTouch')}
						</Button>
					</Surface>
				</div>
				<Heading level={3} size="5xl" tone="display" className={styles.navHint} aria-hidden="true">
					Yeta Studio
				</Heading>
			</div>
		</div>
	);
}

export default NavMockup;
