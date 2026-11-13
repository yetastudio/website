import { Avatar, Badge, Bar, Stage, Text, type Act } from '@stageshow';
import { Tag } from 'lucide-react';

import { SCENE_HEIGHT, SCENE_WIDTH, sceneCursor, type SceneCopy } from './shared';
import look from './look.module.css';
import styles from './discover.module.css';

// Discover: research notes. Interview notes hang off the tile's top-left
// corner, one quote among the transcript. Beats: the cursor drag-selects the
// quote (the highlight stays under the I-beam), the selection turns into a
// highlight, and an Insight tag lands at the end of the line. The poster is
// that tagged quote. Loop: the tag lifts off and the highlight clears (the
// last change first), then the quote is found again.
//
// Real strings: the doc title, the quote, the tag.

type S = { sel: number; hl: 'none' | 'select' | 'mark'; tag: boolean };

/** Past the end of any quote: the whole line is selected. */
const ALL = 999;
const POSTER: S = { sel: ALL, hl: 'mark', tag: true };

async function script(a: Act<S>) {
	await a.wait(2200);
	// Reset around the anchor: the tag leaves, then the highlight clears
	a.mark('reset');
	await a.set({ tag: false });
	await a.wait(90);
	await a.set({ hl: 'none' });
	await a.wait(420);
	a.put({ sel: 0 });
	await a.wait(260);

	// Find the quote and select it, the highlight under the I-beam
	a.mark('select');
	const start = a.rect('q-start');
	const end = a.rect('q-end');
	await a.move({ x: start.x + 1, y: start.y + start.height / 2 });
	await a.wait(220);
	a.put({ hl: 'select' });
	await a.drag({ x: end.x + 1, y: end.y + end.height / 2 }, (at) => a.put({ sel: Math.max(0, a.caret('quote', at)) }), {
		duration: 1100,
	});
	a.put({ sel: ALL });
	await a.wait(260);

	// The selection becomes a highlight, and the tag lands on it
	a.mark('tag');
	await a.set({ hl: 'mark' });
	await a.wait(240);
	await a.set({ tag: true });
	await a.wait(380);
	await a.move('rest');
	await a.wait(1200);
}

export function DiscoverScene({ copy }: { copy: SceneCopy['discover'] }) {
	return (
		<Stage<S>
			width={SCENE_WIDTH}
			height={SCENE_HEIGHT}
			initial={POSTER}
			poster={POSTER}
			script={script}
			cursor={sceneCursor('rest')}
			className={styles.stage}
		>
			{(s) => (
				<>
					<div className={`${look.panel} ${styles.doc}`}>
						<div className={styles.head}>
							<Avatar name="Sofia" size={20} />
							<Text className={look.strong}>{copy.doc}</Text>
							<Bar w={44} h={5} tone={2} className={styles.date} />
						</div>
						<div className={styles.lines}>
							<Bar w={212} h={5} tone={2} />
							<Bar w={168} h={5} tone={2} />
						</div>
						<div className={styles.quoteRow}>
							<div className={`${look.strong} ${styles.quote}`} data-target="quote" data-cursor="ibeam">
								<span data-target="q-start" className={styles.anchor} />
								<span className={styles.sel} data-hl={s.hl}>
									{copy.quote.slice(0, s.sel)}
								</span>
								{copy.quote.slice(s.sel)}
								<span data-target="q-end" className={styles.anchor} />
							</div>
							<span className={styles.tag} data-on={s.tag || undefined}>
								<Badge tone="accent" icon={<Tag size={10} strokeWidth={2} aria-hidden />}>
									{copy.tag}
								</Badge>
							</span>
						</div>
						<div className={styles.lines}>
							<Bar w={196} h={5} tone={2} />
							<Bar w={232} h={5} tone={2} />
							<Bar w={140} h={5} tone={2} />
						</div>
					</div>
					<span data-target="rest" className={styles.rest} />
				</>
			)}
		</Stage>
	);
}
