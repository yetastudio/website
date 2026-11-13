import { Bar, Caret, Prompt, Spinner, Stage, States, Text, type Act } from '@stageshow';
import { Check } from 'lucide-react';

import { SCENE_HEIGHT, SCENE_WIDTH, type SceneCopy } from './shared';
import look from './look.module.css';
import styles from './develop.module.css';

// Develop: code, then a build. An editor hangs off the tile's left gutter and
// runs off the bottom; a terminal straddles its right edge, over the editor's
// empty margin, never over the code. Beats: one line is typed in the
// component; the build command is typed in the terminal; it runs (Building)
// and passes (Compiled). No cursor: the keys and the build carry it. The
// poster is the typed line with the passing build beside it. Loop: the
// terminal's output clears, then the line (the last change first), and both
// are written again; the terminal stays, so its column is never empty.
//
// Real strings: the file name, the typed line, the command and its result.

type Status = 'none' | 'building' | 'passed';
type S = {
	typed: string;
	cmd: string;
	status: Status;
	/** Where the keys go: the editor's caret or the terminal's. */
	focus: 'editor' | 'term';
	typing: boolean;
	clearing: 'none' | 'term' | 'code';
};

/** The line numbers down the gutter, and placeholder code around the typed line. */
const CODE: ReadonlyArray<ReadonlyArray<{ w: number; kw?: boolean }>> = [
	[{ w: 34, kw: true }, { w: 46 }, { w: 58 }],
	[],
	[{ w: 8 }],
	[],
	[{ w: 34, kw: true }, { w: 64 }],
	[{ w: 20, kw: true }, { w: 92 }],
];
const TYPED_ROW = 1;
/** Keyword bars take the tile's hue, quietly. */
const KEYWORD = { background: 'color-mix(in srgb, var(--ss-accent) 55%, transparent)' };

const posterFor = (copy: SceneCopy['develop']): S => ({ typed: copy.line, cmd: copy.command, status: 'passed', focus: 'editor', typing: false, clearing: 'none' });

const scripts = new Map<string, (a: Act<S>) => Promise<void>>();
function scriptFor(copy: SceneCopy['develop']) {
	const id = `${copy.line}\u0000${copy.command}`;
	const known = scripts.get(id);
	if (known) return known;
	const script = async (a: Act<S>) => {
		await a.wait(2000);
		// Reset in place, the last change first: the terminal's run, then the line
		a.mark('reset');
		await a.set({ clearing: 'term' });
		await a.wait(240);
		await a.snap({ cmd: '', status: 'none', clearing: 'none', focus: 'term' });
		await a.wait(140);
		await a.set({ clearing: 'code' });
		await a.wait(240);
		await a.snap({ typed: '', clearing: 'none', focus: 'editor' });
		await a.wait(420);

		// The line is written
		a.mark('type');
		await a.set({ typing: true });
		await a.type('typed', copy.line, { interval: 62 });
		await a.set({ typing: false });
		await a.wait(360);

		// The build is run in the terminal
		a.mark('build');
		await a.set({ focus: 'term', typing: true });
		await a.type('cmd', copy.command, { interval: 48 });
		await a.set({ typing: false });
		await a.wait(220);
		await a.set({ status: 'building' });
		await a.wait(1300);

		// It passes, and the keys go back to the editor
		a.mark('passed');
		await a.set({ status: 'passed' });
		await a.wait(420);
		await a.set({ focus: 'editor' });
		await a.wait(1300);
	};
	scripts.set(id, script);
	return script;
}

export function DevelopScene({ copy }: { copy: SceneCopy['develop'] }) {
	const poster = posterFor(copy);
	const space = copy.line.indexOf(' ');
	return (
		<Stage<S> width={SCENE_WIDTH} height={SCENE_HEIGHT} initial={poster} poster={poster} script={scriptFor(copy)} className={styles.stage}>
			{(s) => {
				const keyword = space > 0 ? s.typed.slice(0, space) : '';
				const rest = space > 0 ? s.typed.slice(space) : s.typed;
				const editing = s.focus === 'editor';
				return (
					<>
						<div className={`${look.panel} ${styles.editor}`}>
							<div className={styles.tabs}>
								<span className={styles.tab}>
									<span className={styles.dot} />
									<Text className={look.label}>{copy.file}</Text>
								</span>
							</div>
							<div className={styles.code}>
								{CODE.map((tokens, i) => (
									<div key={i} className={styles.line}>
										<span className={styles.number}>{i + 1}</span>
										{i === TYPED_ROW ? (
											<span
												className={styles.typed}
												data-clearing={s.clearing === 'code' || undefined}
												data-typing={(editing && s.typing) || undefined}
											>
												<span className={styles.keyword}>{keyword}</span>
												{rest}
												<span className={styles.caret} data-on={editing || undefined} data-typing={(editing && s.typing) || undefined} />
											</span>
										) : (
											<span className={styles.tokens} data-indent={i === 5 || undefined}>
												{tokens.map((t, j) => (
													<Bar key={j} w={t.w} h={5} tone={2} style={t.kw ? KEYWORD : undefined} />
												))}
											</span>
										)}
									</div>
								))}
							</div>
						</div>
						<div className={styles.term}>
							<div className={`ss-term ${styles.termBody}`} data-clearing={s.clearing === 'term' || undefined}>
								<Prompt path="" data-typing={(!editing && s.typing) || undefined}>
									{s.cmd}
									{!editing && s.status === 'none' ? <Caret still={s.typing} /> : null}
								</Prompt>
								<States
									value={s.status}
									align="start"
									className={styles.status}
									states={{
										none: <span className={styles.statusLine} />,
										building: (
											<span className={styles.statusLine}>
												<Spinner size={10} />
												<span className="dim">{copy.building}</span>
											</span>
										),
										passed: (
											<span className={`${styles.statusLine} ok`}>
												<Check size={10} strokeWidth={2.5} aria-hidden />
												<span>{copy.passed}</span>
											</span>
										),
									}}
								/>
							</div>
						</div>
					</>
				);
			}}
		</Stage>
	);
}
