//! Next Core
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

//! Components
import { Header } from '@/components/layout/header';
import BrandGuidelines from './guidelines';

//! Content
import { alternates } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		title: 'Brand guidelines',
		description: 'How to use the Yeta Studio marks, colour, type and voice — with do’s and don’ts.',
		alternates: alternates(locale, '/brand'),
	};
}

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
