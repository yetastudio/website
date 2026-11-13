/**
 * /inspo content: the narrative proposals for the landing and the case study page,
 * and the Mobbin references behind each one. References are links only: the page
 * never re-hosts Mobbin images, its visuals are its own on-brand mockups.
 */

export type ReferenceKind = 'section' | 'screen';

export type Reference = {
	app: string;
	/** The pattern the reference shows, in a few words. */
	pattern: string;
	/** Why it fits Yeta's visual line (neutrals, editorial serif accents, glass pills, washes, bevels). */
	why: string;
	kind: ReferenceKind;
	id: string;
};

export type ProposalId = 'hero-demo' | 'process-walkthrough' | 'results' | 'before-after' | 'client-wall' | 'chapter-nav' | 'booking';

export type Placement = {
	page: 'Landing' | 'Case study';
	/** The anchor or section it lands in, as the page names it. */
	where: string;
	/** Existing or new. New anchors are drawn dashed on the story map. */
	status: 'new' | 'upgrade';
};

export type Proposal = {
	id: ProposalId;
	number: string;
	title: string;
	/** One line: what the proposal is. */
	summary: string;
	/** What it adds to the story. */
	adds: string;
	placements: Placement[];
	/** How the mockup below is built. */
	mockup: string;
	references: Reference[];
};

/** Canonical Mobbin link for a reference (no tracking parameters). */
export const mobbinUrl = ({ kind, id }: Pick<Reference, 'kind' | 'id'>) =>
	kind === 'section' ? `https://mobbin.com/sites/sections/${id}` : `https://mobbin.com/screens/${id}`;

/** The private Mobbin collection holding every reference on this page. */
export const MOBBIN_COLLECTION = 'https://mobbin.com/collections/4ab9e182-f053-470b-ab54-c7db806adff5/mobile/screens';

