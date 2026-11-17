//! Next Core
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

//! Components
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Hero } from '@/components/layout/hero';
import { OurCraft } from '@/components/layout/our-craft';
import { OurProcess } from '@/components/layout/our-process';
import { OurWork } from '@/components/layout/our-work';
import { Testimonials } from '@/components/layout/testimonials';
import { WhyYeta } from '@/components/layout/why-yeta';

//! Content
import { BOOKING_URL, SOCIALS } from '@/components/layout/sections';
import { routing } from '@/i18n/routing';
import { plain } from '@/lib/markdown';
import { SITE_URL, alternates } from '@/lib/site';

//! Styles
import styles from './page.module.css';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	const { locale } = await params;
	return { alternates: alternates(locale, '/') };
}

/** Organization + WebSite JSON-LD: who the studio is and how to reach it, for search engines and agents. */
async function structuredData(locale: string) {
	const meta = await getTranslations({ locale, namespace: 'meta' });
	const hero = await getTranslations({ locale, namespace: 'hero' });
	const organization = `${SITE_URL}/#organization`;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': organization,
				name: 'Yeta Studio',
				alternateName: 'Yeta ✹ Studio',
				url: SITE_URL,
				logo: `${SITE_URL}/icon.png`,
				image: `${SITE_URL}/brand/og/og-encountered-dark.png`,
				description: meta('description'),
				slogan: plain(String(hero.raw('slogan'))),
				knowsAbout: ['Web design', 'Web development', 'UI/UX design', 'Design systems', 'Digital products'],
				sameAs: SOCIALS.flatMap(({ href }) => (href ? [href] : [])),
				address: { '@type': 'PostalAddress', addressCountry: 'AR' },
				contactPoint: {
					'@type': 'ContactPoint',
					contactType: 'sales',
					url: BOOKING_URL,
					availableLanguage: [...routing.locales],
				},
			},
			{
				'@type': 'WebSite',
				'@id': `${SITE_URL}/#website`,
				name: 'Yeta Studio',
				url: SITE_URL,
				inLanguage: locale,
				publisher: { '@id': organization },
			},
		],
	};
}

export default async function Home({ params }: { params: Params }) {
	const { locale } = await params;
	setRequestLocale(locale);

	const jsonLd = JSON.stringify(await structuredData(locale)).replace(/</g, '\\u003c');

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
			<Header />
			<main id="main" className={styles.page}>
				<Hero />
				<WhyYeta />
				<OurCraft />
				<OurWork />
				<OurProcess />
				<Testimonials />
			</main>
			<Footer />
		</>
	);
}
