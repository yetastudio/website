/** The seven Why Yeta scenes: one per feature chip, plus the phone card's goals. */
export const WHY_SCENES = ['insight', 'together', 'luck', 'defy', 'pixel', 'vision', 'goals'] as const;
export type WhySceneName = (typeof WHY_SCENES)[number];

/** Every scene is drawn at one size, shown 1:1 in the unfolded chip, the tablet panel and the phone card. */
export const SCENE_WIDTH = 288;
export const SCENE_HEIGHT = 148;

/**
 * How long each scene takes from its first frame to its payoff (ms), so a host
 * that opens it (the Why Yeta tour) knows when the result is on screen.
 */
export const SCENE_PAYOFF_MS: Record<WhySceneName, number> = {
	insight: 1900,
	together: 1900,
	luck: 1800,
	defy: 1700,
	pixel: 1500,
	vision: 1700,
	goals: 1800,
};

/** The words each scene shows, from messages `whyYeta.tour.<scene>`. */
export type WhyTourCopy = {
	insight: { quote: string; metric: string };
	together: { ask: string; reply: string; resolved: string };
	luck: { test: string; winner: string };
	defy: { metric: string };
	pixel: { cta: string };
	vision: { title: string; cta: string; live: string };
	goals: { label: string; metric: string; reached: string };
};
