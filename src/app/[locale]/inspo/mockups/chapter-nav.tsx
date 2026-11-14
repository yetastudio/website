'use client';

//! React Core
import { useEffect, useRef, useState } from 'react';

//! Hooks
import { useReducedMotion } from './use-autoplay';

//! Components
import { Heading, Text } from '@/components/ui/text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Surface } from '@/components/ui/surface';

//! Styles
import styles from './mockups.module.css';

const CHAPTERS = [
	{
		value: 'about',
		label: 'About',
		title: 'About the client',
		body: 'Yeta Studio is a design and development agency from Argentina, building for brands that refuse to leave things to luck.',
	},
	{
		value: 'challenge',
		label: 'Challenge',
		title: 'The challenge',
		body: 'An agency site is its first portfolio piece: it had to carry the brand in two themes and three languages without becoming a one-off.',
	},
	{
		value: 'result',
		label: 'Result',
		title: 'The result',
		body: 'A token-driven system first, then a landing assembled only from its pieces, so switching theme or language changes nothing else.',
	},
	{
		value: 'numbers',
		label: 'Numbers',
		title: 'In numbers',
		body: 'Three languages, two themes and every component drawn once in Figma and built once in code.',
	},
] as const;

type ChapterId = (typeof CHAPTERS)[number]['value'];

/**
 * Proposal 06: the case study chapter nav. A glass bar pinned to the top of a scrolling
 * miniature page holds the SegmentedControl (Tabs sliding) and a progress hairline.
 * Scrolling moves the pill; picking a chapter scrolls the page. In production this is a
 * `nav` of links with `aria-current`, reusing the same sliding pill.
 */
export function ChapterNavMockup() {
	const [active, setActive] = useState<ChapterId>('about');
	const [progress, setProgress] = useState(0);
	const scrollRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	// While a picked chapter scrolls into place, scroll-spy must not fight the pick.
	const pickedRef = useRef<ChapterId | null>(null);

	useEffect(() => {
		const scroller = scrollRef.current;
		if (!scroller) return;
		const onScroll = () => {
			const max = scroller.scrollHeight - scroller.clientHeight;
			setProgress(max > 0 ? scroller.scrollTop / max : 0);
			const sections = Array.from(scroller.querySelectorAll<HTMLElement>('[data-chapter]'));
			const line = scroller.scrollTop + scroller.clientHeight * 0.35;
			const atEnd = scroller.scrollTop >= max - 2;
			const current = atEnd ? sections[sections.length - 1] : sections.filter((section) => section.offsetTop <= line).pop();
			const id = (current?.dataset.chapter ?? 'about') as ChapterId;
			if (pickedRef.current) {
				if (pickedRef.current === id) pickedRef.current = null;
				return;
			}
			setActive(id);
		};
		scroller.addEventListener('scroll', onScroll, { passive: true });
		return () => scroller.removeEventListener('scroll', onScroll);
	}, []);

	const pick = (id: ChapterId) => {
		const scroller = scrollRef.current;
		const target = scroller?.querySelector<HTMLElement>(`[data-chapter="${id}"]`);
		if (!scroller || !target) return;
		setActive(id);
		pickedRef.current = id;
		scroller.scrollTo({
			top: target.offsetTop - scroller.querySelector<HTMLElement>('[data-chapter]')!.offsetTop,
			behavior: reduceMotion ? 'auto' : 'smooth',
		});
	};

	return (
		<Surface tone="raised" radius="2xl" bevel className={styles.chapterFrame}>
			<div className={styles.chapterBar}>
				<SegmentedControl label="Case study chapters" size="sm" options={CHAPTERS} value={active} onChange={pick} />
				<span className={styles.chapterProgress} aria-hidden="true">
					<span className={styles.chapterProgressFill} style={{ transform: `scaleX(${progress})` }} />
				</span>
			</div>
			{/* data-lenis-prevent: the page's smooth scroll must leave this nested scroller alone. */}
			<div ref={scrollRef} className={styles.chapterScroll} data-lenis-prevent tabIndex={0} role="region" aria-label="Case study preview">
				{CHAPTERS.map((chapter, index) => (
					<section key={chapter.value} data-chapter={chapter.value} className={styles.chapter}>
						<Text as="span" size="xs" family="serif" italic tone="faint">
							{`Chapter ${String(index + 1).padStart(2, '0')}`}
						</Text>
						<Heading level={4} size="xl" family="serif" weight="regular" leading="tight">
							{chapter.title}
						</Heading>
						<Text size="sm" tone="subtle" leading="relaxed">
							{chapter.body}
						</Text>
						<span className={styles.chapterRule} aria-hidden="true" />
					</section>
				))}
			</div>
		</Surface>
	);
}

export default ChapterNavMockup;
