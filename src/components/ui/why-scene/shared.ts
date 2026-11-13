/** The seven Why Yeta scenes: one per feature chip, plus the phone card's goals. */
export const WHY_SCENES = ['insight', 'together', 'luck', 'defy', 'pixel', 'vision', 'goals'] as const;
export type WhySceneName = (typeof WHY_SCENES)[number];

/** Every scene is drawn at one size, shown 1:1 in the unfolded chip, the tablet panel and the phone card. */
export const SCENE_WIDTH = 288;
export const SCENE_HEIGHT = 148;

/**
 * How long a scene waits before its cursor first moves (ms): the tour glides its own cursor onto
 * the scene cursor's resting point in that time and hands over.
 */
export const ENTRY_MS = 900;

/** How long the scene cursor rests after its last beat before it steps out of shot (ms). */
export const CURSOR_IDLE_MS = 1100;

/**
 * How long each scene takes from its first frame to its payoff (ms), so a host
 * that opens it (the Why Yeta tour) knows when the result is on screen. The cursor's
 * work (moves, clicks, typing) is counted in.
 */
export const SCENE_PAYOFF_MS: Record<WhySceneName, number> = {
	insight: 3200,
	together: 3600,
	luck: 2900,
	defy: 2700,
	pixel: 2400,
	vision: 3100,
	goals: 2600,
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
