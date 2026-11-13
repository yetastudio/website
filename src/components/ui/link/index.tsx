//! React Core
import type { AnchorHTMLAttributes, ReactNode } from 'react';

//! Next Core
import { Link as LocaleLink, localeHref } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

//! Components
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string;
	children: ReactNode;
	/** `inline` underlines inside copy. `nav` underlines on hover only. `bullet` adds the ● marker used in the footer. */
	variant?: 'inline' | 'nav' | 'bullet';
	/** Show the external-link arrow. Defaults to true for off-site URLs on inline links. */
	showExternalIcon?: boolean;
};

const EXTERNAL = /^(https?:)?\/\//;

/** Inspo component: the text link, in the three forms the landing uses. */
export function Link({ href, children, variant = 'inline', showExternalIcon, className, ...rest }: LinkProps) {
	const t = useTranslations('common');
	const external = EXTERNAL.test(href) || href.startsWith('mailto:');
	const classes = cx(styles.link, styles[variant], className);
	const withIcon = showExternalIcon ?? (external && variant === 'inline');
	const content = (
		<>
			{children}
			{withIcon && <Icon name="external-link" size="sm" className={styles.icon} />}
			{external && <span className="u-visually-hidden"> ({t('opensNewTab')})</span>}
		</>
	);

	if (external) {
		return (
			<a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
				{content}
			</a>
		);
	}

	return (
		// Same-page anchors stay plain; internal routes keep the current locale.
		href.startsWith('#') ? (
			<a href={href} className={classes} {...rest}>
				{content}
			</a>
		) : (
			<LocaleLink href={localeHref(href)} className={classes} {...rest}>
				{content}
			</LocaleLink>
		)
	);
}

export default Link;
