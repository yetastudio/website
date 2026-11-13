'use client';

//! React Core
import type { ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Bar, Connector, Segmented, Stage, Window, type Act } from '@stageshow';
import { Text } from '@/components/ui';
import { DesignFrame, FlowNode, Note, ReleaseRow, ToolMark, type Tool } from './parts';

//! Data
import { CRAFT_HUES, SCENE_COPY, type CraftStep } from './data';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import look from './look.module.css';
import styles from './bento.module.css';

/*
 * Alternative C: a bento where Design with intention leads with the only moving scene and
 * the other beats are stills of different kinds: an object (the idea's notes), a diagram
 * (the path), a collection (the tools), a component (the releases) and a statement (the
 * impact). One Stage per picture, copy outside it at page size, every tile on one neutral
 * ground with the beat's hue as its one mark.
 */

// ───────────── Lead: Design with intention ─────────────
// A browser on the tile, pinned a gutter from the top and sides and off the bottom: a
// client's booking page, with a Wireframe / Design switch in its toolbar. Beats: the cursor
// picks Wireframe and the page drops to its structure; it picks Design and the page takes
// its voice back, in reading order. Poster: the designed page.

type LeadState = { mode: 'wire' | 'design' };
const LEAD_POSTER: LeadState = { mode: 'design' };

async function leadScript(a: Act<LeadState>) {
	await a.wait(2200);
	a.mark('wire');
	await a.click('lead-wire');
	await a.set({ mode: 'wire' });
	await a.wait(1300);
	a.mark('design');
	await a.click('lead-design');
	await a.set({ mode: 'design' });
	await a.wait(600);
	await a.move('rest');
	await a.wait(1600);
}

function LeadScene() {
	const copy = SCENE_COPY.intention;
	return (
		<Stage<LeadState>
			width={520}
			height={268}
			compact={{ below: 480, width: 326, height: 248 }}
			initial={LEAD_POSTER}
			poster={LEAD_POSTER}
			script={leadScript}
			cursor={{ at: 'rest', style: 'yeta', ripple: true }}
			className={styles.leadStage}
		>
			{(s, _rect, layout) => (
				<>
					<Window
						url={layout === 'wide' ? copy.url : undefined}
						urlShape="pill"
						lights="grey"
						className={styles.browser}
						toolbar={
							<Segmented
								items={[copy.wire, copy.design]}
								value={s.mode === 'wire' ? 0 : 1}
								targets={['lead-wire', 'lead-design']}
								className={styles.modes}
							/>
						}
					>
						<div className={styles.page}>
							<DesignFrame mode={s.mode} slots className={styles.hero} />
							<div className={styles.features} data-mode={s.mode}>
								{[0, 1, 2].map((i) => (
									<div key={i} className={styles.feature}>
										<Bar w={18} h={18} r={5} tone={2} />
										<Bar w={i === 1 ? 64 : 78} h={5} tone={3} />
										<Bar w={i === 2 ? 52 : 90} h={4} tone={2} />
									</div>
								))}
							</div>
						</div>
					</Window>
					<span data-target="rest" className={styles.rest} />
				</>
			)}
		</Stage>
	);
}

// ───────────── Stills ─────────────

/** The idea: three notes gathered in a loose pile, only the top one written. */
function IdeaStill() {
	return (
		<Stage width={260} height={150} className={styles.stillStage}>
			{() => (
				<div className={styles.pile}>
					<Note className={styles.pileBack} bars={[52, 36]} />
					<Note className={styles.pileMid} bars={[44, 56]} />
					<Note className={styles.pileTop} words={SCENE_COPY.idea.note} hued />
				</div>
			)}
		</Stage>
	);
}

