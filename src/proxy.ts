// Next 16 renamed middleware.ts to proxy.ts; next-intl still ships the handler as createMiddleware.
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

/** The landing in any locale: `/`, `/es`, `/pt` (and `/en`, which next-intl redirects to `/`). */
const HOME = new RegExp(`^/(${routing.locales.join('|')})?/?$`);

export default function proxy(request: NextRequest) {
	const home = request.nextUrl.pathname.match(HOME);
	if (!home) return intl(request);

	// Agents that ask for Markdown get the landing as Markdown (app/index.md); browsers keep the HTML.
	// shortcut: any mention of text/markdown wins, q-values are ignored; parse them if a client ever sends it as a low-priority fallback.
	if (!request.headers.get('accept')?.includes('text/markdown')) return intl(request);
	return NextResponse.rewrite(new URL(`/index.md/${home[1] ?? routing.defaultLocale}`, request.url));
}

export const config = {
	// Match only internationalized pathnames
	matcher: ['/', '/(es|en|pt)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
