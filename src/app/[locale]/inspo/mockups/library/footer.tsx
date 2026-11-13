//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button, Divider, Link, Text, Wordmark } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';
import { SHOTS } from '@/components/layout/content';
import { FooterReadout } from './footer-live';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './footer.module.css';

const NAV = ['ourCraft', 'ourWork', 'ourProcess', 'testimonials'] as const;
const SOCIALS = ['linkedin', 'instagram', 'threads', 'twitter'] as const;

/** The booking link as people read it, without the scheme. */
const BOOKING_LABEL = BOOKING_URL.replace(/^https?:\/\//, '');

/** A quiet link column: a faint label over plain items. */
function FooterColumn({ title, items }: { title: string; items: string[] }) {
	return (
		<div className={styles.column}>
			<Text as="span" size="xs" tone="faint">
				{title}
			</Text>
			{items.map((item) => (
				<Text key={item} as="span" size="sm" tone="subtle">
					{item}
				</Text>
			))}
		</div>
	);
}

/**
 * Footer A, after Claude Type: one line and one action over quiet link columns, then the studio's
 * wordmark as a full-width sign-off, the page's last word.
 */
function FooterSignOff() {
	const t = useTranslations('footer');
	const nav = useTranslations('nav');
	const year = new Date().getFullYear();
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.sign)}>
				<div className={styles.signLead}>
					<Text as="h3" size="xl" weight="regular" leading="snug" tone="strong">
						{t('ready')}
					</Text>
					<Button href={BOOKING_URL} variant="glass" size="md" iconStart="calendar">
						{t('consultation')}
					</Button>
				</div>
				<div className={styles.signColumns}>
					<FooterColumn title={t('navigation')} items={NAV.map((key) => nav(key))} />
					<FooterColumn title={t('socials')} items={SOCIALS.map((key) => t(`links.${key}`))} />
					<div className={cx(styles.column, styles.signAbout)}>
						<Text as="span" size="xs" tone="faint">
							{t('aboutTitle')}
						</Text>
						<Text size="sm" tone="subtle" leading="normal">
							{t('about')}
						</Text>
					</div>
				</div>
				<div className={styles.signBase}>
					<Text as="span" size="xs" tone="faint">
						{t('rights', { year })}
					</Text>
					<Text as="span" size="xs" tone="faint">
						{t('agency')}
					</Text>
				</div>
				{/* The real wordmark as the sign-off; the name is already said in the base line. */}
				<Wordmark alt="" className={styles.signLine} />
			</div>
		</div>
	);
}

/**
 * Footer B, after Koto: a colophon on the inverse band the site footer already uses (near-black on
 * the light page, light on the dark one). A two-tone line, a small card with our latest shot, and
 * contact rows split by hairlines; the way in is the booking row, a plain link as in the site
 * footer.
 */
function FooterColophon() {
	const t = useTranslations('footer');
	const nav = useTranslations('nav');
	const work = useTranslations('ourWork');
	const year = new Date().getFullYear();
	const rows = [
		{ label: t('socials'), value: SOCIALS.map((key) => t(`links.${key}`)).join(', ') },
		{ label: t('navigation'), value: NAV.map((key) => nav(key)).join(', ') },
	];
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.colophon, 'scheme-inverse')}>
				<div className={styles.colophonHead}>
					<Text as="h3" size="3xl" weight="regular" leading="tight" tone="strong" className={styles.colophonTitle}>
						{t('ready')} <span className={styles.colophonFaint}>{t('consultation')}</span>
					</Text>
					<figure className={styles.colophonCard}>
						<span className={styles.colophonShot}>
							<Image src={SHOTS[0].light} alt="" fill sizes="(min-width: 1024px) 200px, 40vw" className={cx(shared.image, 'u-only-light')} />
							<Image src={SHOTS[0].dark} alt="" fill sizes="(min-width: 1024px) 200px, 40vw" className={cx(shared.image, 'u-only-dark')} />
						</span>
						<figcaption className={styles.colophonCaption}>
							<Text as="span" size="xs" tone="subtle">
								{`${work('caseStudy')} · ${work('projects.yeta.name')}`}
							</Text>
						</figcaption>
					</figure>
				</div>
				<dl className={styles.colophonRows}>
					<div className={styles.colophonRow}>
						<Text as="dt" size="xs" tone="faint">
							Booking
						</Text>
						<Text as="dd" size="sm" tone="strong">
							<Link href={BOOKING_URL} showExternalIcon={false}>
								{BOOKING_LABEL}
							</Link>
						</Text>
					</div>
					{rows.map((row) => (
						<div key={row.label} className={styles.colophonRow}>
							<Text as="dt" size="xs" tone="faint">
								{row.label}
							</Text>
							<Text as="dd" size="sm" tone="strong">
								{row.value}
							</Text>
						</div>
					))}
				</dl>
				<Divider />
				<div className={styles.colophonBase}>
					<Text as="span" size="xs" tone="faint">
						{t('rights', { year })}
					</Text>
					<Text as="span" size="xs" tone="faint">
						{t('signature')}
					</Text>
				</div>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const FOOTER_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Sign-off', refs: 'Claude Type', Component: FooterSignOff },
	{ id: 'b', label: 'Colophon', refs: 'Koto', Component: FooterColophon },
	{ id: 'c', label: 'Readout', refs: 'Seasats, Legend', Component: FooterReadout },
];
