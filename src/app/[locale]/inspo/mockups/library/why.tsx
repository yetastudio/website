//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Icon, Text, type IconName, type TileHue } from '@/components/ui';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

const REASONS = ['insight', 'together', 'luck', 'vision', 'pixel', 'defy'] as const;

const HIGHLIGHTS: ReadonlyArray<{ key: string; icon: IconName; hue: TileHue }> = [
	{ key: 'goals', icon: 'target', hue: 'pink' },
	{ key: 'ideas', icon: 'spark', hue: 'yellow' },
	{ key: 'collab', icon: 'handshake', hue: 'blue' },
];

/**
 * Library 03, Why Yeta. A serif claim over six numbered reasons in hairline-ruled columns
 * (Metalab, Studio Freight): short claims read as a ledger, not a grid of icons. Under them, the
 * three highlights as wash tiles with one glyph each (FLORA), the only colour in the section.
 */
export function WhyMockup() {
	const t = useTranslations('whyYeta');
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.why)}>
				<Text as="span" size="xs" tone="subtle">
					{t('featuresLabel')}
				</Text>
				<Text as="h3" size="4xl" family="serif" weight="regular" leading="tight" tone="strong" className={styles.whyClaim}>
					{t.rich('p3', { em: (chunks) => <Accent>{chunks}</Accent> })}
				</Text>
				<ol className={styles.whyReasons}>
					{REASONS.map((reason, index) => (
						<li key={reason} className={styles.whyReason}>
							<Text as="span" size="sm" family="serif" italic tone="faint" className={styles.numeral}>
								{String(index + 1).padStart(2, '0')}
							</Text>
							<Text as="span" size="lg" tone="strong" leading="snug">
								{t(`features.${reason}`)}
							</Text>
						</li>
					))}
				</ol>
				<ul className={styles.whyTiles}>
					{HIGHLIGHTS.map((highlight) => (
						<li key={highlight.key} className={cx(styles.whyTile, styles.hued, 'scheme-light')} data-hue={highlight.hue}>
							<span className={styles.whyGlyph}>
								<Icon name={highlight.icon} size="md" />
							</span>
							<Text as="span" size="lg" weight="medium" tone="strong" leading="snug">
								{t(`highlights.${highlight.key}`)}
							</Text>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default WhyMockup;
