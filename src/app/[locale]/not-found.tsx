/* eslint-disable @next/next/no-img-element -- static brand SVGs. */

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Link } from '@/i18n/navigation';

//! Styles
import styles from './not-found.module.css';

/**
 * Localised, themed 404.
 *
 * It deliberately imports NO design-system component that has a CSS module: in Next 15.3
 * dev (Turbopack), any CSS module shared between not-found and the page is moved into
 * the not-found chunk and the landing renders unstyled. Only tokens and global utilities
 * (.u-bevel, .u-only-*) are used here.
 */
export default function NotFound() {
	const t = useTranslations('notFound');

	return (
		<main id="main" className={styles.page}>
			<span className={styles.mark} aria-hidden="true">
				<img src="/brand/logo-mark-light-filled.svg" alt="" width={72} height={72} className="u-only-light" />
				<img src="/brand/logo-mark-dark-filled.svg" alt="" width={72} height={72} className="u-only-dark" />
			</span>
			<p className={`${styles.chip} u-bevel`}>{t('chip')}</p>
			<h1 className={styles.title}>404</h1>
			<p className={styles.text}>{t.rich('description', { em: (chunks) => <em className={styles.accent}>{chunks}</em> })}</p>
			<Link href="/" className={styles.cta}>
				{t('cta')}
			</Link>
		</main>
	);
}
