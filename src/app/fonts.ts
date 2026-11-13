import localFont from 'next/font/local';

/** Funnel Display: the brand sans. Every UI string, heading and label. */
export const funnelDisplay = localFont({
	src: [
		{ path: '../../public/fonts/FunnelDisplay-Light.woff2', weight: '300', style: 'normal' },
		{ path: '../../public/fonts/FunnelDisplay-Regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/FunnelDisplay-Medium.woff2', weight: '500', style: 'normal' },
		// Hero wordmark + footer lettering in Figma. Latin subset from @fontsource/funnel-display (OFL-1.1).
		{ path: '../../public/fonts/FunnelDisplay-SemiBold.woff2', weight: '600', style: 'normal' },
		{ path: '../../public/fonts/FunnelDisplay-Bold.woff2', weight: '700', style: 'normal' },
	],
	variable: '--font-funnel-display',
	display: 'swap',
});

/** PP Editorial New: the editorial accent. Card titles and emphasised words only. */
export const editorialNew = localFont({
	src: [
		{ path: '../../public/fonts/PPEditorialNew-Ultralight.otf', weight: '200', style: 'normal' },
		{ path: '../../public/fonts/PPEditorialNew-Regular.otf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/PPEditorialNew-Italic.otf', weight: '400', style: 'italic' },
	],
	variable: '--font-editorial-new',
	display: 'swap',
});
