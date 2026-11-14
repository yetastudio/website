//! Next Core
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

//! Context
import { ThemeProvider, themeScript } from '@/context/ThemeContext';

//! Fonts
import { editorialNew, editorialNewExtras, funnelDisplay } from '../fonts';

//! UI Core
import { SmoothScroll } from '@/components/layout/smooth-scroll';

//! Styles
import '@/styles/tokens.css';
import '../../../vendor/transitions-dev/transitions.css';
import '../globals.css';

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'meta' });
	return {
		metadataBase: new URL('https://yeta.studio'),
		title: { default: t('title'), template: `%s ✹ Yeta Studio` },
		description: t('description'),
		openGraph: {
			title: t('title'),
			description: t('description'),
			images: [{ url: '/brand/og/og-encountered-dark.png', width: 1200, height: 628 }],
		},
		twitter: { card: 'summary_large_image', images: ['/brand/og/og-encountered-dark.png'] },
	};
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#e4e5e0' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0b04' },
	],
};

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	const messages = await getMessages();

	return (
		<html lang={locale} className={`${funnelDisplay.variable} ${editorialNew.variable} ${editorialNewExtras.variable}`} suppressHydrationWarning>
			<head>
				{/* Applies the stored theme before first paint. */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				{/* Texts reveal starts hidden and waits for JS; without JS, show everything at rest. */}
				<noscript>
					<style>{'.t-stagger-line{opacity:1!important;transform:none!important;filter:none!important}[data-doodle] path{stroke-dashoffset:0!important}[data-doodle] svg{clip-path:none!important}'}</style>
				</noscript>
			</head>
			<body>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>
						<SmoothScroll>
							{children}
						</SmoothScroll>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
