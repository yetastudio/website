//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Chip, SectionHeader, Surface, type ChipTone, type IconName } from '@/components/ui';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import styles from './styles.module.css';

type Feature = { key: string; icon: IconName; tone: ChipTone; side: 'left' | 'right'; slot: string };

/** The six floating chips (Figma 1487:2371 / 1487:2391), in reading order. */
const FEATURES: Feature[] = [
	{ key: 'insight', icon: 'spark', tone: 'orange', side: 'left', slot: 'a' },
	{ key: 'vision', icon: 'eye', tone: 'blue', side: 'right', slot: 'd' },
	{ key: 'together', icon: 'handshake', tone: 'yellow', side: 'left', slot: 'b' },
	{ key: 'pixel', icon: 'palette', tone: 'violet', side: 'right', slot: 'e' },
	{ key: 'luck', icon: 'luck', tone: 'green', side: 'left', slot: 'c' },
	{ key: 'defy', icon: 'swords', tone: 'red', side: 'right', slot: 'f' },
];

/** The three chips of the mobile chip card (Figma 728:665). */
const HIGHLIGHTS: Array<{ key: string; icon: IconName; tone: ChipTone }> = [
	{ key: 'goals', icon: 'target', tone: 'green' },
	{ key: 'ideas', icon: 'spark', tone: 'yellow' },
	{ key: 'collab', icon: 'handshake', tone: 'violet' },
];

/** Figma "¿Why Yeta Studio?" section. */
export function WhyYeta() {
	const t = useTranslations('whyYeta');
	const summary = useTranslations('summary');

	const cluster = (side: 'left' | 'right') => (
		<div className={cx(styles.cluster, styles[side])}>
			<ul className={styles.clusterInner} aria-label={t('featuresLabel')}>
				{FEATURES.filter((feature) => feature.side === side).map((feature) => (
					<li key={feature.key} className={cx(styles.floating, styles[`slot-${feature.slot}`])}>
						<Chip size="xl" fill="solid" icon={feature.icon} tone={feature.tone}>
							{t(`features.${feature.key}`)}
						</Chip>
					</li>
				))}
			</ul>
		</div>
	);

	return (
		<section id="why-yeta" className={styles.section} aria-labelledby="why-yeta-title">
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

				{/* 768–1439px: the six features as a wrapped row (Figma has no frame for these widths). */}
				<ul className={styles.row} aria-label={t('featuresLabel')}>
					{FEATURES.map((feature) => (
						<li key={feature.key}>
							<Chip size="lg" fill="solid" icon={feature.icon} tone={feature.tone}>
								{t(`features.${feature.key}`)}
							</Chip>
						</li>
					))}
				</ul>

				{/* < 768px: Figma mobile chip card. */}
				<Surface as="ul" tone="canvas" bevel={false} className={cx(styles.card, 'u-outline')} aria-label={t('featuresLabel')}>
					{HIGHLIGHTS.map((item) => (
						<li key={item.key}>
							<Chip size="lg" fill="solid" icon={item.icon} tone={item.tone}>
								{t(`highlights.${item.key}`)}
							</Chip>
						</li>
					))}
				</Surface>
			</div>

			{cluster('right')}
		</section>
	);
}

export default WhyYeta;
