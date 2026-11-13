import type { ReactNode } from 'react';

export type ThemeProviderProps = {
	children: ReactNode;
};

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export type ThemeContextType = {
	/** What the person chose. */
	preference: ThemePreference;
	/** What is on screen right now. */
	resolvedTheme: ResolvedTheme;
	/** Kept for older call sites; same as `resolvedTheme === 'dark'`. */
	isDarkMode: boolean;
	setPreference: (preference: ThemePreference) => void;
};
