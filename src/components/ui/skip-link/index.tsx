//! React Core
import type { ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SkipLinkProps = {
	/** Id of the landmark to jump to (`<main id="main">`). */
	targetId?: string;
	/** Visible text; defaults to the translated "Skip to content". */
	children?: ReactNode;
	/** `fixed` pins it to the viewport's top-left (page shell); `absolute` to the nearest positioned box. */
	position?: 'fixed' | 'absolute';
	className?: string;
};

/**
 * Inspo component (component.gallery "Skip link"): the first stop of the tab order. Hidden above
 * the edge until it gets keyboard focus, then it slides in as an inverse pill (the header's own
 * skip link). A plain in-page anchor, so the browser moves both the scroll and the focus start
 * point to the target; give the target landmark the id.
 */
export function SkipLink({ targetId = 'main', children, position = 'fixed', className }: SkipLinkProps) {
	const t = useTranslations('common');
	return (
		<a href={`#${targetId}`} className={cx(styles.skip, styles[position], className)}>
			{children ?? t('skipToContent')}
		</a>
	);
}

export default SkipLink;
