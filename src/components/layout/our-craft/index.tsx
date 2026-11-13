//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, Carousel, CraftCard, SectionHeader } from '@/components/ui';
import { CRAFT, CRAFT_LIGHT_DESKTOP_HUES } from '../content';
import { BOOKING_URL } from '../sections';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import section from '../section.module.css';
import styles from './styles.module.css';

/** Figma "Our Craft" (1475:2264 desktop, 585:768 mobile). */
export function OurCraft() {
	const t = useTranslations('ourCraft');

	const cards = (layout: 'stacked' | 'responsive') =>
		CRAFT.map((item, index) => (
			<CraftCard
				key={item.key}
				layout={layout}
				icon={item.icon}
				hue={item.hue}
				hueLight={layout === 'responsive' ? CRAFT_LIGHT_DESKTOP_HUES[index] : item.hue}
				title={t(`cards.${item.key}.title`)}
				subtitle={t(`cards.${item.key}.subtitle`)}
				description={t(`cards.${item.key}.description`)}
			/>
		));

	return (
		<section id="our-craft" className={cx(section.section, styles.section)} aria-labelledby="our-craft-title">
			<SectionHeader title={t('title')} titleId="our-craft-title" eyebrow={t('chip')} className={cx(section.lead, styles.header)}>
				{/* Figma shows this paragraph on mobile only. */}
				<p className={styles.mobileCopy}>{t.rich('intro', richTags)}</p>
				<p className={styles.mobileCopy}>{t.rich('intro2', richTags)}</p>
			</SectionHeader>

			<div className={section.mobileOnly}>
				<Carousel label={t('carousel')} itemLabel={t('card')} gap="md">
					{cards('stacked')}
				</Carousel>
			</div>
			<div className={section.desktopOnly}>
				<div className={styles.grid}>{cards('responsive')}</div>
			</div>

			<div className={section.cta}>
				<p className={section.ctaText}>{t.rich('cta', richTags)}</p>
				<Button href={BOOKING_URL} size="2xl" radius="soft" iconStart="calendar">
					{t('button')}
				</Button>
			</div>
		</section>
	);
}

export default OurCraft;
