import { Bar, Stage, Text, type Act } from '@stageshow';
import { Frame, MousePointer2, Square, Type } from 'lucide-react';

import { SCENE_HEIGHT, SCENE_WIDTH, sceneCursor, type SceneCopy } from './shared';
import look from './look.module.css';
import styles from './design.module.css';

// Design: a design tool. The window hangs off the tile's top-left corner,
// the canvas on the left with one frame selected, its inspector on the right.
// Beats: the cursor takes the Radius slider and drags it; the frame's corners
// follow the hand and the value reads out live. The poster is the frame at
// its rounded radius, still selected. Loop: a quick try at a sharp corner,
// then back to round, both by hand (each is a real edit, never a rewind).
//
// Real strings: the frame's name, Radius and its value.

type S = { r: number };

const MAX = 24;
const POSTER: S = { r: 20 };

/** Drag the slider's thumb to a radius, reading the radius from the hand. */
async function dragTo(a: Act<S>, r: number, duration: number) {
	const track = a.rect('track');
	const at = (v: number) => ({ x: track.x + (track.width * v) / MAX, y: track.y + track.height / 2 });
	await a.move('thumb');
	await a.wait(160);
	await a.drag(
		at(r),
		(p) => {
			const t = Math.min(1, Math.max(0, (p.x - track.x) / track.width));
			a.put({ r: Math.round(t * MAX) });
		},
		// A slider keeps the arrow while it drags, as design tools do
		{ duration, cursor: 'preserve' },
	);
	a.put({ r });
}

async function script(a: Act<S>) {
	await a.wait(1800);
	a.mark('sharp');
	await dragTo(a, 4, 700);
	await a.wait(900);
	a.mark('round');
	await dragTo(a, 20, 1100);
	await a.wait(300);
	await a.move('rest');
	await a.wait(1400);
}

export function DesignScene({ copy }: { copy: SceneCopy['design'] }) {
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
			{(s) => (
				<>
					<div className={`${look.panel} ${styles.win}`}>
						<div className={styles.bar}>
							<span className={styles.tool} data-active>
								<MousePointer2 size={12} strokeWidth={1.75} aria-hidden />
							</span>
							<span className={styles.tool}>
								<Frame size={12} strokeWidth={1.75} aria-hidden />
							</span>
							<span className={styles.tool}>
								<Square size={12} strokeWidth={1.75} aria-hidden />
							</span>
							<span className={styles.tool}>
								<Type size={12} strokeWidth={1.75} aria-hidden />
							</span>
							<Bar w={56} h={5} tone={3} className={styles.file} />
						</div>
						<div className={styles.body} style={{ ['--frame-r' as string]: s.r, ['--slider-t' as string]: s.r / MAX }}>
							<div className={styles.canvas}>
								<Text className={`${look.label} ${styles.frameName}`}>{copy.frame}</Text>
								<div className={styles.frame}>
									<Bar w={74} h={7} r={2} tone={4} />
									<Bar w={104} h={4} tone={2} />
									<span className={styles.cta} />
								</div>
								<span className={styles.selection} aria-hidden>
									<i />
									<i />
									<i />
									<i />
								</span>
							</div>
							<div className={styles.inspector}>
								<div className={styles.prop}>
									<Text className={look.label}>{copy.radius}</Text>
									<span className={`${look.strong} ${styles.value}`}>{s.r}</span>
								</div>
								<div className={styles.slider} data-target="track">
									<span className={styles.fill} />
									<span className={styles.thumb} data-target="thumb" />
								</div>
								<div className={styles.filler}>
									<Bar w={22} h={4} tone={3} />
									<span className={styles.swatchRow}>
										<span className={styles.swatch} />
										<Bar w={38} h={4} tone={2} />
									</span>
								</div>
							</div>
						</div>
					</div>
					<span data-target="rest" className={styles.rest} />
				</>
			)}
		</Stage>
	);
}
