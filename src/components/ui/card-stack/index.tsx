'use client';

//! React Core
import { Children, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react';

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
	className?: string;
};

const SWIPE_THRESHOLD = 40;

/**
 * Figma stacked carousels, made interactive (inspo: Figma draws only the rest state).
 * Swipe, the arrow buttons or the dots bring the next card to the front.
 */
export function CardStack({ label, itemLabel, children, variant = 'fan', initialIndex = 0, className }: CardStackProps) {
	const t = useTranslations('common');
	const items = Children.toArray(children);
	const count = items.length;
	const [front, setFront] = useState(initialIndex % count);
	const start = useRef<number | null>(null);
	const swiped = useRef(false);

	const go = (delta: number) => setFront((value) => (value + delta + count) % count);

	const onPointerDown = (event: PointerEvent) => {
		// Presses on controls (and anything modal) are never gestures.
		if ((event.target as Element).closest('a, button, input, textarea, dialog')) return;
		start.current = event.clientX;
		swiped.current = false;
	};
	const onPointerUp = (event: PointerEvent) => {
		if (start.current === null) return;
		const dx = event.clientX - start.current;
		start.current = null;
		if (Math.abs(dx) > SWIPE_THRESHOLD) {
			swiped.current = true;
			go(dx < 0 ? 1 : -1);
		}
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
				className={styles.stage}
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
				onPointerCancel={() => (start.current = null)}
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
			{count > 1 && (
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
