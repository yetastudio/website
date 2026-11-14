//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Chip, type ChipTone } from '@/components/ui/chip';
import { SectionHeader } from '@/components/ui/section-header';
import { Surface } from '@/components/ui/surface';
import type { IconName } from '@/components/ui/icon';
import type { WhySceneName } from '@/components/ui/why-scene/shared';
import { WhyNode, WhyPanel, WhyTour } from './tour';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import styles from './styles.module.css';

type Feature = {
	key: WhySceneName;
	icon: IconName;
	tone: ChipTone;
	side: 'left' | 'right';
	slot: string;
	/** The tour's order round the clusters: down the left, across, up the right. */
	step: number;
	/** Where the scene opens: into the free space above the top chips and below the bottom ones; a middle chip opens downward. */
	dir: 'up' | 'down';
	/** The chip edge the scene hangs from, chosen so it stays inside its column at 1440. */
	anchor: 'start' | 'end';
	/** The middle chip whose open scene lies over this one (it steps back meanwhile). */
	coveredBy?: WhySceneName;
};

/** The six floating chips (Figma 1487:2371 / 1487:2391), in reading order. */
const FEATURES: Feature[] = [
	{ key: 'insight', icon: 'spark', tone: 'orange', side: 'left', slot: 'a', step: 0, dir: 'up', anchor: 'end' },
	{ key: 'vision', icon: 'eye', tone: 'blue', side: 'right', slot: 'd', step: 5, dir: 'up', anchor: 'start' },
	{ key: 'together', icon: 'handshake', tone: 'yellow', side: 'left', slot: 'b', step: 1, dir: 'down', anchor: 'start' },
	{ key: 'pixel', icon: 'palette', tone: 'violet', side: 'right', slot: 'e', step: 4, dir: 'down', anchor: 'end' },
	{ key: 'luck', icon: 'luck', tone: 'green', side: 'left', slot: 'c', step: 2, dir: 'down', anchor: 'end', coveredBy: 'together' },
	{ key: 'defy', icon: 'swords', tone: 'red', side: 'right', slot: 'f', step: 3, dir: 'down', anchor: 'start', coveredBy: 'pixel' },
];
const FEATURE_KEYS = FEATURES.map((feature) => feature.key);
const ROW_ITEMS = FEATURES.map((feature) => ({ id: feature.key, scene: feature.key }));

/** The three chips of the mobile chip card (Figma 728:665), each with the scene that says it. */
const HIGHLIGHTS: Array<{ key: string; icon: IconName; tone: ChipTone; scene: WhySceneName }> = [
	{ key: 'goals', icon: 'target', tone: 'green', scene: 'goals' },
	{ key: 'ideas', icon: 'spark', tone: 'yellow', scene: 'vision' },
	{ key: 'collab', icon: 'handshake', tone: 'violet', scene: 'together' },
];
const HIGHLIGHT_KEYS = HIGHLIGHTS.map((item) => item.key);

/** The chip open in the poster: the tour's first stop in each layout. */
const POSTER = { features: 'insight', highlights: 'goals' };

/** Figma "¿Why Yeta Studio?" section, toured by Yeta's cursor (./tour). */
export function WhyYeta() {
	const t = useTranslations('whyYeta');
	const summary = useTranslations('summary');

	const cluster = (side: 'left' | 'right') => (
		<div className={cx(styles.cluster, styles[side])}>
			<ul className={styles.clusterInner} aria-label={t('featuresLabel')} data-why-layout="clusters">
				{FEATURES.filter((feature) => feature.side === side).map((feature) => (
					<WhyNode
						key={feature.key}
						id={feature.key}
						scene={feature.key}
						step={feature.step}
						variant="float"
						keys={FEATURE_KEYS}
						poster={POSTER.features}
						dir={feature.dir}
						anchor={feature.anchor}
						coveredBy={feature.coveredBy}
						className={cx(styles.floating, styles[`slot-${feature.slot}`])}
					>
						<Chip size="xl" fill="solid" icon={feature.icon} tone={feature.tone}>
							{t(`features.${feature.key}`)}
						</Chip>
					</WhyNode>
				))}
			</ul>
		</div>
	);

	return (
		<section id="why-yeta" className={styles.section} aria-labelledby="why-yeta-title">
			<WhyTour>
				{cluster('left')}

				<div className={styles.column}>
					<SectionHeader title={t('title')} titleId="why-yeta-title" eyebrow={t('chip')}>
						<p className={styles.p1Wide}>{t.rich('p1', richTags)}</p>
						{/* Figma's mobile frames differ by theme: dark keeps this copy, light opens with the "pixel-perfect" line. */}
						<p className={cx(styles.p1Mobile, 'u-only-dark')}>{t.rich('p1', richTags)}</p>
						<p className={cx(styles.p1Mobile, styles.p1MobileLight, 'u-only-light')}>{summary.rich('p1', richTags)}</p>
						<p>{t.rich('p2', richTags)}</p>
						<p>{t.rich('p3', richTags)}</p>
					</SectionHeader>

					{/* 768–1439px: the six features as a wrapped row (Figma has no frame for these widths), the hovered one's scene in a panel under it. */}
					<div className={styles.rowGroup}>
						<ul className={styles.row} aria-label={t('featuresLabel')} data-why-layout="row">
							{FEATURES.map((feature, index) => (
								<WhyNode
									key={feature.key}
									id={feature.key}
									scene={feature.key}
									step={index}
									variant="tab"
									keys={FEATURE_KEYS}
									poster={POSTER.features}
									className={styles[`tone-${feature.tone}`]}
								>
									<Chip size="lg" fill="solid" icon={feature.icon} tone={feature.tone}>
										{t(`features.${feature.key}`)}
									</Chip>
								</WhyNode>
							))}
						</ul>
						<WhyPanel items={ROW_ITEMS} poster={POSTER.features} />
					</div>

					{/* < 768px: Figma mobile chip card; the open chip shows its scene under it. */}
					<Surface
						as="ul"
						tone="canvas"
						bevel={false}
						className={cx(styles.card, 'u-outline')}
						aria-label={t('featuresLabel')}
						data-why-layout="card"
					>
						{HIGHLIGHTS.map((item, index) => (
							<WhyNode
								key={item.key}
								id={item.key}
								scene={item.scene}
								step={index}
								variant="fold"
								keys={HIGHLIGHT_KEYS}
								poster={POSTER.highlights}
							>
								<Chip size="lg" fill="solid" icon={item.icon} tone={item.tone}>
									{t(`highlights.${item.key}`)}
								</Chip>
							</WhyNode>
						))}
					</Surface>
				</div>

				{cluster('right')}
			</WhyTour>
		</section>
	);
}

export default WhyYeta;
