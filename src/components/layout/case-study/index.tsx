//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/ui/carousel';
import { CaseStudy, type Project, type ProjectShot } from '@/components/ui/project-card';
import { Chip } from '@/components/ui/chip';
import { GradientTile } from '@/components/ui/gradient-tile';
import { Heading, Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { LogoMark } from '@/components/ui/brand';
import { Surface } from '@/components/ui/surface';
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
 * Case study detail page (`/work/[slug]`). Figma: page "Case Study (Detail)" (1737:2), styled
 * from the landing's own values — the hero pattern (wordmark, chip, lead, button group), the
 * section title and lead, Process Card shells for the stats and the story, the Project
 * Overview Card (Active) as the project sheet, and the landing call to action.
 */
export function CaseStudyDetail({ project, entry }: { project: Project; entry: ProjectEntry }) {
	const t = useTranslations('caseStudy');
	const tw = useTranslations('ourWork');
	const nav = useTranslations('nav');
	const base = `projects.${entry.key}`;
	const [first, ...rest] = project.name.split(' ');

	const paragraphs = (part: string) =>
		PARAGRAPHS.filter((p) => tw.has(`${base}.details.${part}.${p}`)).map((p) => <p key={p}>{tw.rich(`${base}.details.${part}.${p}`, richTags)}</p>);

	return (
		<div className={styles.detail}>
			{/* ── Intro: back link + the landing hero pattern ── */}
			<section className={styles.intro} aria-labelledby="case-study-title">
				<Button href="/#our-work" variant="ghost" size="md" iconStart="arrow-left" className={styles.back}>
					{t('back')}
				</Button>

				<div className={styles.hero}>
					<div className={styles.heading}>
						<h1 id="case-study-title" className={styles.title}>
							{/* The spaces are ignored by the flex layout but keep the heading's name "Yeta Studio". */}
							<span className={styles.word}>{first}</span>
							{rest.length > 0 && (
								<>
									{' '}
									<LogoMark canvas="auto" size="calc(var(--text-display) * 1.0714)" alt="" />{' '}
									<span className={styles.word}>{rest.join(' ')}</span>
								</>
							)}
						</h1>
						<Chip size="sm">{tw('caseStudy')}</Chip>
					</div>

					<p className={styles.lead}>{tw(`${base}.tagline`)}</p>

					<div className={cx(styles.group, 'u-outline')}>
						<Button href={`https://${project.url}`} size="xl" fullWidth>
							{t('visit', { url: project.url })}
						</Button>
						<Button href={BOOKING_URL} size="xl" fullWidth>
							{nav('getInTouch')}
						</Button>
					</div>
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
				<section className={styles.about} aria-labelledby="case-study-about">
					<Heading level={2} id="case-study-about" className={styles.sectionTitle}>
						{tw('sections.about')}
					</Heading>
					<div className={styles.leadCopy}>{paragraphs('about')}</div>
				</section>

				<aside className={cx(styles.sheet, 'u-outline')} aria-labelledby="case-study-sheet">
					<h2 id="case-study-sheet" className={styles.eyebrow}>
						{t('sheet')}
					</h2>
					<CaseStudy project={project} showSections={false} />
				</aside>

				<section className={styles.highlights} aria-labelledby="case-study-highlights">
					<Text as="h2" id="case-study-highlights" weight="regular" tone="subtle" className={styles.label}>
						{t('highlights')}
					</Text>
					<ul className={styles.stats}>
						{entry.highlights.map((item) => (
							<li key={item.key} className={cx(styles.card, 'u-outline')}>
								<GradientTile hue={item.hue} shape="process" className={styles.tile}>
									<Text as="span" family="serif" size="5xl" weight="regular" leading="none" className={styles.value}>
										{item.value}
									</Text>
								</GradientTile>
								<p className={styles.cardLabel}>{tw(`${base}.highlights.${item.key}`)}</p>
							</li>
						))}
					</ul>
				</section>
			</div>

			{/* ── Challenge · Result: Process Card shells, long copy aligned to the start ── */}
			<div className={styles.story}>
				{entry.story.map((item) => (
					<article key={item.key} className={cx(styles.card, 'u-outline')} aria-labelledby={`case-study-${item.key}`}>
						<GradientTile hue={item.hue} shape="process" className={styles.tile} underlay={<Icon name={item.icon} className={styles.storyIcon} />} />
						<div className={styles.storyCopy}>
							<Heading level={2} id={`case-study-${item.key}`} size="2xl" family="serif" weight="regular" leading="none" className={styles.storyTitle}>
								{tw(`sections.${item.key}`)}
							</Heading>
							<div className={styles.storyBody}>{paragraphs(item.key)}</div>
						</div>
					</article>
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
