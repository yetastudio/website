'use client';

//! React Core
import { useState } from 'react';

//! Components
import { Cell, ShowcaseSection, SpecTable, Specimen, ThemePair } from '@/components/showcase';
import { Accent, Heading, Text } from '@/components/ui/text';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { BrandMark, LogoMark } from '@/components/ui/brand';
import { Button } from '@/components/ui/button';
import { Checkbox, Switch } from '@/components/ui/checkbox';
import { Chip } from '@/components/ui/chip';
import { Dialog } from '@/components/ui/dialog';
import { Divider } from '@/components/ui/divider';
import { Input, Textarea } from '@/components/ui/field';
import { Link } from '@/components/ui/link';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { Tooltip } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/toast';

//! Styles
import styles from './styles.module.css';

const sizes = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

export function Primitives() {
	return (
		<>
			<ShowcaseSection
				id="button"
				eyebrow="Components"
				title="Button"
				description="Figma Button: Size Small / Medium / Large × Radius Default / Rounded, Idle and Hovered. The Dark and Light variants are the same component on each canvas. xl (60px) is the landing call to action."
			>
				<Specimen title="Sizes × radius">
					<ThemePair layout="column">
						<div className={styles.row}>
							{sizes.map((size) => (
								<Cell key={size} label={`${size} · rounded`}>
									<Button size={size} iconStart="menu" iconEnd="menu">
										Button
									</Button>
								</Cell>
							))}
						</div>
						<div className={styles.row}>
							{sizes.map((size) => (
								<Cell key={size} label={`${size} · default`}>
									<Button size={size} radius="default" iconStart="menu" iconEnd="menu">
										Button
									</Button>
								</Cell>
							))}
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Variants & states" note="Hover and press are live. Loading keeps the label width and sets aria-busy; disabled uses aria-disabled so focus is kept.">
					<ThemePair>
						<Cell label="solid">
							<Button size="2xl" iconEnd="external-link">
								Get in touch
							</Button>
						</Cell>
						<Cell label="glass">
							<Button size="2xl" variant="glass" iconStart="calendar">
								Schedule consultation
							</Button>
						</Cell>
						<Cell label="ghost · icon only">
							<Button variant="ghost" size="lg" icon="menu" label="Open menu" />
						</Cell>
						<Cell label="loading">
							<Button size="lg" loading>
								Sending
							</Button>
						</Cell>
						<Cell label="disabled">
							<Button size="lg" disabled iconEnd="external-link">
								Unavailable
							</Button>
						</Cell>
						<Cell label="long label">
							<Button size="lg" iconStart="launch">
								Start your project with a free discovery call
							</Button>
						</Cell>
					</ThemePair>
				</Specimen>
				<SpecTable
					columns={['Prop', 'Type', 'Default', 'Notes']}
					rows={[
						[<code key="a">size</code>, 'sm | md | lg | xl | 2xl', 'lg', '30 / 34 / 36 / 48 / 60px tall'],
						[<code key="b">variant</code>, 'solid | glass | ghost', 'solid', 'ghost drops the bevel'],
						[<code key="c">radius</code>, 'default | rounded', 'rounded', '5px / 12px'],
						[<code key="d">iconStart · iconEnd · icon</code>, 'IconName', '—', 'icon renders an icon-only button; pass label'],
						[<code key="e">href</code>, 'string', '—', 'Renders a link; external URLs open in a new tab'],
						[<code key="f">loading · disabled</code>, 'boolean', 'false', 'Both block presses without losing focus'],
					]}
				/>
			</ShowcaseSection>

			<ShowcaseSection id="chip" eyebrow="Components" title="Chip" description="Figma Chip / Badge. xs is Figma Small, sm the section subtitle (Small ×1.2), lg Figma Large, xl the floating feature chip (Large ×1.40625). Interactive chips (as button or link) get the Hovered fill.">
				<ThemePair>
					<Cell label="xs">
						<Chip size="xs">Badge</Chip>
					</Cell>
					<Cell label="sm">
						<Chip>Why brands choose to grow with us</Chip>
					</Cell>
					<Cell label="lg · icon">
						<Chip size="lg" icon="menu">
							Badge
						</Chip>
					</Cell>
					<Cell label="xl · solid · tones">
						<div className={styles.row}>
							<Chip size="xl" fill="solid" icon="spark" tone="orange">
								From insight to impact
							</Chip>
							<Chip size="xl" fill="solid" icon="handshake" tone="yellow">
								Made to work together
							</Chip>
							<Chip size="xl" fill="solid" icon="target" tone="violet">
								Purpose in every pixel
							</Chip>
						</div>
					</Cell>
					<Cell label="interactive">
						<Chip as="button" size="lg" icon="plus">
							Add filter
						</Chip>
					</Cell>
				</ThemePair>
			</ShowcaseSection>

			<ShowcaseSection id="text" eyebrow="Components" title="Text, Heading & Accent" description="The text primitives. Size, weight, tone and family are props; nothing in product code sets font values directly.">
				<ThemePair layout="column" align="start">
					<Heading level={3} size="4xl" tone="display">
						¿Why Yeta Studio?
					</Heading>
					<Text size="lg">
						We craft experiences that blend <Accent italic={false}>creativity</Accent>, <Accent italic={false}>technology</Accent>, and{' '}
						<Accent italic={false}>strategy</Accent>.
					</Text>
					<Text>
						Born to <Accent underline>elevate</Accent> your brand.
					</Text>
					<Text size="xs" tone="subtle">
						Small text · subtle tone · meta and captions
					</Text>
					<Text size="xs" tone="danger">
						Danger text for validation messages
					</Text>
				</ThemePair>
			</ShowcaseSection>

			<ShowcaseSection id="brand-marks" eyebrow="Components" title="Brand marks" description="BrandMark, LogoMark and MessyBrandMark follow the theme automatically (canvas='auto') or can be pinned to a canvas.">
				<ThemePair>
					<Cell label="BrandMark · 60">
						<BrandMark size={60} canvas="auto" />
					</Cell>
					<Cell label="LogoMark · filled">
						<LogoMark size={72} canvas="auto" />
					</Cell>
					<Cell label="LogoMark · transparent">
						<LogoMark size={72} fill="transparent" canvas="auto" />
					</Cell>
				</ThemePair>
			</ShowcaseSection>
		</>
	);
}

