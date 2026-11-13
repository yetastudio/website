//! React Core
import type { ReactNode } from 'react';

//! Components
import { Chip } from '@/components/ui/chip';
import { Reveal } from '@/components/ui/reveal';
import { revealLine } from '@/components/ui/reveal/line';
import { Heading } from '@/components/ui/text';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type SectionHeaderProps = {
	/** Rendered as the section's h2; give it an id so the section can be labelled by it. */
	title: ReactNode;
	titleId?: string;
	/** The subtitle chip under the title ("Why brands choose to grow with us"). */
	eyebrow?: ReactNode;
	/** Lead copy under the heading block. Pass paragraphs; they get the 20/32 rhythm. */
	children?: ReactNode;
	align?: 'center' | 'start';
	className?: string;
};

/**
 * The heading pattern every landing section repeats: Funnel Display Bold title
 * (48 desktop / 32 mobile), a Small ×1.2 chip 20px below, and lead copy after.
 * Title, chip and lead enter with the transitions.dev Texts reveal when scrolled into view.
 */
export function SectionHeader({ title, titleId, eyebrow, children, align = 'center', className }: SectionHeaderProps) {
	return (
		<Reveal className={cx(styles.header, styles[align], className)}>
			<div className={styles.heading}>
				<Heading level={2} id={titleId} className={cx(styles.title, revealLine(1))} align={align === 'center' ? 'center' : 'start'} balance>
					{title}
				</Heading>
				{eyebrow && (
					<Chip size="sm" className={revealLine(2)}>
						{eyebrow}
					</Chip>
				)}
			</div>
			{children && <div className={cx(styles.lead, revealLine(3))}>{children}</div>}
		</Reveal>
	);
}

export default SectionHeader;