export const PROPOSALS: Proposal[] = [
	{
		id: 'hero-demo',
		number: '01',
		title: 'Hero product demo',
		summary: 'A framed Yeta-built site under the wordmark that flips from light to dark on its own theme switch.',
		adds: 'The hero says “pixel-perfect websites” but shows only type. A live product shot proves the claim in the first viewport: one system, two themes, no seams.',
		placements: [{ page: 'Landing', where: '#hero, under the slogan', status: 'upgrade' }],
		mockup: 'Stageshow scene in the Yeta look: a browser window, the classic arrow cursor and a theme pill that really inverts the page tokens.',
		references: [
			{
				app: 'Framer (Developers)',
				pattern: 'Product shot on a gradient wash',
				why: 'A dark page with the product framed on a soft colour wash and a glass “Watch introduction” pill: our gradient tile plus glass pill, at hero scale.',
				kind: 'section',
				id: '8915d551-a595-4252-a8a4-6b0788011efc',
			},
			{
				app: 'Chronicle',
				pattern: 'Dark hero with a glowing mark',
				why: 'Near-black canvas, a four-point star mark lit from behind and the product rising into view: the closest cousin to the ✹ and the metallic display type.',
				kind: 'section',
				id: '6985d6b3-5a76-490b-8082-b723bdb5d232',
			},
			{
				app: 'Framer',
				pattern: 'Canvas showing a finished site',
				why: 'Shows the website itself as the product, at desktop and tablet widths side by side: the story our case study tells about one site in every size.',
				kind: 'section',
				id: '9caf7169-91a3-419e-a787-6f61843eeda0',
			},
		],
	},
	{
		id: 'process-walkthrough',
		number: '02',
		title: 'Process walkthrough',
		summary: 'Our Process as a guided tour: a numbered index on one side, the step happening on the other.',
		adds: 'Six cards in a row read as a list. A walkthrough lets one step speak at a time and shows the work behind it, so “structured but flexible” becomes something you watch.',
		placements: [
			{ page: 'Landing', where: '#our-process', status: 'upgrade' },
			{
				page: 'Case study',
				where: 'between “The challenge” and “The result”',
				status: 'new',
			},
		],
		mockup:
			'Design system index (ghost buttons with Editorial numerals) beside the process tile, which plays that step’s Stageshow scene; the autoplay dot advances it, a click picks a step.',
		references: [
			{
				app: 'Fiasco',
				pattern: 'Sticky numbered step index',
				why: 'Warm neutral page, an italic serif lead and a three-step index that stays put while the story scrolls: our Editorial accent on our neutrals.',
				kind: 'section',
				id: '628d4c6b-cea8-49f0-88ca-353161a59678',
			},
			{
				app: 'FLORA',
				pattern: 'Numbered steps with product UI',
				why: '01 Ideate, 02 Iterate, 03 Scale on dark cards, each with the product mid-action and an italic accent in the headline: the Our Process cards with scenes in them.',
				kind: 'section',
				id: '35657c50-f894-4f9e-9a02-7ec46c414587',
			},
			{
				app: 'Craft Agency',
				pattern: 'Editorial numbered process',
				why: 'Large serif step names on a stone background with hairline rules between rows: the quiet, editorial rhythm our process copy already has.',
				kind: 'section',
				id: '698886b8-377c-40e9-97e1-767a59eb9f28',
			},
		],
	},
	{
		id: 'results',
		number: '03',
		title: 'Results in numbers',
		summary: 'Three outcomes set large in Editorial, each tied to the project that earned it.',
		adds: 'Testimonials say the work landed; numbers say how far. A short row of results turns the case study into evidence and gives the landing a beat between Our Work and Our Process.',
		placements: [
			{
				page: 'Landing',
				where: 'new #results, after #our-work',
				status: 'new',
			},
			{ page: 'Case study', where: '“In numbers”', status: 'upgrade' },
		],
		mockup: 'Design system: gradient stat tiles with Editorial numerals; each figure is read from the code (locales, themes, registry).',
		references: [
			{
				app: 'Fiasco',
				pattern: 'Big numbers with their source',
				why: 'Light figures at display size, each with one line naming the client it came from: proof without a dashboard.',
				kind: 'section',
				id: '8dd5c506-3f96-4672-9c2b-438f36e91439',
			},
			{
				app: 'Twenty',
				pattern: 'Case card with a stats row',
				why: 'Serif headline, an italic quote with a hairline rule and three stats under it: the case-study sheet we already draw, with results added.',
				kind: 'section',
				id: 'e15c2850-a6fd-4c05-8848-e578c0ed21ad',
			},
			{
				app: 'Analogue Agency',
				pattern: 'One counter per scroll beat',
				why: 'A single giant numeral beside a rule, counting up as it enters: the display-gradient type given a number to carry.',
				kind: 'section',
				id: '53f31d8a-739c-4392-b8ac-7a5e69465f6b',
			},
		],
	},
	{
		id: 'before-after',
		number: '04',
		title: 'Before / after',
		summary: 'One frame, two states: the brief as it arrived and the product as it shipped, split by a handle you drag.',
		adds: '“The challenge” and “The result” are two paragraphs apart. Putting them in one frame makes the change visible in a second, and the drag is the most honest demo of craft we can give.',
		placements: [{ page: 'Case study', where: 'opening “The result”', status: 'new' }],
		mockup: 'Stageshow scene in the Yeta look: the arrow cursor drags the divider across, revealing the finished page over the untreated one.',
		references: [
			{
				app: 'V7',
				pattern: 'Before on dark, after on a wash',
				why: 'The “before” half sits on a flat dark surface, the “after” on a bright gradient with glass rows: exactly our canvas versus our gradient tile.',
				kind: 'section',
				id: '17e4b22d-7c8d-45ff-a87c-47b61b089da6',
			},
			{
				app: 'Deel',
				pattern: 'Split before/after quote card',
				why: 'A neutral half and a tinted half in one rounded card, each with a short quote: a compact version that fits the case study sheet.',
				kind: 'section',
				id: 'f7839be1-9379-468c-9b5d-8db428723ae3',
			},
		],
	},
	{
		id: 'client-wall',
		number: '05',
		title: 'Client wall',
		summary: 'The brands behind the testimonials, set as wordmarks on bevelled tiles, with one open tile for the next.',
		adds: 'Trust comes before persuasion. A quiet wall right after the hero tells visitors who already said yes, and the open tile turns the list into an invitation.',
		placements: [
			{ page: 'Landing', where: 'new #clients, after #hero', status: 'new' },
			{
				page: 'Case study',
				where: 'above the closing call to action',
				status: 'new',
			},
		],
		mockup: 'Design system: tint surfaces with the bevel stroke, client names set in type (no lookalike logos) and a CTA tile.',
		references: [
			{
				app: 'Cursor',
				pattern: 'Tiled logo grid',
				why: 'Equal tiles on a stone background, each a hair darker than the page: our tint surface and bevel, repeated.',
				kind: 'section',
				id: '1ffcbd94-da3c-4a55-a7ab-4f9311742312',
			},
			{
				app: 'Fiasco',
				pattern: 'Italic caption over a logo row',
				why: '“Businesses we’ve moved forward” in an italic serif above the marks: the Editorial accent introducing proof.',
				kind: 'section',
				id: '36a53c52-dc8b-4dea-814c-31580b4f1932',
			},
			{
				app: 'Framer',
				pattern: 'Logo grid on black',
				why: 'Monochrome wordmarks on near-black with generous air: how the wall should read on the dark theme.',
				kind: 'section',
				id: '58de7e34-acd9-44d5-a479-4ad6bc4a9237',
			},
		],
	},
	{
		id: 'chapter-nav',
		number: '06',
		title: 'Case study chapter nav',
		summary: 'A glass pill pinned under the header that names the chapters and follows the reader.',
		adds: 'The case study is long and linear. Chapters tell the reader the shape of the story up front, let them jump to the result, and the sliding pill shows where they are.',
		placements: [
			{
				page: 'Case study',
				where: 'under the intro, pinned while reading',
				status: 'new',
			},
		],
		mockup: 'Design system: the SegmentedControl pill (Tabs sliding) driving a scrolling page; scroll moves the pill, the pill scrolls the page.',
		references: [
			{
				app: 'Koto',
				pattern: '“Jump to” chapter row',
				why: 'A dark services page with a small jump-to row of chapter names above the content: the lightest form of chapter nav.',
				kind: 'section',
				id: '2ce48fe2-bea1-438e-a2aa-0b1af12f7996',
			},
			{
				app: 'Codecademy',
				pattern: 'Contents rail with numerals',
				why: 'A right rail of roman-numbered chapters beside a long article, the current one marked: chapters as Editorial numerals.',
				kind: 'screen',
				id: '4685acfd-ce18-451f-8621-3b9958dda6ae',
			},
			{
				app: 'Turo',
				pattern: 'Table of contents with progress',
				why: 'Chapters that tick off as you read, with a progress hairline: the pill plus a progress stroke.',
				kind: 'screen',
				id: 'c1cc661e-ec5c-4d15-a781-d388cb329940',
			},
			{
				app: 'Tailscale',
				pattern: 'Case study with a facts rail',
				why: 'Customer story with company, website and industry stacked beside the cover: where the project sheet and the chapter nav can share a column.',
				kind: 'section',
				id: '84f94fa1-216c-40e9-aa21-d4b6e8039f5b',
			},
		],
	},
	{
		id: 'booking',
		number: '07',
		title: 'Booking preview',
		summary: 'The closing call to action shows what happens next: a day, a time, a confirmed intro call.',
		adds: 'Every section ends in “Get in touch”, which opens cal.com in a new tab. Showing the booking in our own look lowers the cost of that click and ends the story on a calendar, not a link.',
		placements: [
			{
				page: 'Landing',
				where: '#our-process call to action',
				status: 'upgrade',
			},
			{
				page: 'Case study',
				where: 'closing call to action',
				status: 'upgrade',
			},
		],
		mockup: 'Stageshow scene in the Yeta look on a gradient wash: the cursor picks a day and a time, and the button confirms on itself.',
		references: [
			{
				app: 'Calendly',
				pattern: 'Availability card on a wash',
				why: 'A white availability card floating on a blue gradient tile, beside a serif headline: our gradient tile with a product card in it.',
				kind: 'section',
				id: '959d4e5e-ecc6-4995-b084-ed17dc74724f',
			},
			{
				app: 'Shade',
				pattern: 'Booking with a quote under it',
				why: 'Calendar, slots and a client quote in one bordered sheet: the booking and the testimonial working as one closing beat.',
				kind: 'section',
				id: 'ab7d0b16-d140-4c85-ae4f-788e1946e591',
			},
			{
				app: 'Mora',
				pattern: 'What happens after you book',
				why: 'Three numbered steps (call, setup, check-in) on hairline rules under the CTA: the kickoff our process copy already promises.',
				kind: 'section',
				id: 'a3376afd-3fc7-4f42-94e4-a84e3b6deede',
			},
		],
	},
];

