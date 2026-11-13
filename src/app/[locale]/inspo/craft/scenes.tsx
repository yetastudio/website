'use client';

//! React Core
import type { JSX, ReactNode } from 'react';

//! Components
import { Bar, Chart, Collapse, Connector, Segmented, Stage, chartPoints, type Act } from '@stageshow';
import { DesignFrame, FlowNode, Note, ReleaseRow, ToolRow } from './parts';

//! Data
import { CRAFT_HUES, SCENE_COPY, type CraftStep } from './data';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import look from './look.module.css';
import styles from './scenes.module.css';

/*
 * Alternative A: the six Our Craft beats as small Stageshow scenes, one per card tile,
 * the way the Our Process cards carry theirs. Every scene is drawn at the tile's size
 * (240 × 160) and shown 1:1. Decorative: hidden from assistive tech, nothing focusable,
 * no pointer events. Each plays while on screen and shows its poster under reduced motion.
 */

export const TILE_WIDTH = 240;
export const TILE_HEIGHT = 160;

/** The classic arrow, with a soft ring on each click so a press reads at tile size. */
const CURSOR = { at: 'rest', style: 'yeta', ripple: true } as const;

/** The scene's wrapper: its beat's hue, the tile's clip, hidden from assistive tech. */
function Scene({ step, children }: { step: CraftStep; children: ReactNode }) {
	return (
		<div className={cx(look.root, look.fill)} data-hue={CRAFT_HUES[step]} aria-hidden="true">
			{children}
		</div>
	);
}

// ───────────── 01 Idea ─────────────
// A board of notes hung off the tile's top-left corner. Beats: the cursor double-clicks
// an empty spot, a note opens there and the idea is typed into it; it keeps the beat's
// hue as a thin tab. Poster: the written note among the quiet ones. Loop: the note
// leaves as one thing and is written again. Real strings: the note.

type IdeaState = { shown: boolean; words: string; typing: boolean; editing: boolean };
const IDEA_POSTER: IdeaState = { shown: true, words: SCENE_COPY.idea.note, typing: false, editing: false };

async function ideaScript(a: Act<IdeaState>) {
	await a.wait(2000);
	a.mark('reset');
	await a.set({ shown: false });
	await a.wait(420);
	await a.snap({ words: '' });
	await a.wait(240);

	a.mark('create');
	await a.move('spot');
	await a.wait(160);
	await a.click('spot', { double: true });
	await a.set({ shown: true, editing: true });
	await a.move('rest');
	await a.set({ typing: true });
	await a.type('words', SCENE_COPY.idea.note, { interval: 68 });
	await a.set({ typing: false });
	await a.wait(900);
	await a.set({ editing: false });
	await a.wait(900);
}

export function IdeaScene() {
	return (
		<Scene step="idea">
			<Stage<IdeaState>
				width={TILE_WIDTH}
				height={TILE_HEIGHT}
				initial={IDEA_POSTER}
				poster={IDEA_POSTER}
				script={ideaScript}
				cursor={CURSOR}
				className={styles.idea}
			>
				{(s) => (
					<>
						<div className={cx(look.panel, look.canvas, styles.board)}>
							<Note className={styles.n1} />
							<Note className={styles.n3} bars={[38, 28]} />
							<Note className={styles.n4} bars={[30, 42]} />
							<Note className={styles.n5} bars={[40]} />
							<Note
								className={styles.ideaNote}
								data-shown={s.shown || undefined}
								data-editing={s.editing || undefined}
								words={s.words}
								hued
								caret={{ on: s.editing, typing: s.typing }}
							/>
							<span data-target="spot" className={styles.spot} />
						</div>
						<span data-target="rest" className={styles.rest} />
					</>
				)}
			</Stage>
		</Scene>
	);
}

// ───────────── 02 Path ─────────────
// A sitemap on a dotted canvas: Home, Services and Book a call. Beats: the lines between
// them draw on in order, then the goal lights its hue dot. No cursor: the structure is the
// story. Poster: the whole path. Loop: the dot and the lines fade off, the nodes stay.
// Real strings: the three pages.

type PathState = { lines: number; goal: boolean };
const PATH_POSTER: PathState = { lines: 2, goal: true };

async function pathScript(a: Act<PathState>) {
	await a.wait(2200);
	a.mark('reset');
	await a.set({ goal: false });
	await a.wait(120);
	await a.set({ lines: 0 });
	await a.wait(700);

	a.mark('draw');
	await a.set({ lines: 1 });
	await a.wait(1050);
	await a.set({ lines: 2 });
	await a.wait(1050);
	await a.set({ goal: true });
	await a.wait(900);
}

