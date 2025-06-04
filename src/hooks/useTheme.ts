//! React Core
import { useContext } from 'react';

//! Context
import { ThemeContext } from '../context/ThemeContext';

//? Custom hook for accessing the theme context.
export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
