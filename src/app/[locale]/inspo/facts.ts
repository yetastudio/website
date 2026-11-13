//! Next Core
import { routing } from '@/i18n/routing';

//! Data
import registry from '../../../../registry.json';

//! Types
import type { ResultFacts } from './mockups/results';

/** Figures the mockups may show, read from the code so they cannot drift from what ships. */
export const getFacts = (): ResultFacts => ({
	locales: routing.locales.length,
	themes: 2,
	components: registry.components.length,
});
