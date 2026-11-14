//! Next Core
import { setRequestLocale } from 'next-intl/server';

//! Components
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Hero } from '@/components/layout/hero';
import { OurCraft } from '@/components/layout/our-craft';
import { OurProcess } from '@/components/layout/our-process';
import { OurWork } from '@/components/layout/our-work';
import { Testimonials } from '@/components/layout/testimonials';
import { WhyYeta } from '@/components/layout/why-yeta';

//! Styles
import styles from './page.module.css';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
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
