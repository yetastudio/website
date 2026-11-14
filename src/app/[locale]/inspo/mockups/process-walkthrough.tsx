'use client';

//! React Core
import { memo, useRef, useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';
import { useAutoplay } from './use-autoplay';
import { useVariantHidden } from './library/variant-context';

//! Components
import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { Text } from '@/components/ui/text';
import { ProcessScene } from '@/components/ui/process-scene';
import { isProcessStep } from '@/components/ui/process-scene/shared';
import { PROCESS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './mockups.module.css';

/** One step of the index, memoised: a step change re-renders the step that leaves and the one that arrives. */
const WalkStep = memo(function WalkStep({ index, title, current, onPick }: { index: number; title: string; current: boolean; onPick: (index: number) => void }) {
	return (
		<li>
			<Button variant="ghost" size="md" fullWidth className={styles.walkStep} aria-current={current ? 'step' : undefined} onClick={() => onPick(index)}>
				<Text as="span" size="sm" family="serif" italic tone={current ? 'strong' : 'faint'} className={styles.walkNumeral}>
					{String(index + 1).padStart(2, '0')}
				</Text>
				<Text as="span" size="md" tone={current ? 'strong' : 'subtle'}>
					{title}
				</Text>
			</Button>
		</li>
	);
});

/**
 * Proposal 02: Our Process as a walkthrough. A numbered index beside one process tile;
 * the tile plays that step's Stageshow scene while its dot fills, then the next step
 * takes over. A pick restarts the fill from the step picked. Pauses on hover, focus, off-screen and under
 * reduced motion (then the steps are picked by hand only).
 */
export function ProcessWalkthroughMockup() {
	const t = useTranslations('ourProcess');
	const [active, setActive] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);
	const hidden = useVariantHidden();
	const step = PROCESS[active];
	const next = () => setActive((index) => (index + 1) % PROCESS.length);

	return (
		<div className={styles.container}>
			<div ref={rootRef} className={styles.walkthrough} {...autoplay.handlers}>
				<ol className={styles.walkIndex}>
					{PROCESS.map((item, index) => (
						<WalkStep key={item.key} index={index} title={t(`steps.${item.key}.title`)} current={index === active} onPick={setActive} />
					))}
				</ol>

				<div className={styles.walkStage}>
					<Text as="p" size="2xl" family="serif" weight="regular" leading="tight" tone="strong" className={styles.walkTitle} aria-live="polite">
						<span className={styles.walkTitleNumeral}>{String(active + 1).padStart(2, '0')}</span> {t(`steps.${step.key}.title`)}
					</Text>
					{/* The step's own Stageshow scene (the Our Process card's), restarted on every step. */}
					<div key={step.key} className={cx(styles.walkTile, styles.neutralStage)} data-hue={step.hue}>
						{!hidden && isProcessStep(step.key) && <ProcessScene step={step.key} />}
					</div>
					{/* Every description sits in one cell; the box holds the longest, so the page below never shifts. */}
					<div className={styles.walkCopy}>
						{PROCESS.map((item, index) => (
							<Text
								key={item.key}
								size="sm"
								tone="subtle"
								leading="relaxed"
								aria-hidden={index !== active || undefined}
								data-on={index === active || undefined}
							>
								{t(`steps.${item.key}.description`)}
							</Text>
						))}
					</div>
					<PaginationDots
						count={PROCESS.length}
						index={active}
						onSelect={setActive}
						itemLabel="step"
						autoplay={autoplay.enabled ? { paused: autoplay.paused, onComplete: next } : undefined}
					/>
				</div>
			</div>
		</div>
	);
}

export default ProcessWalkthroughMockup;
