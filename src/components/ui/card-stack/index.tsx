'use client';

//! React Core
import { Children, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type CardStackProps = {
	label: string;
	itemLabel?: string;
	children: ReactNode;
	/**
	 * `fan`: back cards peek out left and right at 95% (Figma Testimonial Cards Carousel).
	 * `deck`: back cards peek out above at 95% and 90% (Figma Project Overview Cards Carousel).
	 */
	variant?: 'fan' | 'deck';
	/** Index shown in front first. Figma puts the middle testimonial in front. */
	initialIndex?: number;
	/** Show the arrows and dots under the stack. Off leaves the swipe as the only control. */
	controls?: boolean;
	className?: string;
};

/** Movement before a press becomes a drag (so taps on the card still click). */
const DRAG_SLOP = 6;
/** Share of the stage width, or release speed in px/ms, that commits a swipe. */
const COMMIT_SHARE = 0.22;
const COMMIT_SPEED = 0.45;
/** Tilt of the front card per pixel dragged, in degrees. */
const TILT_PER_PX = 0.035;

/**
 * Figma stacked carousels, made interactive (inspo: Figma draws only the rest state).
 * A swipe is direct manipulation: the front card follows the finger and tilts with it while
 * the cards behind come forward in step. Released far or fast enough, the card carries on
 * from where the finger left it and the next one takes the front; otherwise it settles back.
 * The arrow buttons and the dots do the same without the drag.
 */
export function CardStack({ label, itemLabel, children, variant = 'fan', initialIndex = 0, controls = true, className }: CardStackProps) {
	const t = useTranslations('common');
	const items = Children.toArray(children);
	const count = items.length;
	const [front, setFront] = useState(initialIndex % count);
	const stage = useRef<HTMLDivElement>(null);
	const drag = useRef<{ id: number; x: number; lastX: number; lastT: number; speed: number; active: boolean } | null>(null);
	const swiped = useRef(false);

	const go = (delta: number) => setFront((value) => (value + delta + count) % count);

	// The drag is written straight to custom properties on the stage, so following the finger never re-renders.
	const paint = (dx: number) => {
		const node = stage.current;
		if (!node) return;
		node.style.setProperty('--drag-x', `${dx}px`);
		node.style.setProperty('--drag-tilt', `${dx * TILT_PER_PX}deg`);
		node.style.setProperty('--drag-p', `${Math.min(1, Math.abs(dx) / (node.clientWidth * 0.6))}`);
	};
	const settle = () => {
		const node = stage.current;
		if (!node) return;
		delete node.dataset.dragging;
		node.style.removeProperty('--drag-x');
		node.style.removeProperty('--drag-tilt');
		node.style.removeProperty('--drag-p');
	};

	const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		// Presses on controls (and anything modal) are never gestures.
		if (count < 2 || (event.target as Element).closest('a, button, input, textarea, dialog')) return;
		drag.current = { id: event.pointerId, x: event.clientX, lastX: event.clientX, lastT: event.timeStamp, speed: 0, active: false };
		swiped.current = false;
	};
	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const state = drag.current;
		if (!state || state.id !== event.pointerId) return;
		const dx = event.clientX - state.x;
		if (!state.active) {
			if (Math.abs(dx) < DRAG_SLOP) return;
			state.active = true;
			// Keep the drag when the finger leaves the card; a pointer that is already gone simply is not captured.
			try {
				event.currentTarget.setPointerCapture(event.pointerId);
			} catch {}
			event.currentTarget.dataset.dragging = '';
		}
		const dt = event.timeStamp - state.lastT;
		if (dt > 0) state.speed = (event.clientX - state.lastX) / dt;
		state.lastX = event.clientX;
		state.lastT = event.timeStamp;
		paint(dx);
	};
	const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
		const state = drag.current;
		drag.current = null;
		if (!state || !state.active) return;
		const dx = event.clientX - state.x;
		const width = stage.current?.clientWidth ?? 1;
		const commit = Math.abs(dx) > width * COMMIT_SHARE || Math.abs(state.speed) > COMMIT_SPEED;
		swiped.current = true;
		// Change the front and drop the drag in one frame: every card then eases from where the finger left it.
		flushSync(() => {
			if (commit) go(dx < 0 ? 1 : -1);
		});
		settle();
	};
	const onPointerCancel = () => {
		drag.current = null;
		settle();
	};
	// A swipe that ends over a control must not also click it.
	const onClickCapture = (event: MouseEvent) => {
		if (!swiped.current) return;
		event.preventDefault();
		event.stopPropagation();
		swiped.current = false;
	};

	return (
		<section className={cx(styles.stack, styles[variant], className)} aria-roledescription="carousel" aria-label={label}>
			<div
				ref={stage}
				className={styles.stage}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				onClickCapture={onClickCapture}
			>
				{items.map((child, i) => {
					// 0 = front, 1 = next, count-1 = previous.
					const offset = (i - front + count) % count;
					const position = offset === 0 ? 'front' : offset === 1 ? 'next' : offset === count - 1 ? 'previous' : 'hidden';
					return (
						<div
							key={i}
							className={cx(styles.card, styles[position])}
							aria-hidden={position !== 'front'}
							inert={position !== 'front'}
							role="group"
							aria-roledescription="slide"
							aria-label={`${i + 1} / ${count}`}
						>
							{child}
						</div>
					);
				})}
			</div>
			{controls && count > 1 && (
				<div className={styles.controls}>
					<Button variant="ghost" size="md" icon="arrow-left" label={t('previous')} onClick={() => go(-1)} />
					<PaginationDots count={count} index={front} onSelect={setFront} itemLabel={itemLabel ?? t('slide')} />
					<Button variant="ghost" size="md" icon="arrow-right" label={t('next')} onClick={() => go(1)} />
				</div>
			)}
			<p className="u-visually-hidden" aria-live="polite">
				{`${front + 1} / ${count}`}
			</p>
		</section>
	);
}

export default CardStack;
