//! Types
import type { IconName } from '@/components/ui/icon';
import type { Project } from '@/components/ui/project-card';
import type { TileHue } from '@/components/ui/gradient-tile';

//! Content
import { routing } from '@/i18n/routing';
import registry from '../../../../registry.json';
import { PROJECT_TOOLS, SHOTS } from '../content';

/**
 * Case studies with a detail page (`/work/[slug]`). Copy lives in messages
 * `ourWork.projects.<key>`; `details.<section>.p1…pN` and `highlights.<key>` feed the page.
 */
export const PROJECTS = [
	{
		slug: 'yeta-studio',
		key: 'yeta',
		tools: PROJECT_TOOLS,
		shots: SHOTS,
		/** Story cards on the detail page (the "about" section sits next to the project sheet). */
		story: [
			{ key: 'challenge', icon: 'target', hue: 'orange' },
			{ key: 'result', icon: 'launch', hue: 'violet' },
		],
		/** Stat tiles, in page order. Counts read from the code so the copy cannot drift from the build. */
		highlights: [
			{ key: 'themes', hue: 'pink', value: 2 },
			{ key: 'languages', hue: 'yellow', value: routing.locales.length },
			{ key: 'components', hue: 'green', value: registry.components.length },
			{ key: 'tokens', hue: 'blue', value: 1 },
		],
	},
] as const satisfies ReadonlyArray<{
	slug: string;
	key: string;
	tools: Project['tools'];
	shots: ReadonlyArray<{ light: string; dark: string }>;
	story: ReadonlyArray<{ key: 'challenge' | 'result'; icon: IconName; hue: TileHue }>;
	highlights: ReadonlyArray<{ key: string; hue: TileHue; value: number }>;
}>;

export type ProjectEntry = (typeof PROJECTS)[number];

export function getProjectEntry(slug: string): ProjectEntry | undefined {
	return PROJECTS.find((project) => project.slug === slug);
}

/** Slug of the detail page for a project key, so the landing cards can link to it. */
export function projectSlug(key: string): string | undefined {
	return PROJECTS.find((project) => project.key === key)?.slug;
}

/** Plain-string translator over the `ourWork` namespace (both `useTranslations` and `getTranslations` fit). */
type Translate = (key: string) => string;

/**
 * Builds the `Project` the design-system cards render, from the entry and its messages.
 * `shotAlt` names screen n (1-based); it defaults to the landing's "{name}, screen n".
 */
export function buildProject(t: Translate, entry: ProjectEntry, shotAlt?: (name: string, n: number) => string): Project {
	const copy = (field: string) => t(`projects.${entry.key}.${field}`);
	const name = copy('name');
	const alt = shotAlt ?? ((project: string, n: number) => `${project}, screen ${n}`);
	return {
		slug: entry.slug,
		name,
		year: copy('year'),
		country: copy('country'),
		industry: copy('industry'),
		services: copy('services'),
		url: copy('url'),
		about: copy('about'),
		challenge: copy('challenge'),
		result: copy('result'),
		tools: [...entry.tools],
		shots: entry.shots.map((shot, i) => ({ ...shot, alt: alt(name, i + 1) })),
	};
}
