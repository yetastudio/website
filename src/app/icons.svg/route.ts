//! React Core
import { isValidElement, type ReactNode } from 'react';

//! Icons
import { glyphs } from '@/components/ui/icon/glyphs';
import { extraGlyphs } from '@/components/ui/icon/extra-glyphs';

/** Built once with the site, from the same glyph registry the Icon component reads. */
export const dynamic = 'force-static';

/**
 * A glyph body as SVG markup. Glyphs are <path>s with presentation props (strokeWidth → stroke-width),
 * sometimes in a fragment; react-dom/server is not allowed in a route handler, and this is all it needs.
 */
function markup(node: ReactNode): string {
	if (Array.isArray(node)) return node.map(markup).join('');
	if (!isValidElement<Record<string, unknown>>(node)) return '';
	const { children, ...props } = node.props;
	if (typeof node.type !== 'string') return markup(children as ReactNode);
	const attrs = Object.entries(props)
		.map(([key, value]) => ` ${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${String(value).replace(/"/g, '&quot;')}"`)
		.join('');
	return `<${node.type}${attrs}>${markup(children as ReactNode)}</${node.type}>`;
}

/**
 * The brand glyphs as one SVG sprite: `<Icon>` draws `<use href="/icons.svg#name">`, so each glyph
 * ships once per visit (and is cached across pages) instead of inline wherever it appears.
 */
export function GET() {
	const symbols = Object.entries({ ...glyphs, ...extraGlyphs })
		.map(([name, glyph]) => `<symbol id="${name}" viewBox="${glyph.viewBox}">${markup(glyph.body)}</symbol>`)
		.join('');

	return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`, {
		headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
	});
}
