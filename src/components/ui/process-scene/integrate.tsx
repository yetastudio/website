import { BrandMark, Button, Connector, Stage, brandMarks, type Act } from '@stageshow';
import { Check } from 'lucide-react';

import { SCENE_HEIGHT, SCENE_WIDTH, sceneCursor, type SceneCopy } from './shared';
import look from './look.module.css';
import styles from './integrate.module.css';

// Integrate: two of the client's tools, wired together. A workflow canvas
// hangs off the tile's top-left corner with two app nodes on it, Slack and
// Notion. Beats: the cursor presses Connect under Notion; the line draws
// from Slack across to Notion and ends on its dot, and the button settles
// on Connected with a tick. The poster is the two apps joined. Loop: the
// button goes back to Connect and the line retracts (the last change first),
// and the cursor connects them again.
//
// Real strings: the two app names (with their real marks, named from the
// kit's brand registry) and the button.

type S = { linked: boolean; done: boolean };

const POSTER: S = { linked: true, done: true };

async function script(a: Act<S>) {
	await a.wait(2100);
	// Reset around the canvas, the last change first
	a.mark('reset');
	await a.set({ done: false });
	await a.wait(160);
	await a.set({ linked: false });
	await a.wait(700);

	// Connect
	a.mark('connect');
	await a.move({ at: 'connect', x: 0.78, y: 0.62 });
	await a.wait(180);
	await a.click();
	await a.set({ linked: true });
	await a.wait(900);
	a.mark('connected');
	await a.set({ done: true });
	await a.wait(420);
	await a.move('rest');
	await a.wait(1400);
}

export function IntegrateScene({ copy }: { copy: SceneCopy['integrate'] }) {
	return (
		<Stage<S>
			width={SCENE_WIDTH}
			height={SCENE_HEIGHT}
			initial={POSTER}
			poster={POSTER}
			script={script}
			cursor={sceneCursor('rest')}
			className={styles.stage}
		>
			{(s, rect) => {
				const from = rect('node-a');
				const to = rect('node-b');
				return (
					<>
						<div className={`${look.panel} ${styles.canvas}`}>
							<div className={`${styles.node} ${styles.a}`} data-target="node-a">
								<BrandMark brand="slack" size={22} />
								<span className={look.strong}>{brandMarks.slack.name}</span>
							</div>
							<div className={styles.b}>
								<div className={styles.node} data-target="node-b">
									<BrandMark brand="notion" size={22} />
									<span className={look.strong}>{brandMarks.notion.name}</span>
								</div>
								<Button
									variant={s.done ? 'secondary' : 'primary'}
									size="small"
									icon={s.done ? <Check size={12} strokeWidth={2.25} aria-hidden /> : undefined}
									className={styles.connect}
									data-target="connect"
									data-done={s.done || undefined}
								>
									{s.done ? copy.connected : copy.connect}
								</Button>
							</div>
						</div>
						{from.width > 0 && to.width > 0 && (
							<Connector
								show={s.linked}
								from={{ x: from.x + from.width, y: from.y + from.height / 2 }}
								to={{ x: to.x, y: to.y + to.height / 2 }}
								route="straight"
								dots="both"
								className={styles.line}
							/>
						)}
						<span data-target="rest" className={styles.rest} />
					</>
				);
			}}
		</Stage>
	);
}
