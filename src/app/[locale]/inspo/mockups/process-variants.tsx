'use client';

//! React Core
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

//! Hooks
import { useTranslations } from 'next-intl';
import { useAutoplay } from './use-autoplay';
import { useVariantHidden } from './library/variant-context';

//! Components
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ProcessScene } from '@/components/ui/process-scene';
import { isProcessStep } from '@/components/ui/process-scene/shared';
import { PROCESS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import mockups from './mockups.module.css';
import styles from './process-variants.module.css';

type Step = (typeof PROCESS)[number];

const numeral = (index: number) => String(index + 1).padStart(2, '0');

/**
 * The step's Stageshow scene on a neutral stage tinted with the step's hue. A proposal that is not
 * on show (or a step that is not current) keeps the stage and skips the scene, so only the scene in
 * view ever plays.
 */
function StepStage({ step, className }: { step: Step; className?: string }) {
	const hidden = useVariantHidden();
	return (
		<div className={cx(mockups.neutralStage, styles.stage, className)} data-hue={step.hue}>
			{!hidden && isProcessStep(step.key) && <ProcessScene key={step.key} step={step.key} />}
		</div>
	);
}

/**
 * transitions.dev 04, text states swap: the old text leaves upward with a blur, the new one enters
 * from below. The text is only swapped at the midpoint, so the line never shows both.
 */
function SwapText({ text, className }: { text: string; className?: string }) {
	const [shown, setShown] = useState(text);
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || text === shown) return;
		const duration = parseFloat(getComputedStyle(el).getPropertyValue('--text-swap-dur')) || 150;
		el.classList.add(styles.isExit);
		const timer = window.setTimeout(() => {
			flushSync(() => setShown(text));
			el.classList.remove(styles.isExit);
			el.classList.add(styles.isEnterStart);
			void el.offsetHeight;
			el.classList.remove(styles.isEnterStart);
		}, duration);
		return () => window.clearTimeout(timer);
	}, [text, shown]);

	return (
		<span ref={ref} className={cx(styles.textSwap, className)}>
			{shown}
		</span>
	);
}

/**
 * Process walkthrough B, Timeline (FLORA, Rox): the scene at full width with the step named above
 * it, and under it a track of six segments read like video chapters. The current segment fills in
 * the step's hue over the time its scene needs, then hands over; a segment can be picked. The fill
 * is the one accent.
 */
