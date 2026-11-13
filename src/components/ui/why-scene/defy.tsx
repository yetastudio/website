import { Button, Chart, Count, Stage, type Act } from '@stageshow';
import { TrendingUp } from 'lucide-react';

import { sceneCursor } from './cursor';
import { ENTRY_MS, SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './defy.module.css';

// Building brands that defy luck: growth that keeps climbing, not one lucky
// spike. The brand's reach draws in as a steady line, quarter after quarter,
// and its multiple rolls up with it. The line is ink; only its end dot takes
// the chip's hue. Nothing grows on its own: Yeta's cursor presses See growth,
// the line rises from that press, and the cursor settles on its newest
// quarter. The poster is the drawn line and the multiple.
//
// Real strings: the metric, See growth.

type S = { show: boolean; value: number };

const INITIAL: S = { show: false, value: 1 };
const POSTER: S = { show: true, value: 3.2 };

/** Steady, compounding growth: every step up, none of them a jump. */
const REACH = [1, 1.18, 1.36, 1.6, 1.82, 2.1, 2.4, 2.78, 3.2];

async function script(a: Act<S>) {
	await a.wait(ENTRY_MS);
	a.mark('boost');
	await a.click('boost');
	a.mark('draw');
	await a.set({ show: true, value: 3.2 });
	await a.wait(1150);
	await a.move({ at: 'chart', x: 0.99, y: 0.08 });
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
						<span className={styles.boost} data-target="boost">
							<Button size="small" variant="secondary" icon={<TrendingUp size={12} strokeWidth={2} aria-hidden />}>
								{copy.boost}
							</Button>
						</span>
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
