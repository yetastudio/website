'use client';

//! React Core
import { useSyncExternalStore } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/brand';
import { Text } from '@/components/ui/text';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import shared from './shared.module.css';
import styles from './footer.module.css';

const NAV = ['ourCraft', 'ourWork', 'ourProcess', 'testimonials'] as const;

/** One CSS pixel is 1/96 of an inch, so the readout is a true length, not a made-up figure. */
const METRES_PER_PX = 0.0254 / 96;

/** Window scroll, at most once per frame. */
function subscribe(onChange: () => void) {
	let frame = 0;
	const onScroll = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(onChange);
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	return () => {
		window.removeEventListener('scroll', onScroll);
		cancelAnimationFrame(frame);
	};
}

/** Rounded to the centimetre, so the readout re-renders only when the figure it shows changes. */
const readMetres = () => Math.round(window.scrollY * METRES_PER_PX * 100) / 100;
const readNothing = () => 0;

/**
 * Footer C, after Seasats and Legend: the links pressed into one thin band at the top (Legend), a
 * live readout of how far the reader scrolled to get here (Seasats), and the ✹ mark rising from the
 * frame's lower edge like a moon over the horizon, in neutral ink. The accent is the readout's
 * figure, the one numeral in colour.
 */
export function FooterReadout() {
	const t = useTranslations('footer');
	const nav = useTranslations('nav');
	const metres = useSyncExternalStore(subscribe, readMetres, readNothing);
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.readout)}>
				<div className={styles.readoutBand}>
					<span className={styles.readoutLinks}>
						{NAV.map((key) => (
							<Text key={key} as="span" size="xs" tone="subtle">
								{nav(key)}
							</Text>
						))}
					</span>
					<Button href={BOOKING_URL} variant="glass" size="sm" iconStart="calendar">
						{nav('getInTouch')}
					</Button>
				</div>
				<div className={styles.readoutMeter}>
					<span className={styles.readoutFigure}>
						<Text as="span" size="xs" tone="faint">
							Scrolled to get here
						</Text>
						<Text as="span" size="3xl" family="serif" weight="regular" leading="none" tone="strong" className={shared.numeral}>
							<span className={cx(styles.readoutHue, shared.hued)} data-hue="green">
								{metres.toFixed(2)}
							</span>{' '}
							m
						</Text>
					</span>
					<span className={styles.readoutLegal}>
						<Text as="span" size="xs" tone="faint">
							{t('signature')}
						</Text>
						<Text as="span" size="xs" tone="faint">
							{t('agency')}
						</Text>
					</span>
				</div>
				<div className={styles.readoutRise} aria-hidden="true">
					<LogoMark fill="transparent" size="64cqi" alt="" />
				</div>
			</div>
		</div>
	);
}

export default FooterReadout;
