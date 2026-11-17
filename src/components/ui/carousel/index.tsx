'use client';

//! React Core
import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

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
	/**
	 * From 768px the track stops being a carousel and becomes a plain list laid out by this
	 * class (a grid), so a section renders its cards once instead of a carousel plus a grid.
	 */
	listFromMd?: string;
	className?: string;
};

const MD = '(min-width: 768px)';
const subscribeMd = (onChange: () => void) => {
	const query = window.matchMedia(MD);
	query.addEventListener('change', onChange);
	return () => query.removeEventListener('change', onChange);
};
const noSubscribe = () => () => {};

/**
 * Inspo component: the horizontal, scroll-snapping track the mobile frames draw. The card
 * on show sits centred on the screen, the first one included, and its neighbours peek in
 * from both sides. Native scrolling, so touch, trackpad and keyboard all work; dots are
 * added because Figma draws none.
 */
export function Carousel({ label, itemLabel, children, gap = 'md', showDots = true, listFromMd, className }: CarouselProps) {
	const t = useTranslations('common');
	const track = useRef<HTMLOListElement>(null);
	const [index, setIndex] = useState(0);
	const items = Children.toArray(children);
	// The server renders the carousel (mobile first); CSS lays out the list from 768px before
	// hydration, and the carousel semantics and dots drop once the client knows the width.
	const asList = useSyncExternalStore(
		listFromMd ? subscribeMd : noSubscribe,
		() => Boolean(listFromMd) && window.matchMedia(MD).matches,
		() => false
	);

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
		<section
			className={cx(styles.carousel, listFromMd && styles.listFromMd, className)}
			aria-roledescription={asList ? undefined : 'carousel'}
			aria-label={label}
		>
			<ol ref={track} className={cx(styles.track, styles[`gap-${gap}`], listFromMd)} tabIndex={asList ? undefined : 0}>
				{items.map((child, i) => (
					<li
						key={i}
						className={styles.slide}
						aria-roledescription={asList ? undefined : 'slide'}
						aria-label={asList ? undefined : `${i + 1} / ${items.length}`}
					>
						{child}
					</li>
				))}
			</ol>
			{showDots && !asList && items.length > 1 && (
				<PaginationDots count={items.length} index={index} onSelect={goTo} itemLabel={itemLabel ?? t('slide')} className={styles.dots} />
			)}
		</section>
	);
}

export default Carousel;
