//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Surface, Text } from '@/components/ui';
import { SHOTS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

const FACTS = ['year', 'country', 'industry', 'services'] as const;

/**
 * Library 12, Case study page. A small label, the project title in the Editorial serif and one line
 * on a wash band (COLLINS); the facts card straddles the band's lower edge (Deel) as a quiet rail
 * of labelled rows (basement.studio); the shots run off the frame's edge below it.
 */
export function CaseMockup() {
	const t = useTranslations('ourWork');
	const project = (key: string) => t(`projects.yeta.${key}`);
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.case)}>
				<div className={cx(styles.caseBand, styles.hued, 'scheme-light')} data-hue="violet">
					<Text as="span" size="xs" tone="strong">
						{t('caseStudy')}
					</Text>
					<Text as="h3" family="serif" weight="regular" leading="none" tone="strong" className={styles.caseTitle}>
						{project('name')}
					</Text>
					<Text size="sm" tone="strong" leading="normal" className={styles.caseLine}>
						{project('result')}
					</Text>
				</div>
				<Surface tone="raised" radius="lg" padding="md" bevel className={styles.caseFacts}>
					<dl className={styles.caseFactList}>
						{FACTS.map((fact) => (
							<div key={fact} className={styles.caseFact}>
								<Text as="dt" size="xs" tone="faint">
									{t(`facts.${fact}`)}
								</Text>
								<Text as="dd" size="sm" tone="strong">
									{project(fact)}
								</Text>
							</div>
						))}
					</dl>
				</Surface>
				<div className={styles.caseStrip}>
					{SHOTS.slice(0, 2).map((shot, index) => (
						<div key={shot.light} className={styles.caseShot}>
							<Image
								src={shot.light}
								alt={index === 0 ? `${project('name')}, screen ${index + 1}` : ''}
								fill
								sizes="(min-width: 1024px) 320px, 80vw"
								className={cx(styles.workImage, 'u-only-light')}
							/>
							<Image src={shot.dark} alt="" fill sizes="(min-width: 1024px) 320px, 80vw" className={cx(styles.workImage, 'u-only-dark')} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default CaseMockup;
