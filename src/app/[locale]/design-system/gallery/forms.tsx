'use client';

/*
 * Design system gallery · Forms.
 * Components from component.gallery that the site's library was missing, one ShowcaseSection each.
 * NAV feeds the showcase's side navigation; ids must match each ShowcaseSection id.
 */

//! React Core
import { useState, type FormEvent, type ReactNode } from 'react';

//! Components
import { Cell, ShowcaseSection, Specimen, ThemePair } from '@/components/showcase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/field';
import { Fieldset } from '@/components/ui/fieldset';
import { Form, FormActions, FormRow, type FormError } from '@/components/ui/form';
import { Label, type LabelProps } from '@/components/ui/label';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { SearchInput } from '@/components/ui/search-input';
import { Select, type SelectOption } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Stepper } from '@/components/ui/stepper';
import { Text } from '@/components/ui/text';

//! Styles
import styles from './forms.module.css';

const GROUP = 'Gallery · Forms';

export const NAV: Array<{ id: string; label: string; group: string }> = [
	{ id: 'label', label: 'Label', group: GROUP },
	{ id: 'fieldset', label: 'Fieldset', group: GROUP },
	{ id: 'form', label: 'Form', group: GROUP },
	{ id: 'radio', label: 'Radio button', group: GROUP },
	{ id: 'select', label: 'Select', group: GROUP },
	{ id: 'search-input', label: 'Search input', group: GROUP },
	{ id: 'slider', label: 'Slider', group: GROUP },
	{ id: 'stepper', label: 'Stepper', group: GROUP },
];

const TIMELINES: SelectOption[] = [
	{ value: 'asap', label: 'As soon as possible' },
	{ value: 'month', label: 'Within a month' },
	{ value: 'quarter', label: 'This quarter' },
	{ value: 'exploring', label: 'Just exploring' },
];

const SERVICES = [
	{
		group: 'Design',
		options: [
			{ value: 'brand', label: 'Brand identity' },
			{ value: 'web', label: 'Website' },
			{ value: 'system', label: 'Design system' },
		],
	},
	{
		group: 'Build',
		options: [
			{ value: 'next', label: 'Next.js build' },
			{ value: 'cms', label: 'CMS integration' },
			{ value: 'legacy', label: 'Legacy rebuild (booked out)', disabled: true },
		],
	},
];

const money = (value: number) => `$${value}k`;

/** Specimen labels name no control here, so they render as text (`as="span"`, the group-label form). */
function SampleLabel(props: Omit<LabelProps, 'as' | 'htmlFor'>) {
	return <Label {...props} as="span" />;
}

function Usage({ use, avoid }: { use: ReactNode; avoid: ReactNode }) {
	return (
		<div className={styles.usage}>
			<Text size="sm" tone="subtle">
				<strong>Use it for</strong> {use}
			</Text>
			<Text size="sm" tone="subtle">
				<strong>Don’t use it for</strong> {avoid}
			</Text>
		</div>
	);
}

/** One brief form per canvas, so each panel keeps its own errors and focus. */
function BriefForm() {
	const [errors, setErrors] = useState<FormError[]>([]);
	const errorFor = (field: string) => errors.find((error) => error.field === field)?.message;

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const text = (name: string) => String(data.get(name) ?? '').trim();
		const next: FormError[] = [];
		if (!text('name')) next.push({ field: 'name', message: 'Enter your name' });
		if (!/^\S+@\S+\.\S+$/.test(text('email'))) next.push({ field: 'email', message: 'Enter an email like name@company.com' });
		if (!text('engagement')) next.push({ field: 'engagement', message: 'Choose how you’d like to work' });
		if (!text('timeline')) next.push({ field: 'timeline', message: 'Choose when you’d like to start' });
		setErrors(next);
	};

	return (
		<Form errors={errors} errorHeadingLevel={4} noValidate onSubmit={onSubmit} onReset={() => setErrors([])} className={styles.column}>
			<FormRow>
				<Input label="Name" name="name" autoComplete="name" placeholder="Ada Lovelace" error={errorFor('name')} required />
				<Input label="Email" name="email" type="email" autoComplete="email" placeholder="ada@studio.com" error={errorFor('email')} required />
			</FormRow>
			<RadioGroup label="How should we work?" name="engagement" orientation="horizontal" error={errorFor('engagement')} required>
				<Radio value="sprint" label="Design sprint" />
				<Radio value="retainer" label="Monthly retainer" />
			</RadioGroup>
			<Select label="Timeline" name="timeline" placeholder="Choose a start" options={TIMELINES} error={errorFor('timeline')} required />
			<FormActions note="We reply within one business day.">
				<Button type="reset" variant="ghost">
					Reset
				</Button>
				<Button type="submit" iconStart="launch">
					Send brief
				</Button>
			</FormActions>
		</Form>
	);
}

