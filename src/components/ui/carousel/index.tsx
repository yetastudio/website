'use client';

//! React Core
import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { PaginationDots } from '@/components/ui/pagination-dots';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type CarouselProps = {
	/** Accessible name of the carousel region ("Our craft"). */
	label: string;
	/** What one slide is ("card"), used in the dot labels. */
	itemLabel?: string;
	children: ReactNode;
	/** Space between slides. Figma: 16 for craft, 12 for process. */
	gap?: 'sm' | 'md';
	/** Show the position dots under the track. */
	showDots?: boolean;
	className?: string;
};

/**
 * Inspo component: the horizontal, scroll-snapping track the mobile frames draw. The card
 * on show sits centred on the screen, the first one included, and its neighbours peek in
 * from both sides. Native scrolling, so touch, trackpad and keyboard all work; dots are
 * added because Figma draws none.
 */
export function Carousel({ label, itemLabel, children, gap = 'md', showDots = true, className }: CarouselProps) {
	const t = useTranslations('common');
	const track = useRef<HTMLUListElement>(null);
	const [index, setIndex] = useState(0);
	const items = Children.toArray(children);

	// Centre the first slide: the inline inset is half the track minus half a slide, kept in
	// step with resizes. Written straight to a custom property, so it never re-renders.
	useLayoutEffect(() => {
		const node = track.current;
		const first = node?.children[0];
		if (!node || !(first instanceof HTMLElement)) return;
		const center = () => {
			const inset = Math.max(0, (node.clientWidth - first.offsetWidth) / 2);
			node.style.setProperty('--carousel-inset', `${inset}px`);
		};
		center();
		const observer = new ResizeObserver(center);
		observer.observe(node);
		observer.observe(first);
		return () => observer.disconnect();
	}, [items.length]);

	useEffect(() => {
		const node = track.current;
		if (!node) return;
		const slides = Array.from(node.children) as HTMLElement[];
		const ratios = new Map<Element, number>();
		// The active dot is the slide with the largest visible share, not the last one to peek in.
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio));
				let best = 0;
				let bestRatio = -1;
				slides.forEach((slide, i) => {
					const ratio = ratios.get(slide) ?? 0;
					if (ratio > bestRatio + 0.01) {
						best = i;
						bestRatio = ratio;
					}
				});
				setIndex(best);
			},
			{ root: node, threshold: [0, 0.25, 0.5, 0.75, 1] }
		);
		slides.forEach((slide) => observer.observe(slide));
		return () => observer.disconnect();
	}, [items.length]);

	const goTo = useCallback((next: number) => {
		const node = track.current;
		const slide = node?.children[next] as HTMLElement | undefined;
		if (!node || !slide) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Scroll so the slide's centre meets the track's centre.
		const left = slide.offsetLeft - node.offsetLeft - (node.clientWidth - slide.offsetWidth) / 2;
		node.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
	}, []);

	return (
		<section className={cx(styles.carousel, className)} aria-roledescription="carousel" aria-label={label}>
			<ul ref={track} className={cx(styles.track, styles[`gap-${gap}`])} tabIndex={0}>
				{items.map((child, i) => (
					<li key={i} className={styles.slide} aria-roledescription="slide" aria-label={`${i + 1} / ${items.length}`}>
						{child}
					</li>
				))}
			</ul>
			{showDots && items.length > 1 && (
				<PaginationDots count={items.length} index={index} onSelect={goTo} itemLabel={itemLabel ?? t('slide')} className={styles.dots} />
			)}
		</section>
	);
}

export default Carousel;
