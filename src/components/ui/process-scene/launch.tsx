import { Avatar, Badge, Bar, Roll, Stage, States, Text, type Act } from '@stageshow';
import { ArrowUpRight, Globe } from 'lucide-react';

import { SCENE_HEIGHT, SCENE_WIDTH, type SceneCopy } from './shared';
import look from './look.module.css';
import styles from './launch.module.css';

// Launch: a deploy going live. The production deployment hangs off the
// tile's top-left corner: its status, the commit it ships, and one slot
// under them that holds the build's progress while it runs and the live
// address once it's out. Beats: a new build starts (Building, the bar
// fills), the status rolls to Ready, and the address row rises into the
// slot. No cursor: the platform does it. The poster is Ready with the
// address. Loop: the next build starts on the same card.
//
// Real strings: the environment, its status, the address.

type S = { phase: 'building' | 'ready'; run: boolean };

const POSTER: S = { phase: 'ready', run: false };

async function script(a: Act<S>) {
	await a.wait(2300);
	// The next build starts on the same card
	a.mark('building');
	await a.set({ phase: 'building' });
	await a.wait(160);
	await a.set({ run: true });
	await a.wait(1800);

	// Ready, and the address takes the slot
	a.mark('ready');
	await a.set({ phase: 'ready' });
	await a.wait(450);
	// The finished bar is behind the address now: put it back unseen
	await a.snap({ run: false });
	await a.wait(1500);
}

export function LaunchScene({ copy }: { copy: SceneCopy['launch'] }) {
	return (
		<Stage<S> width={SCENE_WIDTH} height={SCENE_HEIGHT} initial={POSTER} poster={POSTER} script={script} className={styles.stage}>
			{(s) => {
				const ready = s.phase === 'ready';
				return (
					<div className={`${look.panel} ${styles.deploy}`}>
						<div className={styles.head}>
							<Text className={look.strong}>{copy.env}</Text>
							<Badge tone={ready ? 'success' : 'warning'} dot className={styles.status}>
								<Roll variant="fade" align="end">
									{ready ? copy.ready : copy.building}
								</Roll>
							</Badge>
						</div>
						<div className={styles.commit}>
							<Avatar plain size={16} />
							<Bar w={128} h={5} tone={3} />
							<Bar w={36} h={5} tone={2} className={styles.hash} />
						</div>
						<States
							value={s.phase}
							align="start"
							className={styles.slot}
							states={{
								building: (
									<span className={styles.progress} data-run={s.run || undefined}>
										<span className={styles.fill} />
									</span>
								),
								ready: (
									<span className={styles.url}>
										<Globe size={12} strokeWidth={1.75} aria-hidden />
										<Text className={styles.address}>{copy.url}</Text>
										<ArrowUpRight size={12} strokeWidth={1.75} aria-hidden className={styles.out} />
									</span>
								),
							}}
						/>
						<div className={styles.after}>
							<Bar w={92} h={5} tone={2} />
							<Bar w={60} h={5} tone={2} />
						</div>
					</div>
				);
			}}
		</Stage>
	);
}