/** Search that reports what it would look for. */
function SearchDemo() {
	const [query, setQuery] = useState<string | null>(null);
	return (
		<div className={styles.stack}>
			<SearchInput label="Search the case studies" placeholder="Search case studies" shortcut onSearch={setQuery} onClear={() => setQuery(null)} />
			<Text size="xs" tone="subtle" aria-live="polite">
				{query === null ? 'Type and press Enter. Escape or × clears it.' : query ? `Searching for “${query}”` : 'Type something to search.'}
			</Text>
		</div>
	);
}

export default function FormsGallery() {
	return (
		<>
			<ShowcaseSection
				id="label"
				eyebrow="Gallery · Forms"
				title="Label"
				description="The text that names a form control. md is the Input / Textarea label, so every control in a form reads as one family. Marks the few optional fields; a quiet asterisk is there for forms that must star required ones."
			>
				<Usage use="naming one control (htmlFor), a group (as span + aria-labelledby) or a fieldset (as legend)." avoid="headings, helper text or placeholder-only fields; the label never disappears on input." />
				<Specimen title="Sizes" note="sm 12 pairs with sm controls · md 14 is the default (Input’s label) · lg 16 heads a fieldset.">
					<ThemePair>
						<Cell label="sm">
							<SampleLabel size="sm">
								Project name
							</SampleLabel>
						</Cell>
						<Cell label="md (default)">
							<SampleLabel>Project name</SampleLabel>
						</Cell>
						<Cell label="lg">
							<SampleLabel size="lg">
								Project name
							</SampleLabel>
						</Cell>
					</ThemePair>
				</Specimen>
				<Specimen title="Markers & states" note="required adds an aria-hidden asterisk (the control’s own required attribute is what is announced); optional appends the translated “(optional)”.">
					<ThemePair>
						<Cell label="required">
							<SampleLabel required>
								Email
							</SampleLabel>
						</Cell>
						<Cell label="optional">
							<SampleLabel optional>
								Company
							</SampleLabel>
						</Cell>
						<Cell label="disabled">
							<SampleLabel disabled>
								Budget
							</SampleLabel>
						</Cell>
						<Cell label="long content">
							<div className={styles.narrow}>
								<SampleLabel optional>
									Anything we should know before the first call, like deadlines, stakeholders or a site we should look at
								</SampleLabel>
							</div>
						</Cell>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="fieldset"
				eyebrow="Gallery · Forms"
				title="Fieldset"
				description="A native fieldset and legend that group related fields. The legend is read before every field inside; disabled switches off the whole group at once; the group error sits under the legend so it is heard before the fields."
			>
				<Usage use="related choices (checkbox or radio sets) and blocks of a long form (contact, billing)." avoid="a single field or pure visual grouping; use layout (FormRow, Surface) for that." />
				<Specimen title="Plain & card" note="plain stacks the fields under the legend; card frames them on the raised surface with the bevel.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Fieldset legend="Services" description="Pick everything you need; we’ll scope it together.">
								<Checkbox label="Brand identity" defaultChecked />
								<Checkbox label="Website" />
								<Checkbox label="Design system" description="Tokens, components and docs, like this page." />
							</Fieldset>
							<Fieldset legend="Contact details" variant="card" optional>
								<FormRow>
									<Input label="Name" autoComplete="name" />
									<Input label="Role" placeholder="Founder" />
								</FormRow>
							</Fieldset>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Error & disabled" note="The error is the group’s (“choose at least one”), described on the fieldset. Disabled is the native attribute: every control inside stops, no prop per field.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Fieldset legend="Services" error="Choose at least one service">
								<Checkbox label="Brand identity" />
								<Checkbox label="Website" />
							</Fieldset>
							<Fieldset legend="Billing" variant="card" description="Locked after the contract is signed." disabled>
								<RadioGroup label="Invoice every" defaultValue="month" orientation="horizontal">
									<Radio value="month" label="Month" />
									<Radio value="milestone" label="Milestone" />
								</RadioGroup>
								<Select label="Currency" defaultValue="usd" options={[{ value: 'usd', label: 'US dollar' }]} />
							</Fieldset>
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="form"
				eyebrow="Gallery · Forms"
				title="Form"
				description="Form, FormRow and FormActions: the spacing rhythm (fields 20 apart, actions a step further), rows that wrap on narrow screens, and an error summary that lists every problem after a failed submit and links each one to its field."
			>
				<Usage use="any form with more than one field: contact, brief, newsletter with options." avoid="a single search or filter field (SearchInput) or controls that act immediately (Switch)." />
				<Specimen
					title="Error summary"
					note="Submit empty: the summary appears, takes focus and each link focuses its field (the checked or first radio of a group). Fields keep their own errors. Reset clears both."
				>
					<ThemePair align="start">
						<BriefForm />
					</ThemePair>
				</Specimen>
				<Specimen title="Actions" note="One icon per button: the primary action keeps the icon that names its purpose, never a generic arrow beside it. Primary last; secondary ghost. stretch stacks them full width, primary on top.">
					<ThemePair layout="column" align="start">
						<FormActions align="end" className={styles.column}>
							<Button variant="ghost">Cancel</Button>
							<Button iconStart="calendar">Book a call</Button>
						</FormActions>
						<FormActions align="between" note="We reply within one business day." className={styles.column}>
							<Button iconStart="launch">Send brief</Button>
						</FormActions>
						<FormActions align="stretch" className={styles.narrow}>
							<Button variant="ghost">Save draft</Button>
							<Button iconStart="write">Submit proposal</Button>
						</FormActions>
					</ThemePair>
				</Specimen>
				<Specimen title="Compact density" note={'density="compact" tightens fields to 12 for dense panels (filters, settings).'}>
					<ThemePair align="start">
						<Form density="compact" className={styles.narrow} onSubmit={(event) => event.preventDefault()}>
							<Select label="Sort by" size="md" defaultValue="recent" options={[{ value: 'recent', label: 'Most recent' }, { value: 'az', label: 'Name A–Z' }]} />
							<Stepper label="Results per page" size="md" defaultValue={12} min={6} max={48} step={6} />
						</Form>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="radio"
				eyebrow="Gallery · Forms"
				title="Radio button"
				description="RadioGroup and Radio: one choice from a short list. Real radio inputs sharing a name, so the browser gives the APG keyboard model: Tab enters at the checked option, arrow keys move and select (wrapping), Space selects. The circle matches Checkbox; card turns each option into a selectable card."
			>
				<Usage use="2–6 mutually exclusive options that should all stay visible." avoid="more than ~7 options (Select), several answers (Checkbox) or an on/off setting (Switch)." />
				<Specimen title="Default" note="Vertical with descriptions, and horizontal. Hover tints the circle; focus draws the ring on it.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<RadioGroup label="Project size" defaultValue="medium" hint="A rough idea is enough.">
								<Radio value="small" label="Small" description="A landing page or a focused feature." />
								<Radio value="medium" label="Medium" description="A full site or a product area." />
								<Radio value="large" label="Large" description="A platform, a design system and the team to run it." />
							</RadioGroup>
							<RadioGroup label="Preferred contact" orientation="horizontal" defaultValue="email">
								<Radio value="email" label="Email" />
								<Radio value="call" label="Call" />
								<Radio value="chat" label="Chat" />
							</RadioGroup>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Card" note="The whole card is the target and carries the focus ring; checked lifts to the raised surface with a stronger hairline.">
					<ThemePair align="start">
						<RadioGroup label="Engagement" variant="card" orientation="horizontal" defaultValue="sprint">
							<Radio value="sprint" icon="launch" label="Design sprint" description="Two weeks, one clear direction." />
							<Radio value="retainer" icon="handshake" label="Retainer" description="A monthly slot with the studio." />
							<Radio value="product" icon="blocks" label="Product team" description="Design and build, end to end." />
						</RadioGroup>
					</ThemePair>
				</Specimen>
				<Specimen title="Error, disabled & empty" note="No default: Tab lands on the first option. The error is described on the radiogroup. A single option or the whole group can be disabled.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<RadioGroup label="Budget" error="Choose a budget range" required orientation="horizontal">
								<Radio value="s" label="Under $10k" />
								<Radio value="m" label="$10–30k" />
								<Radio value="l" label="$30k+" />
							</RadioGroup>
							<RadioGroup label="Start" defaultValue="later">
								<Radio value="now" label="This week (fully booked)" disabled />
								<Radio value="later" label="Next month" />
							</RadioGroup>
							<RadioGroup label="Plan" variant="card" defaultValue="a" disabled>
								<Radio value="a" label="Studio" description="Locked while the contract is under review." />
							</RadioGroup>
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="select"
				eyebrow="Gallery · Forms"
				title="Select"
				description="A native select dressed as Input: same heights, surface, hairline, focus ring and error. The list, type-ahead and mobile pickers stay the platform’s. The placeholder reads like Input’s and is hidden from the list once the field is required."
			>
				<Usage use="picking one of many known options (7+), where the list does not need searching." avoid="fewer than ~6 options (RadioGroup), several values or a list people need to filter (a combobox)." />
				<Specimen title="Sizes" note="sm 30 · md 34 · lg 36 (default, Input’s height). On touch devices the value stays 16px so the page never zooms.">
					<ThemePair align="start">
						<div className={styles.grid}>
							<Select label="Timeline" size="sm" defaultValue="month" options={TIMELINES} />
							<Select label="Timeline" size="md" defaultValue="month" options={TIMELINES} />
							<Select label="Timeline" defaultValue="month" options={TIMELINES} />
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="States" note="Empty with placeholder, option groups with a disabled option, hint, error (shakes when it appears), disabled and a long value (ellipsis).">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Select label="Timeline" placeholder="Choose a start" options={TIMELINES} hint="We plan the kickoff around it." />
							<Select label="Service" placeholder="Choose a service" options={SERVICES} optional />
							<Select label="Timeline" placeholder="Choose a start" options={TIMELINES} error="Choose when you’d like to start" required />
							<Select label="Region" defaultValue="latam" options={[{ value: 'latam', label: 'Latin America' }]} disabled />
							<Select
								label="Referral"
								defaultValue="long"
								options={[{ value: 'long', label: 'A friend who worked with you on a product launch two years ago and still talks about it' }]}
							/>
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="search-input"
				eyebrow="Gallery · Forms"
				title="Search input"
				description="A search landmark (role=search) with a labelled search field. Enter submits; Escape or × clears it with transitions.dev’s Input clear with dissolve: the text drops and blurs over a per-word streak while the placeholder falls in, and focus stays in the field. ⌘K / Ctrl K focuses it from anywhere."
			>
				<Usage use="finding content across a site or a long list (case studies, docs)." avoid="filtering a short visible list (use the list itself) or a field that is part of a larger form (pass nested)." />
				<Specimen title="Default" note="The label is visually hidden: the icon and placeholder carry it on screen. The ⌘K hint (Ctrl K off Apple) hides while focused, once there is a value and on touch screens.">
					<ThemePair align="start">
						<SearchDemo />
					</ThemePair>
				</Specimen>
				<Specimen title="With a value, sizes & glass" note="A value swaps the hint for the clear button. glass is the nav material, for search floating over content.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<SearchInput label="Search the journal" defaultValue="design systems that survive a rebrand" placeholder="Search the journal" />
							<div className={styles.grid}>
								<SearchInput label="Search, small" size="sm" placeholder="Small" />
								<SearchInput label="Search, medium" size="md" placeholder="Medium" />
							</div>
							<div className={styles.patterned}>
								<SearchInput label="Search the site" variant="glass" placeholder="Search the site" />
							</div>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Visible label, hint & disabled">
					<ThemePair align="start">
						<div className={styles.stack}>
							<SearchInput label="Find a project" showLabel hint="Search by client, industry or service." placeholder="e.g. fintech" />
							<SearchInput label="Search archive" showLabel placeholder="Archive is being reindexed" disabled />
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="slider"
				eyebrow="Gallery · Forms"
				title="Slider"
				description="A native range input styled on-brand, so slider semantics and keys come from the platform: arrows ±step, Page Up / Down, Home / End. The fill follows the thumb; the value prints beside the label or floats in a bubble while hovered, focused or dragged."
			>
				<Usage use="an approximate value in a known range where the position matters more than the digit (budget, team size)." avoid="exact numbers (Stepper or Input) or ranges so wide one step is not reachable by hand." />
				<Specimen title="Value display" note="inline (default) prints the formatted value beside the label; bubble floats it over the thumb; showMinMax prints the ends. formatValue also sets aria-valuetext.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Slider label="Budget" min={5} max={100} step={5} defaultValue={30} formatValue={money} showMinMax />
							<Slider label="Design share" valueDisplay="bubble" defaultValue={60} formatValue={(value) => `${value}%`} showMinMax />
							<Slider label="Weeks" min={1} max={12} defaultValue={4} hint="Most sites ship in 6–8 weeks." />
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Edges, disabled & long label" note="At min and max the thumb stays inside the track. Hover scales the thumb; focus draws the ring around it.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Slider label="Revisions" min={0} max={5} defaultValue={0} />
							<Slider label="Pages" min={1} max={20} defaultValue={20} />
							<Slider label="Team size" defaultValue={40} disabled />
							<Slider label="How much of the current site should we keep, from a full rebuild to a light refresh" defaultValue={25} formatValue={(value) => `${value}%`} />
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>

			<ShowcaseSection
				id="stepper"
				eyebrow="Gallery · Forms"
				title="Stepper"
				description="A number with − and + (quantity, number field). The field is an APG spinbutton: ↑ / ↓ step, Page Up / Down take ten, Home / End jump to the bounds; typed numbers commit on Enter or blur, clamped and snapped. Buttons repeat while held and stay out of the tab order. A stepped value re-enters with transitions.dev’s Number pop-in: up rises, down drops."
			>
				<Usage use="small exact quantities that move a step at a time (seats, rounds, pages)." avoid="large or free-form numbers (Input with inputMode), or approximate values (Slider)." />
				<Specimen title="Sizes" note="sm 30 · md 34 · lg 36 (default). Buttons never shrink under 24px.">
					<ThemePair>
						<Cell label="sm">
							<Stepper label="Seats" size="sm" defaultValue={2} min={1} max={10} />
						</Cell>
						<Cell label="md">
							<Stepper label="Seats" size="md" defaultValue={2} min={1} max={10} />
						</Cell>
						<Cell label="lg (default)">
							<Stepper label="Seats" defaultValue={2} min={1} max={10} formatValue={(value) => (value === 1 ? '1 seat' : `${value} seats`)} />
						</Cell>
					</ThemePair>
				</Specimen>
				<Specimen title="Bounds, decimals & states" note="At a bound its button disables. step 0.5 shows one decimal. Error shakes when it appears.">
					<ThemePair align="start">
						<div className={styles.row}>
							<Stepper label="Revision rounds" defaultValue={0} min={0} max={3} hint="Up to 3 included." />
							<Stepper label="Days on site" defaultValue={1.5} min={0} max={10} step={0.5} />
							<Stepper label="Workshops" defaultValue={0} min={0} max={4} error="Add at least one workshop" />
							<Stepper label="Licences" defaultValue={12} disabled />
							<Stepper label="Pages" defaultValue={240} min={1} max={9999} />
						</div>
					</ThemePair>
				</Specimen>
			</ShowcaseSection>
		</>
	);
}