/** The two stories as they read today, with the proposals slotted in (story map). `isNew` beats do not exist yet. */
export const STORY_MAP: Array<{
	page: Placement['page'];
	beats: Array<{ label: string; proposal?: ProposalId; isNew?: boolean }>;
}> = [
	{
		page: 'Landing',
		beats: [
			{ label: 'Hero', proposal: 'hero-demo' },
			{ label: 'Clients', isNew: true, proposal: 'client-wall' },
			{ label: 'Why Yeta' },
			{ label: 'Our Craft' },
			{ label: 'Our Work' },
			{ label: 'Results', isNew: true, proposal: 'results' },
			{ label: 'Our Process', proposal: 'process-walkthrough' },
			{ label: 'Testimonials' },
			{ label: 'Book a call', proposal: 'booking' },
		],
	},
	{
		page: 'Case study',
		beats: [
			{ label: 'Intro' },
			{ label: 'Chapters', isNew: true, proposal: 'chapter-nav' },
			{ label: 'Screens' },
			{ label: 'About + sheet' },
			{ label: 'In numbers', proposal: 'results' },
			{ label: 'The challenge' },
			{ label: 'Process', isNew: true, proposal: 'process-walkthrough' },
			{ label: 'Before / after', isNew: true, proposal: 'before-after' },
			{ label: 'The result' },
			{ label: 'Clients', isNew: true, proposal: 'client-wall' },
			{ label: 'Book a call', proposal: 'booking' },
		],
	},
];
