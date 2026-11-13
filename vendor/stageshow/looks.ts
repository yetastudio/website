import { createContext, useContext } from 'react'

// The look a stage sets for everything inside it: theme, palette, fidelity,
// and which of its designs (wide or compact) is showing. <Stage> provides it;
// parts read it with useLook().

/**
 * glass: frosted, translucent surfaces over a soft color field. yeta: the Yeta
 * Studio design system (yeta.css), this copy's default. Its tokens are the host's
 * light-dark() roles, so it follows the color-scheme the stage sits in (the page
 * theme, a `.scheme-inverse` tile, a pinned showcase panel) with no prop.
 */
export type Theme = 'light' | 'dark' | 'blueprint' | 'glass' | 'yeta'
export type Palette = 'accent' | 'mono'
/** minimal: no text, only shapes. standard: real text where it carries meaning. realistic: real text, logos and avatars everywhere. */
export type Fidelity = 'minimal' | 'standard' | 'realistic'
/** wide: the design size. compact: the smaller design used below `compact.below`. */
export type Layout = 'wide' | 'compact'

export type Look = { theme: Theme; palette: Palette; fidelity: Fidelity; layout: Layout }

export const LookContext = createContext<Look>({
  theme: 'yeta',
  palette: 'accent',
  fidelity: 'standard',
  layout: 'wide',
})
export const useLook = () => useContext(LookContext)
