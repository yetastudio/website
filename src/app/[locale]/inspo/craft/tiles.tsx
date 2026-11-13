'use client';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Text } from '@/components/ui';
import { TILE_SCENES } from './scenes';

//! Data
import { CRAFT_STEPS } from './data';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './tiles.module.css';

/**
 * Alternative A: the Our Craft cards as they read today (title, subtitle, description), with
 * the colour wash replaced by a neutral tile that plays its beat. Two columns on a desktop
 * canvas; a scrolling track, like the landing's mobile carousel, on a phone.
 */
export function CraftTilesMockup() {
	const t = useTranslations('ourCraft');
	return (
		<div className={styles.container}>
			<ul className={styles.grid}>
				{CRAFT_STEPS.map((step) => {
					const Scene = TILE_SCENES[step];
					return (
						<li key={step} className={cx(styles.card, 'u-outline')}>
							<div className={styles.tile}>
								<Scene />
							</div>
							<div className={cx(styles.pane, 'u-outline')}>
								<Text as="h4" size="xl" family="serif" weight="regular" leading="snug" tone="strong">
									{t(`cards.${step}.title`)}
								</Text>
								<Text size="xs" weight="semibold" leading="snug">
									{t(`cards.${step}.subtitle`)}
								</Text>
								<Text size="2xs" tone="subtle" leading="relaxed">
									{t(`cards.${step}.description`)}
								</Text>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default CraftTilesMockup;
