'use client';

//! React Core
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';

//! Stageshow
import { bezier } from '@stageshow';

//! Components
import { LogoMark } from '@/components/ui/brand';
import { YetaCursor } from '@/components/ui/cursor';
import { WhyScene } from '@/components/ui/why-scene';
import { SCENE_PAYOFF_MS, type WhySceneName } from '@/components/ui/why-scene/shared';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './tour.module.css';

/*
 * The Why Yeta tour. Yeta's own cursor (the site cursor, with the logo mark
 * riding beside it) visits the feature chips one by one; each chip it hovers
 * unfolds into a small scene that shows what that promise means, then folds
 * back as the cursor moves on. A visitor hovering or focusing a chip opens
 * that one and pauses the tour; it picks up again a moment after they leave.
 *
 * One provider holds the state and runs the tour for whichever layout is
 * showing: the floating clusters (≥ 1440: chips unfold in place), the chip
 * row (768–1439: a panel under the row shows the hovered chip's scene) and
 * the phone card (< 768: an accordion, no cursor). The server renders the
 * poster: the first chip of each layout open on its payoff. The tour runs
 * only while the section is on screen, and never under reduced motion.
 */

type Layout = 'clusters' | 'row' | 'card';
type Point = { x: number; y: number };

/** How long the opening frame holds before the cursor shows, and how long a payoff holds before the cursor moves on. */
const HOLD_FIRST_MS = 1200;
const HOLD_MS = 1500;
/** A floating chip's fold, before the cursor leaves it. */
const FOLD_MS = 240;
/** The pause between the cursor arriving and the chip answering. */
const HOVER_MS = 140;
/** The phone card's chips sliding into place before the open one's scene shows (tour.module.css: fold lead + collapse). */
const SETTLE_MS = 380;
/** How long after a visitor leaves before the tour picks up again. */
const RESUME_MS = 1400;
/** The cursor's fade in and out (tour.module.css). */
const SHOW_MS = 320;
/** The kit's travel curve: a soft departure, a long, soft arrival. */
const travel = bezier([0.45, 0, 0.1, 1]);

class Stopped extends Error {}

type TourValue = {
	/** What the tour has open, if anything. */
	tour: string | null;
	/** What a visitor has open (hover, then focus), if anything. */
	visitor: string | null;
	/** The last chip shown, by the tour or a visitor: a panel or accordion keeps it until the next. */
	last: string | null;
	/** False until the tour has run once: the poster stays open meanwhile. */
	started: boolean;
	/** The chip whose scene plays its story; every other scene shows its poster. */
	playing: string | null;
	enter: (id: string) => void;
	leave: (id: string) => void;
	focus: (id: string) => void;
	blur: (id: string) => void;
};

const TourContext = createContext<TourValue | null>(null);

function useTour() {
	const value = useContext(TourContext);
	if (!value) throw new Error('Why Yeta tour parts must render inside <WhyTour>.');
	return value;
}

/** The chip a group shows open. Floating chips can all be closed; a panel or accordion always shows one. */
function useOpen(kind: 'float' | 'sticky', keys: readonly string[], poster: string) {
	const { tour, visitor, last, started } = useTour();
	const mine = (key: string | null) => (key && keys.includes(key) ? key : null);
	const live = mine(visitor) ?? mine(tour);
	if (kind === 'float') return live ?? (started ? null : poster);
	return live ?? mine(last) ?? poster;
}

/** Mounts a scene the first time its chip opens, and keeps it so it can fold away. */
function useSeen(open: boolean) {
	const [seen, setSeen] = useState(open);
	if (open && !seen) setSeen(true);
	return seen || open;
}

/* ─────────────────────────────── Provider ─────────────────────────────── */

const wait = (ms: number, signal: AbortSignal) =>
	new Promise<void>((resolve, reject) => {
		if (signal.aborted) return reject(new Stopped());
		const id = window.setTimeout(resolve, ms);
		signal.addEventListener(
			'abort',
			() => {
				window.clearTimeout(id);
				reject(new Stopped());
			},
			{ once: true }
		);
	});

/** The layout showing: the one whose chips are rendered. */
function layoutOf(section: HTMLElement): Layout | null {
	for (const layout of ['clusters', 'row', 'card'] as const) {
		const node = section.querySelector<HTMLElement>(`[data-why-layout="${layout}"] [data-why-node]`);
		if (node && node.getClientRects().length > 0) return layout;
	}
	return null;
}

