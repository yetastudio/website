//! React Core
import type { CSSProperties, ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, LogoMark } from '@/components/ui';
import { Reveal } from '@/components/ui/reveal';
import { revealLine } from '@/components/ui/reveal/line';
import { BOOKING_URL } from '../sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** The sparkle's five rays from Figma, centre ray first so they burst out from the middle. Each runs from the word outward. */
const RAYS = [
	'M37.9187 21.3677L33.9842 0.304628',
	'M51.9842 21.3677L58.476 9.253',
	'M22.9678 22.7444L15.4924 11.0427',
	'M66.5416 24.3046L73.1318 16.6411',
	'M8.01702 24.3046L1.13177 17.8802',
];

/** The strike-through scribble over "luck", drawn left to right. */
const SCRIBBLE =
	'M0.286011 9.26897L19.6689 16.6899L8.63649 9.26897L27.227 16.3887L7.17363 4.64436L46.8536 21.5296L10.2822 0.72957L45.7565 16.6899L28.6898 4.64436L52.4003 14.4313L37.7108 5.35418L64.286 11.2049';

/**
 * The Figma sparkle over "great", inline so it can move: the rays draw out from the word one after
 * another once the hero has revealed, then shine now and again while a sheen crosses the word.
 */
function Sparkle() {
	return (
		<span className={cx(styles.doodle, styles.sparkle)} aria-hidden="true" data-doodle>
			<svg viewBox="0 0 75 26" fill="none" className={styles.doodleSvg}>
				{RAYS.map((d, index) => (
					<path key={d} d={d} pathLength={1} strokeWidth={3.31797} className={styles.ray} style={{ '--ray': index } as CSSProperties} />
				))}
			</svg>
		</span>
	);
}

/**
 * The Figma strike over "luck", inline so it can be drawn like a pen crossing the word out: one
 * scribble, painted stroke by stroke from the first letter to the last. It stretches with the word
 * (longer translations) at a constant pen width, so it is revealed by a wipe rather than a dash:
 * a dash can't be measured on a non-scaling stroke and broke into pieces.
 */
function Strike() {
	return (
		<span className={cx(styles.doodle, styles.strike)} aria-hidden="true" data-doodle>
			<svg viewBox="0 0 65 23" fill="none" preserveAspectRatio="none" className={styles.doodleSvg}>
				<path d={SCRIBBLE} strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" className={styles.scribble} />
			</svg>
		</span>
	);
}

/**
 * Figma Hero: "Yeta [logo tile] Studio" wordmark, the slogan with its sparkle and
 * strike-through doodles, and the two-button group. The three enter with the
 * transitions.dev Texts reveal right after hydration; then the sparkle bursts and the
 * strike draws itself.
 */
export function Hero() {
	const t = useTranslations('hero');

	return (
		<Reveal as="section" trigger="mount" className={styles.hero} aria-labelledby="hero-title">
			<h1 id="hero-title" className={cx(styles.title, revealLine(1))}>
				<span className={styles.word}>Yeta</span>
				{/* 58.5 @390 → 96 @1920: tracks the wordmark size (Figma ratio 96 / 89.6). */}
				<LogoMark canvas="auto" size="calc(var(--text-display) * 1.0714)" alt="✹" />
				<span className={styles.word}>Studio</span>
			</h1>

			<p className={cx(styles.slogan, revealLine(2))}>
				{t.rich('slogan', {
					br: () => <br />,
					great: (chunks: ReactNode) => (
						<span className={styles.editorial}>
							<Sparkle />
							<span className={styles.shine}>{chunks}</span>
						</span>
					),
					luck: (chunks: ReactNode) => (
						<span className={cx(styles.editorial, styles.struck)}>
							{chunks}
							<Strike />
						</span>
					),
				})}
			</p>

			<div className={cx(styles.group, 'u-outline', revealLine(3))}>
				<Button href="#why-yeta" size="xl" fullWidth>
					{t('whyChoose')}
				</Button>
				<Button href={BOOKING_URL} size="xl" fullWidth>
					{t('letsBuild')}
				</Button>
			</div>
		</Reveal>
	);
}

export default Hero;
