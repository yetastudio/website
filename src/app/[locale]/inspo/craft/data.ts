/**
 * /inspo, "Our Craft, illustrated": the alternatives, the words the scenes show and the
 * Mobbin references behind them. References are links only; the scenes are our own.
 */

//! Types
import type { TileHue } from '@/components/ui';
import type { Reference } from '../data';

/** The six Our Craft beats, in the landing's order, with the hue each card carries. */
export const CRAFT_STEPS = ['idea', 'path', 'intention', 'tech', 'legacy', 'impact'] as const;
export type CraftStep = (typeof CRAFT_STEPS)[number];

export const CRAFT_HUES: Record<CraftStep, TileHue> = {
	idea: 'pink',
	path: 'orange',
	intention: 'yellow',
	tech: 'green',
	legacy: 'blue',
	impact: 'violet',
};

/**
 * The few real strings each scene shows (3 to 7 per scene). Everything else in a scene is
 * placeholder ink. English, like the rest of /inspo.
 */
export const SCENE_COPY = {
	idea: { note: 'Book in two taps' },
	path: { home: 'Home', services: 'Services', book: 'Book a call' },
	intention: {
		wire: 'Wireframe',
		design: 'Design',
		heading: 'Calm, clear booking',
		button: 'Book a call',
		url: 'your-brand.com',
		times: ['10:00', '11:30', '15:00'],
	},
	tech: { title: 'Stack', next: 'Next.js', react: 'React', vercel: 'Vercel', figma: 'Figma' },
	legacy: {
		title: 'Releases',
		latest: { version: 'v1.3', note: 'Booking reminders' },
		past: [
			{ version: 'v1.2', note: 'Dark theme' },
			{ version: 'v1.1', note: 'Spanish site' },
			{ version: 'v1.0', note: 'Launch' },
		],
	},
	impact: { title: 'Bookings', launch: 'Launch', lift: '+38%' },
} as const;

/** The short names the walkthrough's tabs use, one word per beat. */
export const STEP_TABS: Record<CraftStep, string> = {
	idea: 'Idea',
	path: 'Path',
	intention: 'Design',
	tech: 'Build',
	legacy: 'Evolve',
	impact: 'Impact',
};

export type AlternativeId = 'tiles' | 'walkthrough' | 'bento';

export type Alternative = {
	id: AlternativeId;
	letter: 'A' | 'B' | 'C';
	title: string;
	/** One line: what it adds. */
	adds: string;
	/** One line: what it costs. */
	tradeoff: string;
	/** The references it follows, by app name. */
	refs: string;
};

export const ALTERNATIVES: Alternative[] = [
	{
		id: 'tiles',
		letter: 'A',
		title: 'Six living tiles',
		adds: 'Each card shows its beat happening, as Our Process does, while the grid and the copy stay exactly as they are.',
		tradeoff: 'Six small loops compete for the eye, and the section starts to repeat the device Our Process already uses.',
		refs: 'Attio',
	},
	{
		id: 'walkthrough',
		letter: 'B',
		title: 'One walkthrough',
		adds: 'One project window where the Yeta cursor steps through the six beats, so the craft reads as one arc from a note to a result.',
		tradeoff: 'One beat at a time: the whole arc takes about twenty seconds, and the six cards shrink to an index beside it.',
		refs: 'Firecrawl, Intercom, Daydream',
	},
	{
		id: 'bento',
		letter: 'C',
		title: 'Lead and stills',
		adds: 'Design with intention leads with the only moving scene; the other five beats are stills of different kinds, so the grid has a place to look.',
		tradeoff: 'The calmest and most editorial, but it breaks the six equal cards and gives one beat more weight than the rest.',
		refs: 'Framer, Linear',
	},
];

/** Mobbin references for this section. Images stay on Mobbin; each card links there. */
export const CRAFT_REFERENCES: Reference[] = [
	{
		app: 'Attio',
		pattern: 'Six cards, each a small faux UI',
		why: 'Six neutral cards on a dark page, each with a tiny product fragment drawn in quiet grays on dashed guides: alternative A, with the hue kept to one mark per tile.',
		kind: 'section',
		id: '9038df26-d13c-4c95-98d5-62ba4fd5fad3',
	},
	{
		app: 'Firecrawl',
		pattern: 'Step list beside one live demo',
		why: 'Three steps on the left, one terminal on the right, and a thin accent rule on the active step while the rest stays neutral: the walkthrough’s index (B).',
		kind: 'section',
		id: '363363b9-a122-4092-8c41-962f962e6a46',
	},
	{
		app: 'Intercom',
		pattern: 'Numbered index with one panel',
		why: 'A ruled 01–06 index with the active row lit, beside one panel, and a grid of partner marks with one in focus: B’s structure and C’s tool collection.',
		kind: 'section',
		id: '6e6c00d6-44ce-4580-84cf-33acb6799652',
	},
	{
		app: 'Daydream',
		pattern: 'Stepper over one changing picture',
		why: 'Step pills and a 01 / 04 counter over one illustration that changes per step: the walkthrough’s rhythm, drawn as product UI instead of a person.',
		kind: 'section',
		id: 'db6e26f1-2858-4509-85e9-0236e05f3802',
	},
	{
		app: 'Framer',
		pattern: 'Bento of different kinds',
		why: 'An integrations grid, a CMS screen and a type tile side by side, each a different kind of picture: the mix C uses, kept on neutral grounds.',
		kind: 'section',
		id: '304f2b3f-a99b-4ae7-98da-98495475d2ae',
	},
	{
		app: 'Linear',
		pattern: 'Numbered stages on hairlines',
		why: 'Stages named 1.0 Intake to 5.0 Monitor, one line each, split by hairline rules with no colour at all: the quiet numbering the index and the bento share.',
		kind: 'section',
		id: '11fa0cf7-8a9c-41f1-b38f-66918fac01f4',
	},
];
