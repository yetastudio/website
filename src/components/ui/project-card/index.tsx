'use client';

/* eslint-disable @next/next/no-img-element -- tool logos are tiny static SVGs. */

//! React Core
import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

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
	/** Detail page slug (`/work/[slug]`). When set, the case-study dialog links to the full page. */
	slug?: string;
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

/*
 * Wordmark and Shot are memoised: the card re-renders on every autoplay step, hover and focus,
 * and neither the title nor the stacked light/dark images change with any of those.
 */

/** "Yeta ✹ Studio" wordmark with the gradient Figma uses on project cards. */
const Wordmark = memo(function Wordmark({ name, active }: { name: string; active?: boolean }) {
	const [first, ...rest] = name.split(' ');
	return (
		<span className={cx(styles.wordmark, active && styles.wordmarkActive)}>
			<span className={styles.wordmarkText}>{first}</span>
			<LogoMark size={20} canvas="auto" alt="" />
			<span className={styles.wordmarkText}>{rest.join(' ')}</span>
		</span>
	);
});

/** One project screen, light and dark exports stacked. Fills its positioned parent. */
export const Shot = memo(function Shot({ shot, sizes, priority }: { shot: ProjectShot; sizes: string; priority?: boolean }) {
	return (
		<>
			<Image src={shot.light} alt={shot.alt} fill sizes={sizes} className={cx(styles.image, 'u-only-light')} priority={priority} />
			<Image src={shot.dark} alt={shot.alt} fill sizes={sizes} className={cx(styles.image, 'u-only-dark')} priority={priority} />
		</>
	);
});

function ToolLogo({ tool }: { tool: Project['tools'][number] }) {
	if (tool === 'vercel') {
		return (
			<>
				<img loading="lazy" decoding="async" src="/landing/our-work/tools/vercel-light.svg" alt="" className={cx(styles.toolLogo, 'u-only-light')} />
				<img loading="lazy" decoding="async" src="/landing/our-work/tools/vercel-dark.svg" alt="" className={cx(styles.toolLogo, 'u-only-dark')} />
			</>
		);
	}
	if (tool === 'nextjs') {
		return <img loading="lazy" decoding="async" src="/landing/our-work/tools/nextjs.svg" alt="" className={cx(styles.toolLogo, styles.nextjs)} />;
	}
	return <img loading="lazy" decoding="async" src={`/landing/our-work/tools/${tool}.svg`} alt="" className={styles.toolLogo} />;
}

/**
 * Figma Project Overview Card, Status=Active: the expanded case study.
 * `showSections={false}` drops the About / Challenge / Result rows (the detail page tells them in full).
 */
export function CaseStudy({ project, showSections = true }: { project: Project; showSections?: boolean }) {
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

			{showSections && (
				<Accordion className={styles.disclosures}>
					<AccordionItem title={t('sections.about')}>{project.about}</AccordionItem>
					<AccordionItem title={t('sections.challenge')}>{project.challenge}</AccordionItem>
					<AccordionItem title={t('sections.result')}>{project.result}</AccordionItem>
				</Accordion>
			)}

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
	const [previous, setPrevious] = useState<Project | null>(null);

	// On every open (null → project) keep the project for the exit animation and pick the placement.
	// Adjusting state during render (not in an effect) avoids an extra committed frame.
	if (project !== previous) {
		setPrevious(project);
		if (project) {
			setShown(project);
			if (typeof window !== 'undefined') setPlacement(window.matchMedia('(min-width: 768px)').matches ? 'center' : 'bottom');
		}
	}

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
			footer={
				shown?.slug ? (
					<Button href={`/work/${shown.slug}`} size="md" iconEnd="arrow-right" fullWidth>
						{t('viewCaseStudy')}
					</Button>
				) : undefined
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

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
	const query = window.matchMedia(REDUCED_MOTION);
	query.addEventListener('change', onChange);
	return () => query.removeEventListener('change', onChange);
}

/** Server and first hydration pass assume reduced motion, so autoplay only ever starts on the client. */
function useReducedMotion() {
	return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => true);
}

/**
 * Figma Project Overview Card, Status=Idle. "See more" calls `onOpen` to show the Active state.
 * On desktop the shots play on their own: the active dot fills over `--autoplay-interval`, then
 * the next shot fades in. Autoplay pauses on hover, on keyboard focus and off-screen, and is off
 * with reduced motion; the dots still pick a shot by hand.
 */
export function ProjectCard({ project, size = 'desktop', onOpen, priority, className }: ProjectCardProps) {
	const t = useTranslations('ourWork');
	const [shot, setShot] = useState(0);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [inView, setInView] = useState(false);
	const cardRef = useRef<HTMLElement>(null);
	const reduceMotion = useReducedMotion();
	const isDesktop = size === 'desktop';
	const sizes = isDesktop ? '(min-width: 1024px) 449px, 90vw' : '(min-width: 768px) 334px, 90vw';
	const shotCount = project.shots.length;
	const autoplay = isDesktop && shotCount > 1 && !reduceMotion;

	useEffect(() => {
		const card = cardRef.current;
		if (!card || !autoplay) return;
		const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
		observer.observe(card);
		return () => observer.disconnect();
	}, [autoplay]);

	const advance = useCallback(() => setShot((current) => (current + 1) % shotCount), [shotCount]);

	return (
		<article
			ref={cardRef}
			className={cx(styles.card, styles[size], 'u-outline')}
			aria-label={`${t('caseStudy')}: ${project.name}`}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
			}}
		>
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
					<PaginationDots
						count={shotCount}
						index={shot}
						onSelect={setShot}
						itemLabel="image"
						autoplay={autoplay ? { paused: hovered || focused || !inView, onComplete: advance } : undefined}
					/>
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
