//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, Carousel, CaseStudy, Chip, GradientTile, Heading, Icon, LogoMark, Surface, Text, type Project, type ProjectShot } from '@/components/ui';
import { Shot } from '@/components/ui/project-card';
import { BOOKING_URL } from '../sections';
import type { ProjectEntry } from '../our-work/projects';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import section from '../section.module.css';
import styles from './styles.module.css';

/** Paragraph slots a detail section may fill in messages (`details.<section>.p1…p3`). */
const PARAGRAPHS = ['p1', 'p2', 'p3'] as const;

/** One project screen in a framed surface, sized by its parent (grid cell or carousel slide). */
function ShotFrame({ shot, sizes, priority, className }: { shot: ProjectShot; sizes: string; priority?: boolean; className?: string }) {
	return (
		<Surface tone="canvas" radius="2xl" className={cx(styles.frame, className)}>
			<Shot shot={shot} sizes={sizes} priority={priority} />
		</Surface>
	);
}

/**
 * Case study detail page (`/work/[slug]`). Not drawn in Figma: composed only from the
 * design system, in the landing's visual language — hero-style title, the project
 * screens, the Figma "Active" project sheet, process-style story cards, gradient stat
 * tiles and the landing call to action.
 */
export function CaseStudyDetail({ project, entry }: { project: Project; entry: ProjectEntry }) {
	const t = useTranslations('caseStudy');
	const tw = useTranslations('ourWork');
	const nav = useTranslations('nav');
	const base = `projects.${entry.key}`;
	const [first, ...rest] = project.name.split(' ');

	const paragraphs = (part: string) =>
		PARAGRAPHS.filter((p) => tw.has(`${base}.details.${part}.${p}`)).map((p) => (
			<Text key={p} leading="relaxed">
				{tw.rich(`${base}.details.${part}.${p}`, richTags)}
			</Text>
		));

	return (
		<div className={styles.detail}>
			{/* ── Intro ── */}
			<section className={styles.intro} aria-labelledby="case-study-title">
				<Button href="/#our-work" variant="ghost" size="md" iconStart="arrow-left" className={styles.back}>
					{t('back')}
				</Button>

				<div className={styles.heading}>
					<Chip size="sm">{tw('caseStudy')}</Chip>
					<h1 id="case-study-title" className={styles.title}>
						{/* The spaces are ignored by the flex layout but keep the heading's name "Yeta Studio". */}
						<span className={styles.word}>{first}</span>
						{rest.length > 0 && (
							<>
								{' '}
								<LogoMark canvas="auto" size="calc(var(--case-title-size) * 1.0714)" alt="" />{' '}
								<span className={styles.word}>{rest.join(' ')}</span>
							</>
						)}
					</h1>
					<Text size="lg" align="center" balance className={styles.tagline}>
						{tw(`${base}.tagline`)}
					</Text>
				</div>

				<div className={styles.actions}>
					<Button href={`https://${project.url}`} size="xl" iconEnd="external-link">
						{t('visit', { url: project.url })}
					</Button>
					<Button href={BOOKING_URL} size="xl" variant="glass" iconStart="calendar" iconEnd="external-link">
						{nav('getInTouch')}
					</Button>
				</div>
			</section>

			{/* ── Screens: a swipeable track on phones and tablets, a row of three from 1024 ── */}
			<div className={styles.gallery}>
				<div className={styles.galleryTrack}>
					<Carousel label={t('gallery')} itemLabel={t('screen')}>
						{project.shots.map((shot, i) => (
							<ShotFrame key={i} shot={shot} sizes="85vw" priority={i === 0} className={styles.slide} />
						))}
					</Carousel>
				</div>
				<ul className={styles.galleryGrid} aria-label={t('gallery')}>
					{project.shots.map((shot, i) => (
						<li key={i}>
							{/* The screens are the page's largest paint above the fold. */}
							<ShotFrame shot={shot} sizes="33vw" priority={i === 0} />
						</li>
					))}
				</ul>
			</div>

			{/* ── About + in numbers, next to the project sheet (stacked on phones: about, sheet, numbers) ── */}
			<div className={styles.overview}>
				<section className={cx(styles.prose, styles.about)} aria-labelledby="case-study-about">
					<Heading level={2} id="case-study-about" size="2xl" family="serif" weight="regular" leading="tight">
						{tw('sections.about')}
					</Heading>
					{paragraphs('about')}
				</section>

				<Surface as="aside" tone="canvas" radius="2xl" padding="md" className={styles.sheet} aria-labelledby="case-study-sheet">
					<Text as="h2" id="case-study-sheet" size="xs" tone="subtle" align="center">
						{t('sheet')}
					</Text>
					<CaseStudy project={project} showSections={false} />
				</Surface>

				<section className={styles.highlights} aria-labelledby="case-study-highlights">
					<Text as="h2" id="case-study-highlights" size="sm" tone="subtle">
						{t('highlights')}
					</Text>
					<ul className={styles.stats}>
						{entry.highlights.map((item) => (
							<li key={item.key} className={styles.statItem}>
								<GradientTile hue={item.hue} shape="testimonial-compact" className={styles.statTile}>
									<span className={styles.stat}>
										<Text as="span" family="serif" size="5xl" weight="regular" leading="none">
											{item.value}
										</Text>
										<Text as="span" size="sm" leading="snug" align="center" balance>
											{tw(`${base}.highlights.${item.key}`)}
										</Text>
									</span>
								</GradientTile>
							</li>
						))}
					</ul>
				</section>
			</div>

			{/* ── Challenge · Result ── */}
			<div className={styles.story}>
				{entry.story.map((item) => (
					<Surface
						key={item.key}
						as="article"
						tone="canvas"
						radius="2xl"
						padding="sm"
						className={styles.storyCard}
						aria-labelledby={`case-study-${item.key}`}
					>
						<GradientTile hue={item.hue} shape="process" className={styles.storyTile} underlay={<Icon name={item.icon} className={styles.storyIcon} />} />
						<div className={styles.prose}>
							<Heading level={2} id={`case-study-${item.key}`} size="2xl" family="serif" weight="regular" leading="tight">
								{tw(`sections.${item.key}`)}
							</Heading>
							{paragraphs(item.key)}
						</div>
					</Surface>
				))}
			</div>

			{/* ── Call to action (the landing's closing pattern) ── */}
			<section className={cx(section.cta, styles.cta)} aria-labelledby="case-study-cta">
				<p id="case-study-cta" className={section.ctaText}>
					{t.rich('cta', richTags)}
				</p>
				<Button href={BOOKING_URL} size="2xl" radius="soft" iconStart="leaf" iconEnd="external-link">
					{t('ctaButton')}
				</Button>
			</section>
		</div>
	);
}

export default CaseStudyDetail;
