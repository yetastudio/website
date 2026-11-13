import { DefineScene } from './define';
import { DesignScene } from './design';
import { DevelopScene } from './develop';
import { DiscoverScene } from './discover';
import { IntegrateScene } from './integrate';
import { LaunchScene } from './launch';
import look from './look.module.css';
import type { ProcessStep, SceneCopy } from './shared';

export type SceneViewProps = { step: ProcessStep; copy: SceneCopy; className?: string };

/**
 * One Our Process step as a small product scene, drawn over the Process Card's
 * colour wash. Decorative: hidden from assistive tech, nothing focusable, and
 * it never takes the pointer. The copy comes in as props (see ProcessScene).
 */
export function SceneView({ step, copy, className }: SceneViewProps) {
	return (
		<div className={className ? `${look.root} ${className}` : look.root} data-step={step} aria-hidden="true">
			{step === 'discover' && <DiscoverScene copy={copy.discover} />}
			{step === 'define' && <DefineScene copy={copy.define} />}
			{step === 'design' && <DesignScene copy={copy.design} />}
			{step === 'develop' && <DevelopScene copy={copy.develop} />}
			{step === 'integrate' && <IntegrateScene copy={copy.integrate} />}
			{step === 'launch' && <LaunchScene copy={copy.launch} />}
		</div>
	);
}
