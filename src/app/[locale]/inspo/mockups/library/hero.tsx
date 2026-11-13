//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Button, Heading, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

/**
 * Library 02, Hero. The Altitude band the owner saved, in our tokens: a sky that is day on light
 * and night on dark, a small line in it, and the page rising over it in one wide arc. The slogan
 * splits in two across the width (Altitude), its last word in the Editorial italic (Unseen Studio,
 * Microsoft AI), and one glass pill closes it.
 */
export function HeroMockup() {
	const t = useTranslations('hero');
	return (
		<div className={styles.container}>
			<div className={styles.frame}>
				<div className={cx(styles.sky, styles.heroSky)}>
					<Text as="span" size="xs" tone="strong">
						Yeta ✹ Studio · Design &amp; Development
					</Text>
				</div>
				<div className={styles.heroBody}>
					<Heading level={3} size="5xl" tone="display" leading="tight" className={styles.heroSplit}>
						<span className={styles.heroLine}>because great brands</span>{' '}
						<span className={styles.heroLine}>
							aren’t built on <Accent>luck</Accent>.
						</span>
					</Heading>
					<Button href={BOOKING_URL} variant="glass" size="lg" iconStart="calendar">
						{t('letsBuild')}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default HeroMockup;
