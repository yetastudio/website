import { Avatar, Bar, Badge, Collapse, Stage, States, Text, type Act } from '@stageshow';
import { Check } from 'lucide-react';

import { LogoMark } from '@/components/ui/brand';

import { SCENE_HEIGHT, SCENE_WIDTH, type WhyTourCopy } from './shared';
import look from './look.module.css';
import styles from './together.module.css';

// Made to work together: a review thread between the client and the studio.
// The client's question is there; the studio's reply opens under it (typing,
// then the words), and the thread is marked Resolved. Yeta answers with its
// own mark. The poster is the answered, resolved thread.
//
// Real strings: the question, the reply, Resolved.

type S = { reply: boolean; typed: boolean; resolved: boolean };

const INITIAL: S = { reply: false, typed: false, resolved: false };
const POSTER: S = { reply: true, typed: true, resolved: true };

async function script(a: Act<S>) {
	await a.wait(350);
	a.mark('typing');
	await a.set({ reply: true });
	await a.wait(650);
	a.mark('reply');
	await a.set({ typed: true });
	await a.wait(450);
	a.mark('resolved');
	await a.set({ resolved: true });
	await a.wait(450);
}

export function TogetherScene({ copy, playing }: { copy: WhyTourCopy['together']; playing: boolean }) {
	return (
		<Stage<S>
			width={SCENE_WIDTH}
			height={SCENE_HEIGHT}
			initial={INITIAL}
			poster={POSTER}
			script={playing ? script : undefined}
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
								<States
									value={s.typed ? 'text' : 'typing'}
									align="start"
									states={{
										typing: (
											<span className={styles.typing}>
												<span />
												<span />
												<span />
											</span>
										),
										text: <Text className={look.strong}>{copy.reply}</Text>,
									}}
								/>
							</div>
						</div>
					</Collapse>
					<Collapse open={s.resolved} reveal="drop">
						<div className={`${styles.next} ${styles.resolved}`}>
							<Badge icon={<Check size={10} strokeWidth={2.5} aria-hidden className={styles.tick} />}>{copy.resolved}</Badge>
						</div>
					</Collapse>
					<div className={styles.after}>
						<Bar w={188} h={5} tone={2} />
						<Bar w={132} h={5} tone={2} />
					</div>
				</div>
			)}
		</Stage>
	);
}
