//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Heading, Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { LogoMark, Wordmark } from '@/components/ui/brand';
import { Surface } from '@/components/ui/surface';
import { BOOKING_URL } from '@/components/layout/sections';
import { SHOTS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './hero.module.css';

/**
 * Hero A, after Altitude and Air: a neutral sky band (raised surface with a faint blue tint), the
 * page rising over it in one wide arc, and the slogan split across the width. The only colour is
 * the band's tint and the italic word.
 */
function HeroSky() {
	const t = useTranslations('hero');
	return (
		<div className={shared.container}>
			<div className={shared.frame}>
				<div className={cx(shared.sky, styles.skyBand)}>
					<span className={styles.skyMark}>
						<Wordmark alt="Yeta Studio" />
						<Text as="span" size="xs" tone="subtle">
							Design &amp; Development
						</Text>
					</span>
				</div>
				<div className={styles.skyBody}>
					<Heading level={3} size="5xl" tone="display" leading="tight" className={styles.skySplit}>
						<span className={styles.skyLine}>because great brands</span>{' '}
						<span className={styles.skyLine}>
							aren’t built on <Accent>luck</Accent>.
						</span>
					</Heading>
					<Button href={BOOKING_URL} variant="glass" size="lg" iconStart="calendar">
						{t('letsBuild')}
					</Button>
				</div>
			</div>
		</div>
	);
}

/**
 * Hero B, after Unseen Studio and Craft Agency: all type on the plain canvas. A serif italic
 * phrase stacked over a heavy sans line, one small chip with a hue dot, one button. The accent is
 * a faint tinted glow behind the type, the size of the headline and no bigger.
 */
function HeroPairing() {
	const t = useTranslations('hero');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.pairing)}>
				<span className={cx(styles.pairingGlow, shared.hued)} data-hue="violet" aria-hidden="true" />
				<Heading level={3} size="5xl" leading="tight" className={styles.pairingTitle}>
					<Text as="span" family="serif" italic weight="regular" tone="subtle" className={styles.pairingSerif}>
						because great brands
					</Text>
					<span className={styles.pairingSans}>aren’t built on luck.</span>
				</Heading>
				<Button href={BOOKING_URL} variant="solid" size="lg" iconStart="calendar">
					{t('letsBuild')}
				</Button>
			</div>
		</div>
	);
}

/**
 * Hero C, after Daylight and Sana: the slogan beside a rounded inset frame that holds a site we
 * built, with a small frosted nav floating in the frame's corner. The frame's backdrop is the one
 * accent: a neutral surface over the blue wash at low strength.
 */
function HeroFramed() {
	const t = useTranslations('hero');
	const nav = useTranslations('nav');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.framed)}>
				<div className={styles.framedCopy}>
					<Heading level={3} size="4xl" tone="strong" leading="tight" weight="regular" className={styles.framedTitle}>
						because great brands aren’t built on <Accent>luck</Accent>.
					</Heading>
					<Button href={BOOKING_URL} variant="glass" size="md" iconStart="calendar">
						{t('letsBuild')}
					</Button>
				</div>
				<div className={cx(styles.framedStage, shared.tint, shared.hued)} data-hue="blue">
					<div className={styles.framedShot}>
						<Image src={SHOTS[1].light} alt="" fill sizes="(min-width: 1024px) 320px, 80vw" className={cx(shared.image, 'u-only-light')} />
						<Image src={SHOTS[1].dark} alt="" fill sizes="(min-width: 1024px) 320px, 80vw" className={cx(shared.image, 'u-only-dark')} />
					</div>
					<Surface tone="glass" radius="pill" padding="xs" bevel className={styles.framedNav}>
						<LogoMark size={22} alt="" />
						<Text as="span" size="xs" tone="strong">
							{nav('ourWork')}
						</Text>
					</Surface>
				</div>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const HERO_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Sky band', refs: 'Altitude, Air', Component: HeroSky },
	{ id: 'b', label: 'Type pairing', refs: 'Unseen Studio, Craft Agency', Component: HeroPairing },
	{ id: 'c', label: 'Framed site', refs: 'Daylight, Sana', Component: HeroFramed },
];
