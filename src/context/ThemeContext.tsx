'use client';

//! React Core
import { createContext, useCallback, useMemo, useSyncExternalStore } from 'react';

//! Types
import type { ResolvedTheme, ThemeContextType, ThemePreference, ThemeProviderProps } from '@/types';

export const THEME_STORAGE_KEY = 'yeta-theme';
const CHANGE_EVENT = 'yeta-theme-change';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredPreference(): ThemePreference {
	try {
		const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
	} catch {
		// Storage can be blocked (private mode); fall back to the OS.
	}
	return 'system';
}

/** Stored preference as an external store: same-tab changes fire CHANGE_EVENT, other tabs fire `storage`. */
function subscribePreference(onChange: () => void) {
	window.addEventListener(CHANGE_EVENT, onChange);
	window.addEventListener('storage', onChange);
	return () => {
		window.removeEventListener(CHANGE_EVENT, onChange);
		window.removeEventListener('storage', onChange);
	};
}

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function subscribeSystem(onChange: () => void) {
	const media = darkQuery();
	media.addEventListener('change', onChange);
	return () => media.removeEventListener('change', onChange);
}

/**
 * Holds the theme preference (system | light | dark) and the theme it resolves to.
 * The preference is written to `<html data-theme>`; CSS does the rest through
 * `color-scheme` + `light-dark()` tokens. `themeScript` applies the stored value
 * before first paint so there is no flash.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
	const preference = useSyncExternalStore<ThemePreference>(subscribePreference, readStoredPreference, () => 'system');
	const systemTheme = useSyncExternalStore<ResolvedTheme>(
		subscribeSystem,
		() => (darkQuery().matches ? 'dark' : 'light'),
		() => 'light'
	);

	const setPreference = useCallback((next: ThemePreference) => {
		const root = document.documentElement;
		if (next === 'system') root.removeAttribute('data-theme');
		else root.setAttribute('data-theme', next);
		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch {
			// Ignore blocked storage; the attribute still applies for this visit.
		}
		window.dispatchEvent(new Event(CHANGE_EVENT));
	}, []);

	const resolvedTheme: ResolvedTheme = preference === 'system' ? systemTheme : preference;

	const value = useMemo<ThemeContextType>(
		() => ({ preference, resolvedTheme, isDarkMode: resolvedTheme === 'dark', setPreference }),
		[preference, resolvedTheme, setPreference]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Inline, render-blocking script for <head>: applies the stored theme before paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
