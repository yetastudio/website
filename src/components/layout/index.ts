// Page-level sections of the landing. Each one is composed only from the design system in src/components/ui.
// An index, not an import path: pages import each section directly (`@/components/layout/header`),
// so a page that only needs the header doesn't bundle the whole landing. ESLint enforces it.
export { Header } from './header';
export { Hero } from './hero';
export { WhyYeta } from './why-yeta';
export { OurCraft } from './our-craft';
export { OurWork } from './our-work';
export { OurProcess } from './our-process';
export { Testimonials } from './testimonials';
export { Footer } from './footer';
export { SmoothScroll } from './smooth-scroll';
