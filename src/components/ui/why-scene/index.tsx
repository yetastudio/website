'use client';

//! React Core
import { useEffect, useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { DefyScene } from './defy';
import { GoalsScene } from './goals';
import { InsightScene } from './insight';
import { LuckScene } from './luck';
import { PixelScene } from './pixel';
import { TogetherScene } from './together';
import { VisionScene } from './vision';
import type { WhySceneName, WhyTourCopy } from './shared';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import look from './look.module.css';

export type WhySceneProps = {
	scene: WhySceneName;
	/**
	 * Plays the scene's story once from its first frame to its payoff, and holds
	 * it. While false the scene shows its poster (the payoff), as it does on the
	 * server and under reduced motion.
	 */
	playing?: boolean;
	className?: string;
};

/** How long a scene keeps its story after its host closes it: past the host's fade, so it never jumps to its poster in view. */
const LINGER_MS = 400;

/**
 * What one Why Yeta promise means, as a small Stageshow product scene
 * (288 × 148, transparent: its host draws the surface). Decorative
 * (aria-hidden, nothing focusable, no pointer events). It renders its poster
 * on the server, plays only while its host says so and it is on screen, and
 * shows the poster alone under reduced motion. Words come from messages
 * `whyYeta.tour.<scene>`.
 */
export function WhyScene({ scene, playing = false, className }: WhySceneProps) {
	const t = useTranslations('whyYeta');
	const copy = t.raw('tour') as WhyTourCopy;

	// The story stays live a moment after the host stops it (see LINGER_MS)
	const [lingering, setLingering] = useState(false);
	const [wasPlaying, setWasPlaying] = useState(playing);
	if (wasPlaying !== playing) {
		setWasPlaying(playing);
		if (!playing) setLingering(true);
	}
	useEffect(() => {
		if (!lingering) return;
		const id = window.setTimeout(() => setLingering(false), LINGER_MS);
		return () => window.clearTimeout(id);
	}, [lingering]);
	const live = playing || lingering;

	return (
		<div className={cx(look.root, className)} data-scene={scene} aria-hidden="true">
			{scene === 'insight' && <InsightScene copy={copy.insight} playing={live} />}
			{scene === 'together' && <TogetherScene copy={copy.together} playing={live} />}
			{scene === 'luck' && <LuckScene copy={copy.luck} playing={live} />}
			{scene === 'defy' && <DefyScene copy={copy.defy} playing={live} />}
			{scene === 'pixel' && <PixelScene copy={copy.pixel} playing={live} />}
			{scene === 'vision' && <VisionScene copy={copy.vision} playing={live} />}
			{scene === 'goals' && <GoalsScene copy={copy.goals} playing={live} />}
		</div>
	);
}

// Plain constants and types live in ./shared, so a server component can read them;
// this module is a client boundary.
export type { WhySceneName, WhyTourCopy } from './shared';
export default WhyScene;
