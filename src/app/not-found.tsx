//! Next Core
import Link from 'next/link';

//! Fonts
import { editorialNew, funnelDisplay } from './fonts';

//! Styles
import '@/styles/tokens.css';
import './globals.css';

/**
 * Fallback 404 for paths outside any locale (the root layout renders no <html>, so this
 * page brings its own). Localised 404s live in app/[locale]/not-found.tsx.
 */
export default function RootNotFound() {
	return (
		<html lang="en" className={`${funnelDisplay.variable} ${editorialNew.variable}`}>
			<body>
				<main
					style={{
						display: 'grid',
						placeItems: 'center',
						minHeight: '100dvh',
						padding: 'var(--space-24)',
						textAlign: 'center',
					}}
				>
					<div style={{ display: 'grid', gap: 'var(--space-16)' }}>
						<h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-weight-bold)' }}>404</h1>
						<p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-light)' }}>
							This page wasn’t built — and luck won’t find it. <Link href="/" style={{ textDecoration: 'underline' }}>Go home</Link>
						</p>
					</div>
				</main>
			</body>
		</html>
	);
}
