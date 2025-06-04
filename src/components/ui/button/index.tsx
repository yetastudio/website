//! Types
import { ButtonProps } from '@/types';

//! Styles
import styles from './styles.module.css';

function Button(props: ButtonProps) {
	const {
		title,
		variant = 'solid',
		size = 'md',
		radius = 'squared',
		icon,
		iconPosition,
		isFullWidth,
		isDisabled,
		isLoading,
		onClick,
	} = props;

	const Icon = icon;
	const iconMiddle = iconPosition === 'middle';
	const iconLeft = iconPosition === 'left';
	const iconRight = iconPosition === 'right';

	return (
		<button
			className={`
				${styles.button} ${styles[size]} ${styles[radius]} 
			${styles[variant]} ${styles[`icon-${iconPosition}`]} 
			${isFullWidth ? styles.isFull : null} 
			${isLoading ? styles.isLoading : null} 
			${isDisabled ? styles.isDisabled : null}
			`}
			onClick={onClick}
		>
			{Icon && iconLeft && <Icon />}
			{Icon && iconMiddle ? <Icon /> : title}
			{Icon && iconRight && <Icon />}
		</button>
	);
}

export default Button;
