'use client';

//! React Core
import { useEffect, useRef, useState, type RefObject } from 'react';
import { flushSync } from 'react-dom';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { ResultFacts } from '../results';

//! Styles
import shared from './shared.module.css';
import styles from './results.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * transitions.dev 04, text states swap: when `value` changes, the element exits up with a blur,
 * the text swaps, then it enters from below. Returns the value on show, which trails `value` by
 * the exit (`--text-swap-dur` on the element).
 */
function useTextSwap<T>(value: T, ref: RefObject<HTMLElement | null>) {
	const [shown, setShown] = useState(value);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// Paged back before the swap landed: just come back in.
		if (Object.is(value, shown)) {
			el.classList.remove(styles.isSwapExit);
			return;
		}
		const duration = parseFloat(getComputedStyle(el).getPropertyValue('--text-swap-dur')) || 150;
		el.classList.add(styles.isSwapExit);
		const timer = window.setTimeout(() => {
			el.classList.remove(styles.isSwapExit);
			el.classList.add(styles.isSwapEnter);
			flushSync(() => setShown(value));
			void el.offsetHeight;
			el.classList.remove(styles.isSwapEnter);
		}, duration);
		return () => window.clearTimeout(timer);
	}, [value, shown, ref]);

	return shown;
}

/**
 * Results B, after Craft Agency's stat card: one figure at a time, set large in the Editorial serif
 * on a raised card, paged with two small arrows. The figure pops in digit by digit and its caption
 * swaps in place. The one accent is a faint peach glow behind the card, no larger than the card.
 */
export function ResultsOneFigure({ facts }: { facts: ResultFacts }) {
	const work = useTranslations('ourWork');
	const [index, setIndex] = useState(0);
	// The pop-in plays on a page turn, not on the first paint.
	const [paged, setPaged] = useState(false);
	const captionRef = useRef<HTMLDivElement>(null);
	const shown = useTextSwap(index, captionRef);

	const figures = [
		{ key: 'locales', value: facts.locales, label: 'languages from one codebase' },
		{ key: 'themes', value: facts.themes, label: 'themes from one set of tokens' },
		{ key: 'components', value: facts.components, label: 'components in the registry' },
	];
	const figure = figures[index];
	const digits = String(figure.value).split('');
	const page = (step: number) => {
		setPaged(true);
		setIndex((current) => (current + step + figures.length) % figures.length);
	};

	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.single)}>
				<Text as="span" size="xs" tone="subtle" className={styles.mono}>
					Yeta Studio · in numbers
				</Text>
				<div className={styles.singleStage}>
					<span className={cx(styles.singleGlow, shared.hued)} data-hue="orange" aria-hidden="true" />
					<Surface tone="raised" radius="xl" padding="lg" bevel className={styles.singleCard} aria-live="polite">
						<Text as="span" family="serif" weight="regular" tone="strong" leading="none" className={cx(styles.singleValue, shared.numeral)}>
							{/* transitions.dev 02: keyed, so every page turn re-renders the digits and replays the pop-in. */}
							<span key={figure.key} className={cx(styles.digits, paged && styles.isDigitsAnimating)} aria-hidden="true">
								{digits.map((digit, at) => (
									<span key={at} className={styles.digit} data-stagger={at === digits.length - 1 ? '2' : at === digits.length - 2 ? '1' : undefined}>
										{digit}
									</span>
								))}
							</span>
							<span className="u-visually-hidden">{figure.value}</span>
						</Text>
						<div ref={captionRef} className={cx(styles.textSwap, styles.singleCaption)}>
							<Text size="md" tone="strong" leading="snug">
								{figures[shown].label}
							</Text>
						</div>
						<Text as="span" size="xs" tone="faint">
							{`${work('projects.yeta.name')}, ${work('projects.yeta.year')}`}
						</Text>
					</Surface>
				</div>
				<div className={styles.singlePager}>
					<Button variant="glass" size="sm" icon="arrow-left" label="Previous figure" onClick={() => page(-1)} />
					<Text as="span" size="xs" tone="subtle" className={cx(styles.mono, shared.numeral)}>
						{pad(index + 1)} / {pad(figures.length)}
					</Text>
					<Button variant="glass" size="sm" icon="arrow-right" label="Next figure" onClick={() => page(1)} />
				</div>
			</div>
		</div>
	);
}