export function ProcessTimelineMockup() {
	const t = useTranslations('ourProcess');
	const [active, setActive] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);
	const step = PROCESS[active];
	const running = autoplay.enabled && !autoplay.paused;

	return (
		<div className={mockups.container}>
			<div ref={rootRef} className={styles.timeline} {...autoplay.handlers}>
				<div className={styles.timelineHead}>
					<Text as="p" size="2xl" family="serif" weight="regular" leading="tight" tone="strong" aria-live="polite">
						<span className={styles.timelineNumeral}>{numeral(active)}</span> <SwapText text={t(`steps.${step.key}.title`)} />
					</Text>
					<Text size="sm" tone="subtle" leading="relaxed" className={styles.timelineCopy}>
						<SwapText text={t(`steps.${step.key}.description`)} />
					</Text>
				</div>
				<StepStage step={step} />
				<ol className={styles.track}>
					{PROCESS.map((item, index) => (
						<li key={item.key} className={styles.trackItem}>
							<Button
								variant="ghost"
								size="sm"
								fullWidth
								className={styles.segment}
								aria-current={index === active ? 'step' : undefined}
								aria-label={`${numeral(index)} ${t(`steps.${item.key}.title`)}`}
								onClick={() => setActive(index)}
							>
								<span className={styles.segmentBar} data-hue={item.hue}>
									<span
										key={index === active ? `on-${active}` : 'off'}
										className={styles.segmentFill}
										data-state={index < active ? 'done' : index === active ? (autoplay.enabled ? 'playing' : 'done') : 'todo'}
										data-running={running || undefined}
										onAnimationEnd={() => setActive((current) => (current + 1) % PROCESS.length)}
									/>
								</span>
								<Text as="span" size="xs" tone={index === active ? 'strong' : 'faint'} className={styles.segmentLabel}>
									<span className={styles.segmentNumeral}>{numeral(index)}</span>
									<span className={styles.segmentTitle}>{t(`steps.${item.key}.title`)}</span>
								</Text>
							</Button>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}

/**
 * Process walkthrough C, Sticky story (Fiasco): the steps scroll by as a numbered column while the
 * stage beside them holds still and changes to the step at the centre of the column, so reading is
 * what moves the story. The current numeral takes its step's hue; the rest fade back.
 */
export function ProcessStickyMockup() {
	const t = useTranslations('ourProcess');
	const [active, setActive] = useState(0);
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
				}
			},
			{ root: list, rootMargin: '-45% 0px -45% 0px' },
		);
		list.querySelectorAll<HTMLElement>('[data-index]').forEach((item) => observer.observe(item));
		return () => observer.disconnect();
	}, []);

	const step = PROCESS[active];

	return (
		<div className={mockups.container}>
			<div className={styles.sticky}>
				<div className={styles.stickyAside}>
					<StepStage step={step} />
					<div className={styles.stickyMeter}>
						<Text as="span" size="xs" tone="subtle" className={styles.stickyCount}>
							{`${numeral(active)} / ${numeral(PROCESS.length - 1)}`}
						</Text>
						<span className={styles.stickyRule} aria-hidden="true">
							<span className={styles.stickyRuleFill} data-hue={step.hue} style={{ scale: `${(active + 1) / PROCESS.length} 1` }} />
						</span>
					</div>
				</div>
				<div ref={listRef} className={styles.stickyList} tabIndex={0} role="region" aria-label="Our process, step by step" data-lenis-prevent>
					<ol className={styles.stickyItems}>
						{PROCESS.map((item, index) => (
							<li key={item.key} className={styles.stickyItem} data-index={index} data-on={index === active || undefined}>
								<Text as="span" family="serif" weight="light" leading="none" className={styles.stickyNumeral} data-hue={item.hue}>
									{numeral(index)}
								</Text>
								<Text as="h4" size="xl" weight="medium" tone="strong">
									{t(`steps.${item.key}.title`)}
								</Text>
								<Text size="sm" tone="subtle" leading="relaxed">
									{t(`steps.${item.key}.description`)}
								</Text>
							</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
}

/**
 * Process walkthrough D, Accordion (Craft Agency): six editorial rows, a serif numeral and the
 * step's name. The open row grows (transitions.dev card resize) to hold its scene and its lines,
 * and a hairline under its name fills while its scene plays; when it is full the next row opens. Any row can be
 * opened by hand; the hairline is the one accent.
 */
export function ProcessAccordionMockup() {
	const t = useTranslations('ourProcess');
	const [active, setActive] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);

	const advance = () => setActive((index) => (index + 1) % PROCESS.length);

	return (
		<div className={mockups.container}>
			<div ref={rootRef} className={styles.accordion} {...autoplay.handlers}>
				{PROCESS.map((item, index) => {
					const open = index === active;
					return (
						<div key={item.key} className={styles.row} data-open={open || undefined}>
							<Button
								variant="ghost"
								size="lg"
								fullWidth
								className={styles.rowHead}
								aria-expanded={open}
								aria-controls={`process-row-${item.key}`}
								onClick={() => setActive(index)}
							>
								<span className={styles.rowLabel}>
									<Text as="span" family="serif" italic tone={open ? 'strong' : 'faint'} className={styles.rowNumeral}>
										{numeral(index)}
									</Text>
									<Text as="span" family="serif" weight="regular" tone={open ? 'strong' : 'subtle'} className={styles.rowTitle}>
										{t(`steps.${item.key}.title`)}
									</Text>
								</span>
							</Button>
							<span className={styles.rowRule} data-hue={item.hue} aria-hidden="true">
								{open && autoplay.enabled && (
									<span key={`fill-${active}`} className={styles.rowRuleFill} data-running={!autoplay.paused || undefined} onAnimationEnd={advance} />
								)}
							</span>
							<div id={`process-row-${item.key}`} className={styles.rowBody} inert={!open}>
								<div className={styles.rowInner}>
									<Text size="sm" tone="subtle" leading="relaxed" className={styles.rowCopy}>
										{t(`steps.${item.key}.description`)}
									</Text>
									{open && <StepStage step={item} className={styles.rowStage} />}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
