import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export type ThemeProviderProps = {
	children: ReactNode;
};

export type ThemeContextType = {
	isDarkMode: boolean;
};

export type ButtonProps = {
	title?: string;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'solid' | 'outline' | 'ghost' | 'link';
	radius?: 'squared' | 'rounded';
	isFullWidth?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;
	icon?: LucideIcon;
	iconPosition?: 'left' | 'middle' | 'right';
	onClick?: () => void;
};

export type NavItemProps = {
	href: string;
	children: ReactNode;
};

export type ChipProps = {
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg';
	isInverted?: boolean;
	isFullWidth?: boolean;
	icon?: LucideIcon;
	iconPosition?: 'left' | 'middle' | 'right';
};
