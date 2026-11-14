'use client';

//! React Core
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SkeletonShape = 'text' | 'circle' | 'rect';
export type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SkeletonProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
	/** `text` stands in for lines of copy, `circle` for an avatar or icon tile, `rect` for media and cards. */
	shape?: SkeletonShape;
	/** Text only: number of lines. The last of several is shorter, like a paragraph's. */
	lines?: number;
	/**
	 * Text: the Text size it stands in for (xs 12 … xl 24), so a line is as tall as the copy it replaces.
	 * Circle: the Avatar scale, sm 20 · md 28 · lg 40 · xl 60.
	 */
	size?: SkeletonSize;
	/** Any CSS width (`60%`, `var(--measure-narrow)`). Text and rect fill their container by default. */
	width?: string;
	/** Rect only: aspect ratio. Defaults to `16 / 9`. */
	ratio?: string;
};

/**
 * Inspo component (component.gallery "Skeleton"): a placeholder in the shape of content that is still
 * loading. Pulses with the transitions.dev "Skeleton loader" (stands still under reduced motion) and
 * is hidden from assistive tech: the region that loads says so (see SkeletonReveal).
 */
export function Skeleton({ shape = 'text', lines = 1, size, width, ratio = '16 / 9', className, style, ...rest }: SkeletonProps) {
	const textSize = size ?? 'md';
	const circleSize = size ?? 'md';
	return (
		<span
			aria-hidden="true"
			className={cx(styles.skeleton, styles[shape], 't-skel-skeleton', 'is-pulsing', shape === 'text' && styles[`text-${textSize}`], className)}
			style={{ width, ...style }}
			{...rest}
		>
			{shape === 'text' &&
				Array.from({ length: Math.max(1, lines) }, (_, index) => (
					<span key={index} className={cx(styles.bone, styles.line, lines > 1 && index === lines - 1 && styles.lastLine)} />
				))}
			{shape === 'circle' && <span className={cx(styles.bone, styles.circleBone, styles[`circle-${circleSize}`])} />}
			{shape === 'rect' && <span className={cx(styles.bone, styles.rectBone)} style={{ aspectRatio: ratio }} />}
		</span>
	);
}

export type SkeletonRevealProps = {
	/** Flip to true when the data arrives: skeleton and content cross-fade with a matching blur. */
	loaded: boolean;
	/** The placeholder, built from Skeleton in the same layout as the content. */
	skeleton: ReactNode;
	/** The real content. Render it once it exists; it stays inert until revealed. */
	children?: ReactNode;
	/** Announced politely while loading ("Loading projects"). */
	label?: string;
	className?: string;
};

/**
 * Swaps a skeleton for its content in place (transitions.dev "Skeleton loader and reveal").
 * Both layers share one grid cell, so the swap needs no fixed height; the skeleton leaves the
 * DOM once the reveal ends. The region is `aria-busy` while loading.
 */
export function SkeletonReveal({ loaded, skeleton, children, label, className }: SkeletonRevealProps) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(loaded);
	const [skeletonShown, setSkeletonShown] = useState(!loaded);
	const [resetting, setResetting] = useState(false);
	const [previousLoaded, setPreviousLoaded] = useState(loaded);

	// Back to loading: snap the skeleton back without animating the reverse (`is-resetting`).
	if (loaded !== previousLoaded) {
		setPreviousLoaded(loaded);
		if (!loaded) {
			setRevealed(false);
			setSkeletonShown(true);
			setResetting(true);
		}
	}

	useEffect(() => {
		const wrap = wrapRef.current;
		if (!wrap) return;
		if (!loaded) {
			// Drop `is-resetting` after the snap-back has been painted, so the next reveal animates again.
			const frame = requestAnimationFrame(() => setResetting(false));
			return () => cancelAnimationFrame(frame);
		}
		// Resolve the content's hidden rest state first, so adding `is-revealed` transitions from it.
		void contentRef.current?.offsetWidth;
		const frame = requestAnimationFrame(() => setRevealed(true));
		const revealMs = parseFloat(getComputedStyle(wrap).getPropertyValue('--reveal-dur')) || 400;
		const timer = window.setTimeout(() => setSkeletonShown(false), revealMs + 50);
		return () => {
			cancelAnimationFrame(frame);
			window.clearTimeout(timer);
		};
	}, [loaded]);

	return (
		<div
			ref={wrapRef}
			className={cx(styles.reveal, 't-skel', revealed && 'is-revealed', resetting && 'is-resetting', className)}
			aria-busy={!loaded || undefined}
		>
			{skeletonShown && (
				<div className={cx(styles.layer, styles.skeletonLayer, 't-skel-skeleton')} aria-hidden="true">
					{skeleton}
				</div>
			)}
			<div ref={contentRef} className={cx(styles.layer, 't-skel-content')} inert={!revealed}>
				{children}
			</div>
			{label && (
				<span role="status" className="u-visually-hidden">
					{loaded ? '' : label}
				</span>
			)}
		</div>
	);
}

export default Skeleton;
