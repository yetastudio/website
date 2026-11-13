//! Next Core
import Image from 'next/image';

//! Components
import { GradientTile, type TileHue } from '@/components/ui/gradient-tile';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type TestimonialCardProps = {
	quote: string;
	name: string;
	role: string;
	company: string;
	avatar?: string;
	hue: TileHue;
	/** Figma Size=Desktop (376×304, 16px quote) or Size=Mobile (276×264, 12px quote). */
	size?: 'desktop' | 'mobile';
	className?: string;
};

/**
 * Figma Testimonial Card (1213:1430). The quote sits on an inverse wash tile
 * (pastel on the dark site, deep on the light one); the author row stays on the card.
 */
export function TestimonialCard({ quote, name, role, company, avatar, hue, size = 'desktop', className }: TestimonialCardProps) {
	return (
		<figure className={cx(styles.card, styles[size], 'u-outline', className)}>
			<GradientTile hue={hue} shape={size === 'desktop' ? 'testimonial' : 'testimonial-compact'} intensity={size === 'desktop' ? 'strong' : 'soft'} className={styles.tile}>
				<blockquote className={styles.quote}>
					<p>{quote}</p>
				</blockquote>
			</GradientTile>
			<figcaption className={styles.author}>
				<span className={styles.person}>
					<span className={styles.avatar}>{avatar && <Image src={avatar} alt="" width={48} height={48} />}</span>
					<span className={styles.name}>{name}</span>
				</span>
				<span className={styles.role}>
					{role} ✹ {company}
				</span>
			</figcaption>
		</figure>
	);
}

export default TestimonialCard;