/** That layout's chips, in tour order. */
function nodesOf(section: HTMLElement, layout: Layout) {
	return Array.from(section.querySelectorAll<HTMLElement>(`[data-why-layout="${layout}"] [data-why-node]`)).sort(
		(a, b) => Number(a.dataset.whyStep) - Number(b.dataset.whyStep)
	);
}

export function WhyTour({ children }: { children: ReactNode }) {
	const [tour, setTour] = useState<string | null>(null);
	const [hover, setHover] = useState<string | null>(null);
	const [focused, setFocused] = useState<string | null>(null);
	const [last, setLast] = useState<string | null>(null);
	const [started, setStarted] = useState(false);
	const [playing, setPlaying] = useState<string | null>(null);
	const visitor = hover ?? focused;

	const cursorRef = useRef<HTMLDivElement>(null);
	const controls = useRef<{ start: (resume: boolean) => void; stop: () => void } | null>(null);
	// What the running tour reads between awaits (state lags a render behind)
	const live = useRef({ tour, last, hover: null as string | null, focus: null as string | null, started: false });
	live.current.tour = tour;
	live.current.last = last;
	// The chip a visitor last opened, so the tour picks up after it
	const visited = useRef<string | null>(null);
	const resumeTimer = useRef(0);

	// A visitor takes over: their chip opens and plays, the tour's chip closes and its cursor steps away
	const takeOver = useCallback((id: string) => {
		window.clearTimeout(resumeTimer.current);
		visited.current = id;
		controls.current?.stop();
		setTour(null);
		setPlaying(id);
		setLast(id);
	}, []);
	// Once no chip is held, the tour picks up again after a moment
	const release = useCallback(() => {
		if (live.current.hover || live.current.focus) return;
		window.clearTimeout(resumeTimer.current);
		resumeTimer.current = window.setTimeout(() => controls.current?.start(true), RESUME_MS);
	}, []);

	const enter = useCallback(
		(id: string) => {
			live.current.hover = id;
			setHover(id);
			takeOver(id);
		},
		[takeOver]
	);
	const leave = useCallback(
		(id: string) => {
			if (live.current.hover !== id) return;
			live.current.hover = null;
			setHover(null);
			release();
		},
		[release]
	);
	const focus = useCallback(
		(id: string) => {
			live.current.focus = id;
			setFocused(id);
			takeOver(id);
		},
		[takeOver]
	);
	const blur = useCallback(
		(id: string) => {
			if (live.current.focus !== id) return;
			live.current.focus = null;
			setFocused(null);
			release();
		},
		[release]
	);

	useEffect(() => {
		const cursor = cursorRef.current;
		const section = cursor?.parentElement;
		if (!cursor || !section) return;

		let pos: Point | null = null;
		let ctrl: AbortController | null = null;
		let inView = false;

		const place = (p: Point) => {
			pos = p;
			cursor.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
		};
		const show = (on: boolean) => cursor.setAttribute('data-visible', on ? 'true' : 'false');

		// Where the cursor rests on a chip: past the end of its label, low in the pill, never over the words
		const target = (node: HTMLElement): Point => {
			const r = node.getBoundingClientRect();
			const s = section.getBoundingClientRect();
			return { x: r.right - s.left - Math.min(18, r.width * 0.1), y: r.top - s.top + r.height * 0.6 };
		};

		// A hand's shallow arc, timed by distance, on the kit's travel curve
		const glide = (to: Point, signal: AbortSignal) =>
			new Promise<void>((resolve, reject) => {
				const from = pos ?? to;
				const dx = to.x - from.x;
				const dy = to.y - from.y;
				const dist = Math.hypot(dx, dy);
				if (dist < 1) return resolve();
				const ms = Math.min(1300, Math.max(560, 380 + dist * 0.6));
				const bow = Math.min(dist * 0.08, 32);
				const nx = -dy / dist;
				const ny = dx / dist;
				const t0 = performance.now();
				let frame = 0;
				const step = (now: number) => {
					const t = Math.min(1, Math.max(0, (now - t0) / ms));
					const e = travel(t);
					const lift = Math.sin(Math.PI * e) * bow;
					place({ x: from.x + dx * e + nx * lift, y: from.y + dy * e + ny * lift });
					if (t < 1) frame = requestAnimationFrame(step);
					else resolve();
				};
				frame = requestAnimationFrame(step);
				signal.addEventListener(
					'abort',
					() => {
						cancelAnimationFrame(frame);
						reject(new Stopped());
					},
					{ once: true }
				);
			});

		const loop = async (signal: AbortSignal, resume: boolean) => {
			const layout = layoutOf(section);
			if (!layout) return;
			const nodes = nodesOf(section, layout);
			if (!nodes.length) return;
			const keys = nodes.map((n) => n.dataset.whyNode ?? '');
			const floating = layout === 'clusters';
			const withCursor = layout !== 'card';
			const poster = Math.max(
				0,
				nodes.findIndex((n) => n.hasAttribute('data-why-poster'))
			);

			const { tour: open, last: shown } = live.current;
			const from = resume ? (visited.current ?? open ?? shown) : (open ?? shown);
			let i = from && keys.includes(from) ? keys.indexOf(from) : poster;

			if (!resume) {
				// The chip that is open stays on its payoff: a story never rewinds in view
				live.current.started = true;
				setStarted(true);
				setTour(keys[i]);
				setLast(keys[i]);
				await wait(HOLD_FIRST_MS, signal);
				if (withCursor) {
					place(target(nodes[i]));
					show(true);
					await wait(SHOW_MS + 200, signal);
				}
			} else if (withCursor) {
				// It comes back on the chip the visitor left, and carries on from there
				place(target(nodes[i]));
				show(true);
				await wait(SHOW_MS + 60, signal);
			}

			for (;;) {
				if (floating && live.current.tour) {
					setTour(null);
					await wait(FOLD_MS, signal);
				}
				i = (i + 1) % nodes.length;
				const node = nodes[i];
				if (withCursor) {
					await glide(target(node), signal);
					await wait(HOVER_MS, signal);
				}
				setTour(keys[i]);
				setLast(keys[i]);
				// In the phone card the scene shows once its chip has slid into place: its story starts then
				if (!withCursor) await wait(SETTLE_MS, signal);
				setPlaying(keys[i]);
				const scene = node.dataset.whyScene as WhySceneName;
				await wait((SCENE_PAYOFF_MS[scene] ?? 1800) + HOLD_MS, signal);
			}
		};

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const stop = () => {
			ctrl?.abort();
			ctrl = null;
			show(false);
		};
		const start = (resume: boolean) => {
			if (ctrl || reducedMotion.matches || !inView || document.hidden) return;
			if (live.current.hover || live.current.focus) return;
			const run = new AbortController();
			ctrl = run;
			loop(run.signal, resume && live.current.started).catch((error) => {
				if (!(error instanceof Stopped)) console.error('[why-yeta] tour stopped', error);
			});
		};
		controls.current = { start, stop };

		const io = new IntersectionObserver(
			([entry]) => {
				inView = entry.isIntersecting;
				if (inView) start(false);
				else stop();
			},
			{ threshold: 0.2 }
		);
		io.observe(section);

		const onVisibility = () => (document.hidden ? stop() : start(false));
		const onMotion = () => (reducedMotion.matches ? stop() : start(false));
		// Crossing a breakpoint swaps the chips: start over on the new ones
		const tablet = window.matchMedia('(min-width: 768px)');
		const desktop = window.matchMedia('(min-width: 1440px)');
		const onLayout = () => {
			stop();
			pos = null;
			start(false);
		};

		document.addEventListener('visibilitychange', onVisibility);
		reducedMotion.addEventListener('change', onMotion);
		tablet.addEventListener('change', onLayout);
		desktop.addEventListener('change', onLayout);

		return () => {
			stop();
			window.clearTimeout(resumeTimer.current);
			io.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
			reducedMotion.removeEventListener('change', onMotion);
			tablet.removeEventListener('change', onLayout);
			desktop.removeEventListener('change', onLayout);
			controls.current = null;
		};
	}, []);

	const value = useMemo<TourValue>(
		() => ({ tour, visitor, last, started, playing, enter, leave, focus, blur }),
		[tour, visitor, last, started, playing, enter, leave, focus, blur]
	);

	return (
		<TourContext.Provider value={value}>
			{children}
			<TourCursor cursorRef={cursorRef} />
		</TourContext.Provider>
	);
}

