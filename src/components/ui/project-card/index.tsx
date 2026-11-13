'use client';

/* eslint-disable @next/next/no-img-element -- tool logos are tiny static SVGs. */

//! React Core
import { useEffect, useState, type ReactNode } from 'react';

//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { AccordionItem, Accordion } from '@/components/ui/accordion';
import { LogoMark } from '@/components/ui/brand';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PaginationDots } from '@/components/ui/pagination-dots';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ProjectShot = { light: string; dark: string; alt: string };

export type Project = {
	name: string;
	year: string;
	country: string;
	industry: string;
	services: string;
	url: string;
	about: string;
	challenge: string;
	result: string;
	shots: ProjectShot[];
	tools: Array<'figma' | 'react' | 'nextjs' | 'vercel' | 'slack' | 'loom'>;
};

const TOOL_LABEL = { figma: 'Figma', react: 'React', nextjs: 'Next.js', vercel: 'Vercel', slack: 'Slack', loom: 'Loom' } as const;

/** "Yeta ✹ Studio" wordmark with the gradient Figma uses on project cards. */
function Wordmark({ name, active }: { name: string; active?: boolean }) {
	const [first, ...rest] = name.split(' ');
	return (
		<span className={cx(styles.wordmark, active && styles.wordmarkActive)}>
			<span className={styles.wordmarkText}>{first}</span>
			<LogoMark size={20} canvas="auto" alt="" />
			<span className={styles.wordmarkText}>{rest.join(' ')}</span>
		</span>
	);
}

function Shot({ shot, sizes, priority }: { shot: ProjectShot; sizes: string; priority?: boolean }) {
	return (
		<>
			<Image src={shot.light} alt={shot.alt} fill sizes={sizes} className={cx(styles.image, 'u-only-light')} priority={priority} />
			<Image src={shot.dark} alt={shot.alt} fill sizes={sizes} className={cx(styles.image, 'u-only-dark')} priority={priority} />
		</>
	);
}

function ToolLogo({ tool }: { tool: Project['tools'][number] }) {
	if (tool === 'vercel') {
		return (
			<>
				<img src="/landing/our-work/tools/vercel-light.svg" alt="" className={cx(styles.toolLogo, 'u-only-light')} />
				<img src="/landing/our-work/tools/vercel-dark.svg" alt="" className={cx(styles.toolLogo, 'u-only-dark')} />
			</>
		);
	}
	if (tool === 'nextjs') {
		return <img src="/landing/our-work/tools/nextjs.svg" alt="" className={cx(styles.toolLogo, styles.nextjs)} />;
	}
	return <img src={`/landing/our-work/tools/${tool}.svg`} alt="" className={styles.toolLogo} />;
}

/** Figma Project Overview Card, Status=Active: the expanded case study. */
export function CaseStudy({ project }: { project: Project }) {
	const t = useTranslations('ourWork');
	const facts: Array<[string, ReactNode]> = [
		[t('facts.client'), project.name],
		[t('facts.year'), project.year],
		[t('facts.country'), project.country],
		[t('facts.industry'), project.industry],
		[t('facts.services'), project.services],
		[
			t('facts.url'),
			<a key="url" href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className={styles.factLink}>
				{project.url}
			</a>,
		],
	];

	return (
		<div className={styles.caseStudy}>
			<dl className={cx(styles.facts, 'u-outline')}>
				{facts.map(([label, value]) => (
					<div key={label} className={styles.fact}>
						<dt>{label}</dt>
						<dd>{value}</dd>
					</div>
				))}
			</dl>

			<Accordion className={styles.disclosures}>
				<AccordionItem title={t('sections.about')}>{project.about}</AccordionItem>
				<AccordionItem title={t('sections.challenge')}>{project.challenge}</AccordionItem>
				<AccordionItem title={t('sections.result')}>{project.result}</AccordionItem>
			</Accordion>

			<p className={styles.caption}>{t('team')}</p>
			<div className={styles.team}>
				<LogoMark size={20} canvas="auto" alt="" />
				<span>{project.name}</span>
			</div>

			<p className={styles.caption}>{t('tools')}</p>
			<ul className={styles.tools}>
				{project.tools.map((tool) => (
					<li key={tool} className={cx(styles.tool, 'u-outline')}>
						<ToolLogo tool={tool} />
						<span>{TOOL_LABEL[tool]}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

/**
 * Figma Project Overview Card, Status=Active, as a dialog: a centred card on wide
 * screens and a bottom sheet on phones. Render ONE of these per gallery, outside any
 * breakpoint-hidden container or card stack, so the modal can never end up inside a
 * `display: none` or `inert` subtree.
 */
export function CaseStudyDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
	const t = useTranslations('ourWork');
	const [placement, setPlacement] = useState<'center' | 'bottom'>('center');
	const [shown, setShown] = useState<Project | null>(project);

	// Keep the last project while the exit animation runs; pick the placement at open time.
	useEffect(() => {
		if (project) {
			setShown(project);
			setPlacement(window.matchMedia('(min-width: 768px)').matches ? 'center' : 'bottom');
		}
	}, [project]);

	return (
		<Dialog
			open={Boolean(project)}
			onClose={onClose}
			placement={placement}
			size="sm"
			title={
				<span className={styles.dialogTitle}>
					<span className={styles.eyebrow}>{t('caseStudy')}</span>
					{shown && <Wordmark name={shown.name} active />}
				</span>
			}
		>
			{shown && <CaseStudy project={shown} />}
		</Dialog>
	);
}

export type ProjectCardProps = {
	project: Project;
	/** Figma Size=Mobile (358×344) or Size=Desktop (513×415, image strip). */
	size?: 'mobile' | 'desktop';
	/** Opens the case study (render a single CaseStudyDialog next to the gallery). */
	onOpen: () => void;
	priority?: boolean;
	className?: string;
};

/** Figma Project Overview Card, Status=Idle. "See more" calls `onOpen` to show the Active state. */
export function ProjectCard({ project, size = 'desktop', onOpen, priority, className }: ProjectCardProps) {
	const t = useTranslations('ourWork');
	const [shot, setShot] = useState(0);
	const isDesktop = size === 'desktop';
	const sizes = isDesktop ? '(min-width: 1024px) 449px, 90vw' : '(min-width: 768px) 334px, 90vw';

	return (
		<article className={cx(styles.card, styles[size], 'u-outline')} aria-label={`${t('caseStudy')}: ${project.name}`}>
			<header className={styles.header}>
				<p className={styles.eyebrow}>{t('caseStudy')}</p>
				<h3 className={styles.title}>
					<Wordmark name={project.name} />
				</h3>
			</header>

			<div className={cx(styles.frame, 'u-outline', className)}>
				{project.shots.map((item, index) => (
					<div key={index} className={cx(styles.shot, index === shot && styles.shotActive)} aria-hidden={index !== shot}>
						<Shot shot={item} sizes={sizes} priority={priority && index === 0} />
					</div>
				))}
			</div>

			<footer className={styles.footer}>
				{isDesktop && project.shots.length > 1 ? (
					<PaginationDots count={project.shots.length} index={shot} onSelect={setShot} itemLabel="image" />
				) : (
					<span />
				)}
				<Button size="md" iconEnd="external-link" onClick={onOpen} aria-haspopup="dialog">
					{t('seeMore')}
				</Button>
			</footer>
		</article>
	);
}

export default ProjectCard;
