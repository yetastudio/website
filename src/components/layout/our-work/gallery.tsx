'use client';

//! React Core
import { useState } from 'react';

//! Components
import { CardStack, CaseStudyDialog, ProjectCard, type Project } from '@/components/ui';

//! Styles
import section from '../section.module.css';
import styles from './styles.module.css';

/**
 * The project cards in both breakpoint structures (mobile deck, desktop grid) plus a
 * single case-study dialog rendered outside them, so resizing or rotating with the
 * dialog open can never hide or `inert` it.
 */
export function WorkGallery({ projects, label, itemLabel }: { projects: Project[]; label: string; itemLabel: string }) {
	const [active, setActive] = useState<Project | null>(null);

	return (
		<>
			<div className={section.mobileOnly}>
				<CardStack label={label} itemLabel={itemLabel} variant="deck">
					{projects.map((project, i) => (
						<ProjectCard key={i} project={project} size="mobile" onOpen={() => setActive(project)} />
					))}
				</CardStack>
			</div>
			<div className={section.desktopOnly}>
				<div className={styles.grid}>
					{projects.map((project, i) => (
						<ProjectCard key={i} project={project} size="desktop" priority={i === 0} onOpen={() => setActive(project)} />
					))}
				</div>
			</div>
			<CaseStudyDialog project={active} onClose={() => setActive(null)} />
		</>
	);
}

export default WorkGallery;
