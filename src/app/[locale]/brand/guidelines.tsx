/* eslint-disable @next/next/no-img-element -- brand SVG specimens are shown at exact sizes. */

//! Components
import { Cell, ShowcaseLayout, ShowcaseNav, ShowcaseSection, SpecTable, Specimen, ThemePair } from '@/components/showcase';
import { Accent, Heading, Text } from '@/components/ui/text';
import { BrandMark, LogoMark, MessyBrandMark } from '@/components/ui/brand';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Surface } from '@/components/ui/surface';
import { GuidelineCard } from './guideline-card';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

const navItems = [
	{ id: 'marks', label: 'Marks', group: 'Identity' },
	{ id: 'clear-space', label: 'Clear space & size', group: 'Identity' },
	{ id: 'color', label: 'Color', group: 'Identity' },
	{ id: 'typography', label: 'Typography', group: 'Identity' },
	{ id: 'voice', label: 'Voice & copy', group: 'Identity' },
	{ id: 'elements', label: 'Graphic elements', group: 'Identity' },
	{ id: 'dos-donts', label: 'Do’s & don’ts', group: 'Usage' },
	{ id: 'assets', label: 'Asset files', group: 'Usage' },
];

const marks = [
	{
		name: 'Logo Mark',
		role: 'The ✹ sunburst on a bevelled tile. The symbol of the studio: favicon, avatar, hero, social thumbnails.',
		render: (canvas: 'light' | 'dark') => <LogoMark canvas={canvas} size={120} />,
		renderAlt: (canvas: 'light' | 'dark') => <LogoMark canvas={canvas} fill="transparent" size={120} />,
	},
	{
		name: 'Brand Mark',
		role: 'The YETA block monogram. The primary identifier in navigation, footers and signatures.',
		render: (canvas: 'light' | 'dark') => <BrandMark canvas={canvas} size={120} />,
		renderAlt: (canvas: 'light' | 'dark') => <BrandMark canvas={canvas} fill="filled" size={120} />,
	},
	{
		name: 'Messy Brand Mark',
		role: 'The monogram with the E and A rearranged. Expressive moments only: merch, stickers, large editorial spreads.',
		render: (canvas: 'light' | 'dark') => <MessyBrandMark canvas={canvas} size={120} />,
		renderAlt: null,
	},
] as const;

const neutrals = [
	['Neutrals/Dark', '#0a0b04', 'Dark canvas, ink'],
	['Neutrals/Dark Secondary', '#0f1108', 'Light-theme text, dark bands'],
	['Neutrals/Light', '#f5f6f4', 'Highlights, raised light surfaces'],
	['Neutrals/Light Secondary', '#e4e5e0', 'Light canvas, dark-theme text'],
] as const;

const accents = [
	['Pink', '#ff5d88'],
	['Orange', '#ff8d35'],
	['Yellow', '#ffe31c'],
	['Green', '#38f083'],
	['Blue', '#48ccff'],
	['Violet', '#a491f4'],
] as const;

