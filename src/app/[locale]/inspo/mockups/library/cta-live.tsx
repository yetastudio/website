'use client';

//! React Core
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

//! Hooks
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '../use-autoplay';

//! Components
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import shared from './shared.module.css';
import styles from './cta.module.css';

type Topic = 'project' | 'consult';

const TOPICS = [
	{ value: 'project', label: 'New project' },
	{ value: 'consult', label: 'Consultation' },
] as const;

/**
 * CTA C, after Unseen Studio: a large serif italic “Say hello” and two pill choices that route the
 * message before any form. The button’s label follows the choice in place (transitions.dev text
 * states swap); both labels size the button, so it never changes width mid-swap. The accent is the
 * hue dot that closes the greeting like a full stop.
 */
export function CtaHello() {
	const t = useTranslations('ourProcess');
	const craft = useTranslations('ourCraft');
	const labels: Record<Topic, string> = { project: t('button'), consult: craft('button') };
	const reduceMotion = useReducedMotion();
	const [topic, setTopic] = useState<Topic>('project');
	const [shown, setShown] = useState<Topic>('project');
	const swapRef = useRef<HTMLSpanElement>(null);
	const swapTimer = useRef(0);

	const choose = (next: Topic) => {
		setTopic(next);
		const el = swapRef.current;
		if (!el || reduceMotion) return setShown(next);
		// Text states swap: exit up, swap the text, enter from below.
		const duration = parseFloat(getComputedStyle(el).getPropertyValue('--text-swap-dur')) || 150;
		window.clearTimeout(swapTimer.current);
		el.classList.add(styles.isExit);
		swapTimer.current = window.setTimeout(() => {
			flushSync(() => setShown(next));
			el.classList.remove(styles.isExit);
			el.classList.add(styles.isEnterStart);
			void el.offsetHeight;
			el.classList.remove(styles.isEnterStart);
		}, duration);
	};

	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.hello)}>
				<Text as="h3" size="5xl" family="serif" italic weight="regular" leading="none" tone="strong" className={styles.helloTitle}>
					Say hello
					<span className={cx(styles.helloStop, shared.hued)} data-hue="orange" aria-hidden="true" />
				</Text>
				<div className={styles.helloRoute}>
					<Text as="span" size="xs" tone="faint">
						What is it about?
					</Text>
					<div className={styles.helloRow}>
						<SegmentedControl label="What is it about" options={TOPICS} value={topic} onChange={choose} size="sm" />
						<Button href={BOOKING_URL} variant="solid" size="lg" iconStart="calendar">
							<span className={styles.swapSlot}>
								{TOPICS.map((option) => (
									<span key={option.value} className={styles.swapSizer} aria-hidden="true">
										{labels[option.value]}
									</span>
								))}
								<span ref={swapRef} className={styles.textSwap}>
									{labels[shown]}
								</span>
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CtaHello;
