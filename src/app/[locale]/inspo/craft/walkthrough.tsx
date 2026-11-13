'use client';

//! React Core
import { useMemo, useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Bar, Chart, Collapse, Connector, Stage, Tabs, Window, chartPoints, useReducedMotion, type Act } from '@stageshow';
import { Text } from '@/components/ui';
import { DesignFrame, FlowNode, Note, ReleaseRow, ToolRow } from './parts';
import { IMPACT_DATA, IMPACT_LAUNCH } from './scenes';

//! Data
import { CRAFT_HUES, CRAFT_STEPS, SCENE_COPY, STEP_TABS } from './data';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import look from './look.module.css';
import styles from './walkthrough.module.css';

/*
 * Alternative B: one project window, six views. The Yeta cursor steps through the tabs
 * left to right; each view plays its beat as it opens (the note, the path drawing on, the
 * wireframe taking its voice, the stack checked, a release shipping, bookings rising), and
 * the last click goes back to Idea, which is the loop. The page index beside it follows
 * the scene. Poster (reduced motion): the Design view, designed.
 */

type S = {
	step: number;
	lines: number;
	designed: boolean;
	checked: number;
	latest: boolean;
	drawn: boolean;
	lift: boolean;
};

const INITIAL: S = { step: 0, lines: 0, designed: false, checked: 0, latest: false, drawn: false, lift: false };
const POSTER: S = { step: 2, lines: 2, designed: true, checked: 4, latest: true, drawn: true, lift: true };
export const WALKTHROUGH_POSTER_STEP = POSTER.step;

const WIDE = { width: 500, height: 320 };
/** The quiet notes around the idea, in reading order; the grid places them round it. */
const BOARD_FILLER = [[44, 30], [36, 46], [48], [30, 40], [42, 26], [38], [46, 32], [28, 44], [40], [34, 48], [44], [30, 36], [46, 28], [38, 42]];
const COMPACT = { below: 470, width: 326, height: 300 };
const CHART_WIDE = { width: 300, height: 76 };
const CHART_COMPACT = { width: 228, height: 64 };

function makeScript(notify: (step: number) => void) {
	return async (a: Act<S>) => {
		const open = async (step: number, patch: Partial<S> = {}) => {
			await a.click(`tab-${step}`);
			await a.set({ step, ...patch });
			notify(step);
		};

		notify(0);
		await a.wait(2200);

		a.mark('path');
		await open(1);
		await a.wait(260);
		await a.set({ lines: 1 });
		await a.wait(800);
		await a.set({ lines: 2 });
		await a.wait(1700);

		a.mark('design');
		await open(2);
		await a.wait(700);
		await a.set({ designed: true });
		await a.wait(2000);

		a.mark('build');
		await open(3);
		for (const n of [1, 2, 3, 4]) {
			await a.wait(380);
			await a.set({ checked: n });
		}
		await a.wait(1500);

		a.mark('evolve');
		await open(4);
		await a.wait(520);
		await a.set({ latest: true });
		await a.wait(1900);

		a.mark('impact');
		await open(5);
		await a.wait(240);
		await a.set({ drawn: true });
		await a.wait(1300);
		await a.set({ lift: true });
		await a.wait(1900);

		// Back to the start: Idea opens, and the other views settle unseen behind it
		a.mark('loop');
		await open(0);
		await a.wait(320);
		await a.snap({ lines: 0, designed: false, checked: 0, latest: false, drawn: false, lift: false });
		await a.move('rest');
		await a.wait(400);
	};
}

