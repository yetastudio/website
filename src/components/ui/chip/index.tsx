//! Types
import { ChipProps } from '@/types';

//! Styles
import styles from './styles.module.css';

function Chip(props: ChipProps) {
	const {
		children,
		size = 'md',
		icon,
		iconPosition,
		isInverted,
		isFullWidth,
	} = props;

	const Icon = icon;
	const iconMiddle = iconPosition === 'middle';
	const iconLeft = iconPosition === 'left';
	const iconRight = iconPosition === 'right';

	return (
		<span
			className={`
				${styles.chip} ${styles[size]} 
				${styles[`icon-${iconPosition}`]} 
				${isInverted ? styles.isInverted : null} 
				${isFullWidth ? styles.isFull : null} 
			`}
		>
			{Icon && iconLeft && <Icon />}
			{Icon && iconMiddle ? <Icon /> : children}
			{Icon && iconRight && <Icon />}
		</span>
	);
}

export default Chip;
