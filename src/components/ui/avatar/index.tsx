//! Next Core
import Image from 'next/image';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type AvatarProps = {
	/** Person's name: used as alt text and for the initials fallback. */
	name: string;
	src?: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
};

const px = { sm: 20, md: 28, lg: 40 } as const;

function initials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');
}

/** Inspo component (Figma uses it inside Testimonial Card and the case-study team row). */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
	return (
		<span className={cx(styles.avatar, styles[size], 'u-bevel', className)}>
			{src ? (
				<Image src={src} alt={name} width={px[size]} height={px[size]} className={styles.image} />
			) : (
				<span className={styles.initials} aria-label={name} role="img">
					{initials(name)}
				</span>
			)}
		</span>
	);
}

export type AvatarGroupProps = {
	people: ReadonlyArray<{ name: string; src?: string }>;
	size?: AvatarProps['size'];
	/** Show at most this many; the rest collapse into a +N bubble. */
	max?: number;
	className?: string;
};

export function AvatarGroup({ people, size = 'md', max = 4, className }: AvatarGroupProps) {
	const shown = people.slice(0, max);
	const rest = people.length - shown.length;
	return (
		<span className={cx(styles.group, className)}>
			{shown.map((person) => (
				<Avatar key={person.name} {...person} size={size} />
			))}
			{rest > 0 && (
				<span className={cx(styles.avatar, styles[size], styles.more, 'u-bevel')}>
					<span className={styles.initials}>+{rest}</span>
				</span>
			)}
		</span>
	);
}

export default Avatar;
