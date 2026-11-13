import { Badge, Bar, Count, Meter, Stage, type Act } from '@stageshow';

import { SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './luck.module.css';

// Luck has nothing to do with it: the call is made by a test, not a hunch.
// An A/B test reads both variants; their bars fill and their rates roll up,
// and B is marked the winner. The poster is the finished test with B ahead.
//
// Real strings: the test's name, Winner (A and B are the variants' letters).

type S = { run: boolean; win: boolean };

const INITIAL: S = { run: false, win: false };
const POSTER: S = { run: true, win: true };

const RATE = { a: 3.1, b: 4.6 };
const FILL = { a: 0.46, b: 0.72 };

async function script(a: Act<S>) {
	await a.wait(350);
	a.mark('run');
	await a.set({ run: true });
	await a.wait(1040);
	a.mark('winner');
	await a.set({ win: true });
	await a.wait(400);
}

const rate = (n: number) => `${n.toFixed(1)}%`;

export function LuckScene({ copy, playing }: { copy: WhyTourCopy['luck']; playing: boolean }) {
	return (
		<Stage<S>
			width={SCENE_WIDTH}
			height={SCENE_HEIGHT}
			initial={INITIAL}
			poster={POSTER}
			script={playing ? script : undefined}
			play="once"
		>
			{(s) => (
				<div className={look.panel}>
					<div className={look.label}>{copy.test}</div>
					<div className={styles.variants}>
						<div className={styles.variant}>
							<span className={styles.letter}>A</span>
							<Meter value={s.run ? FILL.a : 0} className={`${styles.meter} ${styles.quiet}`} />
							<Count value={s.run ? RATE.a : 0} format={rate} className={`${look.strong} ${styles.rate}`} />
						</div>
						<div className={styles.variant}>
							<span className={styles.letter}>B</span>
							<Meter value={s.run ? FILL.b : 0} className={`${styles.meter} ${styles.late}`} />
							<Count value={s.run ? RATE.b : 0} format={rate} className={`${look.strong} ${styles.rate}`} />
							<span className={look.arrive} data-on={s.win || undefined}>
								<Badge dot className={styles.winner}>
									{copy.winner}
								</Badge>
							</span>
						</div>
					</div>
					<div className={styles.after}>
						<Bar w={196} h={5} tone={2} />
						<Bar w={120} h={5} tone={2} />
					</div>
				</div>
			)}
		</Stage>
	);
}
