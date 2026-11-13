//! Next Core
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

//! Components
import { Playground, type PlaygroundShelf } from './playground';

//! Data
import { LIBRARY } from '../data';
import { getFacts } from '../facts';
import { SHELF_VARIANTS } from '../mockups/library/registry';

export const metadata: Metadata = {
	title: 'Inspo playground',
	description: 'The section library proposals mounted as a full-size landing, one theme at a time.',
	// Internal working page: never indexed, never followed.
	robots: {
		index: false,
		follow: false,
		googleBot: { index: false, follow: false },
	},
};

/**
 * The /inspo proposals mounted at real size, in the order the landing reads, with nothing around
 * them but a small floating toolbar: theme, page and, per section, which proposal is on.
 */
export default async function InspoPlaygroundPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const facts = getFacts();
	const shelves: PlaygroundShelf[] = LIBRARY.map((shelf) => ({
		id: shelf.id,
		title: shelf.title,
		variants: SHELF_VARIANTS[shelf.id].map(({ Component, ...variant }) => ({ ...variant, node: <Component facts={facts} /> })),
	}));

	return <Playground shelves={shelves} />;
}