/* ─────────────────────────────── The cursor ─────────────────────────────── */

/** The Yeta cursor glyph (ui/cursor), drawn for the tour, with Yeta's mark riding beside it. Decorative. */
function TourCursor({ cursorRef }: { cursorRef: RefObject<HTMLDivElement | null> }) {
	return (
		<div ref={cursorRef} className={styles.cursor} data-visible="false" aria-hidden="true">
			<YetaCursor className={styles.arrow} />
			<span className={styles.tag}>
				<LogoMark size={16} alt="" />
			</span>
		</div>
	);
}

/* ─────────────────────────────── The chips ─────────────────────────────── */

type NodeProps = {
	/** The chip's key in its layout (a feature or a highlight). */
	id: string;
	/** The scene it unfolds into. */
	scene: WhySceneName;
	/** Its place in the tour. */
	step: number;
	/** float: unfolds in place (clusters). tab: shown in the panel under the row. fold: opens under the chip in the card (phone). */
	variant: 'float' | 'tab' | 'fold';
	/** Every chip key in its layout, and the one open in the poster. */
	keys: readonly string[];
	poster: string;
	/** Where a floating chip's scene opens: above or below it, from its start or end edge. */
	dir?: 'up' | 'down';
	anchor?: 'start' | 'end';
	/** A floating chip whose open scene lies over this one: this chip steps back while it is open. */
	coveredBy?: string;
	className?: string;
	children: ReactNode;
};

