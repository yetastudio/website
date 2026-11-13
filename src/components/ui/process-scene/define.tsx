import { Avatar, Badge, Bar, Check, Roll, Stage, Text, type Act } from '@stageshow';

import { SCENE_HEIGHT, SCENE_WIDTH, type SceneCopy } from './shared';
import look from './look.module.css';
import styles from './define.module.css';

// Define: the plan. A project brief hangs off the tile's left edge and runs
// off the bottom, its requirements as a checklist. Beats: each requirement
// turns (pending) and ticks, top to bottom; once the last lands the brief's
// status rolls from Draft to Approved. No cursor: the team signs it off. The
// poster is the approved brief. Loop: the status rolls back and the ticks
// clear in a quick reverse stagger (the last change first), and it's planned again.
//
// Real strings: the title and its status.

type S = { done: number; pending: number; approved: boolean };

/** Requirement lines: placeholder widths that vary row to row. */
const ROWS = [132, 104, 150] as const;

const POSTER: S = { done: ROWS.length, pending: -1, approved: true };

async function script(a: Act<S>) {
	await a.wait(2000);
	// Reset in place, the last change first
	a.mark('reset');
	await a.set({ approved: false });
	await a.wait(140);
	for (let n = ROWS.length - 1; n >= 0; n--) {
		a.put({ done: n });
		await a.wait(70);
	}
	await a.wait(700);

	// Each requirement is checked, top to bottom
	a.mark('ticks');
	for (let i = 0; i < ROWS.length; i++) {
		a.put({ pending: i });
		await a.wait(420);
		a.put({ done: i + 1, pending: -1 });
		await a.wait(300);
	}
	await a.wait(260);

	// The brief is signed off
	a.mark('approved');
	await a.set({ approved: true });
	await a.wait(1200);
}

export function DefineScene({ copy }: { copy: SceneCopy['define'] }) {
	return (
		<Stage<S> width={SCENE_WIDTH} height={SCENE_HEIGHT} initial={POSTER} poster={POSTER} script={script} className={styles.stage}>
			{(s) => (
				<div className={`${look.panel} ${styles.brief}`}>
					<div className={styles.head}>
						<Text className={look.strong}>{copy.doc}</Text>
						<Badge tone={s.approved ? 'success' : 'neutral'} dot className={styles.status}>
							<Roll variant="fade" align="end">
								{s.approved ? copy.approved : copy.draft}
							</Roll>
						</Badge>
					</div>
					<div className={styles.list}>
						{ROWS.map((w, i) => (
							<div key={i} className={styles.row}>
								<Check on={s.done > i} pending={s.pending === i} size={14} />
								<Bar w={w} h={5} tone={s.done > i ? 2 : 3} className={styles.item} />
								<Avatar plain size={14} className={styles.owner} />
							</div>
						))}
					</div>
				</div>
			)}
		</Stage>
	);
}
