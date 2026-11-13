//! React Core
import type { ReactNode } from 'react';

//! Components
import { Icon, Text } from '@/components/ui';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** One do / don't example: a live specimen on top, the verdict and rule below. */
export function GuidelineCard({
	verdict,
	title,
	children,
	canvas = 'auto',
}: {
	verdict: 'do' | 'dont';
	title: string;
	children: ReactNode;
	/** Pin the specimen to a canvas, or follow the page theme. */
	canvas?: 'auto' | 'light' | 'dark';
}) {
	return (
		<figure className={cx(styles.guideline, verdict === 'dont' && styles.guidelineDont)}>
			<div
				data-scheme={canvas === 'auto' ? undefined : canvas}
				className={cx(styles.guidelineStage, canvas === 'light' && 'scheme-light', canvas === 'dark' && 'scheme-dark', 'u-bevel')}
			>
				{children}
			</div>
			<figcaption className={styles.guidelineCaption}>
				<span className={cx(styles.verdict, verdict === 'do' ? styles.verdictDo : styles.verdictDont)}>
					<Icon name={verdict === 'do' ? 'check' : 'close'} size="sm" />
					{verdict === 'do' ? 'Do' : 'Don’t'}
				</span>
				<Text as="span" size="sm">
					{title}
				</Text>
			</figcaption>
		</figure>
	);
}
