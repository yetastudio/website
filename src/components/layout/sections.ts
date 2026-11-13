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
 * Social profiles listed in the footer. Figma names them but gives no URLs, so they
 * render as plain text until a real `href` is filled in here.
 */
export const SOCIALS: ReadonlyArray<{ key: 'linkedin' | 'instagram' | 'threads' | 'twitter'; href: string | null }> = [
	{ key: 'linkedin', href: null },
	{ key: 'instagram', href: null },
	{ key: 'threads', href: null },
	{ key: 'twitter', href: null },
];
