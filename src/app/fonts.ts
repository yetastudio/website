import localFont from 'next/font/local';

/**
 * Funnel Display: the brand sans. Every UI string, heading and label.
 * One variable file (weight axis 300–800, latin subset from @fontsource-variable/funnel-display,
 * OFL-1.1, see public/fonts/FunnelDisplay-OFL.txt) serves the 300–700 the site uses: 17.7 KB in place of
 * five static files (93 KB). It covers every character the site renders. Preloaded: the header and
 * the hero use it in the first viewport.
 */
export const funnelDisplay = localFont({
	src: [{ path: '../../public/fonts/FunnelDisplay-Variable.woff2', weight: '300 800', style: 'normal' }],
	variable: '--font-funnel-display',
	display: 'swap',
});

/*
 * PP Editorial New: the editorial accent. Card titles and emphasised words only.
 *
 * One family, declared in two parts so only the cut the first viewport needs is preloaded. Both parts
 * name the same font-family, so the browser joins their faces into one family and `--font-serif`
 * resolves weight and style across all three as before.
 * - Regular is preloaded: the hero slogan sets its emphasised words in it, and the slogan is the
 *   landing's largest paint on phones, so its paint waits for this file.
 * - Ultralight and Italic are fetched only when text uses them (the landing never uses Ultralight
 *   and shows Italic below the fold), instead of competing with the hero for bandwidth.
 */

export const editorialNew = localFont({
	src: [{ path: '../../public/fonts/PPEditorialNew-Regular.otf', weight: '400', style: 'normal' }],
	variable: '--font-editorial-new',
	display: 'swap',
	declarations: [{ prop: 'font-family', value: "'PP Editorial New'" }],
});

/** The rest of the PP Editorial New family (see above). Its class only has to be on the page so its faces load. */
export const editorialNewExtras = localFont({
	src: [
		{ path: '../../public/fonts/PPEditorialNew-Ultralight.otf', weight: '200', style: 'normal' },
		{ path: '../../public/fonts/PPEditorialNew-Italic.otf', weight: '400', style: 'italic' },
	],
	variable: '--font-editorial-new-extras',
	display: 'swap',
	preload: false,
	declarations: [{ prop: 'font-family', value: "'PP Editorial New'" }],
});
