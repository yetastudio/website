'use client';

//! React Core
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

//! Hooks
import { useTranslations } from 'next-intl';
import { useAutoplay } from '../use-autoplay';

//! Components
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import { CRAFT } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import shared from './shared.module.css';
import styles from './craft.module.css';

/** How long a beat holds before the list steps on, in ms. */
const HOLD = 3600;

/**
 * Craft A, after Fiasco: the six craft beats as one list in large type, the current one in the
 * Editorial italic and the rest faded, beside a centred framed card that holds the beat's promise.
 * It steps on its own while in view, pauses on hover and focus, and any line can be picked; the
 * card's copy changes with the transitions.dev text states swap. The accent is the current line's
 * numeral, in that beat's hue.
 */
export function CraftList() {
	const t = useTranslations('ourCraft');
	const [active, setActive] = useState(0);
	// The beat the card shows. It trails `active` by one text swap.
	const [shown, setShown] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const swapRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);
	const beat = CRAFT[shown];

	useEffect(() => {
		if (!autoplay.enabled || autoplay.paused) return;
		const timer = window.setTimeout(() => setActive((index) => (index + 1) % CRAFT.length), HOLD);
		return () => window.clearTimeout(timer);
	}, [active, autoplay.enabled, autoplay.paused]);

	// transitions.dev 04 · Text states swap: the old copy exits up, swaps, and the new copy enters from below.
	useEffect(() => {
		const el = swapRef.current;
		if (!el || shown === active) return;
		const duration = parseFloat(getComputedStyle(el).getPropertyValue('--text-swap-dur')) || 150;
		el.classList.add(styles.isExit);
		const timer = window.setTimeout(() => {
			flushSync(() => setShown(active));
			el.classList.remove(styles.isExit);
			el.classList.add(styles.isEnterStart);
			void el.offsetHeight;
			el.classList.remove(styles.isEnterStart);
		}, duration);
		return () => window.clearTimeout(timer);
	}, [active, shown]);

	return (
		<div className={shared.container}>
			<div ref={rootRef} className={cx(shared.frame, styles.list)} {...autoplay.handlers}>
				<ol className={styles.listItems}>
					{CRAFT.map((item, index) => {
						const current = index === active;
						return (
							<li key={item.key} className={shared.hued} data-hue={item.hue}>
								<Button variant="ghost" size="lg" fullWidth className={styles.listItem} aria-pressed={current} onClick={() => setActive(index)}>
									<span className={styles.listLabel}>
										<Text as="span" size="xs" family="serif" italic tone="faint" className={cx(styles.listNumber, shared.numeral)}>
											{String(index + 1).padStart(2, '0')}
										</Text>
										<Text
											as="span"
											size="2xl"
											family={current ? 'serif' : 'sans'}
											italic={current}
											weight={current ? 'regular' : 'light'}
											tone={current ? 'strong' : 'faint'}
											leading="tight"
											className={styles.listTitle}
										>
											{t(`cards.${item.key}.title`)}
										</Text>
									</span>
								</Button>
							</li>
						);
					})}
				</ol>
				<Surface tone="tint" radius="xl" padding="md" bevel className={styles.listStage}>
					<div className={styles.listCardFrame}>
						<Surface tone="raised" radius="lg" padding="md" bevel>
							<div ref={swapRef} className={styles.textSwap} aria-live="polite">
								<span className={styles.listCardHead}>
									<Icon name={beat.icon} size="md" />
									<Text as="span" size="sm" weight="medium" tone="strong" leading="snug">
										{t(`cards.${beat.key}.subtitle`)}
									</Text>
								</span>
								<Text size="xs" tone="subtle" leading="normal" className={styles.listCardNote}>
									{t(`cards.${beat.key}.description`)}
								</Text>
							</div>
						</Surface>
					</div>
				</Surface>
			</div>
		</div>
	);
}

export default CraftList;
