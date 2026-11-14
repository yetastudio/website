//! Components
import { Cell, ShowcaseSection, SpecTable, Specimen, ThemePair } from '@/components/showcase';
import { Accent, Heading, Text } from '@/components/ui/text';
import { Icon, iconNames } from '@/components/ui/icon';
import { Surface } from '@/components/ui/surface';

//! Styles
import styles from './styles.module.css';

const palette: Array<{ name: string; steps: Array<[string, string]> }> = [
	{
		name: 'Neutral',
		steps: [
			['50', '#f5f6f4'],
			['100', '#e4e5e0'],
			['200', '#d8dad3'],
			['300', '#c5c7bc'],
			['600', '#60615c'],
			['900', '#111307'],
			['925', '#0f1108'],
			['950', '#0a0b04'],
			['975', '#060703'],
		],
	},
	{ name: 'Pink', steps: [['300', '#ff97b1'], ['400', '#ff5d88'], ['500', '#ff2465'], ['600', '#ff0558'], ['900', '#57001e']] },
	{ name: 'Orange', steps: [['300', '#ffb76f'], ['400', '#ff8d35'], ['500', '#ff6e0e'], ['600', '#fb5607'], ['900', '#80290e']] },
	{ name: 'Yellow', steps: [['300', '#fff243'], ['400', '#ffe31c'], ['500', '#efc803'], ['600', '#ce9c00'], ['900', '#734710']] },
	{ name: 'Green', steps: [['300', '#79fcaf'], ['400', '#38f083'], ['500', '#0fe166']] },
	{ name: 'Blue', steps: [['300', '#83e0ff'], ['400', '#48ccff'], ['500', '#1eadff'], ['600', '#0690ff'], ['950', '#0e325d']] },
	{
		name: 'Violet',
		steps: [['200', '#dcd8fc'], ['300', '#c2b9f9'], ['400', '#a491f4'], ['500', '#8664ee'], ['600', '#7543e3'], ['700', '#6632cf'], ['950', '#2b1560']],
	},
	{ name: 'Red', steps: [['400', '#ff6764']] },
];

const surfaceRoles = [
	['--color-surface', 'Page canvas'],
	['--color-surface-raised', 'One step above the canvas'],
	['--color-surface-control', 'Buttons, inputs'],
	['--color-surface-control-hover', 'Control, hovered'],
	['--color-surface-control-pressed', 'Control, pressed'],
	['--color-surface-glass', 'Nav pill, toasts (with blur)'],
	['--color-surface-tint', 'Chips, wells'],
	['--color-surface-inverse', 'Tooltip, selected'],
] as const;

const textRoles = [
	['--color-text-strong', 'Headings, key values'],
	['--color-text', 'Body copy'],
	['--color-text-subtle', 'Secondary copy, meta'],
	['--color-text-faint', 'Placeholders, captions'],
	['--color-text-link', 'Inline links'],
	['--color-danger-text', 'Error messages'],
] as const;

const typeScale = [
	['display', 'clamp 56 → 96', 'Hero wordmark'],
	['5xl', '64', ''],
	['4xl', '48', 'Section titles'],
	['3xl', '40', ''],
	['2xl', '32', 'Card titles (serif)'],
	['xl', '24', ''],
	['lg', '20', 'Lead copy'],
	['md', '16', 'Body, nav, CTA buttons'],
	['sm', '14', 'Button Large, chip Large'],
	['xs', '12', 'Button Medium, captions'],
	['2xs', '10', 'Button Small, chip Small'],
] as const;

const spaceScale = [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96, 128];
const radii = [
	['xs', '5px', 'Button Radius=Default'],
	['sm', '8px', 'Segments, small wells'],
	['md', '12px', 'Button Radius=Rounded, nav pill, inputs'],
	['lg', '16px', 'Inner card media'],
	['xl', '20px', 'Cards'],
	['2xl', '24px', 'Dialogs, large panels'],
	['pill', '999px', 'Chips, toggles'],
] as const;

const motion = [
	['instant', '0ms', '—', 'Press feedback (scale 0.98)'],
	['micro', '150ms', 'ease-out', 'Hover fills, colour changes'],
	['enter', '320ms', 'ease-out', 'Toasts, tooltips, carousel slides'],
	['exit', '200ms', 'ease-out', 'Anything leaving, always shorter than enter'],
	['overlay', '420ms', 'ease-sheet', 'Dialogs and sheets'],
	['collapse', '260ms', 'ease-out', 'Accordion panels, chevrons'],
] as const;

