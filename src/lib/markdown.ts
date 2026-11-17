//! Next Core
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';

//! Content
import { BOOKING_URL } from '@/components/layout/sections';
import { CRAFT, PROCESS, TESTIMONIALS } from '@/components/layout/content';
import { PROJECTS } from '@/components/layout/our-work/projects';
import { SITE_URL } from './site';

/** Message copy as plain text: line-break tags become spaces, rich-text tags (<serif>, <em>…) are dropped. */
export function plain(text: string): string {
	return text
		.replace(/<(br|brmd)><\/\1>/g, ' ')
		.replace(/<\/?[a-z]+>/gi, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** The landing page as Markdown, read from the same messages the page renders, for agents that ask for text/markdown. */
export async function homeMarkdown(locale: string): Promise<string> {
	const t = async (namespace: string) => {
		const tr = await getTranslations({ locale, namespace });
		return (key: string) => plain(String(tr.raw(key)));
	};
	const [meta, summary, why, craft, work, process, testimonials, nav] = await Promise.all(
		['meta', 'summary', 'whyYeta', 'ourCraft', 'ourWork', 'ourProcess', 'testimonials', 'nav'].map(t),
	);

	return [
		`# ${meta('title')}`,
		`> ${meta('description')}`,
		summary('p2'),
		`## ${why('title')}`,
		['p1', 'p2', 'p3'].map(why).join(' '),
		`## ${craft('title')}`,
		craft('intro'),
		CRAFT.map(({ key }) => `- **${craft(`cards.${key}.title`)}** ${craft(`cards.${key}.description`)}`).join('\n'),
		`## ${work('title')}`,
		PROJECTS.map(({ slug, key }) => {
			const url = SITE_URL + getPathname({ locale, href: `/work/${slug}` });
			return `- [${work(`projects.${key}.name`)}](${url}): ${work(`projects.${key}.tagline`)} (${work(`projects.${key}.services`)})`;
		}).join('\n'),
		`## ${process('title')}`,
		process('intro'),
		PROCESS.map(({ key }, i) => `${i + 1}. **${process(`steps.${key}.title`)}**: ${process(`steps.${key}.description`)}`).join('\n'),
		`## ${testimonials('title')}`,
		TESTIMONIALS.map(({ key }) => {
			const item = (field: string) => testimonials(`items.${key}.${field}`);
			return `> ${item('quote')}\n> — ${item('name')}, ${item('role')} · ${item('company')}`;
		}).join('\n\n'),
		`## ${nav('getInTouch')}`,
		`${craft('cta')} [${craft('button')}](${BOOKING_URL})`,
	].join('\n\n') + '\n';
}
