import { memo } from 'react';
import { DefineScene } from './define';
import { DesignScene } from './design';
import { DevelopScene } from './develop';
import { DiscoverScene } from './discover';
import { IntegrateScene } from './integrate';
import { LaunchScene } from './launch';
import look from './look.module.css';
import type { ProcessStep, SceneCopy } from './shared';

export type SceneViewProps = {
	step: ProcessStep;
	copy: SceneCopy;
	className?: string;
	/** Only the sized root, no scene inside (the landing's server render, see ProcessScene). */
	hollow?: boolean;
};

/**
 * One Our Process step as a small product scene, drawn over the Process Card's
 * colour wash. Decorative: hidden from assistive tech, nothing focusable, and
 * it never takes the pointer. The copy comes in as props (see ProcessScene).
 */
// Memoised: WhyScene and the stage hosts re-render around it with the same copy and playing flag.
export const SceneView = memo(function SceneView({ step, copy, className, hollow }: SceneViewProps) {
	return (
		<div className={className ? `${look.root} scheme-site ${className}` : `${look.root} scheme-site`} data-step={step} aria-hidden="true">
			{!hollow && (
				<>
					{step === 'discover' && <DiscoverScene copy={copy.discover} />}
					{step === 'define' && <DefineScene copy={copy.define} />}
					{step === 'design' && <DesignScene copy={copy.design} />}
					{step === 'develop' && <DevelopScene copy={copy.develop} />}
					{step === 'integrate' && <IntegrateScene copy={copy.integrate} />}
					{step === 'launch' && <LaunchScene copy={copy.launch} />}
				</>
			)}
		</div>
	);
});
