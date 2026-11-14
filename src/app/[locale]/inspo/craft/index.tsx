//! React Core
import type { ReactNode } from 'react';

//! Components
import { ShowcaseSection, ThemePair } from '@/components/showcase';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { ReferenceCard } from '../proposal';
import { CraftBentoMockup } from './bento';
import { CraftTilesMockup } from './tiles';
import { CraftWalkthroughMockup } from './walkthrough';

//! Data
import { ALTERNATIVES, CRAFT_REFERENCES, type AlternativeId } from './data';

//! Styles
import inspo from '../styles.module.css';
import styles from './styles.module.css';

/**
 * /inspo, "Our Craft, illustrated": the Our Craft beats drawn as Stageshow scenes in the Yeta
 * look, three ways, each live on the light and the dark canvas, with the Mobbin references
 * behind them. It sits after the showcase, on the same content column.
 */
export function CraftIllustrated() {
	const mockups: Record<AlternativeId, ReactNode> = {
		tiles: <CraftTilesMockup />,
		walkthrough: <CraftWalkthroughMockup />,
		bento: <CraftBentoMockup />,
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.column}>
				<ShowcaseSection
					id="craft-illustrated"
					eyebrow="Our Craft · Stageshow"
					title="Our Craft, illustrated"
					description="The six beats of Our Craft, from the idea to its impact, shown happening instead of named on a colour wash. Three ways to tell it, each drawn as Stageshow scenes in the Yeta look: neutral surfaces, the beat’s hue as one small mark, the classic arrow as the cursor."
				>
					<div className={inspo.introMeta}>
						<Chip size="xs" icon="pin">
							Landing #our-craft
						</Chip>
						<Chip size="xs">{`${ALTERNATIVES.length} alternatives · light + dark`}</Chip>
					</div>

					{ALTERNATIVES.map((alternative) => (
						<div key={alternative.id} id={`craft-${alternative.id}`} className={styles.alternative}>
							<div className={styles.altHead}>
								<Text as="h3" size="2xl" family="serif" weight="regular" leading="tight" tone="strong">
									<span className={styles.letter}>{alternative.letter}</span> {alternative.title}
								</Text>
								<dl className={styles.facts}>
									<div className={styles.fact}>
										<Text as="dt" size="xs" tone="faint">
											Adds
										</Text>
										<Text as="dd" size="sm" leading="relaxed">
											{alternative.adds}
										</Text>
									</div>
									<div className={styles.fact}>
										<Text as="dt" size="xs" tone="faint">
											Trade-off
										</Text>
										<Text as="dd" size="sm" tone="subtle" leading="relaxed">
											{alternative.tradeoff}
										</Text>
									</div>
									<div className={styles.fact}>
										<Text as="dt" size="xs" tone="faint">
											After
										</Text>
										<Text as="dd" size="sm" tone="subtle" leading="relaxed">
											{alternative.refs}
										</Text>
									</div>
								</dl>
							</div>
							<ThemePair layout="column">{mockups[alternative.id]}</ThemePair>
						</div>
					))}

					<div className={inspo.references}>
						<Text as="h3" size="sm" tone="subtle">
							References on Mobbin
						</Text>
						<ul className={inspo.referenceGrid}>
							{CRAFT_REFERENCES.map((reference) => (
								<ReferenceCard key={reference.id} reference={reference} />
							))}
						</ul>
					</div>
				</ShowcaseSection>
			</div>
		</div>
	);
}

export default CraftIllustrated;
