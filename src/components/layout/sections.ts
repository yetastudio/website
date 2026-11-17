/** Landing sections in page order. ids are the anchor targets; keys index the `nav` messages. */
export const SECTIONS = [
	{ id: 'why-yeta', key: 'whyYeta', footerKey: 'whyYetaShort' },
	{ id: 'our-craft', key: 'ourCraft', footerKey: 'ourCraft' },
	{ id: 'our-work', key: 'ourWork', footerKey: 'ourWork' },
	{ id: 'our-process', key: 'ourProcess', footerKey: 'ourProcess' },
	{ id: 'testimonials', key: 'testimonials', footerKey: 'testimonials' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

/** Booking link used by every "Get in touch" / consultation call to action (from the Figma file). */
export const BOOKING_URL = 'https://cal.com/yetastudio';

/**
 * Social profiles listed in the footer and named as `sameAs` in the Organization JSON-LD.
 * One without an `href` renders as plain text (Threads has no profile yet).
 */
export const SOCIALS: ReadonlyArray<{ key: 'linkedin' | 'instagram' | 'threads' | 'twitter'; href: string | null }> = [
	{ key: 'linkedin', href: 'https://www.linkedin.com/company/yeta-studio/' },
	{ key: 'instagram', href: 'https://www.instagram.com/yeta_studio/' },
	{ key: 'threads', href: null },
	{ key: 'twitter', href: 'https://x.com/yeta_studio' },
];
