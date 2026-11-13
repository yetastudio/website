'use client';

//! React Core
import { createContext, useContext } from 'react';

/**
 * True inside a proposal that is not the one on show. Self-running mockups read it (through
 * useAutoplay) and hold still, so the hidden proposals never tick in the background.
 */
export const VariantHiddenContext = createContext(false);

export const useVariantHidden = () => useContext(VariantHiddenContext);
