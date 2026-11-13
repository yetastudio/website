'use client';

//! React Core
import { useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, CardStack, CaseStudyDialog, PaginationDots, ProjectCard, type Project } from '@/components/ui';

//! Styles
import section from '../section.module.css';
import styles from './styles.module.css';

/** Cases the desktop grid shows at once; more than this and it pages, with its controls. */
const PER_PAGE = 3;

/**
 * The project cards in both breakpoint structures (mobile deck, desktop grid) plus a
 * single case-study dialog rendered outside them, so resizing or rotating with the
 * dialog open can never hide or `inert` it. On mobile the deck has no controls: the
 * swipe is the control. On desktop the grid shows three cases and only grows arrows
 * and dots once there are more than three.
 */
export function WorkGallery({ projects, label, itemLabel }: { projects: Project[]; label: string; itemLabel: string }) {
	const t = useTranslations('common');
	const [active, setActive] = useState<Project | null>(null);
	const [page, setPage] = useState(0);
	const pages = Math.ceil(projects.length / PER_PAGE);
	const shown = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
	const turn = (delta: number) => setPage((value) => (value + delta + pages) % pages);

	return (
		<>
			<div className={section.mobileOnly}>
				<CardStack label={label} itemLabel={itemLabel} variant="deck" controls={false}>
					{projects.map((project, i) => (
						<ProjectCard key={i} project={project} size="mobile" onOpen={() => setActive(project)} />
					))}
				</CardStack>
			</div>
			<div className={section.desktopOnly}>
				<div className={styles.grid}>
					{shown.map((project, i) => (
						<ProjectCard
							key={page * PER_PAGE + i}
							project={project}
							size="desktop"
							priority={page === 0 && i === 0}
							onOpen={() => setActive(project)}
						/>
					))}
				</div>
				{pages > 1 && (
					<div className={styles.pager}>
						<Button variant="ghost" size="md" icon="arrow-left" label={t('previous')} onClick={() => turn(-1)} />
						<PaginationDots count={pages} index={page} onSelect={setPage} itemLabel={itemLabel} />
						<Button variant="ghost" size="md" icon="arrow-right" label={t('next')} onClick={() => turn(1)} />
					</div>
				)}
			</div>
			<CaseStudyDialog project={active} onClose={() => setActive(null)} />
		</>
	);
}

export default WorkGallery;
