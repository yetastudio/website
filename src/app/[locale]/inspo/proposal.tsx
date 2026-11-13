//! React Core
import type { ReactNode } from 'react';

//! Components
import { ShowcaseSection, ThemePair } from '@/components/showcase';
import { Chip, Link, Surface, Text } from '@/components/ui';

//! Data
import { PROPOSALS, STORY_MAP, mobbinUrl, type Proposal, type Reference, type Shelf } from './data';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** One Mobbin reference: app, pattern, why it fits and the link. No image: the visuals on the page are our own. */
export function ReferenceCard({ reference, showKind = true }: { reference: Reference; showKind?: boolean }) {
	return (
		<Surface as="li" tone="tint" radius="xl" padding="md" bevel className={styles.reference}>
			<div className={styles.referenceHead}>
				<Text as="span" size="md" weight="medium" tone="strong">
					{reference.app}
				</Text>
				{showKind && <Chip size="xs">{reference.kind === 'section' ? 'Web section' : 'Web screen'}</Chip>}
			</div>
			<Text size="sm" family="serif" italic tone="strong" leading="snug">
				{reference.pattern}
			</Text>
			<Text size="sm" tone="subtle" leading="normal" className={styles.referenceWhy}>
				{reference.why}
			</Text>
			<Link href={mobbinUrl(reference)} className={styles.referenceLink}>
				{`Open ${reference.app} on Mobbin`}
			</Link>
		</Surface>
	);
}

function BriefItem({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className={styles.briefItem}>
			<Text as="span" size="xs" tone="faint">
				{label}
			</Text>
			{children}
		</div>
	);
}

/** A proposal: what it adds, where it goes, a live mockup on both canvases, and its references. */
export function ProposalSection({ proposal, children }: { proposal: Proposal; children: ReactNode }) {
	return (
		<ShowcaseSection id={proposal.id} eyebrow={`Proposal ${proposal.number}`} title={proposal.title} description={proposal.summary}>
			<div className={styles.brief}>
				<BriefItem label="What it adds to the story">
					<Text size="sm" leading="relaxed">
						{proposal.adds}
					</Text>
				</BriefItem>
				<BriefItem label="Where it goes">
					<ul className={styles.placements}>
						{proposal.placements.map((placement) => (
							<li key={`${placement.page}-${placement.where}`} className={styles.placement}>
								<Chip size="xs" icon={placement.status === 'new' ? 'plus' : 'enhance'} tone={placement.status === 'new' ? 'violet' : 'neutral'}>
									{placement.status === 'new' ? 'New' : 'Upgrade'}
								</Chip>
								<Text as="span" size="sm" leading="snug">
									<strong className={styles.placementPage}>{placement.page}</strong> {placement.where}
								</Text>
							</li>
						))}
					</ul>
				</BriefItem>
				<BriefItem label="How the mockup is built">
					<Text size="sm" tone="subtle" leading="relaxed">
						{proposal.mockup}
					</Text>
				</BriefItem>
			</div>

			<ThemePair layout="column">{children}</ThemePair>

			<div className={styles.references}>
				<Text as="h3" size="sm" tone="subtle">
					References on Mobbin
				</Text>
				<ul className={styles.referenceGrid}>
					{proposal.references.map((reference) => (
						<ReferenceCard key={reference.id} reference={reference} />
					))}
				</ul>
			</div>
		</ShowcaseSection>
	);
}

/** One shelf of the section library: where it lands, what to look for, and its references. */
export function LibraryShelf({ shelf, number }: { shelf: Shelf; number: string }) {
	return (
		<ShowcaseSection id={`library-${shelf.id}`} eyebrow={`Section library · ${number}`} title={shelf.title} description={shelf.lookFor}>
			<div className={styles.introMeta}>
				<Chip size="xs" icon="pin">
					{shelf.lands}
				</Chip>
				<Chip size="xs">{`${shelf.references.length} references`}</Chip>
			</div>
			<ul className={styles.referenceGrid}>
				{shelf.references.map((reference) => (
					<ReferenceCard key={reference.id} reference={reference} showKind={false} />
				))}
			</ul>
		</ShowcaseSection>
	);
}

/** Both stories as they read today, with each proposal slotted in where it would land. */
export function StoryMap() {
	const numberOf = (id: string) => PROPOSALS.find((proposal) => proposal.id === id)?.number;
	return (
		<ShowcaseSection
			id="story-map"
			eyebrow="Overview"
			title="The story, beat by beat"
			description="The landing and the case study in reading order. Dashed beats do not exist yet; numbered ones carry a proposal below."
		>
			<div className={styles.map}>
				{STORY_MAP.map((story) => (
					<Surface key={story.page} tone="raised" radius="2xl" padding="md" bevel className={styles.mapColumn}>
						<Text as="h3" size="2xl" family="serif" weight="regular" leading="tight" tone="strong">
							{story.page}
						</Text>
						<ol className={styles.beats}>
							{story.beats.map((beat) => {
								const number = beat.proposal ? numberOf(beat.proposal) : undefined;
								const content = (
									<>
										<Text as="span" size="sm" tone={beat.proposal ? 'strong' : 'subtle'} leading="snug">
											{beat.label}
										</Text>
										{number && (
											<Text as="span" size="xs" family="serif" italic tone="subtle" className={styles.beatNumber}>
												{number}
											</Text>
										)}
									</>
								);
								return (
									<li key={beat.label} className={cx(styles.beat, beat.isNew && styles.beatNew, beat.proposal && styles.beatProposal)}>
										{beat.proposal ? (
											<a href={`#${beat.proposal}`} className={styles.beatLink}>
												{content}
											</a>
										) : (
											<span className={styles.beatLink}>{content}</span>
										)}
									</li>
								);
							})}
						</ol>
					</Surface>
				))}
			</div>
		</ShowcaseSection>
	);
}
