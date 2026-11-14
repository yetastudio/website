//! React Core
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type VisuallyHiddenProps = HTMLAttributes<HTMLElement> & {
	children: ReactNode;
	/** Element to render. Defaults to `span`; pass `a` (with `href`) for a skip link. */
	as?: ElementType;
	/** Shows the content while it, or something inside it, has focus (skip links, "Back to top"). */
	focusable?: boolean;
	href?: string;
};

/**
 * Inspo component (component.gallery "Visually hidden"): content for assistive tech only, such as the
 * extra words behind an icon or a short link. Wraps the `u-visually-hidden` utility. `focusable` turns it
 * into a skip link: hidden until focused, then a glass pill at the top-left of its positioned container.
 */
export function VisuallyHidden({ as: Component = 'span', focusable = false, className, children, ...rest }: VisuallyHiddenProps) {
	return (
		<Component className={cx(focusable ? styles.focusable : 'u-visually-hidden', className)} {...rest}>
			{children}
		</Component>
	);
}

export default VisuallyHidden;
