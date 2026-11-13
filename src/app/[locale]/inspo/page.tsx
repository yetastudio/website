//! Next Core
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

//! Components
import { Header } from '@/components/layout';
import InspoShowcase from './showcase';

//! Data
import registry from '../../../../registry.json';

export const metadata: Metadata = {
	title: 'Inspo',
	description: 'Proposals to deepen the story of the Yeta Studio landing and case study, with live on-brand mockups and the references behind them.',
	// Internal working page: never indexed, never followed.
	robots: {
		index: false,
		follow: false,
		googleBot: { index: false, follow: false },
	},
};

export default async function InspoPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	// Results mockup figures come from the code, so they cannot drift from what ships.
	const facts = {
		locales: routing.locales.length,
		themes: 2,
		components: registry.components.length,
	};

	return (
		<>
			<Header />
			<main id="main">
				<InspoShowcase facts={facts} />
			</main>
		</>
	);
}
