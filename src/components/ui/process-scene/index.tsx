'use client';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { SceneView } from './scenes';
import type { ProcessStep, SceneCopy } from './shared';

export type ProcessSceneProps = {
	step: ProcessStep;
	className?: string;
};

/**
 * The Our Process step happening, as a small Stageshow product scene for the
 * Process Card's wash tile (342 × 160). Decorative (aria-hidden, nothing
 * focusable, no pointer events). It renders its poster on the server, plays
 * its loop only while on screen, and shows the poster alone under reduced
 * motion. Words come from messages `ourProcess.scenes.<step>`.
 */
export function ProcessScene({ step, className }: ProcessSceneProps) {
	const t = useTranslations('ourProcess');
	const copy = t.raw('scenes') as SceneCopy;
	return <SceneView step={step} copy={copy} className={className} />;
}

// Plain helpers (PROCESS_STEPS, isProcessStep) live in ./shared, so a server
// component can call them; this module is a client boundary.
export type { ProcessStep } from './shared';
export default ProcessScene;
