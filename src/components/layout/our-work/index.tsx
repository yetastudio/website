//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { SectionHeader, type Project } from '@/components/ui';
import { WorkGallery } from './gallery';
import { PROJECT_TOOLS, SHOTS } from '../content';
import { projectSlug } from './projects';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import section from '../section.module.css';
import styles from './styles.module.css';

/** Figma "Our Work" (1294:2794 desktop, 899:790 mobile). */
export function OurWork() {
	const t = useTranslations('ourWork');

	const base: Omit<Project, 'shots'> = {
		slug: projectSlug('yeta'),
		name: t('projects.yeta.name'),
		year: t('projects.yeta.year'),
		country: t('projects.yeta.country'),
		industry: t('projects.yeta.industry'),
		services: t('projects.yeta.services'),
		url: t('projects.yeta.url'),
		about: t('projects.yeta.about'),
		challenge: t('projects.yeta.challenge'),
		result: t('projects.yeta.result'),
		tools: PROJECT_TOOLS,
	};
	// Figma repeats the same card three times, each opening on shot 1 of the strip.
	const shots = SHOTS.map((shot, i) => ({ ...shot, alt: `${base.name}, screen ${i + 1}` }));
	const projects: Project[] = [0, 1, 2].map(() => ({ ...base, shots }));

	return (
		<section id="our-work" className={cx(section.section, styles.section)} aria-labelledby="our-work-title">
			<SectionHeader title={t('title')} titleId="our-work-title" eyebrow={t('chip')} className={cx(section.lead, styles.header)}>
				<p>{t.rich('intro', richTags)}</p>
			</SectionHeader>

			<WorkGallery projects={projects} label={t('carousel')} itemLabel={t('card')} />
		</section>
	);
}

export default OurWork;
