/* eslint-disable @next/next/no-img-element -- static brand SVGs inside a scene: next/image adds nothing and would rasterise them. */

//! React Core
import type { HTMLAttributes } from 'react';

//! Components
import { Bar, Check } from '@stageshow';

//! Data
import { SCENE_COPY } from './data';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import look from './look.module.css';
import styles from './parts.module.css';

/*
 * The pieces the Our Craft scenes are built from, shared by the six tiles (A), the
 * walkthrough (B) and the bento (C). Each scene sizes them through custom properties
 * on its own class; nothing here moves on its own, the scenes drive the state.
 */

type DivProps = HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, unknown>;

/** A blinking text caret: solid while keys are going in. */
export function TypeCaret({ on, typing }: { on: boolean; typing?: boolean }) {
	return <span className={styles.caret} data-on={on || undefined} data-typing={typing || undefined} aria-hidden />;
}

/**
 * A sticky note on a board. With `words` it is the idea the story is about (and takes the
 * beat's hue as a thin tab); without, a quiet note of placeholder lines.
 */
export function Note({
	words,
	bars = [44, 30],
	hued = false,
	caret,
	className,
	...rest
}: DivProps & { words?: string; bars?: number[]; hued?: boolean; caret?: { on: boolean; typing?: boolean } }) {
	return (
		<div {...rest} className={cx(styles.note, className)} data-hued={hued || undefined}>
			{words !== undefined ? (
				<span className={cx(look.strong, styles.noteWords)}>
					{words}
					{caret && <TypeCaret on={caret.on} typing={caret.typing} />}
				</span>
			) : (
				<span className={styles.noteBars}>
					{bars.map((w, i) => (
						<Bar key={i} w={w} h={5} tone={3} />
					))}
				</span>
			)}
		</div>
	);
}

/**
 * One node of a flow: a page in the sitemap. The goal node keeps a slot for the beat's hue
 * dot, which grows in when `lit`, so the label never shifts.
 */
export function FlowNode({ label, goal = false, lit = true, className, ...rest }: DivProps & { label?: string; goal?: boolean; lit?: boolean }) {
	return (
		<div {...rest} className={cx(styles.node, className)}>
			{goal && <span className={cx(look.hueDot, styles.goalDot)} data-on={lit || undefined} />}
			{label ? <span className={look.strong}>{label}</span> : <Bar w={40} h={5} tone={3} />}
		</div>
	);
}

export type Tool = 'nextjs' | 'react' | 'vercel' | 'figma' | 'slack' | 'loom';

/** A tool's real mark, from the landing's Our Work assets. Vercel has one artwork per canvas. */
export function ToolMark({ tool, className }: { tool: Tool; className?: string }) {
	if (tool === 'vercel') {
		return (
			<span className={cx(styles.mark, className)}>
				<img src="/landing/our-work/tools/vercel-light.svg" alt="" className="u-only-light" />
				<img src="/landing/our-work/tools/vercel-dark.svg" alt="" className="u-only-dark" />
			</span>
		);
	}
	return (
		<span className={cx(styles.mark, className)} data-tool={tool}>
			<img src={`/landing/our-work/tools/${tool}.svg`} alt="" />
		</span>
	);
}

/** A row of the stack: the tool's mark, its name and a check that fills as it is added. */
export function ToolRow({ tool, name, on, className, ...rest }: DivProps & { tool: Tool; name: string; on: boolean }) {
	return (
		<div {...rest} className={cx(styles.toolRow, className)}>
			<ToolMark tool={tool} />
			<span className={look.strong}>{name}</span>
			<Check on={on} size={14} className={styles.toolCheck} />
		</div>
	);
}

/** A release in the changelog: its version, what it brought and a quiet date. */
export function ReleaseRow({ version, note, latest = false, className, ...rest }: DivProps & { version: string; note: string; latest?: boolean }) {
	return (
		<div {...rest} className={cx(styles.release, className)} data-latest={latest || undefined}>
			<span className={styles.version}>{version}</span>
			<span className={cx(look.strong, styles.releaseNote)}>{note}</span>
			{latest ? <span className={look.hueDot} /> : <Bar w={22} h={5} tone={2} className={styles.releaseDate} />}
		</div>
	);
}

/**
 * A landing hero as a wireframe or as the designed page. Both states sit in the same
 * slots and cross-fade in reading order, so the structure stays put and only its voice
 * changes: bars become the headline, the outline becomes the button.
 */
export function DesignFrame({ mode, slots = false, className, ...rest }: DivProps & { mode: 'wire' | 'design'; slots?: boolean }) {
	const copy = SCENE_COPY.intention;
	return (
		<div {...rest} className={cx(styles.frame, className)} data-mode={mode} data-slots={slots || undefined}>
			<div className={styles.frameCopy}>
				<div className={styles.slot} data-slot="heading">
					<span className={styles.wire}>
						<Bar w="88%" h={7} tone={3} />
						<Bar w="56%" h={7} tone={3} />
					</span>
					<span className={cx(styles.design, styles.heading)}>{copy.heading}</span>
				</div>
				<div className={styles.slot} data-slot="line">
					<span className={styles.wire}>
						<Bar w="72%" h={4} tone={2} />
					</span>
					<span className={styles.design}>
						<Bar w="80%" h={4} tone={2} />
					</span>
				</div>
				<div className={styles.slot} data-slot="button">
					<span className={cx(styles.wire, styles.wireButton)}>
						<Bar w={36} h={4} tone={3} />
					</span>
					<span className={cx(styles.design, styles.button)}>{copy.button}</span>
				</div>
			</div>
			{slots && (
				<div className={styles.times}>
					{copy.times.map((time, i) => (
						<div key={time} className={styles.slot} data-slot={`time-${i}`}>
							<span className={cx(styles.wire, styles.wireTime)}>
								<Bar w={28} h={4} tone={3} />
							</span>
							<span className={cx(styles.design, styles.time)} data-picked={i === PICKED || undefined}>
								{i === PICKED && <span className={look.hueDot} />}
								{time}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

/** The time the designed booking card shows as picked. */
const PICKED = 1;
