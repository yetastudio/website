//! React Core
import { ReactNode } from 'react';

//! Context
export type ThemeProviderProps = {
	children: ReactNode;
};

export type ThemeContextType = {
	isDarkMode: boolean;
};

//! Lucide React
import { LucideIcon } from 'lucide-react';

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
