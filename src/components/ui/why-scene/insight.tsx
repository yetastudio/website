import { Avatar, Bar, Button, Collapse, Count, Stage, Text, type Act } from '@stageshow';
import { Scissors, TrendingUp } from 'lucide-react';

import { sceneCursor } from './cursor';
import { ENTRY_MS, SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './insight.module.css';

// From insight to impact: what a user said becomes what the brand gains, in
// three readable beats. The insight: a user's quote, "the sign-up is too long",
// over the sign-up form it is about (five fields). The change: Yeta's cursor
// presses Shorten sign-up and the form folds to the two fields it needs. The
// impact: sign-ups arrive beside it and roll up. The poster is the short form
// with its result.
//
// Real strings: the quote, Shorten sign-up, the metric.

type S = { short: boolean; value: number };

const INITIAL: S = { short: false, value: 0 };
const POSTER: S = { short: true, value: 24 };

/** The sign-up form's fields as filler widths; the first two are the ones that stay. */
const FIELDS = [92, 92, 92, 92, 92];
const KEPT = 2;

async function script(a: Act<S>) {
	await a.wait(ENTRY_MS);
	a.mark('shorten');
	await a.click('shorten');
	await a.set({ short: true });
	await a.wait(420);
	a.mark('impact');
	await a.set({ value: 24 });
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
						<div className={styles.form} aria-hidden>
							{FIELDS.map((w, i) => (
								<Collapse key={i} open={!s.short || i < KEPT}>
									<span className={styles.field}>
										<Bar w={w} h={4} tone={2} />
									</span>
								</Collapse>
							))}
							<span className={styles.submit} />
						</div>
						<div className={styles.side}>
							<span data-target="shorten">
								<Button size="small" variant="secondary" icon={<Scissors size={12} strokeWidth={2} aria-hidden />}>
									{copy.action}
								</Button>
							</span>
							<div className={`${look.arrive} ${styles.impact}`} data-on={s.short || undefined}>
								<span className={styles.tile}>
									<TrendingUp size={12} strokeWidth={2} aria-hidden />
								</span>
								<Text className={look.label}>{copy.metric}</Text>
								<Count value={s.value} format={percent} className={`${look.strong} ${styles.value}`} data-target="value" />
							</div>
						</div>
					</div>
				</div>
			)}
		</Stage>
	);
}