export default function BrandGuidelines() {
	return (
		<ShowcaseLayout nav={<ShowcaseNav label="Brand guideline sections" items={navItems} />}>
			<header className={styles.hero}>
				<LogoMark canvas="auto" size={88} alt="" />
				<div className={styles.heroText}>
					<Chip>Brand guidelines · v1</Chip>
					<Heading level={1} size="5xl" tone="display">
						Yeta ✹ Studio
					</Heading>
					<Text size="lg" tone="subtle">
						because great brands aren’t built on <Accent italic={false}>luck</Accent>. Neither is a brand system. These are the rules that keep
						every page, post and deck recognisably ours, with the examples that show them.
					</Text>
				</div>
			</header>

			<ShowcaseSection
				id="marks"
				eyebrow="Identity"
				title="Marks"
				description="Three marks, one family. Each ships for a light canvas (ink artwork) and a dark canvas (metallic artwork); never mix them up."
			>
				{marks.map((mark) => (
					<Specimen key={mark.name} title={mark.name} note={mark.role}>
						<div className={styles.markGrid}>
							{(['light', 'dark'] as const).map((canvas) => (
								<div key={canvas} data-scheme={canvas} className={cx(styles.markCanvas, canvas === 'light' ? 'scheme-light' : 'scheme-dark', 'u-bevel')}>
									<div className={styles.markRow}>
										{mark.render(canvas)}
										{mark.renderAlt?.(canvas)}
									</div>
									<Text as="span" size="2xs" tone="faint">
										On {canvas} canvas
									</Text>
								</div>
							))}
						</div>
					</Specimen>
				))}
			</ShowcaseSection>

			<ShowcaseSection
				id="clear-space"
				eyebrow="Identity"
				title="Clear space & minimum size"
				description="Keep a quarter of the mark’s width free on every side. Nothing (text, edges, other logos) enters that zone."
			>
				<ThemePair>
					<Cell label="Clear space = ¼ of the mark width">
						<div className={styles.clearSpace}>
							<span className={styles.clearZone} aria-hidden="true" />
							<BrandMark canvas="auto" size={96} />
						</div>
					</Cell>
					<Cell label="Logo Mark tile, same rule">
						<div className={styles.clearSpace}>
							<span className={styles.clearZone} aria-hidden="true" />
							<LogoMark canvas="auto" size={96} />
						</div>
					</Cell>
				</ThemePair>
				<SpecTable
					columns={['Mark', 'Minimum on screen', 'Minimum in print', 'Typical use']}
					rows={[
						['Brand Mark', '24 px', '8 mm', 'Header 60 px desktop, 40 px mobile'],
						['Logo Mark (filled)', '16 px (favicon)', '6 mm', 'Hero tile 96 px, avatars, thumbnails'],
						['Messy Brand Mark', '64 px', '20 mm', 'Large, expressive placements only'],
					]}
				/>
			</ShowcaseSection>

			<ShowcaseSection
				id="color"
				eyebrow="Identity"
				title="Color"
				description="Four neutrals carry the brand. Six hues add light, never weight: they live in icons, card washes and moments of delight, about one tenth of any layout."
			>
				<Specimen title="Neutrals">
					<div className={styles.swatchGrid}>
						{neutrals.map(([name, hex, use]) => (
							<div key={name} className={styles.swatchCard}>
								<span className={styles.swatch} style={{ background: hex }} />
								<Text size="sm" weight="regular">
									{name}
								</Text>
								<Text size="xs" tone="subtle">
									{hex} · {use}
								</Text>
							</div>
						))}
					</div>
				</Specimen>
				<Specimen title="Accents" note="The 400 step on dark canvases; the deeper 600/700 steps on light ones so icons keep their contrast.">
					<div className={styles.swatchGrid}>
						{accents.map(([name, hex]) => (
							<div key={name} className={styles.swatchCard}>
								<span className={styles.swatch} style={{ background: hex }} />
								<Text size="sm" weight="regular">
									{name}
								</Text>
								<Text size="xs" tone="subtle">
									{hex}
								</Text>
							</div>
						))}
					</div>
				</Specimen>
				<Specimen title="Proportion">
					<div className={styles.ratio} aria-label="About 90% neutrals, 10% accents">
						<span className={styles.ratioNeutral}>Neutrals ~90%</span>
						<span className={styles.ratioAccent}>Accents ~10%</span>
					</div>
				</Specimen>
				<Specimen title="Gradients" note="Metallic on dark, ink on light. Only for the wordmark, display titles and the marks themselves.">
					<ThemePair>
						<Text as="span" size="5xl" weight="bold" tone="display" leading="none">
							Yeta Studio
						</Text>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="typography"
				eyebrow="Identity"
				title="Typography"
				description={
					<>
						Funnel Display speaks; PP Editorial New <Accent>whispers</Accent>. The serif only ever appears on a few words, card titles and
						quotes.
					</>
				}
			>
				<ThemePair layout="column" align="start">
					<Text size="xs" tone="faint">
						Display · Funnel Display SemiBold · −3%
					</Text>
					<Text size="5xl" weight="semibold" tone="display" leading="none">
						Yeta Studio
					</Text>
					<Text size="xs" tone="faint">
						Headline · Funnel Display Bold 48/52.8
					</Text>
					<Heading level={3} size="4xl">
						Our Process
					</Heading>
					<Text size="xs" tone="faint">
						Lead · Funnel Display Light 20/30 with Editorial accents
					</Text>
					<Text size="lg">
						We craft experiences that blend <Accent italic={false}>creativity</Accent>, <Accent italic={false}>technology</Accent>, and{' '}
						<Accent italic={false}>strategy</Accent>. Born to <Accent underline>elevate</Accent> your brand.
					</Text>
					<Text size="xs" tone="faint">
						Card title · PP Editorial New Regular
					</Text>
					<Text family="serif" size="2xl" leading="none">
						Design with intention.
					</Text>
				</ThemePair>
			</ShowcaseSection>

			<ShowcaseSection id="voice" eyebrow="Identity" title="Voice & copy" description="Confident, warm and a little playful. We say what we do, then prove it.">
				<SpecTable
					columns={['Principle', 'Write', 'Avoid']}
					rows={[
						['Lead with the belief', 'because great brands aren’t built on luck.', 'Award-winning full-service digital agency'],
						['Sentence case everywhere', 'Schedule consultation', 'SCHEDULE CONSULTATION · Schedule Consultation'],
						['✹ is the separator', 'Yeta ✹ Studio · Founder ✹ NovaTech', 'Yeta • Studio · Yeta | Studio · Yeta ★ Studio'],
						['One editorial word per line', 'Get a free consultation and find out the difference.', 'Every other word in italics'],
						['Our signature question', '¿Why Yeta Studio?', 'Why Yeta Studio?? · WHY YETA'],
					]}
				/>
			</ShowcaseSection>

			<ShowcaseSection
				id="elements"
				eyebrow="Identity"
				title="Graphic elements"
				description="The dot grid canvas, the bevel on every surface, the colour washes and the block letters. Together they read as Yeta even without a logo."
			>
				<ThemePair layout="grid" align="start">
					<Cell label="Dot grid canvas (15 px pitch)">
						<span className={styles.patternSample} />
					</Cell>
					<Cell label="Bevelled surface">
						<Surface tone="canvas" radius="xl" className={styles.elementBox} />
					</Cell>
					<Cell label="Colour wash tile">
						<img src="/landing/our-craft/tile-idea-dark-desktop.svg" alt="" width={96} height={96} className={styles.washSample} />
					</Cell>
					<Cell label="Block letter">
						<img src="/landing/footer/block-y-ink.svg" alt="" width={72} height={72} className="u-only-light" />
						<img src="/landing/footer/block-y-metallic.svg" alt="" width={72} height={72} className="u-only-dark" />
					</Cell>
				</ThemePair>
			</ShowcaseSection>

			<ShowcaseSection
				id="dos-donts"
				eyebrow="Usage"
				title="Do’s & don’ts"
				description="Every example below is rendered live with the real assets and components, so it stays true as the system changes."
			>
				<div className={styles.guidelineGrid}>
					<GuidelineCard verdict="do" title="Use the artwork made for the canvas: ink on light, metallic on dark.">
						<div className={styles.pairSpecimen}>
							<span className="scheme-light" data-scheme="light">
								<BrandMark canvas="light" size={72} />
							</span>
							<span className="scheme-dark" data-scheme="dark">
								<BrandMark canvas="dark" size={72} />
							</span>
						</div>
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Place the light-canvas artwork on a dark background (or the reverse).">
						<div className={cx(styles.solidCanvas, 'scheme-dark')} data-scheme="dark">
							<BrandMark canvas="light" size={72} />
						</div>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Scale the marks proportionally.">
						<LogoMark canvas="auto" size={88} />
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Stretch, squash or skew a mark.">
						<span className={styles.stretched}>
							<LogoMark canvas="auto" size={88} />
						</span>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Keep the marks upright.">
						<BrandMark canvas="auto" size={80} />
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Rotate the marks or set them at an angle.">
						<span className={styles.rotated}>
							<BrandMark canvas="auto" size={80} />
						</span>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Keep the marks in their neutrals.">
						<BrandMark canvas="auto" size={88} />
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Recolour a mark with an accent hue or a new gradient.">
						<span className={styles.recoloured} role="img" aria-label="Brand Mark recoloured in pink and orange" />
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Let the bevel be the only effect.">
						<Button size="2xl" iconEnd="external-link">
							Get in touch
						</Button>
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Add drop shadows, glows or outlines to marks and controls.">
						<span className={styles.glow}>
							<BrandMark canvas="auto" size={80} />
						</span>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Respect the clear space around the mark.">
						<div className={styles.lockup}>
							<BrandMark canvas="auto" size={56} />
							<Text size="sm" tone="subtle">
								Yeta ✹ Studio
							</Text>
						</div>
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Crowd the mark with text or other logos.">
						<div className={cx(styles.lockup, styles.crowded)}>
							<BrandMark canvas="auto" size={56} />
							<Text size="sm" weight="bold">
								YETA STUDIO DIGITAL AGENCY
							</Text>
						</div>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Use one or two editorial words to add a voice.">
						<Text size="lg" align="center">
							Get a <Accent underline>free consultation</Accent> and find out the difference.
						</Text>
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Set whole paragraphs in the serif italic.">
						<Text size="lg" family="serif" italic align="center">
							Get a free consultation and find out the difference with our team today.
						</Text>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Keep accent colours on icons and washes.">
						<Chip size="lg" fill="solid" icon="spark" tone="orange">
							From insight to impact
						</Chip>
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Set body copy or labels in accent colours.">
						<Text size="lg" style={{ color: 'var(--palette-pink-400)' }} align="center">
							From insight to impact
						</Text>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Write labels in sentence case, with ✹ as the separator.">
						<div className={styles.chipRow}>
							<Chip>How we work and what to expect</Chip>
							<Text size="sm">Founder ✹ NovaTech</Text>
						</div>
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Shout in all caps or swap ✹ for other symbols.">
						<div className={styles.chipRow}>
							<Chip>HOW WE WORK AND WHAT TO EXPECT</Chip>
							<Text size="sm">Founder ★ NovaTech</Text>
						</div>
					</GuidelineCard>

					<GuidelineCard verdict="do" title="Save the Messy Brand Mark for big, expressive moments.">
						<MessyBrandMark canvas="auto" size={120} />
					</GuidelineCard>
					<GuidelineCard verdict="dont" title="Use the Messy Brand Mark small, as a favicon or in navigation.">
						<div className={styles.miniNav}>
							<MessyBrandMark canvas="auto" size={20} />
							<Text size="xs">Our Work</Text>
							<Text size="xs">Our Process</Text>
						</div>
					</GuidelineCard>
				</div>
			</ShowcaseSection>

			<ShowcaseSection id="assets" eyebrow="Usage" title="Asset files" description="Exported from the Figma Branding page. Light files are for light canvases; dark files are for dark canvases.">
				<SpecTable
					columns={['Asset', 'Files']}
					rows={[
						['Logo Mark', <code key="l">/brand/logo-mark-{'{light|dark}'}-{'{filled|transparent}'}.svg</code>],
						['Brand Mark', <code key="b">/brand/brand-mark-{'{light|dark}'}-{'{filled|transparent}'}.svg</code>],
						['Messy Brand Mark', <code key="m">/brand/messy-brand-mark-{'{light|dark}'}.svg</code>],
						['Social thumbnails (1200 × 628)', <code key="o">/brand/og/og-*.png</code>],
					]}
				/>
				<div className={styles.downloads}>
					{['logo-mark-light-filled', 'logo-mark-dark-filled', 'brand-mark-light-transparent', 'brand-mark-dark-transparent'].map((file) => (
						<Button key={file} href={`/brand/${file}.svg`} size="lg" iconStart="book" download>
							{file}.svg
						</Button>
					))}
				</div>
				<Text size="sm" tone="subtle" className={styles.note}>
					<Icon name="info" size="sm" /> Need another format? The source lives on the Branding page of the Figma file.
				</Text>
			</ShowcaseSection>
		</ShowcaseLayout>
	);
}
