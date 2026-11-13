import { Avatar, Bar, Count, Stage, Text, type Act } from '@stageshow';
import { TrendingUp } from 'lucide-react';

import { sceneCursor } from './cursor';
import { ENTRY_MS, SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './insight.module.css';

// From insight to impact: what a user said becomes what the brand gains. An
// interview quote sits at the top of the notes; a line draws down from the
// person to a result row, which arrives under it, and its figure rolls up.
// Yeta's cursor picks the quote out of the notes (a double click marks it),
// then rests on the result it brought. The poster is the quote with its result.
//
// Real strings: the quote, the metric.

type S = { marked: boolean; line: boolean; impact: boolean; value: number };

const INITIAL: S = { marked: false, line: false, impact: false, value: 0 };
const POSTER: S = { marked: true, line: true, impact: true, value: 24 };

async function script(a: Act<S>) {
	await a.wait(ENTRY_MS);
	a.mark('select');
	await a.click({ at: 'quote', x: 0.5, y: 0.55 }, { double: true });
	await a.set({ marked: true });
	await a.wait(260);
	a.mark('line');
	await a.set({ line: true });
	await a.wait(320);
	a.mark('impact');
	await a.set({ impact: true });
	await a.wait(200);
	await a.set({ value: 24 });
	await a.move({ at: 'value', x: 0.6, y: 0.9 });
	await a.wait(500);
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
						<Text className={look.strong} data-target="quote" data-marked={s.marked || undefined}>
							{copy.quote}
						</Text>
					</div>
					<div className={styles.notes}>
						<Bar w={172} h={5} tone={2} />
					</div>
					<span className={styles.line} data-on={s.line || undefined} />
					<div className={`${look.arrive} ${styles.impact}`} data-on={s.impact || undefined}>
						<span className={styles.tile}>
							<TrendingUp size={12} strokeWidth={2} aria-hidden />
						</span>
						<Text className={look.label}>{copy.metric}</Text>
						<Count value={s.value} format={percent} className={`${look.strong} ${styles.value}`} data-target="value" />
					</div>
					<div className={styles.notes}>
						<Bar w={204} h={5} tone={2} />
						<Bar w={148} h={5} tone={2} />
					</div>
				</div>
			)}
		</Stage>
	);
}
