//! React Core
import type { ReactNode } from 'react';

//! Components
import { Dialog, type DialogProps } from '@/components/ui/dialog';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type DrawerProps = Omit<DialogProps, 'placement' | 'size'> & {
	/** `right` is a side sheet (filters, details); `bottom` a bottom sheet (phones, quick content). */
	side?: 'right' | 'bottom';
	/** One line under the title, at the top of the body. */
	description?: ReactNode;
};

/**
 * Inspo component (component.gallery "Drawer", a.k.a. sheet, tray, flyout): a panel that slides in
 * from an edge. A thin wrapper over Dialog's sheet placements, so it inherits the native <dialog>:
 * focus trapped, Escape and the backdrop close it, focus returns to the opener, page scroll paused,
 * and the transitions.dev Panel reveal. Header (title + close), scrolling body, optional footer.
 */
export function Drawer({ side = 'right', description, children, className, ...rest }: DrawerProps) {
	return (
		<Dialog placement={side} className={cx(styles.drawer, className)} {...rest}>
			{description && <p className={styles.description}>{description}</p>}
			{children}
		</Dialog>
	);
}

export default Drawer;
