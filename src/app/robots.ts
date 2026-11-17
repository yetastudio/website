//! Next Core
import type { MetadataRoute } from 'next';

//! Content
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
	return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` };
}