function WalkthroughScene({ onStep }: { onStep: (step: number) => void }) {
	// One stable script: a new identity would restart the scene. `onStep` is a state setter, so it never changes.
	const script = useMemo(() => makeScript(onStep), [onStep]);
	const copy = SCENE_COPY;

	return (
		<Stage<S>
			width={WIDE.width}
			height={WIDE.height}
			compact={COMPACT}
			initial={INITIAL}
			poster={POSTER}
			script={script}
			cursor={{ at: 'rest', style: 'real', ripple: true }}
			className={styles.stage}
		>
			{(s, rect, layout) => {
				const compact = layout === 'compact';
				const chart = compact ? CHART_COMPACT : CHART_WIDE;
				const launchX = chartPoints({ data: IMPACT_DATA, ...chart })[IMPACT_LAUNCH]?.x ?? 0;
				const home = rect('w-home');
				const services = rect('w-services');
				const book = rect('w-book');
				const view = (step: number) => ({
					className: cx(styles.view, look.hued),
					'data-on': s.step === step || undefined,
					'data-hue': CRAFT_HUES[CRAFT_STEPS[step]],
				});
				return (
					<>
						<Window title={copy.intention.url} lights="grey" className={styles.window}>
							<div className={styles.tabsRow}>
								<Tabs
									items={CRAFT_STEPS.map((step, i) => (compact ? String(i + 1).padStart(2, '0') : STEP_TABS[step]))}
									value={s.step}
									targets={CRAFT_STEPS.map((_, i) => `tab-${i}`)}
									className={styles.tabs}
								/>
								<span className={look.label}>{compact ? STEP_TABS[CRAFT_STEPS[s.step]] : null}</span>
							</div>
							<div className={cx(look.canvas, styles.views)}>
								{/* 01 Idea: a board, the written note among quiet ones */}
								<div {...view(0)}>
									<div className={styles.board}>
										<Note className={cx(styles.boardNote, styles.focus)} words={copy.idea.note} hued />
										{BOARD_FILLER.map((bars, i) => (
											<Note key={i} className={styles.boardNote} bars={bars} />
										))}
									</div>
								</div>

								{/* 02 Path: three pages, joined as the view opens */}
								<div {...view(1)}>
									<FlowNode data-target="w-home" className={styles.home} label={copy.path.home} />
									<FlowNode data-target="w-services" className={styles.services} label={copy.path.services} />
									<FlowNode data-target="w-book" className={styles.book} label={copy.path.book} goal lit={s.lines >= 2} />
								</div>

								{/* 03 Design: the wireframe takes its voice */}
								<div {...view(2)}>
									<div className={styles.designPage}>
										<DesignFrame mode={s.designed ? 'design' : 'wire'} slots className={styles.frame} />
										<div className={styles.features}>
											{[78, 64, 90].map((w, i) => (
												<div key={i} className={styles.feature}>
													<Bar w={16} h={16} r={5} tone={2} />
													<Bar w={w} h={5} tone={3} />
												</div>
											))}
										</div>
									</div>
								</div>

								{/* 04 Build: the stack, checked top to bottom */}
								<div {...view(3)}>
									<div className={styles.card}>
										<div className={styles.cardHead}>
											<span className={look.hueDot} />
											<span className={look.strong}>{copy.tech.title}</span>
										</div>
										<ToolRow tool="figma" name={copy.tech.figma} on={s.checked >= 1} />
										<ToolRow tool="nextjs" name={copy.tech.next} on={s.checked >= 2} />
										<ToolRow tool="react" name={copy.tech.react} on={s.checked >= 3} />
										<ToolRow tool="vercel" name={copy.tech.vercel} on={s.checked >= 4} />
									</div>
								</div>

								{/* 05 Evolve: a release ships on top of the ones before it */}
								<div {...view(4)}>
									<div className={styles.card}>
										<div className={styles.cardHead}>
											<span className={look.strong}>{copy.legacy.title}</span>
										</div>
										<Collapse open={s.latest}>
											<ReleaseRow version={copy.legacy.latest.version} note={copy.legacy.latest.note} latest />
										</Collapse>
										{copy.legacy.past.map((release) => (
											<ReleaseRow key={release.version} version={release.version} note={release.note} className={styles.rule} />
										))}
									</div>
								</div>

								{/* 06 Impact: bookings rise after the launch */}
								<div {...view(5)}>
									<div className={cx(styles.card, styles.metrics)}>
										<div className={styles.metricsHead}>
											<span className={look.strong}>{copy.impact.title}</span>
											<span className={styles.lift} data-on={s.lift || undefined}>
												{copy.impact.lift}
											</span>
										</div>
										<div className={styles.plot} style={{ ['--launch-x' as string]: launchX }}>
											<span className={styles.launch}>
												<span className={look.hueDot} />
												<span className={look.label}>{copy.impact.launch}</span>
											</span>
											<span className={styles.launchRule} />
											<Chart data={IMPACT_DATA} width={chart.width} height={chart.height} show={s.drawn} className={styles.chart} />
										</div>
									</div>
								</div>
							</div>
						</Window>
						<Connector
							show={s.step === 1 && s.lines >= 1}
							route="h"
							radius={8}
							from={{ x: home.x + home.width, y: home.y + home.height / 2 }}
							to={{ x: services.x + services.width / 2, y: services.y }}
						/>
						<Connector
							show={s.step === 1 && s.lines >= 2}
							route="h"
							radius={8}
							from={{ x: services.x + services.width, y: services.y + services.height / 2 }}
							to={{ x: book.x + book.width / 2, y: book.y + book.height }}
						/>
						<span data-target="rest" className={styles.rest} />
					</>
				);
			}}
		</Stage>
	);
}

const pad = (index: number) => String(index + 1).padStart(2, '0');

/**
 * The walkthrough with its index: the six beats as a numbered list under the window, the
 * one on screen lit with its hue rule, and its subtitle below. Under reduced motion the
 * index shows the poster's beat.
 */
export function CraftWalkthroughMockup() {
	const t = useTranslations('ourCraft');
	const [active, setActive] = useState(0);
	const reduced = useReducedMotion();
	const shown = reduced ? WALKTHROUGH_POSTER_STEP : active;

	return (
		<div className={styles.container}>
			<div className={cx(look.root, styles.scene)} aria-hidden="true">
				<WalkthroughScene onStep={setActive} />
			</div>
			<div className={styles.caption}>
				<ol className={styles.index}>
					{CRAFT_STEPS.map((step, i) => (
						<li
							key={step}
							className={cx(styles.indexItem, look.hued)}
							data-hue={CRAFT_HUES[step]}
							data-on={i === shown || undefined}
							aria-current={i === shown ? 'step' : undefined}
						>
							<Text as="span" size="xs" tone="faint" className={styles.numeral}>
								{pad(i)}
							</Text>
							<Text as="span" size="sm" tone={i === shown ? 'strong' : 'subtle'} leading="snug">
								{t(`cards.${step}.title`)}
							</Text>
						</li>
					))}
				</ol>
				<Text size="sm" family="serif" italic tone="subtle" leading="snug" aria-live="polite" className={styles.subtitle}>
					{t(`cards.${CRAFT_STEPS[shown]}.subtitle`)}
				</Text>
			</div>
		</div>
	);
}

export default CraftWalkthroughMockup;
