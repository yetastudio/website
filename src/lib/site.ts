//! Content
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { PROJECTS } from '@/components/layout/our-work/projects';

/** Production origin (yetastudio.com 308s here). Metadata, the sitemap and the agent files build absolute URLs off it. */
export const SITE_URL = 'https://www.yetastudio.com';

/** Indexable routes, in sitemap order. /inspo is an internal working page (noindex) and stays out. */
export const PAGES = ['/', ...PROJECTS.map(({ slug }) => `/work/${slug}`), '/brand', '/design-system'];

/** `href` in every locale, as root-relative paths. */
export function localePaths(href: string): Record<string, string> {
	return Object.fromEntries(routing.locales.map((locale) => [locale, getPathname({ locale, href })]));
}

/** Canonical + hreflang for `href`: each locale's copy points at itself and lists its siblings. */
export function alternates(locale: string, href: string) {
	const languages = localePaths(href);
	return { canonical: languages[locale], languages: { ...languages, 'x-default': languages[routing.defaultLocale] } };
}
