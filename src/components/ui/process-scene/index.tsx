'use client';

//! Hooks
import { useTranslations } from 'next-intl';
import { useHydrated } from '@/hooks/useHydrated';

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
 * focusable, no pointer events). The server sends only its sized root (the
 * scene's markup was a large share of the landing's HTML); the poster draws on
 * hydration, the loop plays only while on screen, and reduced motion keeps the
 * poster alone. Words come from messages `ourProcess.scenes.<step>`.
 */
export function ProcessScene({ step, className }: ProcessSceneProps) {
	const t = useTranslations('ourProcess');
	const copy = t.raw('scenes') as SceneCopy;
	const hydrated = useHydrated();
	return <SceneView step={step} copy={copy} className={className} hollow={!hydrated} />;
}

// Plain helpers (PROCESS_STEPS, isProcessStep) live in ./shared, so a server
// component can call them; this module is a client boundary.
export type { ProcessStep } from './shared';
export default ProcessScene;
