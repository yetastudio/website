'use client';

//! React Core
import { useEffect, useRef, useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';
import { useAutoplay } from '../use-autoplay';

//! Components
import { Button, Icon, Surface, Text } from '@/components/ui';
import { CRAFT } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

const HOLD = 3600;

/**
 * Library 04, Our Craft. The six craft beats as one list in large type, the current one in the
 * Editorial italic and the rest faded (Fiasco, Instrument); beside it the beat's wash with a framed
 * card floating in it, the deliverable rather than an icon (Phantom Studios). It steps on its own
 * while in view, pauses on hover and focus, and any line can be picked.
 */
export function CraftMockup() {
	const t = useTranslations('ourCraft');
	const [active, setActive] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);
	const beat = CRAFT[active];

	useEffect(() => {
		if (!autoplay.enabled || autoplay.paused) return;
		const timer = window.setTimeout(() => setActive((index) => (index + 1) % CRAFT.length), HOLD);
		return () => window.clearTimeout(timer);
	}, [active, autoplay.enabled, autoplay.paused]);

	return (
		<div className={styles.container}>
			<div ref={rootRef} className={cx(styles.frame, styles.craft)} {...autoplay.handlers}>
				<ol className={styles.craftList}>
					{CRAFT.map((item, index) => {
						const current = index === active;
						return (
							<li key={item.key}>
								<Button variant="ghost" size="lg" fullWidth className={styles.craftItem} aria-pressed={current} onClick={() => setActive(index)}>
									<span className={styles.craftLabel}>
										<Text as="span" size="xs" family="serif" italic tone="faint" className={styles.numeral}>
											{String(index + 1).padStart(2, '0')}
										</Text>
										<Text
											as="span"
											size="2xl"
											family={current ? 'serif' : 'sans'}
											italic={current}
											tone={current ? 'strong' : 'faint'}
											leading="tight"
											className={styles.craftTitle}
										>
											{t(`cards.${item.key}.title`)}
										</Text>
									</span>
								</Button>
							</li>
						);
					})}
				</ol>
				<div className={cx(styles.craftStage, styles.hued, 'scheme-light')} data-hue={beat.hue} aria-live="polite">
					<Surface tone="raised" radius="lg" padding="sm" bevel className={styles.craftCard}>
						<span className={styles.craftCardHead}>
							<Icon name={beat.icon} size="md" />
							<Text as="span" size="sm" weight="medium" tone="strong">
								{t(`cards.${beat.key}.subtitle`)}
							</Text>
						</span>
						<Text size="xs" tone="subtle" leading="normal">
							{t(`cards.${beat.key}.description`)}
						</Text>
					</Surface>
				</div>
			</div>
		</div>
	);
}

export default CraftMockup;
