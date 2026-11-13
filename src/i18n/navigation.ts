import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/** Locale-aware wrappers around Next.js navigation APIs. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

/** Turns "/path#hash" into the object form the locale-aware Link prefixes correctly. */
export function localeHref(href: string): string | { pathname: string; hash: string } {
	const index = href.indexOf('#');
	if (index <= 0) return href;
	return { pathname: href.slice(0, index) || '/', hash: href.slice(index + 1) };
}
