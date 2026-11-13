//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Button, Heading, Surface, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';
import { CRAFT, SHOTS } from '@/components/layout/content';
import { CraftList } from './craft-live';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './craft.module.css';

const pad = (index: number) => String(index + 1).padStart(2, '0');

/**
 * Craft B, after Koto: the section name, one large promise, then a ruled list of what we deliver
 * (each beat with its one-line subtitle), and a small case tile pinned in the corner as proof. The
 * accent is the hue dot on that tile's caption.
 */
function CraftRows() {
	const t = useTranslations('ourCraft');
	const work = useTranslations('ourWork');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.rows)}>
				<div className={styles.rowsHead}>
					<Text as="span" size="sm" weight="medium" tone="strong">
						{t('title')}
					</Text>
					<Heading level={3} size="3xl" weight="regular" leading="tight" tone="strong" className={styles.rowsPromise}>
						{t.rich('intro', { serif: (chunks) => <Accent>{chunks}</Accent> })}
					</Heading>
				</div>
				<Surface tone="raised" radius="lg" padding="xs" bevel className={styles.rowsCase}>
					<div className={styles.rowsShot}>
						<Image src={SHOTS[1].light} alt="" fill sizes="160px" className={cx(shared.image, styles.centered, 'u-only-light')} />
						<Image src={SHOTS[1].dark} alt="" fill sizes="160px" className={cx(shared.image, styles.centered, 'u-only-dark')} />
					</div>
					<span className={styles.rowsCaption}>
						<Text as="span" size="2xs" tone="strong">
							{work('projects.yeta.name')}
						</Text>
						<Text as="span" size="2xs" tone="faint">
							{work('caseStudy')}
						</Text>
					</span>
				</Surface>
				<ol className={styles.rowsList}>
					{CRAFT.map((item, index) => (
						<li key={item.key} className={styles.row}>
							<Text as="span" size="xs" tone="faint" className={shared.numeral}>
								{pad(index)}
							</Text>
							<Text as="span" size="md" tone="strong" leading="snug">
								{t(`cards.${item.key}.title`)}
							</Text>
							<Text as="span" size="xs" tone="subtle" leading="snug" className={styles.rowNote}>
								{t(`cards.${item.key}.subtitle`)}
							</Text>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}

/**
 * Craft C, after Taxi Studio and Instrument: two voices. A heavy sans statement with a pill
 * action on one side (Instrument), and on the other a solid square, inverse to the canvas, that
 * lists the six beats in the Editorial serif (Taxi Studio). The accent is the thin hue line that
 * opens the square.
 */
function CraftVoices() {
	const t = useTranslations('ourCraft');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.voices)}>
				<div className={styles.voicesStatement}>
					<Heading level={3} size="4xl" leading="none" tone="strong" className={styles.voicesTitle}>
						{t('chip')}
					</Heading>
					<Button href={BOOKING_URL} variant="glass" size="md" iconStart="calendar">
						{t('button')}
					</Button>
				</div>
				<div className={cx(styles.voicesSquare, 'scheme-inverse')}>
					<span className={cx(styles.voicesRule, shared.hued)} data-hue="yellow" aria-hidden="true" />
					<ol className={styles.voicesList}>
						{CRAFT.map((item) => (
							<li key={item.key}>
								<Text as="span" family="serif" weight="regular" leading="snug" tone="strong" className={styles.voicesLine}>
									{t(`cards.${item.key}.title`)}
								</Text>
							</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const CRAFT_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Active list', refs: 'Fiasco', Component: CraftList },
	{ id: 'b', label: 'Capability rows', refs: 'Koto', Component: CraftRows },
	{ id: 'c', label: 'Two voices', refs: 'Taxi Studio, Instrument', Component: CraftVoices },
];
