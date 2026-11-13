/* eslint-disable @next/next/no-img-element -- decorative inline SVG artwork, no optimisation needed. */

//! React Core
import type { ReactNode } from 'react';

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

/** A hand-drawn mark from Figma, themed by swapping the light/dark export. */
function Doodle({ name, className }: { name: 'great-sparkle' | 'luck-strike'; className: string }) {
	return (
		<span className={cx(styles.doodle, className)} aria-hidden="true">
			<img src={`/landing/hero/${name}-light.svg`} alt="" className="u-only-light" draggable={false} />
			<img src={`/landing/hero/${name}-dark.svg`} alt="" className="u-only-dark" draggable={false} />
		</span>
	);
}

/**
 * Figma Hero: "Yeta [logo tile] Studio" wordmark, the slogan with its sparkle and
 * strike-through doodles, and the two-button group. The three enter with the
 * transitions.dev Texts reveal right after hydration.
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
							<Doodle name="great-sparkle" className={styles.sparkle} />
							{chunks}
						</span>
					),
					luck: (chunks: ReactNode) => (
						<span className={cx(styles.editorial, styles.struck)}>
							{chunks}
							<Doodle name="luck-strike" className={styles.strike} />
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
