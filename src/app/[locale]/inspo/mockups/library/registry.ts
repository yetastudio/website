//! Library
import { ABOUT_VARIANTS } from './about';
import { CASE_VARIANTS } from './case';
import { CRAFT_VARIANTS } from './craft';
import { CTA_VARIANTS } from './cta';
import { FOOTER_VARIANTS } from './footer';
import { HERO_VARIANTS } from './hero';
import { NAV_VARIANTS } from './nav';
import { PROCESS_VARIANTS } from './process';
import { RESULTS_VARIANTS } from './results';
import { TESTIMONIAL_VARIANTS } from './testimonials';
import { WHY_VARIANTS } from './why';
import { WORK_VARIANTS } from './work';

//! Types
import type { ShelfId } from '../../data';
import type { LibraryVariantDef } from './variant-types';

/** Three proposals per library shelf, each following one or two of its references. */
export const SHELF_VARIANTS: Record<ShelfId, LibraryVariantDef[]> = {
	nav: NAV_VARIANTS,
	hero: HERO_VARIANTS,
	value: WHY_VARIANTS,
	services: CRAFT_VARIANTS,
	work: WORK_VARIANTS,
	process: PROCESS_VARIANTS,
	stats: RESULTS_VARIANTS,
	testimonials: TESTIMONIAL_VARIANTS,
	about: ABOUT_VARIANTS,
	cta: CTA_VARIANTS,
	footer: FOOTER_VARIANTS,
	case: CASE_VARIANTS,
};
