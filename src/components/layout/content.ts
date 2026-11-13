//! Types
import type { IconName, Project, TileHue } from '@/components/ui';

/** Our Craft cards (Figma 1475:2271 / 1475:2350), in page order. Copy lives in messages `ourCraft.cards.<key>`. */
export const CRAFT: ReadonlyArray<{ key: string; icon: IconName; hue: TileHue }> = [
	{ key: 'idea', icon: 'brain', hue: 'pink' },
	{ key: 'path', icon: 'route', hue: 'orange' },
	{ key: 'intention', icon: 'click', hue: 'yellow' },
	{ key: 'tech', icon: 'work-in-progress', hue: 'green' },
	{ key: 'legacy', icon: 'handshake', hue: 'blue' },
	{ key: 'impact', icon: 'spark', hue: 'violet' },
];

/** Figma's light desktop board (1475:2453) reorders the craft washes; light mobile keeps the order above. */
export const CRAFT_LIGHT_DESKTOP_HUES: ReadonlyArray<TileHue> = ['pink', 'yellow', 'green', 'blue', 'violet', 'orange'];

/** Our Process steps (Figma 1509:7878). Copy lives in messages `ourProcess.steps.<key>`. */
export const PROCESS: ReadonlyArray<{ key: string; icon: IconName; hue: TileHue }> = [
	{ key: 'discover', icon: 'discover', hue: 'pink' },
	{ key: 'define', icon: 'notebook', hue: 'orange' },
	{ key: 'design', icon: 'design-spline', hue: 'yellow' },
	{ key: 'develop', icon: 'code', hue: 'green' },
	{ key: 'integrate', icon: 'blocks', hue: 'blue' },
	{ key: 'launch', icon: 'launch', hue: 'violet' },
];

/** Testimonials (Figma 1509:9041), desktop order. Copy lives in messages `testimonials.items.<key>`. */
export const TESTIMONIALS: ReadonlyArray<{ key: string; avatar: string; hue: TileHue }> = [
	{ key: 'jorge', avatar: '/landing/testimonials/avatar-jorge-r.jpg', hue: 'pink' },
	{ key: 'marcelo', avatar: '/landing/testimonials/avatar-marcelo-z.png', hue: 'violet' },
	{ key: 'lisette', avatar: '/landing/testimonials/avatar-lisette-t.jpg', hue: 'orange' },
];

/** The three shots of the Yeta Studio case study (Figma image strip). */
export const SHOTS = [1, 2, 3].map((n) => ({
	light: `/landing/our-work/project-shot-${n}-light.png`,
	dark: `/landing/our-work/project-shot-${n}-dark.png`,
}));

export const PROJECT_TOOLS: Project['tools'] = ['figma', 'react', 'nextjs', 'vercel', 'slack', 'loom'];
