//! Next Core
import type { MetadataRoute } from 'next';

//! Content
import { PAGES, SITE_URL, localePaths } from '@/lib/site';

// No lastModified: a build-time date would change on every deploy and teach crawlers to ignore it.
export default function sitemap(): MetadataRoute.Sitemap {
	return PAGES.flatMap((href) => {
		const languages = Object.fromEntries(Object.entries(localePaths(href)).map(([locale, path]) => [locale, SITE_URL + path]));
		return Object.values(languages).map((url) => ({ url, alternates: { languages } }));
	});
}