/** The path: three pages and the lines between them, the goal lit. */
function PathStill() {
	const copy = SCENE_COPY.path;
	return (
		<Stage width={260} height={150} className={cx(styles.stillStage, styles.onGutter)}>
			{(_s, rect) => {
				const home = rect('s-home');
				const services = rect('s-services');
				const book = rect('s-book');
				return (
					<>
						<FlowNode data-target="s-home" className={styles.sHome} label={copy.home} />
						<FlowNode data-target="s-services" className={styles.sServices} label={copy.services} />
						<FlowNode data-target="s-book" className={styles.sBook} label={copy.book} goal />
						<Connector
							show
							route="h"
							radius={6}
							from={{ x: home.x + home.width, y: home.y + home.height / 2 }}
							to={{ x: services.x + services.width / 2, y: services.y }}
						/>
						<Connector
							show
							route="h"
							radius={6}
							from={{ x: services.x + services.width, y: services.y + services.height / 2 }}
							to={{ x: book.x + book.width / 2, y: book.y + book.height }}
						/>
					</>
				);
			}}
		</Stage>
	);
}

/** The releases: a changelog card pinned under the copy, off the tile's foot. */
function LegacyStill() {
	const copy = SCENE_COPY.legacy;
	return (
		<Stage width={260} height={150} className={cx(styles.stillStage, styles.onGutter)}>
			{() => (
				<div className={cx(look.panel, styles.log)}>
					<ReleaseRow version={copy.latest.version} note={copy.latest.note} latest />
					{copy.past.slice(0, 2).map((release) => (
						<ReleaseRow key={release.version} version={release.version} note={release.note} className={styles.rule} />
					))}
					<div className={cx(styles.rule, styles.filler)}>
						<Bar w={26} h={12} r={4} tone={2} />
						<Bar w={56} h={5} tone={2} />
					</div>
				</div>
			)}
		</Stage>
	);
}

/** The tools: their real marks on small tiles, one row running off the tile's right edge. */
const TOOLS: Tool[] = ['figma', 'nextjs', 'react', 'vercel', 'slack', 'loom'];

function ToolsCollection() {
	return (
		<div className={styles.collection}>
			<div className={styles.collectionRow}>
				{TOOLS.map((tool) => (
					<span key={tool} className={styles.markTile}>
						<ToolMark tool={tool} className={styles.bigMark} />
					</span>
				))}
			</div>
		</div>
	);
}

// ───────────── Grid ─────────────

function Tile({ step, span, picture, children }: { step: CraftStep; span?: 'lead' | 'wide'; picture?: ReactNode; children: ReactNode }) {
	return (
		<li className={cx(styles.tile, look.root, look.hued, 'u-outline')} data-span={span} data-hue={CRAFT_HUES[step]}>
			<div className={styles.copy}>{children}</div>
			{picture && (
				<div className={styles.picture} aria-hidden="true">
					{picture}
				</div>
			)}
		</li>
	);
}

/** Run-in tile copy: the beat's title, then its subtitle in the quieter ink, at page size. */
function RunIn({ step }: { step: CraftStep }) {
	const t = useTranslations('ourCraft');
	return (
		<Text size="lg" leading="snug" tone="subtle">
			<Text as="strong" size="lg" weight="medium" tone="strong">
				{t(`cards.${step}.title`)}
			</Text>{' '}
			{t(`cards.${step}.subtitle`)}
		</Text>
	);
}

export function CraftBentoMockup() {
	const t = useTranslations('ourCraft');
	return (
		<div className={styles.container}>
			<ul className={styles.grid}>
				<Tile step="intention" span="lead" picture={<LeadScene />}>
					<RunIn step="intention" />
				</Tile>
				<Tile step="idea" picture={<IdeaStill />}>
					<RunIn step="idea" />
				</Tile>
				<Tile step="path" picture={<PathStill />}>
					<RunIn step="path" />
				</Tile>
				<Tile step="tech" picture={<ToolsCollection />}>
					<RunIn step="tech" />
				</Tile>
				<Tile step="legacy" picture={<LegacyStill />}>
					<RunIn step="legacy" />
				</Tile>
				<Tile step="impact" span="wide">
					<span className={styles.statementRule} aria-hidden="true" />
					<Text size="3xl" family="serif" weight="regular" leading="tight" tone="strong">
						{t('cards.impact.title')}
					</Text>
					<Text size="md" tone="subtle" leading="normal" className={styles.statementNote}>
						{t('cards.impact.description')}
					</Text>
				</Tile>
			</ul>
		</div>
	);
}

export default CraftBentoMockup;
