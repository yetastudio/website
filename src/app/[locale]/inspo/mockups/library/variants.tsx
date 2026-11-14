'use client';

//! React Core
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

//! Components
import { ThemePair } from '@/components/showcase';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';

//! Context
import { VariantHiddenContext } from './variant-context';
import type { ShelfVariant, VariantId } from './variant-types';

//! Styles
import styles from './variants.module.css';

/**
 * A shelf's proposals behind one switcher. The system SegmentedControl slides its pill (tabs
 * sliding); the proposals change with the page side-by-side transition, entering from the side
 * they sit on; the reference line swaps its text in place (text states swap). All proposals share
 * one grid cell, so the shelf holds the tallest and the page below never jumps.
 */
export function ShelfVariants({ title, variants }: { title: string; variants: ShelfVariant[] }) {
	const [active, setActive] = useState<VariantId>(variants[0].id);
	const [refs, setRefs] = useState(variants[0].refs);
	const refsRef = useRef<HTMLSpanElement>(null);
	const swapTimer = useRef(0);
	const activeIndex = variants.findIndex((variant) => variant.id === active);

	const select = (next: VariantId) => {
		setActive(next);
		const nextRefs = variants.find((variant) => variant.id === next)?.refs ?? '';
		const el = refsRef.current;
		if (!el) return setRefs(nextRefs);
		// Text states swap: exit up, swap the text, enter from below.
		const duration = parseFloat(getComputedStyle(el).getPropertyValue('--text-swap-dur')) || 150;
		window.clearTimeout(swapTimer.current);
		el.classList.add(styles.isExit);
		swapTimer.current = window.setTimeout(() => {
			flushSync(() => setRefs(nextRefs));
			el.classList.remove(styles.isExit);
			el.classList.add(styles.isEnterStart);
			void el.offsetHeight;
			el.classList.remove(styles.isEnterStart);
		}, duration);
	};

	return (
		<div className={styles.variants}>
			<div className={styles.bar}>
				<SegmentedControl
					label={`${title} proposals`}
					options={variants.map((variant) => ({ value: variant.id, label: `${variant.id.toUpperCase()} · ${variant.label}` }))}
					value={active}
					onChange={select}
					size="sm"
				/>
				<Text as="p" size="sm" tone="subtle" aria-live="polite">
					From{' '}
					<span ref={refsRef} className={styles.textSwap}>
						{refs}
					</span>
				</Text>
			</div>
			<ThemePair layout="column">
				<PageSlide variants={variants} activeIndex={activeIndex} />
			</ThemePair>
		</div>
	);
}

/**
 * One canvas's stack of proposals. Its height follows the proposal on show and tweens between
 * them (transitions.dev card resize); the height is written straight to a custom property, so a
 * resize never re-renders the mockups.
 */
export function PageSlide({ variants, activeIndex }: { variants: ShelfVariant[]; activeIndex: number }) {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const root = rootRef.current;
		const page = root?.children[activeIndex];
		if (!root || !(page instanceof HTMLElement)) return;
		const observer = new ResizeObserver(([entry]) => {
			root.style.setProperty('--slide-height', `${entry.borderBoxSize[0].blockSize}px`);
		});
		observer.observe(page);
		return () => observer.disconnect();
	}, [activeIndex]);

	return (
		<div ref={rootRef} className={styles.pageSlide}>
			{variants.map((variant, index) => {
				const on = index === activeIndex;
				return (
					<div
						key={variant.id}
						className={styles.page}
						data-on={on || undefined}
						data-side={index < activeIndex ? 'before' : 'after'}
						aria-hidden={!on || undefined}
						inert={!on}
					>
						<VariantHiddenContext.Provider value={!on}>{variant.node}</VariantHiddenContext.Provider>
					</div>
				);
			})}
		</div>
	);
}

export default ShelfVariants;
