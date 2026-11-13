import { Avatar, Badge, Bar, Count, Meter, Stage, type Act } from '@stageshow';
import { Check } from 'lucide-react';

import { LogoMark } from '@/components/ui/brand';

import { SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './goals.module.css';

// Your goals are our goals: one goal, shared. The client and the studio sit
// on the same goal card; progress fills past the target mark and the goal is
// marked Reached. The poster is the reached goal.
//
// Real strings: the goal, the metric, Reached.

type S = { run: boolean; done: boolean };

const INITIAL: S = { run: false, done: false };
const POSTER: S = { run: true, done: true };

/** The meter's full width stands for +28%: the target (+20%) sits at its mark, the result (+24%) past it. */
const SCALE = 28;
const TARGET = 20;
const RESULT = 24;

async function script(a: Act<S>) {
	await a.wait(350);
	a.mark('progress');
	await a.set({ run: true });
	await a.wait(1000);
	a.mark('reached');
	await a.set({ done: true });
	await a.wait(450);
}

const percent = (n: number) => `+${Math.round(n)}%`;

export function GoalsScene({ copy, playing }: { copy: WhyTourCopy['goals']; playing: boolean }) {
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
					<div className={styles.head}>
						<span className={styles.pair}>
							<Avatar name="Ana" size={20} />
							<LogoMark size={20} alt="" />
						</span>
						<span className={look.strong}>{copy.label}</span>
					</div>
					<div className={styles.result}>
						<span className={look.label}>{copy.metric}</span>
						<Count value={s.run ? RESULT : 0} format={percent} className={`${look.strong} ${styles.value}`} />
						<span className={look.arrive} data-on={s.done || undefined}>
							<Badge icon={<Check size={10} strokeWidth={2.5} aria-hidden className={styles.tick} />}>{copy.reached}</Badge>
						</span>
					</div>
					<div className={styles.track} data-done={s.done || undefined}>
						<Meter value={s.run ? RESULT / SCALE : 0} />
						<span className={styles.target} style={{ left: `${(TARGET / SCALE) * 100}%` }} />
					</div>
					<div className={styles.after}>
						<Bar w={148} h={5} tone={2} />
					</div>
				</div>
			)}
		</Stage>
	);
}
