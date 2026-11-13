//! Components
import { GradientTile, type TileHue } from '@/components/ui/gradient-tile';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type CraftCardProps = {
	title: string;
	subtitle: string;
	description: string;
	icon: IconName;
	hue: TileHue;
	/** Hue on the light site, when the design differs (Figma Our Craft desktop, light). */
	hueLight?: TileHue;
	/**
	 * `row` is Figma Size=Desktop (470×185: tile left, text right).
	 * `stacked` is Size=Mobile (275 wide: tile on top, centred text).
	 * `responsive` stacks below 1024px and goes row above.
	 */
	layout?: 'row' | 'stacked' | 'responsive';
	headingLevel?: 3 | 4;
	className?: string;
};

/** Figma Craft Card (1472:4250): a colour-wash tile with an icon and a three-line text pane. */
export function CraftCard({ title, subtitle, description, icon, hue, hueLight, layout = 'responsive', headingLevel = 3, className }: CraftCardProps) {
	const Title = `h${headingLevel}` as const;
	return (
		<article className={cx(styles.card, styles[layout], 'u-outline', className)}>
			<GradientTile hue={hue} hueLight={hueLight} shape={layout === 'row' ? 'craft' : 'craft-wide'} className={styles.tile} underlay={<Icon name={icon} className={styles.icon} />} />
			<div className={cx(styles.pane, 'u-outline')}>
				<Title className={styles.title}>{title}</Title>
				<p className={styles.subtitle}>{subtitle}</p>
				<p className={styles.description}>{description}</p>
			</div>
		</article>
	);
}

export default CraftCard;
