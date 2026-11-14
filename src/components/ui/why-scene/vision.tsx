import { Badge, Bar, Button, Spinner, Stage, States, Text, type Act } from '@stageshow';
import { Rocket } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { sceneCursor } from './cursor';
import { ENTRY_MS, SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './vision.module.css';

// Static parts, hoisted: the scene redraws on every state change and these never change.
const ROCKET_ICON = <Rocket size={12} strokeWidth={2} aria-hidden />;
const SPINNER = <Spinner size={10} />;

// Turning vision into product: a wireframe becomes the page. The sketch is
// drawn at the page's own geometry (a title bar, a crossed image box, a
// dashed button); each part resolves in reading order into the real thing,
// and the page is marked Live. Dashed edges never resize, they only fade.
// Yeta's cursor presses Launch: the control turns into Launching… while the
// sketch resolves in reading order, and lands on Live once the page is real,
// like a deploy. The poster is the live page.
//
// Real strings: the page title, the button, Launch, Launching…, Live.

type S = { launching: boolean; built: boolean; live: boolean };

const INITIAL: S = { launching: false, built: false, live: false };
const POSTER: S = { launching: false, built: true, live: true };

async function script(a: Act<S>) {
	await a.wait(ENTRY_MS);
	a.mark('launch');
	await a.click('launch');
	await a.set({ launching: true });
	await a.wait(140);
	a.mark('build');
	await a.set({ built: true });
	await a.wait(1050);
	a.mark('live');
	await a.set({ launching: false, live: true });
	await a.wait(400);
}

/** One part of the page: its sketch and its finished face in one cell, crossfaded in reading order. */
function Part({ i, sketch, product, className, target }: { i: number; sketch: ReactNode; product: ReactNode; className?: string; target?: string }) {
	return (
		<div className={className ? `${styles.part} ${className}` : styles.part} style={{ '--i': i } as CSSProperties} data-target={target}>
			<div className={styles.sketch}>{sketch}</div>
			<div className={styles.product}>{product}</div>
		</div>
	);
}

export function VisionScene({ copy, playing }: { copy: WhyTourCopy['vision']; playing: boolean }) {
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
				<div className={look.panel} data-built={s.built || undefined}>
					<div className={styles.head}>
						<Part i={0} sketch={<Bar w={104} h={8} tone={3} />} product={<Text className={look.strong}>{copy.title}</Text>} />
						<span className={styles.status} data-target="launch">
							<States
								value={s.live ? 'live' : s.launching ? 'launching' : 'idle'}
								align="end"
								states={{
									idle: (
										<Button size="small" variant="primary" icon={ROCKET_ICON}>
											{copy.deploy}
										</Button>
									),
									launching: <Badge icon={SPINNER}>{copy.deploying}</Badge>,
									live: (
										<Badge dot className={styles.live}>
											{copy.live}
										</Badge>
									),
								}}
							/>
						</span>
					</div>
					<Part
						i={1}
						className={styles.media}
						sketch={
							<svg className={styles.cross} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
								<line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
								<line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
							</svg>
						}
						product={<span className={styles.image} />}
					/>
					<Part
						i={2}
						className={styles.cta}
						target="cta"
						sketch={
							<span className={styles.pill}>
								<Bar w={56} h={5} tone={3} />
							</span>
						}
						product={<Button variant="primary">{copy.cta}</Button>}
					/>
				</div>
			)}
		</Stage>
	);
}
