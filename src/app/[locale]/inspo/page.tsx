//! Next Core
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

//! Components
import { Header } from '@/components/layout/header';
import InspoShowcase from './showcase';

//! Data
import { getFacts } from './facts';

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

	const facts = getFacts();

	return (
		<>
			<Header />
			<main id="main">
				<InspoShowcase facts={facts} />
			</main>
		</>
	);
}