export function PathScene() {
	const copy = SCENE_COPY.path;
	return (
		<Scene step="path">
			<Stage<PathState> width={TILE_WIDTH} height={TILE_HEIGHT} initial={PATH_POSTER} poster={PATH_POSTER} script={pathScript} className={styles.path}>
				{(s, rect) => {
					const home = rect('home');
					const services = rect('services');
					const book = rect('book');
					return (
						<>
							<div className={cx(look.canvas, styles.ground)} />
							<FlowNode data-target="home" className={styles.home} label={copy.home} />
							<FlowNode data-target="services" className={styles.services} label={copy.services} />
							<FlowNode data-target="book" className={styles.book} label={copy.book} goal lit={s.goal} />
							<Connector
								show={s.lines >= 1}
								route="h"
								radius={6}
								from={{ x: home.x + home.width, y: home.y + home.height / 2 }}
								to={{ x: services.x + services.width / 2, y: services.y }}
							/>
							<Connector
								show={s.lines >= 2}
								route="h"
								radius={6}
								from={{ x: services.x + services.width, y: services.y + services.height / 2 }}
								to={{ x: book.x + book.width / 2, y: book.y + book.height }}
							/>
						</>
					);
				}}
			</Stage>
		</Scene>
	);
}

// ───────────── 03 Intention ─────────────
// A design tool hung off the tile's top-left corner: a Wireframe / Design switch over a
// hero frame. Beats: the cursor picks Wireframe and the frame drops to bars; it picks
// Design and the bars become the headline and the button, in reading order. Poster: the
// designed frame. Loop: both picks are real edits, never a rewind. Real strings: the two
// modes, the headline and the button.

type IntentionState = { mode: 'wire' | 'design' };
const INTENTION_POSTER: IntentionState = { mode: 'design' };

async function intentionScript(a: Act<IntentionState>) {
	await a.wait(2000);
	a.mark('wire');
	await a.click('seg-wire');
	await a.set({ mode: 'wire' });
	await a.wait(1100);
	a.mark('design');
	await a.click('seg-design');
	await a.set({ mode: 'design' });
	await a.wait(500);
	await a.move('rest');
	await a.wait(1400);
}

export function IntentionScene() {
	const copy = SCENE_COPY.intention;
	return (
		<Scene step="intention">
			<Stage<IntentionState>
				width={TILE_WIDTH}
				height={TILE_HEIGHT}
				initial={INTENTION_POSTER}
				poster={INTENTION_POSTER}
				script={intentionScript}
				cursor={CURSOR}
				className={styles.intention}
			>
				{(s) => (
					<>
						<div className={cx(look.panel, styles.tool)}>
							<div className={styles.toolbar}>
								<Segmented
									items={[copy.wire, copy.design]}
									value={s.mode === 'wire' ? 0 : 1}
									targets={['seg-wire', 'seg-design']}
									className={styles.modes}
								/>
								<Bar w={28} h={5} tone={2} />
							</div>
							<div className={cx(look.canvas, styles.toolCanvas)}>
								<DesignFrame mode={s.mode} className={styles.frame} />
							</div>
						</div>
						<span data-target="rest" className={styles.rest} />
					</>
				)}
			</Stage>
		</Scene>
	);
}

// ───────────── 04 Tech ─────────────
// The project's stack, a panel hung off the tile's top-left corner: Next.js, React and
// Vercel with their real marks. Beats: each tool is checked in turn, top to bottom. No
// cursor. Poster: the stack, all checked. Loop: the checks clear in a quick reverse
// stagger (the last first) and the stack is chosen again. Real strings: the three tools.

type TechState = { checked: number };
const TECH_POSTER: TechState = { checked: 3 };

async function techScript(a: Act<TechState>) {
	await a.wait(2200);
	a.mark('reset');
	for (const n of [2, 1, 0]) {
		await a.set({ checked: n });
		await a.wait(80);
	}
	await a.wait(700);

	a.mark('choose');
	for (const n of [1, 2, 3]) {
		await a.set({ checked: n });
		await a.wait(620);
	}
	await a.wait(900);
}

export function TechScene() {
	const copy = SCENE_COPY.tech;
	return (
		<Scene step="tech">
			<Stage<TechState> width={TILE_WIDTH} height={TILE_HEIGHT} initial={TECH_POSTER} poster={TECH_POSTER} script={techScript} className={styles.tech}>
				{(s) => (
					<div className={cx(look.panel, styles.stack)}>
						<div className={styles.stackHead}>
							<span className={look.hueDot} />
							<span className={look.strong}>{copy.title}</span>
						</div>
						<div className={styles.stackRows}>
							<ToolRow tool="nextjs" name={copy.next} on={s.checked >= 1} />
							<ToolRow tool="react" name={copy.react} on={s.checked >= 2} />
							<ToolRow tool="vercel" name={copy.vercel} on={s.checked >= 3} />
							<div className={styles.stackFiller}>
								<Bar w={16} h={16} r={4} tone={2} />
								<Bar w={52} h={5} tone={2} />
							</div>
						</div>
					</div>
				)}
			</Stage>
		</Scene>
	);
}

