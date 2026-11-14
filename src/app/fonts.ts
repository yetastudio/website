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

/**
 * PP Editorial New: the editorial accent. Card titles and emphasised words only.
 * Not preloaded: preloading pulled all three cuts (~120 KB) into every page's first load, though
 * the landing never uses Ultralight and only shows Italic below the fold. The browser fetches each
 * cut when text first uses it.
 */
export const editorialNew = localFont({
	src: [
		{ path: '../../public/fonts/PPEditorialNew-Ultralight.otf', weight: '200', style: 'normal' },
		{ path: '../../public/fonts/PPEditorialNew-Regular.otf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/PPEditorialNew-Italic.otf', weight: '400', style: 'italic' },
	],
	variable: '--font-editorial-new',
	display: 'swap',
	preload: false,
});
