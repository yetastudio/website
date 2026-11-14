import { useMemo } from 'react';
import { Avatar, Button, Collapse, Stage, Text, type Act } from '@stageshow';
import { SendHorizontal } from 'lucide-react';

import { LogoMark } from '@/components/ui/brand';

import { sceneCursor } from './cursor';
import { ENTRY_MS, SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './together.module.css';

// Made to work together: a review thread between the client and the studio.
// The client's question is there. Yeta's cursor (the tour's, handed over) steps
// into the reply field, types a warm answer and sends it; the reply lands in
// the thread under the question, and the client writes back to thank them. The
// poster is the whole exchange with an empty field.
//
// Real strings: the question, the reply, the thanks.

type S = { focus: boolean; draft: string; reply: boolean; thanks: boolean };

const INITIAL: S = { focus: false, draft: '', reply: false, thanks: false };
const POSTER: S = { focus: false, draft: '', reply: true, thanks: true };

const scriptFor = (reply: string) =>
	async function script(a: Act<S>) {
		await a.wait(ENTRY_MS);
		a.mark('field');
		await a.click('field');
		await a.set({ focus: true });
		await a.type('draft', reply, { interval: 30 });
		await a.wait(180);
		a.mark('send');
		await a.click('send');
		await a.set({ reply: true, draft: '', focus: false });
		await a.wait(620);
		a.mark('thanks');
		await a.set({ thanks: true });
		await a.wait(300);
	};

export function TogetherScene({ copy, playing }: { copy: WhyTourCopy['together']; playing: boolean }) {
	const script = useMemo(() => scriptFor(copy.reply), [copy.reply]);
	return (
		<Stage<S>
			width={SCENE_WIDTH}
			height={SCENE_HEIGHT}
			initial={INITIAL}
			poster={POSTER}
			script={playing ? script : undefined}
			cursor={playing ? sceneCursor : undefined}
			play="once"
		>
			{(s) => (
				<div className={look.panel}>
					<div className={styles.row}>
						<Avatar name="Ana" size={20} />
						<Text className={look.strong}>{copy.ask}</Text>
					</div>
					<Collapse open={s.reply} reveal="drop">
						<div className={styles.next}>
							<div className={styles.row}>
								<LogoMark size={20} alt="" />
								<Text className={look.strong}>{copy.reply}</Text>
							</div>
						</div>
					</Collapse>
					<Collapse open={s.thanks} reveal="drop">
						<div className={styles.next}>
							<div className={styles.row}>
								<Avatar name="Ana" size={20} />
								<Text className={look.strong}>{copy.thanks}</Text>
							</div>
						</div>
					</Collapse>
					<div className={styles.composer}>
						<div className={styles.field} data-target="field" data-focus={s.focus || undefined}>
							{s.draft ? <span className={styles.draft}>{s.draft}</span> : <span className={styles.placeholder} />}
							{s.focus && <span className={styles.caret} />}
						</div>
						<span data-target="send">
							<Button size="small" variant="primary" icon={<SendHorizontal size={12} strokeWidth={2} aria-hidden />} />
						</span>
					</div>
				</div>
			)}
		</Stage>
	);
}