// ───────────── 05 Legacy ─────────────
// The site's releases, a changelog hung off the tile's top-left corner. Beats: a new
// release opens at the top with the beat's hue dot and carries the older ones down. No
// cursor. Poster: v1.3 on top. Loop: the new release closes as one thing (the rows below
// rise with it) and ships again. Real strings: the releases.

type LegacyState = { latest: boolean };
const LEGACY_POSTER: LegacyState = { latest: true };

async function legacyScript(a: Act<LegacyState>) {
	await a.wait(2400);
	a.mark('reset');
	await a.set({ latest: false });
	await a.wait(1300);
	a.mark('ship');
	await a.set({ latest: true });
	await a.wait(1600);
}

export function LegacyScene() {
	const copy = SCENE_COPY.legacy;
	return (
		<Scene step="legacy">
			<Stage<LegacyState> width={TILE_WIDTH} height={TILE_HEIGHT} initial={LEGACY_POSTER} poster={LEGACY_POSTER} script={legacyScript} className={styles.legacy}>
				{(s) => (
					<div className={cx(look.panel, styles.log)}>
						<div className={styles.logHead}>
							<span className={look.strong}>{copy.title}</span>
							<Bar w={36} h={5} tone={2} />
						</div>
						<Collapse open={s.latest}>
							<ReleaseRow version={copy.latest.version} note={copy.latest.note} latest />
						</Collapse>
						{copy.past.slice(0, 2).map((release) => (
							<ReleaseRow key={release.version} version={release.version} note={release.note} className={styles.logRow} />
						))}
						<div className={cx(styles.logRow, styles.logFiller)}>
							<Bar w={26} h={12} r={4} tone={2} />
							<Bar w={64} h={5} tone={2} />
						</div>
						<div className={cx(styles.logRow, styles.logFiller)}>
							<Bar w={26} h={12} r={4} tone={2} />
							<Bar w={48} h={5} tone={2} />
						</div>
					</div>
				)}
			</Stage>
		</Scene>
	);
}

// ───────────── 06 Impact ─────────────
// Bookings over time, a panel hung off the tile's top-left corner, with the launch marked
// in the beat's hue. Beats: the line draws in from the left, flat before the launch and
// rising after it; the lift lands in the header. No cursor. Poster: the drawn line and its
// lift. Loop: the lift and the line fade as one, and the period is drawn again.
// Real strings: the title, Launch and the lift.

type ImpactState = { drawn: boolean; lift: boolean };
const IMPACT_POSTER: ImpactState = { drawn: true, lift: true };

/** Bookings per week: flat before the launch (index 5), rising after it. */
export const IMPACT_DATA = [9, 10, 9, 11, 10, 11, 13, 15, 18, 20, 23, 25];
export const IMPACT_LAUNCH = 5;
const CHART = { width: 196, height: 58 };

async function impactScript(a: Act<ImpactState>) {
	await a.wait(2200);
	a.mark('reset');
	await a.set({ lift: false });
	await a.wait(120);
	await a.set({ drawn: false });
	await a.wait(650);
	a.mark('draw');
	await a.set({ drawn: true });
	await a.wait(1300);
	await a.set({ lift: true });
	await a.wait(1400);
}

export function ImpactScene() {
	const copy = SCENE_COPY.impact;
	const points = chartPoints({ data: IMPACT_DATA, width: CHART.width, height: CHART.height });
	const launchX = points[IMPACT_LAUNCH]?.x ?? 0;
	return (
		<Scene step="impact">
			<Stage<ImpactState> width={TILE_WIDTH} height={TILE_HEIGHT} initial={IMPACT_POSTER} poster={IMPACT_POSTER} script={impactScript} className={styles.impact}>
				{(s) => (
					<div className={cx(look.panel, styles.metrics)}>
						<div className={styles.metricsHead}>
							<span className={look.strong}>{copy.title}</span>
							<span className={styles.lift} data-on={s.lift || undefined}>
								{copy.lift}
							</span>
						</div>
						<div className={styles.plot} style={{ ['--launch-x' as string]: launchX }}>
							<span className={styles.launch}>
								<span className={look.hueDot} />
								<span className={look.label}>{copy.launch}</span>
							</span>
							<span className={styles.launchRule} />
							<Chart data={IMPACT_DATA} width={CHART.width} height={CHART.height} show={s.drawn} className={styles.chart} />
						</div>
					</div>
				)}
			</Stage>
		</Scene>
	);
}

/** The six scenes by beat, for the cards. */
export const TILE_SCENES: Record<CraftStep, () => JSX.Element> = {
	idea: IdeaScene,
	path: PathScene,
	intention: IntentionScene,
	tech: TechScene,
	legacy: LegacyScene,
	impact: ImpactScene,
};

