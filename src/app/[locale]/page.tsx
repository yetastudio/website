//! Next Core
import { setRequestLocale } from 'next-intl/server';

//! Components
import { Footer, Header, Hero, OurCraft, OurProcess, OurWork, Testimonials, WhyYeta } from '@/components/layout';

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
