//! React Core
import type { ReactNode } from 'react';

//! Components
import { ShowcaseLayout, ShowcaseNav, ShowcaseSection } from '@/components/showcase';
import { Accent, Button, Chip, Heading, Text } from '@/components/ui';
import { LibraryShelf, ProposalSection, StoryMap } from './proposal';
import { BeforeAfterMockup } from './mockups/before-after';
import { BookingMockup } from './mockups/booking';
import { ChapterNavMockup } from './mockups/chapter-nav';
import { ClientWallMockup } from './mockups/client-wall';
import { HeroDemoMockup } from './mockups/hero-demo';
import { ProcessWalkthroughMockup } from './mockups/process-walkthrough';
import { ResultsMockup, type ResultFacts } from './mockups/results';
import { CraftMockup } from './mockups/library/craft';
import { HeroMockup } from './mockups/library/hero';
import { NavMockup } from './mockups/library/nav';
import { ProcessMockup } from './mockups/library/process';
import { ResultsLedgerMockup } from './mockups/library/results';
import { TestimonialsMockup } from './mockups/library/testimonials';
import { WhyMockup } from './mockups/library/why';
import { WorkMockup } from './mockups/library/work';

//! Data
import { LIBRARY, LIBRARY_COLLECTION, MOBBIN_COLLECTION, PROPOSALS, type ProposalId, type ShelfId } from './data';

//! Styles
import styles from './styles.module.css';

const shelfNumber = (index: number) => String(index + 1).padStart(2, '0');
const libraryCount = LIBRARY.reduce((total, shelf) => total + shelf.references.length, 0);

const navItems = [
	{ id: 'story-map', label: 'Story map', group: 'Overview' },
	...PROPOSALS.map((proposal) => ({
		id: proposal.id,
		label: `${proposal.number} ${proposal.title}`,
		group: 'Proposals',
	})),
	{ id: 'library', label: 'Overview', group: 'Section library' },
	...LIBRARY.map((shelf, index) => ({
		id: `library-${shelf.id}`,
		label: `${shelfNumber(index)} ${shelf.title}`,
		group: 'Section library',
	})),
	{ id: 'collection', label: 'Mobbin collections', group: 'References' },
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

	// One live mockup per library shelf: the best of its references, rebuilt in the Yeta look.
	const shelfMockups: Partial<Record<ShelfId, ReactNode>> = {
		nav: <NavMockup />,
		hero: <HeroMockup />,
		value: <WhyMockup />,
		services: <CraftMockup />,
		work: <WorkMockup />,
		process: <ProcessMockup />,
		stats: <ResultsLedgerMockup facts={facts} />,
		testimonials: <TestimonialsMockup />,
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
				id="library"
				eyebrow="Section library"
				title="Sections worth borrowing from"
				description={`${libraryCount} website sections from studios and design-led brands, one shelf per anchor in the order the landing reads. Each card says what to take for Yeta; the images live in the Mobbin collection.`}
			>
				<div>
					<Button href={LIBRARY_COLLECTION} variant="glass" size="lg" iconStart="book">
						Open “Yeta Studio · Section library”
					</Button>
				</div>
			</ShowcaseSection>

			{LIBRARY.map((shelf, index) => (
				<LibraryShelf key={shelf.id} shelf={shelf} number={shelfNumber(index)}>
					{shelfMockups[shelf.id]}
				</LibraryShelf>
			))}

			<ShowcaseSection
				id="collection"
				eyebrow="References"
				title="The Mobbin collections"
				description="Every reference on this page, saved in two private Mobbin collections. Only you and your teammates can open them; Mobbin images stay on Mobbin."
			>
				<div className={styles.collections}>
					<Button href={MOBBIN_COLLECTION} variant="glass" size="lg" iconStart="book">
						Open “Yeta Studio · Narrative inspo”
					</Button>
					<Button href={LIBRARY_COLLECTION} variant="glass" size="lg" iconStart="book">
						Open “Yeta Studio · Section library”
					</Button>
				</div>
			</ShowcaseSection>
		</ShowcaseLayout>
	);
}
