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
		mockup:
			'Design system: neutral raised tiles with Editorial numerals and one hue dot each; each figure is read from the code (locales, themes, registry).',
		references: [
			{
				app: 'Fiasco',
				pattern: 'Big numbers with their source',
				why: 'Light figures at display size, each with one line naming the client it came from: proof without a dashboard.',
				kind: 'section',
				id: '8dd5c506-3f96-4672-9c2b-438f36e91439',
			},
			{
				app: 'Metalab',
				pattern: 'Serif figures in ruled rows',
				why: 'Three large serif figures on near-black, each in its own ruled row with a one-line caption: results read as a calm ledger, not a dashboard.',
				kind: 'section',
				id: '93bb5d7f-995a-4784-a9ec-fad6ccc40830',
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
				app: 'Deel',
				pattern: 'Split before/after quote card',
				why: 'A neutral half and a tinted half in one rounded card, each with a short quote: a compact version that fits the case study sheet.',
				kind: 'section',
				id: 'f7839be1-9379-468c-9b5d-8db428723ae3',
			},
			{
				app: 'Nite Riot',
				pattern: 'Split hero across a seam',
				why: 'A product shot fills one half, paper-white the other, and an oversized title crosses the seam: the divider as the hero, the way our drag handle is.',
				kind: 'section',
				id: 'd8c6801c-2eaa-48ed-b55b-5c74d0042347',
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
				app: 'Koto',
				pattern: 'Case page with a chapter rail',
				why: 'A dark rail with title, sector, year and chapters from Challenge to Outcome beside full-bleed brand media: the reading structure our case page needs.',
				kind: 'section',
				id: '0e52c0f5-c6f6-40a3-be31-06a104e486a1',
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
		mockup:
			'Stageshow scene in the Yeta look on a neutral stage with a faint violet tint: the cursor picks a day and a time, and the button confirms on itself.',
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

export type ShelfId = 'nav' | 'hero' | 'value' | 'services' | 'work' | 'process' | 'stats' | 'testimonials' | 'about' | 'cta' | 'footer' | 'case';

/** One anchor of the section library: where it lands on the site, what to look for, and the references. */
export type Shelf = {
	id: ShelfId;
	title: string;
	/** The anchor or page it feeds, as the site names it. */
	lands: string;
	/** What makes a reference right for this anchor, in one sentence. */
	lookFor: string;
	references: Reference[];
};

/** The private Mobbin collection holding every reference in the section library. */
export const LIBRARY_COLLECTION = 'https://mobbin.com/collections/0089fac5-c8c0-4592-ad3f-3414a71a3c3d/mobile/screens';

/** Section library: brand-aligned Mobbin sections, one shelf per anchor, in the order the landing reads. */
export const LIBRARY: Shelf[] = [
	{
		id: 'nav',
		title: 'Navigation',
		lands: 'Header, every page',
		lookFor: 'Frosted pills that hold only what matters, a theme switch that belongs there, and dark versions with one lit action.',
		references: [
			{
				app: 'Analogue Agency',
				pattern: 'Centered frosted glass pill',
				why: 'A translucent pill holding only Work, the wordmark and About, blurring the light burst behind it: the frosted nav we want, at its most reduced.',
				kind: 'section',
				id: '2897fc9c-97a9-48e6-9b96-ea02583b012d',
			},
			{
				app: 'mymind',
				pattern: 'White pill with colored dot links',
				why: 'Each link carries a tiny colored dot that echoes the gradient tiles below; borrow it to tie nav items to our pink, yellow and green washes.',
				kind: 'section',
				id: '4441237a-2e84-4fd8-a4dd-683a3c21c5d9',
			},
			{
				app: 'Fourmula AI',
				pattern: 'Compact pill with theme toggle',
				why: 'A dark capsule holding Menu, a moon toggle and a scroll percentage, with the logo and one black pill parked at the edges; ideal for our light/dark switch.',
				kind: 'section',
				id: '3332ff1d-967c-4f6a-99fa-f9a4734c181b',
			},
			{
				app: 'Butter',
				pattern: 'Split frosted nav groups',
				why: 'Links and actions sit in two separate frosted trays with a gap between, over a pale grey gradient; a calm way to split nav from calls to action.',
				kind: 'section',
				id: '27482a00-3ca5-4d95-ad84-b2b06e581f00',
			},
			{
				app: 'VanMoof',
				pattern: 'Dark glass bar over photo',
				why: 'A narrow smoked-glass bar with only a menu icon, the wordmark and a bag, centered over a dark product shot; shows how little a premium nav needs.',
				kind: 'section',
				id: 'a2eb514d-563f-4fb9-aaff-8f235f43d666',
			},
			{
				app: 'Cosmos',
				pattern: 'Dark pill with glowing primary',
				why: 'On near-black, a dim pill of links ends in a white Sign up chip with a soft halo; a model for our dark-theme nav and lit primary button.',
				kind: 'section',
				id: '5262f136-e0e1-4d69-bb6b-19673552612f',
			},
			{
				app: 'Büro',
				pattern: 'Bottom-docked menu pill',
				why: 'The nav lives in a dark capsule docked at the bottom, with Open menu and a white current-page chip; an unexpected placement that keeps the hero untouched.',
				kind: 'section',
				id: '96246ad7-c31d-4134-b867-1c73db9fcb78',
			},
		],
	},
	{
		id: 'hero',
		title: 'Hero',
		lands: 'Landing #hero',
		lookFor: 'A neutral ground or a faintly tinted sky, a headline that pairs sans with a serif italic, and the product framed quietly.',
		references: [
			{
				app: 'Craft Agency',
				pattern: 'Dark hero with italic serif line',
				why: 'Near-black canvas, a smoky green-lilac wash behind the type and a second line set in serif italic: borrow the restraint of one wash and one accent.',
				kind: 'section',
				id: 'cbde3ed5-2c73-47ee-91a4-6b33cb7efa0e',
			},
			{
				app: 'Air',
				pattern: 'Sky gradient with one huge word',
				why: 'Closest cousin to the saved Altitude hero: a deep-to-pale blue sky, clouds only at the corners and a single condensed word carrying the whole viewport.',
				kind: 'section',
				id: '7917824f-28da-4b9f-a84c-fe28f35d26d4',
			},
			{
				app: 'Microsoft AI',
				pattern: 'Italic serif over warm wash',
				why: 'One italic word above an upright one, floating on a blurred peach light wash under a cream glass bar: our editorial accent and soft atmosphere in one frame.',
				kind: 'section',
				id: '057209db-db9a-4f89-9eba-2f4144f1f099',
			},
			{
				app: 'Unseen Studio',
				pattern: 'Serif italic and sans headline',
				why: 'The type pairing we want: a serif italic phrase stacked on a heavy sans word, one white pill below; take the pairing, skip the 3D room.',
				kind: 'section',
				id: '1bdc4e01-2f7e-4e09-9aa1-27f02c13bcbe',
			},
			{
				app: 'Daylight',
				pattern: 'Inset photo hero with italic accent',
				why: 'Rounded inset frame, a frosted pill nav floating in the corner and one italic serif word in a light sans headline; a calm model for a framed-site hero.',
				kind: 'section',
				id: 'b9729ea8-5d0f-4cd1-bd67-77d6f9d835e0',
			},
			{
				app: 'Sana',
				pattern: 'Product window over landscape photo',
				why: 'A real product window sits on a sky-and-hills photo with a segmented pill switcher above: a live demo framed by atmosphere, close to our Stageshow scenes.',
				kind: 'section',
				id: '7f35e77e-e242-4333-809d-49fc3156ba43',
			},
		],
	},
	{
		id: 'value',
		title: 'Why Yeta',
		lands: 'Landing #why-yeta',
		lookFor: 'Reasons as short claims, carried by numbers or real interface fragments instead of a grid of icons.',
		references: [
			{
				app: 'Metalab',
				pattern: 'Serif claim over numbered reasons',
				why: 'A serif headline on near-black, then six numbered reasons in thin-ruled columns: Why Yeta as a calm row of short claims, not a grid of icons.',
				kind: 'section',
				id: '26e93485-a46d-464b-b795-f4eb9101403c',
			},
			{
				app: 'FLORA',
				pattern: 'Framed dashboard over gradient tiles',
				why: 'One framed product UI on top, three small tiles below with blurred color washes and a single icon each: borrow the wash-as-tile idea and the dark restraint.',
				kind: 'section',
				id: '27fbff58-42db-49e5-84c9-0a9ff1bcca07',
			},
			{
				app: 'Paraform',
				pattern: 'Numbered accordion beside framed UI',
				why: 'Serif headline, a four-item numbered accordion, and a live dashboard floating on a painted backdrop: reasons stay short while the product proves them visually.',
				kind: 'section',
				id: '4f204e08-e8ba-43b8-9c8d-d668986361a3',
			},
			{
				app: 'Cursor',
				pattern: 'Three tiles with UI fragments',
				why: 'Warm-grey tiles, a short claim and link on top, a cropped model picker or code view below: each reason shows a real interface detail instead of an icon.',
				kind: 'section',
				id: 'e0720ea6-1a1a-4ae5-8f3e-826a10f8b9ae',
			},
			{
				app: 'Legora',
				pattern: 'Frosted-glass product tiles in a row',
				why: "Four equal tiles with soft grey frosted renders and short captions underneath; the glassy, bevelled surfaces match Yeta's pill buttons and keep the row quiet.",
				kind: 'section',
				id: '6a184452-7e67-4257-b630-ba8e3c584229',
			},
			{
				app: 'Studio Freight',
				pattern: 'Serif principles as an accordion',
				why: 'Eight principles set as large serif lines with plus toggles, one open with an image and paragraph: an editorial way to list reasons without cards.',
				kind: 'section',
				id: '6426caf8-d7d6-418c-96f6-aa0ea53b2646',
			},
			{
				app: 'Vucko',
				pattern: 'Giant headline with numbered benefits',
				why: 'WORKING, TOGETHER in oversized sans, then numbered benefits beside a live video-call tile: confident type plus one real moment of collaboration as proof.',
				kind: 'section',
				id: '6b5093a3-925b-41ea-8cc1-e77d61822f59',
			},
		],
	},
	{
		id: 'services',
		title: 'Our Craft',
		lands: 'Landing #our-craft',
		lookFor: 'Disciplines set as big type with quiet lists under them, and proof pinned beside each one.',
		references: [
			{
				app: 'Fiasco',
				pattern: 'Service list beside a framed demo',
				why: 'Italic serif services list with one active item and the rest faded, next to a centered framed UI; it names motion, design systems and development, like Yeta.',
				kind: 'section',
				id: '6fbcef4f-e8df-4aa5-a71a-abe9504f619e',
			},
			{
				app: 'Koto',
				pattern: 'Service intro with capability rows',
				why: 'Dark page, one service name, a large one-sentence promise and a ruled list of deliverables, with a small case tile pinned in the corner as proof.',
				kind: 'section',
				id: '968754c4-c525-4315-a823-07721be58b1b',
			},
			{
				app: 'Phantom Studios',
				pattern: 'Discipline rows with work thumbnails',
				why: "Each discipline gets a big title, two lines of focus, a pill link and a framed product thumbnail on the right; the floating pill nav echoes Yeta's.",
				kind: 'section',
				id: '3cf723db-92c1-4601-b820-379757d44107',
			},
			{
				app: 'Analogue Agency',
				pattern: 'Three-column capability index',
				why: 'Strategy, Design and Technology as three ruled columns under a frosted pill nav, listing design systems and Framer builds: a dense offer that still reads calm.',
				kind: 'section',
				id: '7063e124-d7b5-4fe4-9797-b318a5be20d1',
			},
			{
				app: 'Instrument',
				pattern: 'Giant serif disciplines with lists',
				why: 'Brand, Marketing and Product set in huge serif, each with a short paragraph, two columns of capabilities and a pill button; Our Craft could use the same rhythm.',
				kind: 'section',
				id: 'd0850530-6f9d-4590-83bc-baa018680be2',
			},
			{
				app: 'Anima',
				pattern: 'Service list on a color wash',
				why: 'A plain list of services in large type sits on white fading into a yellow-green wash, with pill nav overhead: one atmospheric gradient, nothing else competing.',
				kind: 'section',
				id: '883db2f4-aced-412d-8c52-de2012b6e6db',
			},
			{
				app: 'Taxi Studio',
				pattern: 'Sans statement beside serif list',
				why: "Condensed sans statement on the left, a near-black square on the right listing six services in serif: a two-voice type pairing that suits Yeta's editorial accent.",
				kind: 'section',
				id: '77b5357f-74e4-413b-80b9-adb104a89693',
			},
		],
	},
	{
		id: 'work',
		title: 'Our Work',
		lands: 'Landing #our-work',
		lookFor: 'Finished sites framed as the product, editorial pacing, and filters that stay out of the way.',
		references: [
			{
				app: 'Fiasco',
				pattern: 'Staggered grid with serif eyebrow',
				why: "A serif italic 'Selected works' label over a calm statement, then an offset two-column grid with quiet tags. Our Work section can borrow this editorial pacing directly.",
				kind: 'section',
				id: '4ed7c118-a866-41fa-824c-32a24323c927',
			},
			{
				app: 'Instrument',
				pattern: 'Filterable work with serif statement',
				why: 'A serif statement headline, small pill filters and a stack/grid toggle, then rounded tiles showing live product UI. Borrow the toggle and the way the media tells the story.',
				kind: 'section',
				id: '05811dd7-a07a-41ae-9fa7-192b8eede1b1',
			},
			{
				app: 'OFF+BRAND',
				pattern: 'Framed site cards on a wash',
				why: "One pink-orange wash bleeds off the edge, with frosted pill buttons and client cards that hold framed site screens and a 'View case study' pill. Very close to our own kit.",
				kind: 'section',
				id: '0b70740a-eb7a-415b-b48d-09d66ce3ec38',
			},
			{
				app: 'ramp.design',
				pattern: 'Work as live product moments',
				why: 'Each tile is a small working piece of UI on a near-white panel, such as a card carousel or a budget gauge. It shows craft through motion instead of thumbnails.',
				kind: 'section',
				id: 'f61f66c0-5b44-471b-9ef7-f382746d4f76',
			},
			{
				app: 'Koto',
				pattern: 'Dark work index with intro rail',
				why: 'A narrow left rail holds the intro, filters and a featured project card, while a tight bento of work fills the rest. A good model for our dark theme.',
				kind: 'section',
				id: 'd820c5ae-eeff-4b27-bf9b-4f78df222c89',
			},
			{
				app: 'Webflow',
				pattern: 'Framed sites over a pale wash',
				why: 'A big centered headline on a pale banded wash, then a peeking carousel of large framed sites, one full of soft sky. A quiet way to present finished websites.',
				kind: 'section',
				id: '103632e2-e594-4aba-8287-68eedd2cfb44',
			},
			{
				app: 'Unseen Studio',
				pattern: 'Centered projects with count pills',
				why: "A centered 'Selected Projects' title, pill filters with small counts, and two-up tiles captioned with name, type and a hairline. Restrained chrome around rich media.",
				kind: 'section',
				id: '79d328bc-800b-4830-9de1-7ef8fd2dd00f',
			},
		],
	},
	{
		id: 'process',
		title: 'Our Process',
		lands: 'Landing #our-process',
		lookFor: 'Numbered steps carried by type, one step in focus at a time, and a live demo where it helps.',
		references: [
			{
				app: 'Oevra',
				pattern: 'Washed headline with step tabs',
				why: 'Soft green wash behind a big display headline with an inline image chip, steps as numbered mono tabs: borrow the chip and tab rail for our six steps.',
				kind: 'section',
				id: '129ec290-2b26-46ff-9800-96a1145f7907',
			},
			{
				app: 'Trawelt',
				pattern: 'Giant numeral step rows',
				why: 'Light serif line over a sans line in the headline, then each step gets a giant numeral and a ruled row; editorial hierarchy carried by numbers alone.',
				kind: 'section',
				id: '629aae31-4a94-46df-a97f-3180a6ae22e0',
			},
			{
				app: 'Rox',
				pattern: 'Step rail with live demo',
				why: 'Numbered step rail on top drives one framed, oversized UI demo below; the active step brightens. A direct model for showing each step as a live scene.',
				kind: 'section',
				id: '53c3d7d9-8feb-4531-afd7-c1bd06bf77c0',
			},
			{
				app: 'Ragged Edge',
				pattern: 'Full-bleed wash step list',
				why: 'A full pink wash with huge sans step names and quiet serif body text; few elements, lots of air, and the color does the atmosphere.',
				kind: 'section',
				id: '2f8c5c81-1584-415c-80b2-3ac03ae68a80',
			},
			{
				app: 'Titan Intake',
				pattern: 'Rotary dial of steps',
				why: 'Steps arranged on a dial around a sky-gradient disc, active step in focus and the rest fading; a crafted rotating take that suits the dark theme.',
				kind: 'section',
				id: '997ccdfd-8e26-4f3b-ba9e-423d72ed08c1',
			},
			{
				app: 'Atlas',
				pattern: 'One step per viewport',
				why: 'One step per viewport: a giant step word, line-art object and dot pagination on a dark grid. Our Integrate step could borrow this frame directly.',
				kind: 'section',
				id: 'f4bb0189-fdb7-4075-a704-8f2f7b91f926',
			},
			{
				app: 'Wild',
				pattern: 'Steps under generative visual',
				why: "A studio's four steps under a generative pixel field that drifts from scattered blue to ordered yellow; the visual itself tells the process story.",
				kind: 'section',
				id: 'eef9343d-0d21-41e4-9524-54462b7612db',
			},
		],
	},
	{
		id: 'stats',
		title: 'Results and clients',
		lands: 'Landing, new #results and #clients',
		lookFor: 'Figures set large with their source, and client lists that read as typography rather than clip art.',
		references: [
			{
				app: 'Craft Agency',
				pattern: 'Serif stat card over gradient wash',
				why: 'A single serif 94% on an off-white card floating over a peach and blue wash, paged with small arrows: one number at a time, carried by atmosphere.',
				kind: 'section',
				id: '2cf145a8-2ed6-4c99-9b32-a2795c1e7004',
			},
			{
				app: 'Fiasco',
				pattern: 'Impact statement with sourced numbers',
				why: "Italic serif Impact label, a short belief paragraph, then three thin oversized figures each tied to a named client project: honest proof that works in Yeta's dark theme.",
				kind: 'section',
				id: 'b50a1ddc-1229-45d5-a6b2-03d37c60351e',
			},
			{
				app: 'Giga',
				pattern: 'Stats over a blurred sky',
				why: 'Three short metrics with mono labels sit on a blurred dusk-sky gradient with a soft light source; close to the Altitude band the owner saved, applied to numbers.',
				kind: 'section',
				id: 'ae0c14d3-f972-41f1-872a-bc673fb3a522',
			},
			{
				app: 'Craft Agency',
				pattern: 'Client names as serif wordmarks',
				why: 'Clients set as large serif wordmarks in a muted, edge-to-edge band, one name highlighted in brand green: a logo wall that reads as typography, not clip art.',
				kind: 'section',
				id: '6e48e522-c4a0-4df4-9f69-947cf6d586eb',
			},
			{
				app: 'Koto',
				pattern: 'Two-tone headline over logo tiles',
				why: "Headline half white, half grey, then equal dark tiles each holding one monochrome logo: a restrained logo row that sits naturally in Yeta's dark theme.",
				kind: 'section',
				id: 'd6885464-0d5e-414f-8f54-054b7059f238',
			},
			{
				app: 'Unify',
				pattern: 'Serif numbers with fine-line charts',
				why: 'Serif figures in three white cards, each with a thin orange line drawing and a source footnote: small charts that feel drawn, not pulled from a library.',
				kind: 'section',
				id: 'b9ef2e45-641c-4b58-9707-bd1f373636d0',
			},
		],
	},
	{
		id: 'testimonials',
		title: 'Testimonials',
		lands: 'Landing #testimonials',
		lookFor: 'One voice at a time on a quiet ground, with a calm way to move to the next.',
		references: [
			{
				app: 'mymind',
				pattern: 'Serif quote on gradient wash',
				why: 'One large serif quote floating on a pink, orange and violet wash, attribution in small sans; exactly our wash-as-atmosphere idea applied to a single voice.',
				kind: 'section',
				id: '1ae9cdc7-a8f4-46b7-bf64-f6e6f38d4df7',
			},
			{
				app: 'Craft',
				pattern: 'Sky-wash quote with italics',
				why: 'Pale sky-blue band, serif sentence with the quoted phrases set in italic, a small laurel badge; the italic-accent trick from our headlines, reused for praise.',
				kind: 'section',
				id: '65764548-7a15-430d-85e2-491458cc4aa0',
			},
			{
				app: 'Framer',
				pattern: "Quote beside the client's site",
				why: 'Each slide pairs a client quote with a framed screenshot of the site built, plus client-name tabs; for a web studio the work becomes the proof.',
				kind: 'section',
				id: '87c35e9c-b704-42e0-8887-0ab5c372375c',
			},
			{
				app: 'Analogue Agency',
				pattern: 'Quote cards scrolling over headline',
				why: 'A dark stage holding one line while light quote cards scroll across it under a frosted pill nav; motion and restraint instead of a card grid.',
				kind: 'section',
				id: '4660cdff-279d-4a6c-9708-2cca679432f8',
			},
			{
				app: 'Harvey',
				pattern: 'Portrait quote with progress bars',
				why: 'Portrait left, serif quote and client wordmark right, three thin bars, one filling, pacing the rotation; calm rhythm and a precise detail we can rebuild.',
				kind: 'section',
				id: 'd591740c-b7c1-40fb-86c3-34c8511bc2c4',
			},
			{
				app: 'Paraform',
				pattern: 'Logo tabs over painted landscape',
				why: "Serif heading and a single short quote over a dark painted mountain, client logos as tabs with an active underline; atmosphere like Altitude's sky, kept quiet.",
				kind: 'section',
				id: 'f8458b16-3edd-4437-bd21-7a06eb89269c',
			},
			{
				app: 'Amigo',
				pattern: 'Frosted glass quote panel',
				why: 'A frosted panel over a warm terracotta field, logo left and serif quote right with tiny pagination; our glass material applied to a testimonial without extra chrome.',
				kind: 'section',
				id: 'd168ff0e-bd57-4839-a482-3721c89bcc4a',
			},
		],
	},
	{
		id: 'about',
		title: 'About the studio',
		lands: 'New page or section',
		lookFor: 'The people and the principles, told as a statement, a letter or a portrait standard, never a stock grid.',
		references: [
			{
				app: 'Analogue Agency',
				pattern: 'Statement beside a team list',
				why: 'A large statement whose last word fades to grey, a hairline divider, and a list of studio portraits with roles and one-line notes. Personal, and avoids a stock grid.',
				kind: 'section',
				id: '1d822f31-3963-417c-afeb-3c5deb144cfc',
			},
			{
				app: 'OFF+BRAND',
				pattern: 'Team intro on a gradient wash',
				why: 'A pink-orange orb is the only color, with a numbered chapter index, an uppercase statement and team photos below. It shows how one wash can carry a page.',
				kind: 'section',
				id: 'f6a9b056-e9be-4ab5-80ea-9eae42fbd179',
			},
			{
				app: 'Taxi Studio',
				pattern: 'Serif manifesto with awards still life',
				why: 'A light serif paragraph as the headline on warm off-white, a condensed sub-statement and a pill button. The awards are photographed as one object instead of shown as logos.',
				kind: 'section',
				id: '4e75712f-fc5e-4799-ac5e-2deafb5ff081',
			},
			{
				app: 'incident.io',
				pattern: "Founders' note with signatures",
				why: "A serif 'A note from the founders' heading, a letter in plain paragraphs, a small framed photo and handwritten signatures. A warm, honest format for the studio story.",
				kind: 'section',
				id: '67e11461-af20-4b7e-8e9a-8f0cdc669a8d',
			},
			{
				app: 'Aino Agency',
				pattern: 'Scattered photos over a statement',
				why: 'Loose, offset studio photos above a large statement and four short principles in monospace columns. Generous space and a real sense of the people and the place.',
				kind: 'section',
				id: '0553efc5-ac3a-4b83-9105-c0a16d2ce221',
			},
			{
				app: 'Mother Design',
				pattern: 'Values as a word grid',
				why: 'Four one-word values set large in a hairline grid over a single photo, with a small note card. A confident, editorial way to state principles.',
				kind: 'section',
				id: '9514d24a-05d7-4439-8425-02de8f64c348',
			},
			{
				app: 'Ragged Edge',
				pattern: 'Portrait grid on colored backdrops',
				why: 'Consistent studio portraits against ochre, teal and coral backdrops, with serif name and role underneath. If we show the team, this is the photography standard to aim for.',
				kind: 'section',
				id: '48506d87-4d32-42f0-aa0a-ad334b3fbb86',
			},
		],
	},
	{
		id: 'cta',
		title: 'Closing call to action',
		lands: 'End of every page',
		lookFor: 'A quiet last band: one sentence, one way to reach us, and colour only as an accent.',
		references: [
			{
				app: 'Fiasco',
				pattern: 'Dark contact with italic eyebrow',
				why: 'Near-black panel, a small serif italic Get in touch above a three-line light sans question: pure type, no button, exactly our editorial accent at work.',
				kind: 'section',
				id: 'fa4ba62d-f77e-4210-9b3b-993d86580db5',
			},
			{
				app: 'Atlas',
				pattern: 'Painted sky with huge headline',
				why: 'A soft painted sky and hills, two huge white lines and one dark button: the Altitude mood reused as a closing band before the footer.',
				kind: 'section',
				id: 'cc082caa-a17c-4d49-9254-4d60270d2d38',
			},
			{
				app: 'Chronicle',
				pattern: 'Outlined wordmark with lit button',
				why: 'Black field, a giant hairline-outlined wordmark along the bottom and one light button with star-flare streaks at its corners; a direct match for our mark and dark theme.',
				kind: 'section',
				id: 'ae44c0d6-872d-4892-9c35-d2a07fcb9904',
			},
			{
				app: 'Oevra',
				pattern: 'Soft green wash closing band',
				why: 'Pale grey surface with a blurred green glow, a mono eyebrow, a two-line olive headline and one black pill: shows a single wash carrying a quiet ending.',
				kind: 'section',
				id: '65d8c109-215a-42ca-8cd4-0b9295424a0e',
			},
			{
				app: 'Unseen Studio',
				pattern: 'Say hello with pill choices',
				why: 'Serif italic Say hello beside two pill chips for New Business or General and a plain email; borrow the chip choice to route inquiries without a form.',
				kind: 'section',
				id: '5323b0ec-3ed9-4bb0-a5a0-5f575d60333b',
			},
			{
				app: 'Analogue Agency',
				pattern: 'Work with us bento',
				why: 'A short Work with us headline over three tiles, one black, one blue diagram, one avatar grid: proof points as product-like cards instead of a sales pitch.',
				kind: 'section',
				id: '574c3764-86cc-445e-9337-28c022a44dc6',
			},
			{
				app: 'Ghost',
				pattern: 'Dark CTA with horizon gradient',
				why: 'Near-black with a blue-to-orange horizon band glowing at the base and a single metallic object centered; a dark-theme version of the sky band, with one quiet button.',
				kind: 'section',
				id: '0d5b905e-df4a-420c-a961-6763c83aa8c3',
			},
		],
	},
	{
		id: 'footer',
		title: 'Footer',
		lands: 'Every page',
		lookFor: 'A colophon, not a sitemap: one wordmark, one accent and a crafted detail that rewards reaching the end.',
		references: [
			{
				app: 'Opacity',
				pattern: 'Gradient sweep over giant wordmark',
				why: 'A single blue-to-black gradient sweeps diagonally across a light ground, a few links, then a huge logo lockup; one wash, one wordmark, nothing else.',
				kind: 'section',
				id: 'ea8ab734-447d-4422-a34d-82f98a6d61a8',
			},
			{
				app: 'Claude Type',
				pattern: 'Serif italic sign-off wordmark',
				why: "Quiet link columns and a pill email field, closed by a full-width serif italic line; the editorial italic accent turned into the page's last word.",
				kind: 'section',
				id: 'e4b43a6b-b75a-4564-8573-10742b5e5911',
			},
			{
				app: 'Koto',
				pattern: 'Dark studio contact footer',
				why: 'Two-tone heading, contact rows with hairlines and a small studio photo card on near-black; a studio footer that reads like a colophon, not a sitemap.',
				kind: 'section',
				id: '2d796987-2aad-48a2-b619-8757026054d6',
			},
			{
				app: 'Seasats',
				pattern: 'Wordmark with scroll-distance readout',
				why: 'Huge wordmark over a hazy orange landscape, plus a live readout of meters scrolled and scroll speed; a playful crafted detail that rewards reaching the end.',
				kind: 'section',
				id: '8f592ead-9c02-4ba0-97f9-ee57bb1bd6a2',
			},
			{
				app: 'Legend',
				pattern: 'Glowing mark over night landscape',
				why: 'Links compressed into a thin top band, then the logo glows like a moon over a rendered dark landscape; a dark-theme ending that is pure atmosphere.',
				kind: 'section',
				id: '010b6e4d-1e73-4698-9e32-e4396c7d9357',
			},
			{
				app: 'Daylight',
				pattern: 'Dark footer with corner glow',
				why: 'Near-black footer with orange light bleeding in from two corners and a pill email field with inset button; a wash used as edge lighting, ideal for dark mode.',
				kind: 'section',
				id: '2c33a0e6-3add-4a11-b4b8-d8b66ba00597',
			},
			{
				app: 'Tempo',
				pattern: 'Atmospheric newsletter band above links',
				why: 'A motion-blurred photo band carries one serif sentence and an underline input, then plain columns below; the atmosphere stays in one tile, the rest stays calm.',
				kind: 'section',
				id: '36e2e633-d9ee-42eb-b383-1e200ef41526',
			},
		],
	},
	{
		id: 'case',
		title: 'Case study page',
		lands: 'Case study',
		lookFor: 'Facts rails, editorial case heroes and soft ways to close a project story with its numbers.',
		references: [
			{
				app: 'basement.studio',
				pattern: 'Facts rail beside a brand gallery',
				why: 'Client, year, type and link sit in a compact table on the left with a short narrative and more projects. The gallery on the right includes a color-palette strip worth borrowing.',
				kind: 'section',
				id: '6ac71d72-4d9d-4e61-b9f0-df8432c83237',
			},
			{
				app: 'COLLINS',
				pattern: 'Serif case hero with media carousel',
				why: "A small 'Case Study' label, a serif project title and a one-line subtitle on white, then rounded media running off the edge. Minimal, editorial and easy to adapt.",
				kind: 'section',
				id: '213b1c6a-6655-4330-965d-4851cf1e25cd',
			},
			{
				app: 'Granola',
				pattern: 'Stats tile beside client quote',
				why: 'Three stat cards stacked on a textured water tile, next to a serif client quote and an outline pill CTA. A softer way to close a case study.',
				kind: 'section',
				id: '6fe5dee9-b811-4e60-82f3-ad7024090784',
			},
			{
				app: 'Deel',
				pattern: 'Facts card straddling the hero',
				why: 'Client logo and a one-line summary sit on a dark band. A white facts card (industry, location, size, year) overlaps its bottom edge, a neat layering detail.',
				kind: 'section',
				id: 'f3b6d424-a803-425b-bae6-5322ad4a904e',
			},
		],
	},
];
