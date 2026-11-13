//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, Carousel, ProcessCard, SectionHeader } from '@/components/ui';
import { PROCESS } from '../content';
import { BOOKING_URL } from '../sections';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import section from '../section.module.css';
import styles from './styles.module.css';

/** Figma "Our Process" (1509:5782 desktop, 899:610 mobile). */
export function OurProcess() {
	const t = useTranslations('ourProcess');

	const cards = PROCESS.map((item, index) => (
		<ProcessCard
			key={item.key}
			step={index + 1}
			stepLabel={t('step')}
			icon={item.icon}
			hue={item.hue}
			title={t(`steps.${item.key}.title`)}
			description={t(`steps.${item.key}.description`)}
			className={styles.card}
		/>
	));

	return (
		<section id="our-process" className={cx(section.section, styles.section)} aria-labelledby="our-process-title">
			<SectionHeader title={t('title')} titleId="our-process-title" eyebrow={t('chip')} className={cx(section.lead, styles.header)}>
				<p>{t.rich('intro', richTags)}</p>
				<p>{t.rich('kickoff', richTags)}</p>
			</SectionHeader>

			<div className={section.mobileOnly}>
				<Carousel label={t('carousel')} itemLabel={t('card')} gap="sm">
					{cards}
				</Carousel>
			</div>
			<div className={section.desktopOnly}>
				<ol className={styles.grid}>
					{cards.map((card) => (
						<li key={card.key}>{card}</li>
					))}
				</ol>
			</div>

			<div className={section.cta}>
				<p className={section.ctaText}>{t.rich('cta', richTags)}</p>
				<Button href={BOOKING_URL} size="2xl" radius="soft" iconStart="leaf">
					{t('button')}
				</Button>
			</div>
		</section>
	);
}

export default OurProcess;
