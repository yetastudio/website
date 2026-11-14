'use client';

//! React Core
import { useEffect, useRef, useState, type RefObject } from 'react';
import { flushSync } from 'react-dom';

//! Hooks
import { useTranslations } from 'next-intl';
import { useAutoplay } from '../use-autoplay';

//! Components
import { Accent, Heading, Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Surface } from '@/components/ui/surface';
import { ProcessScene } from '@/components/ui/process-scene';
import { isProcessStep } from '@/components/ui/process-scene/shared';
import { PROCESS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import shared from './shared.module.css';
import styles from './process.module.css';

/** transitions.dev 18: the decoupled exit, a quiet fade in place before the content swaps. */
const REVEAL_EXIT = 200;

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
		// Picked back before the swap landed: just come back in.
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
 * transitions.dev 18, texts reveal: on a new `value` the lines fade out in place, the content
 * swaps while they are hidden, then they rise back in staggered. Adapted so the lines snap to
 * their start state at the swap, and every entrance rises the full distance.
 */
function useTextsReveal<T>(value: T, ref: RefObject<HTMLElement | null>) {
	const [shown, setShown] = useState(value);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (Object.is(value, shown)) {
			if (el.classList.contains(styles.isRevealHiding)) {
				el.classList.remove(styles.isRevealHiding);
				el.classList.add(styles.isRevealShown);
			}
			return;
		}
		el.classList.add(styles.isRevealHiding);
		el.classList.remove(styles.isRevealShown);
		const timer = window.setTimeout(() => {
			el.classList.remove(styles.isRevealHiding);
			el.classList.add(styles.isRevealReset);
			flushSync(() => setShown(value));
			void el.offsetHeight;
			el.classList.remove(styles.isRevealReset);
			el.classList.add(styles.isRevealShown);
		}, REVEAL_EXIT);
		return () => window.clearTimeout(timer);
	}, [value, shown, ref]);

	return shown;
}

/**
 * Process B, after Rox and Oevra: the kickoff line as a display headline with an inline chip that
 * holds the step's glyph (Oevra), a numbered rail over one framed demo (Rox). The rail drives the
 * step's live scene on a neutral tint stage; the caption under it swaps in place. The accent is the
 * scene's own small hue details and the step dot, nothing else.
 */
export function ProcessRail() {
	const t = useTranslations('ourProcess');
	const [active, setActive] = useState(0);
	const captionRef = useRef<HTMLDivElement>(null);
	const shown = useTextSwap(active, captionRef);
	const step = PROCESS[active];

	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.rail)}>
				<Heading level={3} leading="tight" tone="strong" className={styles.railTitle}>
					{t.rich('kickoff', {
						em: (chunks) => (
							<>
								<Surface as="span" tone="raised" radius="pill" padding="xs" bevel className={styles.railChip}>
									<Icon name={step.icon} size="md" />
								</Surface>{' '}
								<Accent>{chunks}</Accent>
							</>
						),
					})}
				</Heading>
				<SegmentedControl
					label={t('carousel')}
					size="sm"
					options={PROCESS.map((item, index) => ({ value: item.key, label: pad(index + 1), ariaLabel: t(`steps.${item.key}.title`) }))}
					value={step.key}
					onChange={(key) => setActive(PROCESS.findIndex((item) => item.key === key))}
				/>
				{/* The step's own Stageshow scene, restarted on every step, on a neutral stage. */}
				<Surface tone="tint" radius="xl" bevel className={styles.railStage}>
					{isProcessStep(step.key) && <ProcessScene key={step.key} step={step.key} />}
				</Surface>
				{/* Every caption sits in one cell, so the frame holds the longest and never jumps. */}
				<div ref={captionRef} className={cx(styles.textSwap, styles.railCaption)} aria-live="polite">
					{PROCESS.map((item, index) => (
						<div key={item.key} className={styles.railCaptionItem} data-on={index === shown || undefined} aria-hidden={index !== shown || undefined}>
							<span className={styles.railCaptionHead}>
								<span className={cx(shared.dot, shared.hued)} data-hue={item.hue} aria-hidden="true" />
								<Text as="span" size="sm" family="serif" italic tone="faint" className={shared.numeral}>
									{pad(index + 1)}
								</Text>
								<Text as="span" size="xl" weight="medium" tone="strong" leading="tight">
									{t(`steps.${item.key}.title`)}
								</Text>
							</span>
							<Text size="sm" tone="subtle" leading="normal">
								{t(`steps.${item.key}.description`)}
							</Text>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Process C, after Atlas: one step per frame. A giant step word over a faint hairline grid, the
 * step's glyph drawn as line art above it and dot pagination pacing the six. The word, glyph and
 * copy rise in staggered on every step. The one accent is the line-art glyph in the step's hue.
 */
export function ProcessOneStep() {
	const t = useTranslations('ourProcess');
	const [active, setActive] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);
	const shown = useTextsReveal(active, revealRef);
	const step = PROCESS[shown];

	return (
		<div className={shared.container}>
			<div ref={rootRef} className={cx(shared.frame, styles.oneStep)} {...autoplay.handlers}>
				<div className={styles.oneStepHead}>
					<Text as="span" size="xs" tone="subtle" className={styles.oneStepMono}>
						{t('step')}
					</Text>
					<Text as="span" size="xs" tone="subtle" className={cx(styles.oneStepMono, shared.numeral)}>
						{pad(shown + 1)} / {pad(PROCESS.length)}
					</Text>
				</div>
				<div ref={revealRef} className={cx(styles.oneStepReveal, styles.isRevealShown)} aria-live="polite">
					<span className={cx(styles.revealLine, styles.oneStepGlyph, shared.hued)} data-hue={step.hue}>
						<Icon name={step.icon} size="xl" />
					</span>
					<Text as="span" weight="bold" tone="strong" leading="none" className={cx(styles.revealLine, styles.revealLine2, styles.oneStepWord)}>
						{t(`steps.${step.key}.title`)}
					</Text>
					<Text size="sm" tone="subtle" leading="normal" className={cx(styles.revealLine, styles.revealLine3, styles.oneStepCopy)}>
						{t(`steps.${step.key}.description`)}
					</Text>
				</div>
				<PaginationDots
					count={PROCESS.length}
					index={active}
					onSelect={setActive}
					itemLabel={t('card')}
					autoplay={autoplay.enabled ? { paused: autoplay.paused, onComplete: () => setActive((index) => (index + 1) % PROCESS.length) } : undefined}
				/>
			</div>
		</div>
	);
}
