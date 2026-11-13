//! Components
import { TestimonialsGlass, TestimonialsPortrait, TestimonialsTabs } from './testimonials-live';

//! Types
import type { LibraryVariantDef } from './variant-types';

/** The proposals for this shelf, in switcher order. Every one is live, so they all live in testimonials-live. */
export const TESTIMONIAL_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Portrait', refs: 'Harvey', Component: TestimonialsPortrait },
	{ id: 'b', label: 'Name tabs', refs: 'Paraform', Component: TestimonialsTabs },
	{ id: 'c', label: 'Glass', refs: 'Amigo', Component: TestimonialsGlass },
];
