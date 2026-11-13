'use client';

//! React Core
import { useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Button, SegmentedControl, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

type Topic = 'project' | 'hello';

const TOPICS = [
	{ value: 'project', label: 'New project' },
	{ value: 'hello', label: 'Just say hello' },
] as const;

/**
 * Library 10, Closing call to action. The sky band as the page's last beat (Atlas, Ghost): a
 * small serif italic eyebrow (Fiasco), the process line set huge, two pill choices that route the
 * message before any form (Unseen Studio), and one button whose label follows the choice.
 */
export function CtaMockup() {
	const t = useTranslations('ourProcess');
	const [topic, setTopic] = useState<Topic>('project');
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.sky, styles.cta)}>
				<Text as="span" size="lg" family="serif" italic tone="strong">
					Get in touch
				</Text>
				<Text as="h3" size="5xl" weight="regular" leading="tight" tone="strong" className={styles.ctaLine}>
					{t.rich('cta', { em: (chunks) => <Accent>{chunks}</Accent> })}
				</Text>
				<SegmentedControl label="What is it about" options={TOPICS} value={topic} onChange={setTopic} size="sm" />
				<Button href={BOOKING_URL} variant="solid" size="lg" iconStart="calendar">
					{topic === 'project' ? t('button') : 'Book an intro call'}
				</Button>
			</div>
		</div>
	);
}

export default CtaMockup;
