//! React Core
import type { ReactNode } from 'react';

//! Components
import { ShowcaseLayout, ShowcaseNav, ShowcaseSection } from '@/components/showcase';
import { Accent, Button, Chip, Heading, Text } from '@/components/ui';
import { ProposalSection, StoryMap } from './proposal';
import { BeforeAfterMockup } from './mockups/before-after';
import { BookingMockup } from './mockups/booking';
import { ChapterNavMockup } from './mockups/chapter-nav';
import { ClientWallMockup } from './mockups/client-wall';
import { HeroDemoMockup } from './mockups/hero-demo';
import { ProcessWalkthroughMockup } from './mockups/process-walkthrough';
import { ResultsMockup, type ResultFacts } from './mockups/results';

//! Data
import { MOBBIN_COLLECTION, PROPOSALS, type ProposalId } from './data';

//! Styles
import styles from './styles.module.css';

const navItems = [
	{ id: 'story-map', label: 'Story map', group: 'Overview' },
	...PROPOSALS.map((proposal) => ({
		id: proposal.id,
		label: `${proposal.number} ${proposal.title}`,
		group: 'Proposals',
	})),
	{ id: 'collection', label: 'Mobbin collection', group: 'References' },
];

export default function InspoShowcase({ facts }: { facts: ResultFacts }) {
	const mockups: Record<ProposalId, ReactNode> = {
		'hero-demo': <HeroDemoMockup />,
		'process-walkthrough': <ProcessWalkthroughMockup />,
		results: <ResultsMockup facts={facts} />,
		'before-after': <BeforeAfterMockup />,
		'client-wall': <ClientWallMockup />,
		'chapter-nav': <ChapterNavMockup />,
		booking: <BookingMockup />,
	};

	return (
		<ShowcaseLayout nav={<ShowcaseNav label="Inspo sections" items={navItems} />}>
			<header className={styles.intro}>
				<div className={styles.introMeta}>
					<Chip>Inspo</Chip>
					<Chip>Not indexed</Chip>
					<Chip>{`${PROPOSALS.length} proposals · light + dark`}</Chip>
				</div>
				<Heading level={1} size="5xl" tone="display">
					Where the story goes next
				</Heading>
				<Text size="lg" tone="subtle">
					Sections, components and visual beats that would let the landing and the case study <Accent>show</Accent> what they now tell. Every mockup
					is live, built from the design system or a Stageshow scene in the Yeta look, and drawn on both canvases.
				</Text>
			</header>

			<StoryMap />

			{PROPOSALS.map((proposal) => (
				<ProposalSection key={proposal.id} proposal={proposal}>
					{mockups[proposal.id]}
				</ProposalSection>
			))}

			<ShowcaseSection
				id="collection"
				eyebrow="References"
				title="The Mobbin collection"
				description="Every reference above, saved in one private Mobbin collection. Only you and your teammates can open it; Mobbin images stay on Mobbin."
			>
				<div>
					<Button href={MOBBIN_COLLECTION} variant="glass" size="lg" iconEnd="external-link">
						Open “Yeta Studio · Narrative inspo”
					</Button>
				</div>
			</ShowcaseSection>
		</ShowcaseLayout>
	);
}
