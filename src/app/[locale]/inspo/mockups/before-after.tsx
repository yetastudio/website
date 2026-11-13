'use client';

//! Components
import { Badge, Bar, Stage, Window, type Act } from '@stageshow';
import { ChevronsLeftRight } from 'lucide-react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './scenes.module.css';

// Proposal 04, before / after. One browser window, two versions of the same
// page under a divider: the untreated template on the left, the page as
// shipped on the right. Beats: the arrow takes the handle, drags it left (the
// finished page takes the frame), then right (the template comes back), then
// home to the middle. The poster is the frame split down the middle. Every
// change is the hand on the handle, so nothing rewinds on its own.
//
// Real strings: Before, After, the two headlines.

type S = { x: number };

const POSTER: S = { x: 0.5 };

/** Drag the handle so the divider sits at `x` (0 to 1 across the page). */
async function dragTo(a: Act<S>, x: number, duration: number) {
	const page = a.rect('compare');
	const knob = a.rect('knob');
	await a.drag(
		{ x: page.x + page.width * x, y: knob.y + knob.height / 2 },
		(p) => a.put({ x: Math.min(0.96, Math.max(0.04, (p.x - page.x) / page.width)) }),
		{ duration, cursor: 'preserve' },
	);
	a.put({ x });
}

async function script(a: Act<S>) {
	await a.wait(1500);
	a.mark('take');
	await a.move('knob');
	await a.wait(200);
	a.mark('after');
	await dragTo(a, 0.16, 1100);
	await a.wait(1300);
	a.mark('before');
	await dragTo(a, 0.84, 1300);
	await a.wait(1100);
	a.mark('home');
	await dragTo(a, 0.5, 800);
	await a.wait(300);
	await a.move('rest');
	await a.wait(1400);
}

/** The template as it arrived: flat, copy on the left, a stock image block on the right, a square button. */
function Before() {
	return (
		<div className={styles.baBefore}>
			<div className={styles.baBeforeNav}>
				<Bar w={34} h={6} tone={4} />
				<Bar w={18} h={4} tone={3} className={styles.baPushRight} />
				<Bar w={18} h={4} tone={3} />
				<Bar w={18} h={4} tone={3} />
			</div>
			<div className={styles.baColumns}>
				<div className={styles.baCopy}>
					<p className={styles.baBeforeTitle}>Welcome to our website</p>
					<Bar w={120} h={4} tone={3} />
					<Bar w={92} h={4} tone={3} />
					<span className={styles.baBeforeButton} />
				</div>
				<span className={styles.baBeforeImage} />
			</div>
			<Badge className={cx(styles.baTag, styles.baTagStart)}>Before</Badge>
		</div>
	);
}

/** The page as shipped, mirrored: a wash on the left, display type with an Editorial accent and a bevelled call to action on the right. */
function After() {
	return (
		<div className={styles.baAfter}>
			<div className={cx(styles.baAfterNav, 'u-bevel')}>
				<Bar w={30} h={6} tone={5} />
				<Bar w={18} h={4} tone={3} className={styles.baPushRight} />
				<Bar w={18} h={4} tone={3} />
				<Bar w={18} h={4} tone={3} />
			</div>
			<div className={styles.baColumns}>
				<span className={styles.baAfterTile} />
				<div className={styles.baCopy}>
					<p className={styles.baAfterTitle}>
						Made with <em>intention</em>.
					</p>
					<Bar w={112} h={4} tone={3} />
					<span className={cx(styles.baAfterButton, 'u-bevel')}>
						<Bar w={44} h={4} tone={4} />
					</span>
				</div>
			</div>
			<Badge tone="accent" className={cx(styles.baTag, styles.baTagEnd)}>
				After
			</Badge>
		</div>
	);
}

export function BeforeAfterMockup() {
	return (
		<div
			className={styles.frame}
			role="img"
			aria-label="Mockup: one page before and after, split by a handle the cursor drags across to reveal the finished page over the template."
		>
			<Stage<S>
				width={520}
				height={300}
				compact={{ below: 440, width: 340, height: 280 }}
				initial={POSTER}
				poster={POSTER}
				script={script}
				cursor={{ at: 'rest' }}
				className={styles.baStage}
			>
				{(s) => (
					<>
						<Window url="yourbrand.com" urlShape="pill" className={styles.baWindow}>
							<div className={styles.baCompare} data-target="compare" style={{ ['--ba-x' as string]: s.x }}>
								<Before />
								<div className={styles.baAfterClip}>
									<After />
								</div>
								<span className={styles.baDivider}>
									<span className={cx(styles.baKnob, 'u-bevel')} data-target="knob" data-cursor="resize-ew">
										<ChevronsLeftRight size={14} strokeWidth={1.5} aria-hidden />
									</span>
								</span>
							</div>
						</Window>
						<span data-target="rest" className={styles.baRest} />
					</>
				)}
			</Stage>
		</div>
	);
}

export default BeforeAfterMockup;