export function Foundations() {
	return (
		<>
			<ShowcaseSection
				id="color"
				eyebrow="Foundations"
				title="Color"
				description="Primitive steps come straight from the Figma variables. Components only read the semantic roles, which resolve per theme through light-dark()."
			>
				<Specimen title="Palette" note="Neutrals carry the interface; hues appear only in icons, card washes and status.">
					<div className={styles.palette}>
						{palette.map((group) => (
							<div key={group.name} className={styles.paletteRow}>
								<Text as="span" size="sm" weight="regular" className={styles.paletteName}>
									{group.name}
								</Text>
								<div className={styles.swatches}>
									{group.steps.map(([step, hex]) => (
										<div key={step} className={styles.swatch}>
											<span className={styles.swatchChip} style={{ background: hex }} />
											<Text as="span" size="2xs" tone="subtle">
												{step}
											</Text>
											<Text as="span" size="2xs" tone="faint">
												{hex}
											</Text>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</Specimen>

				<Specimen title="Surface roles">
					<ThemePair layout="grid" align="start">
						{surfaceRoles.map(([token, use]) => (
							<div key={token} className={styles.role}>
								<span className={styles.roleChip} style={{ background: `var(${token})` }} />
								<Text as="code" size="2xs" tone="strong" className={styles.code}>
									{token.replace('--color-', '')}
								</Text>
								<Text as="span" size="2xs" tone="subtle">
									{use}
								</Text>
							</div>
						))}
					</ThemePair>
				</Specimen>

				<Specimen title="Text roles">
					<ThemePair layout="column" align="start">
						{textRoles.map(([token, use]) => (
							<div key={token} className={styles.textRole}>
								<Text as="span" size="lg" weight="regular" style={{ color: `var(${token})` }}>
									Aa {use}
								</Text>
								<Text as="code" size="2xs" tone="faint" className={styles.code}>
									{token}
								</Text>
							</div>
						))}
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="typography"
				eyebrow="Foundations"
				title="Typography"
				description={
					<>
						Funnel Display sets everything at −3% tracking. PP Editorial New is the editorial voice: card titles and the
						occasional <Accent>emphasised</Accent> word.
					</>
				}
			>
				<Specimen title="Families">
					<ThemePair layout="column" align="start">
						<Text size="3xl" weight="medium" tone="display" leading="tight">
							Funnel Display
						</Text>
						<Text size="sm" tone="subtle">
							Light 300 · Regular 400 · Medium 500 · Bold 700
						</Text>
						<Text size="3xl" family="serif" leading="none">
							PP Editorial New <Accent>Italic</Accent>
						</Text>
						<Text size="sm" tone="subtle">
							Ultralight 200 · Regular 400 · Italic 400
						</Text>
					</ThemePair>
				</Specimen>
				<Specimen title="Scale">
					<div className={styles.typeScale}>
						{typeScale.map(([step, px, use]) => (
							<div key={step} className={styles.typeRow}>
								<Text as="span" size="xs" tone="faint" className={styles.typeMeta}>
									{step} · {px}
								</Text>
								<Text as="span" size={step} weight={step === 'display' || step.endsWith('xl') ? 'medium' : 'light'} leading="tight" className={styles.typeSample}>
									{use || 'Because great brands'}
								</Text>
							</div>
						))}
					</div>
				</Specimen>
				<Specimen title="Pairing">
					<ThemePair layout="column">
						<Heading level={3} size="4xl" tone="display" align="center">
							Our Craft
						</Heading>
						<Text align="center" size="lg" balance>
							Get a <Accent underline>free consultation</Accent> and find out the difference.
						</Text>
						<Text family="serif" size="2xl" align="center" leading="none">
							Starts with an idea.
						</Text>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection id="space" eyebrow="Foundations" title="Space, radius & elevation">
				<Specimen title="Spacing scale" note="Named by pixel value, stored in rem.">
					<div className={styles.spaceScale}>
						{spaceScale.map((step) => (
							<div key={step} className={styles.spaceRow}>
								<Text as="code" size="2xs" tone="subtle" className={styles.code}>
									--space-{step}
								</Text>
								<span className={styles.spaceBar} style={{ width: `var(--space-${step})` }} />
							</div>
						))}
					</div>
				</Specimen>
				<Specimen title="Radius">
					<ThemePair layout="grid" align="start">
						{radii.map(([name, value, use]) => (
							<Cell key={name} label={`${name} · ${value}`}>
								<Surface tone="raised" radius={name} className={styles.radiusBox} title={use} />
							</Cell>
						))}
					</ThemePair>
				</Specimen>
				<Specimen title="Bevel" note="Every control and card carries the same hairline gradient stroke and inset light. Use the .u-bevel utility or Surface.">
					<ThemePair>
						<Cell label="canvas">
							<Surface tone="canvas" radius="xl" className={styles.bevelBox} />
						</Cell>
						<Cell label="raised">
							<Surface tone="raised" radius="xl" className={styles.bevelBox} />
						</Cell>
						<Cell label="tint">
							<Surface tone="tint" radius="xl" className={styles.bevelBox} />
						</Cell>
						<Cell label="glass">
							<Surface tone="glass" radius="xl" className={styles.bevelBox} />
						</Cell>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection id="motion" eyebrow="Foundations" title="Motion" description="Animate transform and opacity only. Enters ease out; exits are shorter. All presets drop to 0ms under prefers-reduced-motion.">
				<SpecTable
					columns={['Preset', 'Duration', 'Easing', 'Use']}
					rows={motion.map(([name, duration, easing, use]) => [<code key="n">--duration-{name}</code>, duration, easing, use])}
				/>
			</ShowcaseSection>

			<ShowcaseSection
				id="icons"
				eyebrow="Foundations"
				title="Iconography"
				description="27 brand glyphs from the Figma library on a 24px grid with 1.5px strokes, plus a few supplemental Lucide icons at the same weight. Sizes: sm 14 · md 18 · lg 20 · xl 24."
			>
				<ThemePair layout="grid" align="start">
					{iconNames.map((name) => (
						<Cell key={name} label={name}>
							<Icon name={name} size="xl" />
						</Cell>
					))}
				</ThemePair>
			</ShowcaseSection>
		</>
	);
}
