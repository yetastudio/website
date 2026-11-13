'use client';

//! Next Core
import Image from 'next/image';

//! React Core
import { useRef, useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';
import { useAutoplay } from '../use-autoplay';

//! Components
import { PaginationDots, Text } from '@/components/ui';
import { TESTIMONIALS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

/**
 * Library 08, Testimonials. One voice at a time: a large serif quote floating on the client's
 * wash (mymind, Craft), the attribution small under it, and the system's autoplay dots pacing the
 * rotation the way Harvey's thin bars do. All quotes share one grid cell, so the frame never
 * changes height between them.
 */
export function TestimonialsMockup() {
	const t = useTranslations('testimonials');
	const [active, setActive] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);
	const current = TESTIMONIALS[active];

	return (
		<div className={styles.container}>
			<div ref={rootRef} className={cx(styles.frame, styles.quote, styles.hued, 'scheme-light')} data-hue={current.hue} {...autoplay.handlers}>
				<div className={styles.quoteStack}>
					{TESTIMONIALS.map((item, index) => (
						<figure key={item.key} className={styles.quoteItem} data-on={index === active || undefined} aria-hidden={index !== active || undefined}>
							<Text as="blockquote" family="serif" weight="regular" tone="strong" leading="snug" className={styles.quoteText}>
								{t(`items.${item.key}.quote`)}
							</Text>
							<figcaption className={styles.quoteBy}>
								<Image src={item.avatar} alt="" width={40} height={40} className={styles.quoteAvatar} />
								<Text as="span" size="sm" tone="strong">
									{t(`items.${item.key}.name`)}
									<Text as="span" size="sm" tone="subtle">
										{` · ${t(`items.${item.key}.role`)}, ${t(`items.${item.key}.company`)}`}
									</Text>
								</Text>
							</figcaption>
						</figure>
					))}
				</div>
				<PaginationDots
					count={TESTIMONIALS.length}
					index={active}
					onSelect={setActive}
					itemLabel="testimonial"
					autoplay={
						autoplay.enabled ? { paused: autoplay.paused, onComplete: () => setActive((index) => (index + 1) % TESTIMONIALS.length) } : undefined
					}
				/>
			</div>
		</div>
	);
}

export default TestimonialsMockup;
