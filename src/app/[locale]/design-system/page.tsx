//! Next Core
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

//! Components
import { Header } from '@/components/layout';
import { ToastProvider } from '@/components/ui';
import DesignSystemShowcase from './showcase';

export const metadata: Metadata = {
	title: 'Design System',
	description: 'Tokens, components and states of the Yeta Studio design system, in light and dark.',
};

export default async function DesignSystemPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<ToastProvider>
			<Header />
			<main id="main">
				<DesignSystemShowcase />
			</main>
		</ToastProvider>
	);
}