/**
 * One feature chip in the tour. The chip (the children) is the only readable
 * part; the scene beside it is decorative. Hovering it, or focusing it with
 * the keyboard or a tap, opens it and pauses the tour.
 */
export function WhyNode({ id, scene, step, variant, keys, poster, dir = 'down', anchor = 'start', coveredBy, className, children }: NodeProps) {
	const { enter, leave, focus, blur, playing } = useTour();
	const openKey = useOpen(variant === 'float' ? 'float' : 'sticky', keys, poster);
	const open = openKey === id;
	const covered = !!coveredBy && openKey === coveredBy;
	// In the phone card, the chips after the open one move down to make its room
	const below = variant === 'fold' && openKey !== null && keys.indexOf(id) > keys.indexOf(openKey);
	const seen = useSeen(open);

	return (
		<li
			className={cx(styles.node, styles[variant], className)}
			data-why-node={id}
			data-why-scene={scene}
			data-why-step={step}
			data-why-poster={id === poster ? '' : undefined}
			data-open={open || undefined}
			data-covered={covered || undefined}
			data-below={below || undefined}
			data-dir={variant === 'float' ? dir : undefined}
			data-anchor={variant === 'float' ? anchor : undefined}
			tabIndex={0}
			onPointerEnter={(e) => e.pointerType === 'mouse' && enter(id)}
			onPointerLeave={(e) => e.pointerType === 'mouse' && leave(id)}
			onFocus={() => focus(id)}
			onBlur={() => blur(id)}
		>
			{children}
			{variant === 'float' && (
				<span className={styles.card}>
					<span className={cx(styles.window, 'u-bevel')}>{seen && <WhyScene scene={scene} playing={open && playing === id} />}</span>
				</span>
			)}
			{variant === 'fold' && (
				<span className={cx(styles.well, 'u-bevel')}>{seen && <WhyScene scene={scene} playing={open && playing === id} />}</span>
			)}
		</li>
	);
}

/**
 * The panel under the tablet chip row: the open chip's scene, crossfading as
 * the tour (or a visitor) moves along the row. Fixed size, so nothing moves.
 */
export function WhyPanel({ items, poster, className }: { items: ReadonlyArray<{ id: string; scene: WhySceneName }>; poster: string; className?: string }) {
	const { playing } = useTour();
	const keys = useMemo(() => items.map((item) => item.id), [items]);
	const open = useOpen('sticky', keys, poster) ?? poster;
	const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set([open]));
	if (!seen.has(open)) setSeen(new Set(seen).add(open));

	return (
		<div className={cx(styles.panel, 'u-bevel', className)} aria-hidden="true">
			{items.map((item) =>
				seen.has(item.id) ? (
					<span key={item.id} className={styles.slide} data-open={item.id === open || undefined}>
						<WhyScene scene={item.scene} playing={item.id === open && playing === item.id} />
					</span>
				) : null
			)}
		</div>
	);
}
