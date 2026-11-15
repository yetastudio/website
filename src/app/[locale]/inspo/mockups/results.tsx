'use client';

//! React Core
import { memo, useEffect, useRef, type RefObject } from 'react';

//! Hooks
import { useReducedMotion } from './use-autoplay';

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
 * A figure that counts up to `value` (see useCountUp). `primed` holds it at 0 until the count
 * starts, so the figure never drops in view; without motion it simply shows the value.
 */
// Memoised: a pure part its parents redraw with the same props.
const CountUp = memo(function CountUp({ value, primed }: { value: number; primed: boolean }) {
	return (
		<>
			<span data-count={value} aria-hidden="true">
				{primed ? 0 : value}
			</span>
			<span className="u-visually-hidden">{value}</span>
		</>
	);
});

/**
 * Counts every figure in the root up to its value once, the first time the root is on screen. The
 * count writes the figures straight into their spans each frame, so neither starting it nor running
 * it renders anything.
 */
function useCountUp(ref: RefObject<HTMLElement | null>, enabled: boolean) {
	useEffect(() => {
		const root = ref.current;
		if (!root || !enabled) return;
		let frame = 0;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				const figures = [...root.querySelectorAll<HTMLElement>('[data-count]')];
				const begin = performance.now();
				const tick = (now: number) => {
					const progress = Math.min(1, (now - begin) / COUNT_DURATION);
					// Ease out cubic: fast start, gentle landing on the real figure.
					const eased = 1 - (1 - progress) ** 3;
					for (const figure of figures) figure.textContent = String(Math.round(Number(figure.dataset.count) * eased));
					if (progress < 1) frame = requestAnimationFrame(tick);
				};
				frame = requestAnimationFrame(tick);
			},
			{ threshold: 0.4 },
		);
		observer.observe(root);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [ref, enabled]);
}

/**
 * Proposal 03: results set large in Editorial on neutral raised tiles, each marked by one hue dot. The figures are the
 * Yeta case study's own and are read from the code (locales, themes, registry), so the
 * mockup never shows a made-up number.
 */
export function ResultsMockup({ facts }: { facts: ResultFacts }) {
	const rootRef = useRef<HTMLDivElement>(null);
	const enabled = !useReducedMotion();
	useCountUp(rootRef, enabled);

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
									<CountUp value={stat.value} primed={enabled} />
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
