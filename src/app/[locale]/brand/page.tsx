//! Next Core
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

//! Components
import { Header } from '@/components/layout';
import BrandGuidelines from './guidelines';

export const metadata: Metadata = {
	title: 'Brand guidelines',
	description: 'How to use the Yeta Studio marks, colour, type and voice — with do’s and don’ts.',
};

export default async function BrandPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Header />
			<main id="main">
				<BrandGuidelines />
			</main>
		</>
	);
}
