//! Data
import { CURSOR_IDLE_MS } from './shared';

/**
 * The cursor every Why Yeta scene plays with. It is never seen: the scene drives it through its
 * story, and the tour's own cursor (Yeta's glyph and badge) follows it frame by frame, so the
 * hand that hovers a chip is the one that clicks and types inside its scene. It waits at the
 * panel's top corner, where the tour cursor joins it.
 */
export const sceneCursor = {
	at: { x: 236, y: 30 },
	style: 'yeta' as const,
	idle: CURSOR_IDLE_MS,
	ripple: true,
};
