import { Bar, Chart, Count, Stage, type Act } from '@stageshow';

import { sceneCursor } from './cursor';
import { ENTRY_MS, SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './defy.module.css';

// Building brands that defy luck: growth that keeps climbing, not one lucky
// spike. The brand's reach draws in as a steady line, quarter after quarter,
// and its multiple rolls up with it. The line is ink; only its end dot takes
// the chip's hue. Yeta's cursor rides the line as it draws, quarter by quarter,
// and rests on its end. The poster is the drawn line and the multiple.
//
// Real strings: the metric.

type S = { show: boolean; value: number };

const INITIAL: S = { show: false, value: 1 };
const POSTER: S = { show: true, value: 3.2 };

/** Steady, compounding growth: every step up, none of them a jump. */
const REACH = [1, 1.18, 1.36, 1.6, 1.82, 2.1, 2.4, 2.78, 3.2];

async function script(a: Act<S>) {
	await a.wait(ENTRY_MS);
	await a.move({ at: 'chart', x: 0.02, y: 0.94 });
	a.mark('draw');
	await a.set({ show: true });
	await a.set({ value: 3.2 });
	// Along the reach, left to right: the hand follows the steady climb the line draws.
	const chart = a.rect('chart');
	await a.move(
		{ at: 'chart', x: 0.99, y: 0.06 },
		{
			duration: 1100,
			path: (t) => {
				const at = t * (REACH.length - 1);
				const i = Math.min(REACH.length - 2, Math.floor(at));
				const v = REACH[i] + (REACH[i + 1] - REACH[i]) * (at - i);
				return { x: chart.x + chart.width * (0.02 + 0.97 * t), y: chart.y + chart.height * (1 - v / 3.4) };
			},
		},
	);
	await a.wait(300);
}

const multiple = (n: number) => `${n.toFixed(1)}×`;

export function DefyScene({ copy, playing }: { copy: WhyTourCopy['defy']; playing: boolean }) {
	return (
		<Stage<S>
			width={SCENE_WIDTH}
			height={SCENE_HEIGHT}
			initial={INITIAL}
			poster={POSTER}
			script={playing ? script : undefined}
			cursor={playing ? sceneCursor : undefined}
			play="once"
		>
			{(s) => (
				<div className={look.panel}>
					<div className={styles.head}>
						<span className={look.label}>{copy.metric}</span>
						<Bar w={36} h={5} tone={2} />
					</div>
					<div className={styles.value}>
						<Count value={s.value} format={multiple} duration={900} />
					</div>
					<span className={styles.chartTarget} data-target="chart">
						<Chart data={REACH} width={240} height={52} max={3.4} show={s.show} className={styles.chart} />
					</span>
				</div>
			)}
		</Stage>
	);
}
