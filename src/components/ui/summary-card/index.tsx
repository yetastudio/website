/* eslint-disable @next/next/no-img-element -- decorative scribbles exported from Figma. */

//! React Core
import { useId, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { LogoMark } from '@/components/ui/brand';
import { Chip } from '@/components/ui/chip';
import { Accent } from '@/components/ui/text';

//! Utils
import { cx } from '@/lib/cx';
import { richTags } from '@/lib/rich';

//! Styles
import styles from './styles.module.css';

type Scribble = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

/** Idle and active strokes, per site theme, stacked so hover can cross-fade them. */
function ScribbleArt({ name }: { name: Scribble }) {
	return (
		<span className={cx(styles.scribble, styles[name])} aria-hidden="true">
			<span className={styles.scribbleInner}>
				<img loading="lazy" decoding="async" src={`/landing/summary/scribble-${name}-light-idle.svg`} alt="" className={cx(styles.idle, 'u-only-light')} />
				<img loading="lazy" decoding="async" src={`/landing/summary/scribble-${name}-dark-idle.svg`} alt="" className={cx(styles.idle, 'u-only-dark')} />
				<img loading="lazy" decoding="async" src={`/landing/summary/scribble-${name}-light-active.svg`} alt="" className={cx(styles.active, 'u-only-light')} />
				<img loading="lazy" decoding="async" src={`/landing/summary/scribble-${name}-dark-active.svg`} alt="" className={cx(styles.active, 'u-only-dark')} />
			</span>
		</span>
	);
}

function SparkLines({ side }: { side: 'left' | 'right' }) {
	return (
		<span className={cx(styles.spark, styles[`spark-${side}`])} aria-hidden="true">
			<img loading="lazy" decoding="async" src="/landing/summary/spark-lines-light-idle.svg" alt="" className={cx(styles.idle, 'u-only-light')} />
			<img loading="lazy" decoding="async" src="/landing/summary/spark-lines-dark-idle.svg" alt="" className={cx(styles.idle, 'u-only-dark')} />
			<img loading="lazy" decoding="async" src={`/landing/summary/spark-lines-${side}-light-active.svg`} alt="" className={cx(styles.active, 'u-only-light')} />
			<img loading="lazy" decoding="async" src={`/landing/summary/spark-lines-${side}-dark-active.svg`} alt="" className={cx(styles.active, 'u-only-dark')} />
		</span>
	);
}

/**
 * Figma Summary card (786:762 / 786:805): "Yeta ✹ Studio in a nutshell". Hover (or focus
 * within) is the Figma Active variant: the scribbles turn metallic.
 */
export function SummaryCard({ className }: { className?: string }) {
	const t = useTranslations('summary');
	const titleId = useId();

	const motto = t.rich('motto', {
		serif: (chunks: ReactNode) => <span className={styles.mottoStrong}>{chunks}</span>,
		em: (chunks: ReactNode) => <Accent underline>{chunks}</Accent>,
	});

	return (
		<article className={cx(styles.card, className)} tabIndex={0} aria-labelledby={titleId}>
			<ScribbleArt name="top-left" />
			<ScribbleArt name="top-right" />
			<ScribbleArt name="bottom-right" />
			<ScribbleArt name="bottom-left" />

			<header className={styles.header}>
				<h3 id={titleId} className={styles.wordmark}>
					<span className={styles.wordmarkText}>Yeta</span>
					<LogoMark size={20} canvas="auto" alt="" />
					<span className={styles.wordmarkText}>Studio</span>
				</h3>
				<p className={styles.subtitle}>{t('subtitle')}</p>
			</header>

			<Chip size="sm">{t.rich('chip', { em: (chunks: ReactNode) => <Accent>{chunks}</Accent> })}</Chip>

			<p className={styles.paragraph}>{t.rich('p1', richTags)}</p>

			<p className={styles.motto}>
				<SparkLines side="left" />
				{motto}
				<SparkLines side="right" />
			</p>

			<p className={styles.paragraph}>{t.rich('p2', richTags)}</p>
		</article>
	);
}

export default SummaryCard;
