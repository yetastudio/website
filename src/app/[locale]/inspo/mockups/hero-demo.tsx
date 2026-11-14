'use client';

//! Components
import { Bar, Stage, Window, type Act } from '@stageshow';
import { Icon } from '@/components/ui/icon';
import { LogoMark } from '@/components/ui/brand';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './scenes.module.css';

// Proposal 01, hero product demo. The Yeta landing in a browser window under
// the slogan. Beats: the arrow goes to the page's own theme switch, picks the
// sun, and the light browser opens out of the switch in a circle over the
// dark one; a beat later it picks the moon and the dark one opens back over it.
// The poster is the dark page at rest. Every flip is a click, so the loop
// ends where it began with a visible cause.
//
// Real strings: the address, the wordmark, the slogan, the call to action.

type Scheme = 'light' | 'dark';
type S = { front: Scheme; open: boolean };

const POSTER: S = { front: 'dark', open: true };

async function flip(a: Act<S>, to: Scheme) {
	a.mark(to);
	await a.move(to === 'light' ? 'sun' : 'moon');
	await a.wait(180);
	await a.click();
	// The new page goes on top, closed to a point on the switch, then opens out of it
	await a.snap({ front: to, open: false });
	await a.set({ open: true });
}

async function script(a: Act<S>) {
	await a.wait(1300);
	await flip(a, 'light');
	await a.wait(1900);
	await flip(a, 'dark');
	await a.wait(300);
	await a.move('rest');
	await a.wait(1200);
}

/** The landing, in miniature, in one scheme. */
function MiniLanding({ scheme }: { scheme: Scheme }) {
	return (
		<div className={styles.heroPage}>
			<div className={cx(styles.heroNav, 'u-bevel')}>
				<LogoMark canvas={scheme} size={14} alt="" />
				<Bar w={22} h={4} tone={3} />
				<Bar w={30} h={4} tone={3} />
				<Bar w={18} h={4} tone={3} />
				<span className={cx(styles.heroSwitch, 'u-bevel')}>
					<span className={styles.heroSwitchItem} data-target="sun" data-on={scheme === 'light' || undefined}>
						<Icon name="sun" size="sm" />
					</span>
					<span className={styles.heroSwitchItem} data-target="moon" data-on={scheme === 'dark' || undefined}>
						<Icon name="moon" size="sm" />
					</span>
				</span>
			</div>
			<div className={styles.heroWordmark}>
				<span className={styles.heroWord}>Yeta</span>
				<LogoMark canvas={scheme} size={30} alt="" />
				<span className={styles.heroWord}>Studio</span>
			</div>
			<p className={styles.heroSlogan}>
				because <em>great</em> brands aren’t built on <em>luck</em>.
			</p>
			<span className={cx(styles.heroCta, 'u-bevel')}>Let’s build something</span>
			<div className={styles.heroTiles} aria-hidden="true">
				<span className={styles.heroTile} data-hue="pink" />
				<span className={styles.heroTile} data-hue="yellow" />
				<span className={styles.heroTile} data-hue="blue" />
			</div>
		</div>
	);
}

export function HeroDemoMockup() {
	return (
		<div
			className={styles.frame}
			role="img"
			aria-label="Mockup: the Yeta landing in a browser window; the cursor uses the page's theme switch and the page flips between light and dark."
		>
			<Stage<S>
				width={520}
				height={300}
				compact={{ below: 440, width: 340, height: 280 }}
				initial={POSTER}
				poster={POSTER}
				script={script}
				cursor={{ at: 'rest', ripple: true }}
				className={styles.heroStage}
			>
				{(s, rect) => {
					const pick = rect(s.front === 'light' ? 'sun' : 'moon');
					const origin = pick.width > 0 ? `${pick.x + pick.width / 2}px ${pick.y + pick.height / 2}px` : '100% 0';
					return (
						<>
							{/* The whole browser wears the page's scheme: two copies stacked, the front one opens out of the switch. */}
							{(['dark', 'light'] as const).map((scheme) => (
								<div
									key={scheme}
									className={cx(styles.heroLayer, scheme === 'dark' ? 'scheme-dark' : 'scheme-light')}
									data-front={s.front === scheme || undefined}
									data-open={s.open || undefined}
									style={{ ['--reveal-at' as string]: origin }}
								>
									<Window url="yeta.studio" urlShape="pill" className={styles.heroWindow}>
										<MiniLanding scheme={scheme} />
									</Window>
								</div>
							))}
							<span data-target="rest" className={styles.heroRest} />
						</>
					);
				}}
			</Stage>
		</div>
	);
}

export default HeroDemoMockup;
