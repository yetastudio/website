//! React Core
import { useSyncExternalStore } from 'react';

const noSubscribe = () => () => {};

/** False on the server and during hydration, true right after: for content that should only exist on the client. */
export function useHydrated(): boolean {
	return useSyncExternalStore(noSubscribe, () => true, () => false);
}
