//! React Core
import type { ComponentType, ReactNode } from 'react';

//! Types
import type { ResultFacts } from '../results';

export type VariantId = 'a' | 'b' | 'c' | 'd';

/** One proposal for a shelf: what it is called, the references it is built from, and the mockup. */
export type LibraryVariantDef = {
	id: VariantId;
	/** One or two words, shown in the proposal switcher. */
	label: string;
	/** The one or two Mobbin references this proposal follows, as their site names. */
	refs: string;
	Component: ComponentType<{ facts: ResultFacts }>;
};

/** The serialisable form the client switcher receives: the mockup is already rendered. */
export type ShelfVariant = Omit<LibraryVariantDef, 'Component'> & { node: ReactNode };
