//! Next Core
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';

//! Components
import { Footer, Header } from '@/components/layout';
import { CaseStudyDetail } from '@/components/layout/case-study';
import { PROJECTS, buildProject, getProjectEntry } from '@/components/layout/our-work/projects';

//! Styles
import page from '../../page.module.css';

type Params = Promise<{ locale: string; slug: string }>;

/** Only the case studies listed in PROJECTS exist; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
	return routing.locales.flatMap((locale) => PROJECTS.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	const { locale, slug } = await params;
	const entry = getProjectEntry(slug);
	if (!entry) return {};

	const t = await getTranslations({ locale, namespace: 'caseStudy' });
	const tw = await getTranslations({ locale, namespace: 'ourWork' });
	const name = tw(`projects.${entry.key}.name`);
	const title = t('metaTitle', { name });
	const description = tw(`projects.${entry.key}.tagline`);
	const path = (target: string) => getPathname({ locale: target, href: `/work/${slug}` });

	return {
		title,
		description,
		alternates: {
			canonical: path(locale),
			languages: Object.fromEntries(routing.locales.map((target) => [target, path(target)])),
		},
		openGraph: {
			type: 'article',
			title,
			description,
			images: [{ url: '/brand/og/og-encountered-dark.png', width: 1200, height: 628 }],
		},
		twitter: { card: 'summary_large_image', title, description, images: ['/brand/og/og-encountered-dark.png'] },
	};
}

export default async function CaseStudyPage({ params }: { params: Params }) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const entry = getProjectEntry(slug);
	if (!entry) notFound();

	const t = await getTranslations('caseStudy');
	const tw = await getTranslations('ourWork');
	const project = buildProject(tw, entry, (name, number) => t('shotAlt', { name, number }));

	return (
		<>
			<Header />
			<main id="main" className={page.page}>
				<CaseStudyDetail project={project} entry={entry} />
			</main>
			<Footer />
		</>
	);
}
