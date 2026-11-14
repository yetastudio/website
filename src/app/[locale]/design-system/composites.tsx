'use client';

//! React Core
import { useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Cell, ShowcaseSection, SpecTable, Specimen, ThemePair } from '@/components/showcase';
import { CardStack } from '@/components/ui/card-stack';
import { Carousel } from '@/components/ui/carousel';
import { CaseStudy, CaseStudyDialog, ProjectCard, type Project } from '@/components/ui/project-card';
import { CraftCard } from '@/components/ui/craft-card';
import { GradientTile, type TileHue } from '@/components/ui/gradient-tile';
import { Icon } from '@/components/ui/icon';
import { ProcessCard } from '@/components/ui/process-card';
import { SectionHeader } from '@/components/ui/section-header';
import { SummaryCard } from '@/components/ui/summary-card';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { CRAFT, PROCESS, PROJECT_TOOLS, SHOTS, TESTIMONIALS } from '@/components/layout/content';

//! Utils
import { richTags } from '@/lib/rich';

//! Styles
import styles from './styles.module.css';

const HUES: TileHue[] = ['pink', 'orange', 'yellow', 'green', 'blue', 'violet'];

/** Figma composite components (cards, carousels, section header). */
export function Composites() {
	const craft = useTranslations('ourCraft');
	const process = useTranslations('ourProcess');
	const testimonials = useTranslations('testimonials');
	const work = useTranslations('ourWork');
	const [active, setActive] = useState<Project | null>(null);

	const project: Project = {
		name: work('projects.yeta.name'),
		year: work('projects.yeta.year'),
		country: work('projects.yeta.country'),
		industry: work('projects.yeta.industry'),
		services: work('projects.yeta.services'),
		url: work('projects.yeta.url'),
		about: work('projects.yeta.about'),
		challenge: work('projects.yeta.challenge'),
		result: work('projects.yeta.result'),
		tools: PROJECT_TOOLS,
		shots: SHOTS.map((shot, i) => ({ ...shot, alt: `Yeta Studio, screen ${i + 1}` })),
	};

	const craftCard = (index: number, layout: 'row' | 'stacked') => {
		const item = CRAFT[index];
		return (
			<CraftCard
				layout={layout}
				icon={item.icon}
				hue={item.hue}
				title={craft(`cards.${item.key}.title`)}
				subtitle={craft(`cards.${item.key}.subtitle`)}
				description={craft(`cards.${item.key}.description`)}
			/>
		);
	};

	const testimonial = (index: number, size: 'desktop' | 'mobile') => {
		const item = TESTIMONIALS[index];
		return (
			<TestimonialCard
				size={size}
				hue={item.hue}
				avatar={item.avatar}
				quote={testimonials(`items.${item.key}.quote`)}
				name={testimonials(`items.${item.key}.name`)}
				role={testimonials(`items.${item.key}.role`)}
				company={testimonials(`items.${item.key}.company`)}
			/>
		);
	};

	return (
		<>
			<ShowcaseSection
				id="section-header"
				eyebrow="Patterns"
				title="Section header"
				description="Title (Funnel Display Bold 48 / 32 on mobile), the Small ×1.2 chip 20px below, and the 20/32 lead copy with editorial accents."
			>
				<ThemePair>
					<SectionHeader title={process('title')} eyebrow={process('chip')}>
						<p>{process.rich('intro', richTags)}</p>
						<p>{process.rich('kickoff', richTags)}</p>
					</SectionHeader>
				</ThemePair>
			</ShowcaseSection>

			<ShowcaseSection
				id="gradient-tile"
				eyebrow="Patterns"
				title="Gradient tile"
				description="The wash behind Craft, Process and Testimonial cards: blurred ellipses exported from Figma, blended with hard-light. It is the inverse surface, pastel on the dark site and deep on the light one."
			>
				<ThemePair layout="grid" align="start">
					{HUES.map((hue) => (
						<Cell key={hue} label={hue}>
							<GradientTile hue={hue} shape="craft" className={styles.tileSample} underlay={<Icon name="spark" size="xl" />} />
						</Cell>
					))}
				</ThemePair>
			</ShowcaseSection>

			<ShowcaseSection id="craft-card" eyebrow="Patterns" title="Craft card" description="Figma Craft Card: Size=Desktop (row, 470×185) and Size=Mobile (stacked, 275 wide).">
				<Specimen title="Size=Desktop">
					<ThemePair layout="column">{craftCard(0, 'row')}</ThemePair>
				</Specimen>
				<Specimen title="Size=Mobile">
					<ThemePair>{craftCard(2, 'stacked')}</ThemePair>
				</Specimen>
				<Specimen title="Carousel (mobile track)" note="Inspo: dots added; Figma draws only the resting track.">
					<ThemePair layout="column" align="start">
						<div className={styles.narrow}>
							<Carousel label="Craft cards" itemLabel="card">
								{CRAFT.map((_, index) => (
									<div key={index}>{craftCard(index, 'stacked')}</div>
								))}
							</Carousel>
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection id="process-card" eyebrow="Patterns" title="Process card" description="Figma Process Card, Size=Large (358 wide). One per step, colour-coded in palette order.">
				<ThemePair>
					{PROCESS.slice(0, 2).map((item, index) => (
						<ProcessCard
							key={item.key}
							step={index + 1}
							icon={item.icon}
							hue={item.hue}
							title={process(`steps.${item.key}.title`)}
							description={process(`steps.${item.key}.description`)}
						/>
					))}
				</ThemePair>
			</ShowcaseSection>

			<ShowcaseSection
				id="testimonial-card"
				eyebrow="Patterns"
				title="Testimonial card"
				description="Figma Testimonial Card (Desktop 376×304, Mobile 276×264) and the stacked mobile carousel, now swipeable with arrows and dots."
			>
				<Specimen title="Size=Desktop">
					<ThemePair>{testimonial(1, 'desktop')}</ThemePair>
				</Specimen>
				<Specimen title="Stacked carousel (fan)">
					<ThemePair>
						<CardStack label="Testimonials" itemLabel="testimonial" variant="fan" initialIndex={1}>
							{TESTIMONIALS.map((_, index) => (
								<div key={index}>{testimonial(index, 'mobile')}</div>
							))}
						</CardStack>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="project-card"
				eyebrow="Patterns"
				title="Project overview card"
				description="Status=Idle at both sizes; See more opens Status=Active (the case study) in a dialog or bottom sheet. Desktop cards cycle through the image strip with the dots."
			>
				<Specimen title="Status=Idle · Size=Desktop">
					<ThemePair>
						<ProjectCard project={project} size="desktop" onOpen={() => setActive(project)} />
					</ThemePair>
				</Specimen>
				<Specimen title="Status=Idle · Size=Mobile, stacked deck">
					<ThemePair>
						<CardStack label="Projects" itemLabel="project" variant="deck">
							{[0, 1, 2].map((i) => (
								<ProjectCard key={i} project={project} size="mobile" onOpen={() => setActive(project)} />
							))}
						</CardStack>
					</ThemePair>
				</Specimen>
				<Specimen title="Status=Active (case study content)">
					<ThemePair align="start">
						<div className={styles.narrow}>
							<CaseStudy project={project} />
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="summary-card"
				eyebrow="Patterns"
				title="Summary card"
				description="“Yeta ✹ Studio in a nutshell”. Hover or focus is the Figma Active variant: the scribbles turn metallic."
			>
				<ThemePair>
					<SummaryCard />
				</ThemePair>
				<CaseStudyDialog project={active} onClose={() => setActive(null)} />
				<SpecTable
					columns={['Component', 'Figma node', 'Variants in code']}
					rows={[
						['Craft card', '1472:4250', 'layout: row · stacked · responsive'],
						['Process card', '1204:1323', 'Size=Large (Medium not used by the site)'],
						['Testimonial card', '1213:1430', 'size: desktop · mobile'],
						['Testimonial cards carousel', '1231:1787', 'CardStack variant="fan"'],
						['Project overview card', '987:1594', 'size: desktop · mobile; Active → CaseStudy in Dialog'],
						['Project overview cards carousel', '1010:2036', 'CardStack variant="deck"'],
						['Summary', '786:762 / 786:805', 'Idle; Active on hover/focus'],
					]}
				/>
			</ShowcaseSection>
		</>
	);
}
