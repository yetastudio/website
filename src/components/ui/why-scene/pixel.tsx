import { Bar, Button, Check, Count, Stage, type Act } from '@stageshow';

import { SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './pixel.module.css';

// Purpose in every pixel: a button selected in a design file, its spacing
// measured on both sides. The two gaps disagree (20 and 12); the button is
// nudged until both read 16, and a check lands on the frame's corner. The
// frame never changes width: one gap gives what the other takes. The poster
// is the balanced button with its check.
//
// Real strings: the button's label (the gaps are numbers).

type S = { fixed: boolean; ok: boolean };

const INITIAL: S = { fixed: false, ok: false };
const POSTER: S = { fixed: true, ok: true };

async function script(a: Act<S>) {
	await a.wait(500);
	a.mark('nudge');
	await a.set({ fixed: true });
	await a.wait(600);
	a.mark('check');
	await a.set({ ok: true });
	await a.wait(400);
}

function Gap({ side, value }: { side: 'start' | 'end'; value: number }) {
	return (
		<span className={styles.gap} data-side={side}>
			<span className={styles.rule} />
			<span className={styles.size}>
				<Count value={value} duration={420} />
			</span>
		</span>
	);
}

export function PixelScene({ copy, playing }: { copy: WhyTourCopy['pixel']; playing: boolean }) {
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
					<Bar w={72} h={5} tone={3} className={styles.path} />
					<div className={styles.frame} data-fixed={s.fixed || undefined}>
						<Gap side="start" value={s.fixed ? 16 : 20} />
						<span className={styles.selected}>
							<Button variant="primary">{copy.cta}</Button>
							<span className={styles.handle} data-corner="tl" />
							<span className={styles.handle} data-corner="tr" />
							<span className={styles.handle} data-corner="bl" />
							<span className={styles.handle} data-corner="br" />
						</span>
						<Gap side="end" value={s.fixed ? 16 : 12} />
						<span className={styles.check}>
							<Check on={s.ok} size={16} />
						</span>
					</div>
					<div className={styles.after}>
						<Bar w={164} h={5} tone={2} />
						<Bar w={112} h={5} tone={2} />
					</div>
				</div>
			)}
		</Stage>
	);
}
