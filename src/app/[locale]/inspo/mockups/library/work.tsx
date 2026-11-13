//! Next Core
import Image from 'next/image';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Button, Chip, Text } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';
import { SHOTS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

/** The shot each tile frames, and the wash it sits on (OFF+BRAND, Webflow). */
const TILES = [
	{ shot: 0, hue: 'pink' },
	{ shot: 2, hue: 'blue' },
] as const;

/**
 * Library 05, Our Work. A serif italic eyebrow over one statement (Fiasco), quiet filter pills
 * (Instrument, Unseen Studio), then the finished site framed on washes in a staggered pair, each
 * with its caption and one pill (OFF+BRAND). The last tile is left open for the next project, so
 * the grid never invents clients.
 */
export function WorkMockup() {
	const t = useTranslations('ourWork');
	const project = (key: string) => t(`projects.yeta.${key}`);
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.work)}>
				<header className={styles.workHead}>
					<Text as="span" size="lg" family="serif" italic tone="strong">
						Selected works
					</Text>
					<Text as="h3" size="2xl" tone="strong" leading="snug" className={styles.workStatement}>
						{t.rich('intro', { serif: (chunks) => <Accent>{chunks}</Accent>, em: (chunks) => <Accent>{chunks}</Accent>, brmd: () => null })}
					</Text>
					<ul className={styles.workFilters} aria-label="Filters">
						<li>
							<Chip size="sm">All</Chip>
						</li>
						<li>
							<Chip size="sm">Websites</Chip>
						</li>
						<li>
							<Chip size="sm">Design systems</Chip>
						</li>
					</ul>
				</header>
				<ul className={styles.workGrid}>
					{TILES.map((tile, index) => (
						<li key={tile.shot} className={styles.workItem}>
							<div className={cx(styles.workWash, styles.hued)} data-hue={tile.hue}>
								<div className={styles.workShot}>
									<Image
										src={SHOTS[tile.shot].light}
										alt=""
										fill
										sizes="(min-width: 1024px) 280px, 90vw"
										className={cx(styles.workImage, 'u-only-light')}
									/>
									<Image
										src={SHOTS[tile.shot].dark}
										alt=""
										fill
										sizes="(min-width: 1024px) 280px, 90vw"
										className={cx(styles.workImage, 'u-only-dark')}
									/>
								</div>
							</div>
							<div className={styles.workCaption}>
								<div>
									<Text as="span" size="md" weight="medium" tone="strong">
										{project('name')}
									</Text>
									<Text size="xs" tone="subtle">
										{index === 0 ? project('services') : `${project('industry')} · ${project('year')}`}
									</Text>
								</div>
								<Button variant="glass" size="sm">
									{t('viewProject')}
								</Button>
							</div>
						</li>
					))}
					<li className={cx(styles.workItem, styles.workOpen)}>
						<Text as="span" size="lg" family="serif" italic tone="subtle">
							Your project, next
						</Text>
						<Button href={BOOKING_URL} variant="ghost" size="sm" iconStart="plus">
							Start yours
						</Button>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default WorkMockup;
