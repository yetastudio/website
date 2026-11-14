'use client';

//! React Core
import { memo, useEffect, useRef } from 'react';

//! Hooks
import { useAutoplay } from './use-autoplay';

//! Components
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import type { TileHue } from '@/components/ui/gradient-tile';

//! Styles
import styles from './mockups.module.css';

export type ResultFacts = {
	locales: number;
	themes: number;
	components: number;
};

const COUNT_DURATION = 900;

/**
 * Counts up to `value` once, the first time the row is on screen. `primed` holds it at 0
 * while it is still off screen, so the figure never drops in view; without motion it
 * simply shows the value.
 */
// Memoised: a pure part its parents redraw with the same props.
const CountUp = memo(function CountUp({ value, primed, start }: { value: number; primed: boolean; start: boolean }) {
	const figureRef = useRef<HTMLSpanElement>(null);

	// The count writes the figure straight into the span each frame, so the animation costs no React
	// render per frame (it used to set state ~55 times per counter).
	useEffect(() => {
		const figure = figureRef.current;
		if (!start || !figure) return;
		let frame = 0;
		const begin = performance.now();
		const tick = (now: number) => {
			const progress = Math.min(1, (now - begin) / COUNT_DURATION);
			// Ease out cubic: fast start, gentle landing on the real figure.
			figure.textContent = String(Math.round(value * (1 - (1 - progress) ** 3)));
			if (progress < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [start, value]);

	return (
		<>
			<span ref={figureRef} aria-hidden="true">
				{start || primed ? 0 : value}
			</span>
			<span className="u-visually-hidden">{value}</span>
		</>
	);
});

/**
 * Proposal 03: results set large in Editorial on neutral raised tiles, each marked by one hue dot. The figures are the
 * Yeta case study's own and are read from the code (locales, themes, registry), so the
 * mockup never shows a made-up number.
 */
export function ResultsMockup({ facts }: { facts: ResultFacts }) {
	const rootRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);

	const stats: Array<{
		key: string;
		value: number;
		label: string;
		hue: TileHue;
	}> = [
		{
			key: 'locales',
			value: facts.locales,
			label: 'languages from one codebase',
			hue: 'pink',
		},
		{
			key: 'themes',
			value: facts.themes,
			label: 'themes from one set of tokens',
			hue: 'violet',
		},
		{
			key: 'components',
			value: facts.components,
			label: 'components in the system',
			hue: 'orange',
		},
	];

	return (
		<div ref={rootRef} className={styles.results}>
			<div className={styles.resultsHead}>
				<Text as="span" size="xs" tone="subtle">
					Yeta Studio · in numbers
				</Text>
				<Text as="p" size="xl" family="serif" weight="regular" leading="tight" tone="strong" balance>
					One system, built to prove the <em>craft</em>.
				</Text>
			</div>
			<ul className={styles.stats}>
				{stats.map((stat) => (
					<li key={stat.key} className={styles.statItem}>
						<Surface tone="raised" radius="xl" bevel className={styles.statTile}>
							<span className={styles.stat}>
								<span className={styles.statDot} data-hue={stat.hue} aria-hidden="true" />
								<Text as="span" family="serif" weight="regular" leading="none" className={styles.statValue}>
									<CountUp value={stat.value} primed={autoplay.enabled} start={autoplay.seen && autoplay.enabled} />
								</Text>
								<Text as="span" size="xs" leading="snug" align="center" balance>
									{stat.label}
								</Text>
							</span>
						</Surface>
					</li>
				))}
			</ul>
		</div>
	);
}

export default ResultsMockup;
