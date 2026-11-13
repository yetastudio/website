'use client';

//! React Core
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';

//! Next Core
import { Link as LocaleLink, localeHref } from '@/i18n/navigation';

//! Components
import { Icon, type IconName, type IconSize } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ButtonVariant = 'solid' | 'ghost' | 'glass';
export type ButtonRadius = 'default' | 'rounded' | 'soft';

type BaseProps = {
	children?: ReactNode;
	/** Figma sizes: sm 30 · md 34 · lg 36. Landing: xl 48 (Large ×1.2, hero group) · 2xl 60 (calls to action). */
	size?: ButtonSize;
	/** `solid` is the Figma button. `ghost` drops surface and stroke. `glass` is the translucent nav material. */
	variant?: ButtonVariant;
	/** Figma Radius=Default (5px) or Radius=Rounded (12px); `soft` (16px) is the landing CTA instance. */
	radius?: ButtonRadius;
	iconStart?: IconName;
	iconEnd?: IconName;
	/**
	 * Icon-only button. `label` becomes the accessible name, so it is required in practice;
	 * without it the icon name is used.
	 */
	icon?: IconName;
	/** Icon-only button with custom icon content (an animated icon swap); takes precedence over `icon`. */
	iconNode?: ReactNode;
	/** Accessible name override (also the name for icon-only buttons). */
	label?: string;
	fullWidth?: boolean;
	/** Keeps the label, shows a spinner in the same box, sets aria-busy and blocks repeat presses. */
	loading?: boolean;
	disabled?: boolean;
	className?: string;
};

type AsButton = BaseProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
		href?: undefined;
	};

type AsLink = BaseProps &
	Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
		/** Renders a link. External URLs open in a new tab. */
		href: string;
	};

export type ButtonProps = AsButton | AsLink;

const iconSizeFor: Record<ButtonSize, IconSize> = { sm: 'sm', md: 'md', lg: 'lg', xl: 'lg', '2xl': 'lg' };

function isExternal(href: string) {
	return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

/**
 * The Figma Button (Variant × Status × Size × Radius). Theme comes from tokens,
 * so there is no Dark/Light prop: the same button is dark on the dark canvas
 * and light on the light canvas.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
	const {
		children,
		size = 'lg',
		variant = 'solid',
		radius = 'rounded',
		iconStart,
		iconEnd,
		icon,
		iconNode,
		label,
		fullWidth,
		loading,
		disabled,
		className,
		...rest
	} = props;

	const iconSize = iconSizeFor[size];
	const isIconOnly = Boolean(icon || iconNode) && !children;
	const accessibleName = label ?? (isIconOnly ? icon : undefined);

	const classes = cx(
		styles.button,
		styles[size === '2xl' ? 'xxl' : size],
		styles[variant],
		styles[radius],
		variant !== 'ghost' && 'u-bevel',
		isIconOnly && styles.iconOnly,
		Boolean(iconStart) && styles.hasStart,
		Boolean(iconEnd) && styles.hasEnd,
		fullWidth && styles.fullWidth,
		loading && styles.loading,
		disabled && styles.disabled,
		className
	);

	const content = (
		<>
			{iconStart && <Icon name={iconStart} size={iconSize} />}
			{isIconOnly && (iconNode ?? (icon && <Icon name={icon} size={iconSize} />))}
			{children !== undefined && <span className={styles.label}>{children}</span>}
			{iconEnd && <Icon name={iconEnd} size={iconSize} />}
			{loading && (
				<span className={styles.spinner} aria-hidden="true">
					<Icon name="loader" size={iconSize} />
				</span>
			)}
		</>
	);

	const blocked = Boolean(loading || disabled);

	if ('href' in rest && typeof rest.href === 'string') {
		const { href, onClick, ...anchorRest } = rest as Omit<AsLink, keyof BaseProps>;
		const external = isExternal(href);
		// Files (downloads), same-page anchors and external URLs bypass client-side routing.
		const plain = external || href.startsWith('#') || 'download' in anchorRest;
		const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
			if (blocked) {
				event.preventDefault();
				return;
			}
			onClick?.(event);
		};
		const shared = {
			ref: ref as React.Ref<HTMLAnchorElement>,
			className: classes,
			'aria-label': label,
			'aria-busy': loading || undefined,
			'aria-disabled': blocked || undefined,
			onClick: handleClick,
			...anchorRest,
		};
		if (plain) {
			return (
				<a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...shared}>
					{content}
				</a>
			);
		}
		return (
			<LocaleLink href={localeHref(href)} {...shared}>
				{content}
			</LocaleLink>
		);
	}

	const { type = 'button', onClick, ...buttonRest } = rest as Omit<AsButton, keyof BaseProps>;
	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type={type}
			className={classes}
			aria-label={accessibleName}
			aria-busy={loading || undefined}
			aria-disabled={blocked || undefined}
			onClick={(event) => {
				if (blocked) {
					event.preventDefault();
					return;
				}
				onClick?.(event);
			}}
			{...buttonRest}
		>
			{content}
		</button>
	);
});

export default Button;
