import { Avatar, Button, Count, Stage, Text, type Act } from '@stageshow';
import { TrendingUp } from 'lucide-react';

import { sceneCursor } from './cursor';
import { ENTRY_MS, SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './insight.module.css';

// From insight to impact: what a user said becomes what the brand gains, in
// three readable beats. The insight: a shopper's quote, "I can't find where to
// buy", over the product card it is about, its Buy link small and faint. The
// change: Yeta's cursor picks that link and it becomes the card's primary
// button. The impact: sales arrive beside it and roll up. The poster is the
// card with its clear button and the result.
//
// Real strings: the quote, Buy, the metric.

type S = { clear: boolean; value: number };

const INITIAL: S = { clear: false, value: 0 };
const POSTER: S = { clear: true, value: 18 };

async function script(a: Act<S>) {
	await a.wait(ENTRY_MS);
	a.mark('buy');
	await a.click('buy');
	await a.set({ clear: true });
	await a.wait(420);
	a.mark('impact');
	await a.set({ value: 18 });
	await a.move({ at: 'value', x: 0.6, y: 0.9 });
	await a.wait(600);
}

const percent = (n: number) => `+${Math.round(n)}%`;

export function InsightScene({ copy, playing }: { copy: WhyTourCopy['insight']; playing: boolean }) {
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
					<div className={styles.quote}>
						<Avatar name="Lucía" size={20} />
						<Text className={look.strong}>{copy.quote}</Text>
					</div>
					<div className={styles.body}>
						<div className={styles.card} data-clear={s.clear || undefined}>
							<span className={styles.media} />
							<span className={styles.row}>
								<span className={styles.price}>$ 49</span>
								<span className={styles.buy} data-target="buy">
									<span className={styles.faint}>{copy.buy}</span>
									<span className={styles.clear}>
										<Button size="small" variant="primary">
											{copy.buy}
										</Button>
									</span>
								</span>
							</span>
						</div>
						<div className={`${look.arrive} ${styles.impact}`} data-on={s.clear || undefined}>
							<span className={styles.tile}>
								<TrendingUp size={12} strokeWidth={2} aria-hidden />
							</span>
							<Text className={look.label}>{copy.metric}</Text>
							<Count value={s.value} format={percent} className={`${look.strong} ${styles.value}`} data-target="value" />
						</div>
					</div>
				</div>
			)}
		</Stage>
	);
}