export function InspoComponents() {
	const [dialog, setDialog] = useState<'center' | 'right' | 'bottom' | null>(null);
	const [view, setView] = useState<'grid' | 'list' | 'board'>('grid');
	const [page, setPage] = useState(1);
	const { notify } = useToast();

	return (
		<>
			<ShowcaseSection
				id="inspo"
				eyebrow="Inspo components"
				title="Built to fill the gaps"
				description="Components the Figma library does not draw yet but the site needs: same tokens, same bevel, same type. Each is accessible by default."
			>
				<Specimen title="SegmentedControl & ThemeSwitch" note="A radio group: arrow keys move the selection.">
					<ThemePair>
						<SegmentedControl
							label="View"
							value={view}
							onChange={setView}
							options={[
								{ value: 'grid', label: 'Grid', icon: 'blocks' },
								{ value: 'list', label: 'List', icon: 'menu' },
								{ value: 'board', label: 'Board', icon: 'notebook' },
							]}
						/>
						<ThemeSwitch />
						<ThemeSwitch size="md" withLabels />
					</ThemePair>
				</Specimen>

				<Specimen title="Link & Divider">
					<ThemePair layout="column">
						<Text>
							Ready to get started? <Link href="https://cal.com/yetastudio">Get a free consultation!</Link>
						</Text>
						<Divider />
						<div className={styles.row}>
							<Link href="/#why-yeta" variant="bullet">
								Why Yeta
							</Link>
							<Link href="/#our-craft" variant="bullet">
								Our Craft
							</Link>
							<Link href="/#our-work" variant="nav">
								Our Work
							</Link>
						</div>
					</ThemePair>
				</Specimen>

				<Specimen title="Avatar & PaginationDots">
					<ThemePair>
						<Cell label="sizes">
							<div className={styles.row}>
								<Avatar name="Jorge R." size="sm" />
								<Avatar name="Marcelo Z." size="md" />
								<Avatar name="Lisette T." size="lg" />
							</div>
						</Cell>
						<Cell label="group">
							<AvatarGroup people={[{ name: 'Tobias F' }, { name: 'Yeta Studio' }, { name: 'Jorge R' }, { name: 'Marcelo Z' }, { name: 'Lisette T' }]} max={3} />
						</Cell>
						<Cell label="dots">
							<PaginationDots count={4} index={page} onSelect={setPage} itemLabel="project" />
						</Cell>
					</ThemePair>
				</Specimen>

				<Specimen title="Tooltip" note="Hover or focus the trigger. Never on touch; never the only label.">
					<ThemePair>
						<Tooltip content="Book a 30-minute intro call">
							<Button size="lg" iconStart="calendar" href="https://cal.com/yetastudio">
								Schedule
							</Button>
						</Tooltip>
						<Tooltip content="Copy email address" side="bottom">
							<Button size="lg" icon="write" label="Copy email" onClick={() => notify('Email copied to clipboard', 'success')} />
						</Tooltip>
					</ThemePair>
				</Specimen>

				<Specimen title="Accordion" note="The case-study rows from the Project Overview Card (Active).">
					<ThemePair align="start">
						<div className={styles.narrow}>
							<Accordion>
								<AccordionItem title="About the client" defaultOpen>
									A digital agency that needed a site as sharp as the work it ships.
								</AccordionItem>
								<AccordionItem title="The challenge">Stand out in a crowded market without leaning on luck.</AccordionItem>
								<AccordionItem title="The result">A design system and landing that scale across themes and locales.</AccordionItem>
							</Accordion>
						</div>
					</ThemePair>
				</Specimen>

				<Specimen title="Dialog, Sheet & Toast" note="Native <dialog>: focus is trapped, Escape closes, focus returns to the opener.">
					<ThemePair>
						<Button size="lg" onClick={() => setDialog('center')}>
							Open dialog
						</Button>
						<Button size="lg" onClick={() => setDialog('right')}>
							Open side sheet
						</Button>
						<Button size="lg" onClick={() => setDialog('bottom')}>
							Open bottom sheet
						</Button>
						<Button size="lg" iconStart="spark" onClick={() => notify('Your brief was sent. We reply within one business day.', 'success')}>
							Show toast
						</Button>
					</ThemePair>
				</Specimen>

				<Specimen title="Input, Textarea, Checkbox & Switch" note="States: rest, hint, required, error, disabled, long content.">
					<ThemePair align="start">
						<form className={styles.form} onSubmit={(event) => event.preventDefault()}>
							<Input label="Name" placeholder="Ada Lovelace" autoComplete="name" required />
							<Input label="Email" type="email" placeholder="ada@studio.com" defaultValue="ada@" error="Enter an email like name@company.com" required />
							<Input label="Company" optional hint="So we can look at your current site." />
							<Input label="Budget" disabled defaultValue="Locked after the first call" error="Never shown while disabled" />
							<Textarea label="What are you building?" defaultValue="A product site with a design system that survives a rebrand, a dark mode and three locales without anyone touching a hex value." />
							<Checkbox label="I'd like a free consultation" description="We'll send a Cal.com link." defaultChecked />
							<Switch label="Send me the monthly notes" />
							<Checkbox label="Disabled option" disabled />
							<Button type="submit" size="lg" fullWidth iconEnd="launch">
								Send brief
							</Button>
						</form>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<Dialog
				open={dialog === 'center'}
				onClose={() => setDialog(null)}
				title="Let’s build something"
				footer={
					<>
						<Button size="lg" variant="ghost" onClick={() => setDialog(null)}>
							Not now
						</Button>
						<Button size="lg" href="https://cal.com/yetastudio" iconEnd="external-link">
							Book a call
						</Button>
					</>
				}
			>
				<Text>
					Tell us where you are and where you want to be. We answer within one business day with a plan, not a pitch.
				</Text>
			</Dialog>
			<Dialog open={dialog === 'right'} onClose={() => setDialog(null)} title="Menu" placement="right">
				<Text>A side sheet: the mobile navigation uses this placement.</Text>
			</Dialog>
			<Dialog open={dialog === 'bottom'} onClose={() => setDialog(null)} title="Case study" placement="bottom">
				<Text>A bottom sheet: project details open here on phones.</Text>
			</Dialog>
		</>
	);
}
