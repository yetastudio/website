//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { CardStack } from '@/components/ui/card-stack';
import { SectionHeader } from '@/components/ui/section-header';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { TESTIMONIALS } from '../content';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import section from '../section.module.css';
import styles from './styles.module.css';

/** Figma "Testimonials" (1509:7879 desktop, 1018:2315 mobile). */
export function Testimonials() {
	const t = useTranslations('testimonials');

	const cards = (size: 'desktop' | 'mobile') =>
		TESTIMONIALS.map((item) => (
			<TestimonialCard
				key={item.key}
				size={size}
				hue={item.hue}
				avatar={item.avatar}
				quote={size === 'mobile' && t.has(`items.${item.key}.quoteMobile`) ? t(`items.${item.key}.quoteMobile`) : t(`items.${item.key}.quote`)}
				name={t(`items.${item.key}.name`)}
				role={t(`items.${item.key}.role`)}
				company={t(`items.${item.key}.company`)}
			/>
		));

	return (
		<section id="testimonials" className={cx(section.section, styles.section)} aria-labelledby="testimonials-title">
			<SectionHeader title={t('title')} titleId="testimonials-title" eyebrow={t('chip')} className={cx(section.lead, styles.header)}>
				<p>{t.rich('intro', richTags)}</p>
			</SectionHeader>

			<div className={section.mobileOnly}>
				{/* The fan sits inset by how far its back cards peek out, so they stay whole on screen. */}
				<div className={styles.fan}>
					{/* Figma puts Marcelo (the middle card) in front of the stack. */}
					<CardStack label={t('carousel')} itemLabel={t('card')} variant="fan" initialIndex={1}>
						{cards('mobile')}
					</CardStack>
				</div>
			</div>
			<div className={section.desktopOnly}>
				<div className={styles.grid}>{cards('desktop')}</div>
			</div>
		</section>
	);
}

export default Testimonials;
