"use client"

//! React Core
import { createContext, useEffect, useState } from 'react';

//! Types
import { ThemeContextType, ThemeProviderProps } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  //? Checks that the user's system preference theme is dark mode.
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);

    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  //? Provides the user's theme value.
  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
