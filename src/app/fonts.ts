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
 * Garabosse: the editorial accent. Card titles and emphasised words only.
 * OFL-1.1 with reserved font names, see public/fonts/Garabosse-OFL.txt. The files ship unmodified;
 * only their file names drop the "·" of the cut names (Mignon·ne → Mignonne).
 *
 * The family has five upright cuts (Parangon 200, Gaillard·e 300, Mignon·ne 400, Nonpareil·le 500,
 * Perle 600) and no italic. The site uses two: Mignon·ne for every serif word and Parangon for
 * `--font-weight-serif-thin`. Italic text renders upright, because globals.css turns off the
 * browser's synthesized italic.
 *
 * One family, declared in two parts so only the cut the first viewport needs is preloaded. Both parts
 * name the same font-family, so the browser joins their faces into one family and `--font-serif`
 * resolves the weight across both.
 * - Mignon·ne is preloaded: the hero slogan sets its emphasised words in it, and the slogan is the
 *   landing's largest paint on phones, so its paint waits for this file.
 * - Parangon is fetched only when text uses it (the landing never does), instead of competing
 *   with the hero for bandwidth.
 */

export const garabosse = localFont({
	src: [{ path: '../../public/fonts/Garabosse-Mignonne.otf', weight: '400', style: 'normal' }],
	variable: '--font-garabosse',
	display: 'swap',
	declarations: [{ prop: 'font-family', value: "'Garabosse'" }],
});

/** The thin cut of Garabosse (see above). Its class only has to be on the page so its face loads. */
export const garabosseExtras = localFont({
	src: [{ path: '../../public/fonts/Garabosse-Parangon.otf', weight: '200', style: 'normal' }],
	variable: '--font-garabosse-extras',
	display: 'swap',
	preload: false,
	declarations: [{ prop: 'font-family', value: "'Garabosse'" }],
});
