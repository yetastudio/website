/**
 * Class for the Nth staggered line inside a Reveal (1–4): `<h2 className={revealLine(1)}>`.
 * Lives outside the client component so server components can call it.
 */
export function revealLine(index: 1 | 2 | 3 | 4) {
	return `t-stagger-line t-stagger-line--${index}`;
}
