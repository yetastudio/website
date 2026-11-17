//! Next Core
import { routing } from '@/i18n/routing';

//! Content
import { homeMarkdown } from '@/lib/markdown';

/** Only the site's locales exist; prerendered at build like the pages. */
export const dynamicParams = false;

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

/** The landing as Markdown. proxy.ts rewrites `/`, `/es` and `/pt` here when the request asks for text/markdown. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	return new Response(await homeMarkdown(locale), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept' },
	});
}
