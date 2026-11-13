//! Components
import { GradientTile, type TileHue } from '@/components/ui/gradient-tile';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ProcessCardProps = {
	title: string;
	description: string;
	icon: IconName;
	hue: TileHue;
	/** Step number, announced before the title ("Step 1"). */
	step?: number;
	stepLabel?: string;
	headingLevel?: 3 | 4;
	className?: string;
};

/** Figma Process Card, Size=Large (1204:1323): wash tile on top, Editorial title, short description. */
export function ProcessCard({ title, description, icon, hue, step, stepLabel = 'Step', headingLevel = 3, className }: ProcessCardProps) {
	const Title = `h${headingLevel}` as const;
	return (
		<article className={cx(styles.card, 'u-outline', className)}>
			<GradientTile hue={hue} shape="process" className={styles.tile} underlay={<Icon name={icon} className={styles.icon} />} />
			<div className={styles.text}>
				<Title className={styles.title}>
					{step !== undefined && <span className="u-visually-hidden">{`${stepLabel} ${step}: `}</span>}
					{title}
				</Title>
				<p className={styles.description}>{description}</p>
			</div>
		</article>
	);
}

export default ProcessCard;
