//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Button, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';
import { CtaHello } from './cta-live';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './cta.module.css';

/** The booking link as people read it, without the scheme. */
const BOOKING_LABEL = BOOKING_URL.replace(/^https?:\/\//, '');

/**
 * CTA A, after Fiasco: pure type on a panel one step above the page. A small serif italic eyebrow
 * over a three-line light sans line, then one quiet way in under a hairline: the booking address
 * and a ghost button set like type. The accent is the eyebrow, the one phrase in colour.
 */
function CtaType() {
	const t = useTranslations('ourProcess');
	const nav = useTranslations('nav');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.type)}>
				<Text size="xl" family="serif" italic weight="regular" leading="tight">
					<span className={cx(styles.typeHue, shared.hued)} data-hue="violet">
						{nav('getInTouch')}
					</span>
				</Text>
				<Text as="h3" size="5xl" weight="light" leading="tight" tone="strong" className={styles.typeLine}>
					{t.rich('cta', { em: (chunks) => <Accent>{chunks}</Accent> })}
				</Text>
				<div className={styles.typeFoot}>
					<Text as="span" size="xs" tone="faint">
						{BOOKING_LABEL}
					</Text>
					<Button href={BOOKING_URL} variant="ghost" size="md" iconStart="calendar">
						{t('button')}
					</Button>
				</div>
			</div>
		</div>
	);
}

/**
 * CTA B, after Atlas and Ghost: two huge display lines and one button, centred over a horizon.
 * The ground rises from the base as a wide arc one step above the canvas (Ghost); its rim is the
 * one accent, a hairline in the hue with a faint glow above it, no wider than the arc itself.
 */
function CtaHorizon() {
	const hero = useTranslations('hero');
	const craft = useTranslations('ourCraft');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.horizon)}>
				<Text as="h3" size="5xl" weight="bold" leading="none" tone="display" align="center" balance className={styles.horizonLine}>
					{hero('letsBuild')}
				</Text>
				<Button href={BOOKING_URL} variant="solid" size="lg" iconStart="calendar">
					{craft('button')}
				</Button>
				<span className={cx(styles.horizonArc, shared.hued)} data-hue="blue" aria-hidden="true" />
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const CTA_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Pure type', refs: 'Fiasco', Component: CtaType },
	{ id: 'b', label: 'Horizon', refs: 'Atlas, Ghost', Component: CtaHorizon },
	{ id: 'c', label: 'Say hello', refs: 'Unseen Studio', Component: CtaHello },
];
