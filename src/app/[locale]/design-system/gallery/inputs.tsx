'use client';

/*
 * Design system gallery · Advanced inputs.
 * Components from component.gallery that the site's library was missing, one ShowcaseSection each.
 * NAV feeds the showcase's side navigation; ids must match each ShowcaseSection id.
 */

//! React Core
import { useState, type ReactNode } from 'react';

//! Components
import { Cell, ShowcaseSection, SpecTable, Specimen, ThemePair } from '@/components/showcase';
import { ColorPicker, type ColorSwatch } from '@/components/ui/color-picker';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { DateInput } from '@/components/ui/date-input';
import { Datepicker } from '@/components/ui/datepicker';
import { File } from '@/components/ui/file';
import { FileUpload } from '@/components/ui/file-upload';
import { Rating } from '@/components/ui/rating';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Text } from '@/components/ui/text';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './inputs.module.css';

const GROUP = 'Gallery · Advanced inputs';

export const NAV: Array<{ id: string; label: string; group: string }> = [
	{ id: 'combobox', label: 'Combobox', group: GROUP },
	{ id: 'date-input', label: 'Date input', group: GROUP },
	{ id: 'datepicker', label: 'Datepicker', group: GROUP },
	{ id: 'color-picker', label: 'Color picker', group: GROUP },
	{ id: 'file-upload', label: 'File upload', group: GROUP },
	{ id: 'file', label: 'File', group: GROUP },
	{ id: 'rich-text-editor', label: 'Rich text editor', group: GROUP },
	{ id: 'rating', label: 'Rating', group: GROUP },
];

/** "Use it for / Don't use it for", one line each. */
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

const code = (text: string) => <code key={text}>{text}</code>;

const SERVICES: ComboboxOption[] = [
	{ value: 'identity', label: 'Brand identity', description: 'Naming, logo, visual language' },
	{ value: 'web', label: 'Web design', description: 'Marketing sites and landings' },
	{ value: 'product', label: 'Product design', description: 'Apps, dashboards, flows' },
	{ value: 'dev', label: 'Development', description: 'Next.js builds and CMS' },
	{ value: 'motion', label: 'Motion & 3D', description: 'Product films, interactions' },
	{ value: 'content', label: 'Content strategy' },
	{ value: 'research', label: 'User research' },
	{ value: 'audit', label: 'Accessibility audit' },
	{ value: 'legacy', label: 'Legacy rebuild (booked out)', disabled: true },
];

const CITIES: ComboboxOption[] = [
	{ value: 'bue', label: 'Buenos Aires' },
	{ value: 'bog', label: 'Bogotá' },
	{ value: 'cdmx', label: 'Ciudad de México' },
	{ value: 'mvd', label: 'Montevideo' },
	{ value: 'sao', label: 'São Paulo' },
	{ value: 'scl', label: 'Santiago de Chile' },
	{ value: 'lis', label: 'Lisboa' },
	{ value: 'mad', label: 'Madrid' },
	{ value: 'llanfair', label: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch, Isle of Anglesey, Wales' },
];

const NEUTRALS: ColorSwatch[] = [
	{ label: 'Ink', value: '--color-swatch-ink' },
	{ label: 'Paper', value: '--color-swatch-ink-inverse' },
	{ label: 'Pink', value: '--color-swatch-pink' },
	{ label: 'Blue', value: '--color-swatch-blue' },
];

/** ISO date `days` from today, for min / max that stay meaningful whenever the page is opened. */
function isoFromToday(days: number) {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Weekends are closed in the booking specimen. */
const isWeekend = (iso: string) => {
	const [y, m, d] = iso.split('-').map(Number);
	const day = new Date(y, m - 1, d).getDay();
	return day === 0 || day === 6;
};

/** A pretend upload: progress in uneven steps, and files over 8 MB fail like a server limit would. */
function fakeUpload(file: globalThis.File, report: (percent: number) => void) {
	return new Promise<void>((resolve, reject) => {
		let percent = 0;
		const timer = window.setInterval(() => {
			percent = Math.min(100, percent + 8 + Math.random() * 22);
			report(Math.round(percent));
			if (percent < 100) return;
			window.clearInterval(timer);
			if (file.size > 8_000_000) reject(new Error('The server refused this file'));
			else resolve();
		}, 220);
	});
}

const BRIEF_HTML =
	'<p>We need a <b>landing page</b> for the spring launch, live by <i>March 3</i>.</p><ul><li>Hero with the product film</li><li>Pricing in three tiers</li><li>FAQ pulled from support</li></ul><p>References are in the <a href="https://component.gallery">shared board</a>.</p>';

const LONG_HTML = `<p>${'The studio rewrote the onboarding copy three times before the tone felt right: warm without being cute, precise without sounding like a contract. '.repeat(4)}</p><ol><li>Audit the current screens</li><li>Map every error message</li><li>Rewrite, test with five people, repeat</li></ol>`;

export default function InputsGallery() {
	const [service, setService] = useState<string | null>(null);
	const [birthday, setBirthday] = useState<string | null>(null);
	const [booking, setBooking] = useState<string | null>(null);
	const [accent, setAccent] = useState<string>('');
	const [files, setFiles] = useState<string[]>([]);
	const [html, setHtml] = useState(BRIEF_HTML);
	const [score, setScore] = useState<number | undefined>(undefined);

	const minBooking = isoFromToday(1);
	const maxBooking = isoFromToday(60);

	return (
		<>
			{/* ───────────────────────── Combobox ───────────────────────── */}
			<ShowcaseSection
				id="combobox"
				eyebrow={GROUP}
				title="Combobox"
				description="A text field that filters a list as you type (WAI-ARIA APG combobox, list autocomplete). Focus stays in the field; the active option is announced through aria-activedescendant and a polite count of matches. The list grows from the field with the Menu dropdown motion and flips above it near the bottom of the window."
			>
				<Specimen title="Default and picked" note="Click the field or the chevron, or press ↓. Type to filter (accents and case are ignored, the match is weighted). Hover moves the active row like the arrows do.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Combobox
								label="Service"
								placeholder="Search services"
								options={SERVICES}
								value={service}
								onChange={setService}
								hint="Pick the closest one; we will refine it together."
								name="service"
							/>
							<Text size="xs" className={styles.readout}>
								value: {service ?? 'null'}
							</Text>
							<Combobox label="City" options={CITIES} defaultValue="bog" />
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="States" note="Error (with the Input shake on a new message), disabled, and an option far longer than the field: it wraps inside the list and ellipsizes in the field.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Combobox label="Service" options={SERVICES} placeholder="Search services" error="Choose a service to continue" />
							<Combobox label="Service" options={SERVICES} defaultValue="web" disabled />
							<Combobox label="Office" options={CITIES} defaultValue="llanfair" optional />
						</div>
					</ThemePair>
				</Specimen>
				<SpecTable
					columns={['Key', 'Does']}
					rows={[
						['↓ / ↑', 'Opens the list (on the picked option, or the first / last); then moves the active option, wrapping'],
						['Alt + ↓', 'Opens the list without moving'],
						['Enter', 'Picks the active option and closes'],
						['Escape', 'Closes the list; with it closed, clears the field'],
						['Typing', 'Filters; “No results” when nothing matches. Leaving the field keeps an exact match, else returns to the last pick'],
					]}
				/>
				<Usage use="choosing one value from a long or searchable list (services, cities, people)." avoid="fewer than ~7 options (use radios or a SegmentedControl) or free text that does not need to match a list." />
			</ShowcaseSection>

			{/* ───────────────────────── Date input ───────────────────────── */}
			<ShowcaseSection
				id="date-input"
				eyebrow={GROUP}
				title="Date input"
				description="A memorable date as three numeric boxes (after GOV.UK): a fieldset with the question as legend, the locale’s order and segment names from Intl, a numeric keypad on phones. When focus leaves the group it checks for missing parts, a real date, a 4-digit year and min / max, and marks only the faulty boxes."
			>
				<Specimen title="Default and filled" note="No auto-advance between boxes (it surprises people who correct a digit). autoComplete=&quot;bday&quot; lets the browser fill a birthday.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<DateInput
								label="What is your date of birth?"
								hint="For example, 27 March 1990"
								autoComplete="bday"
								name="birthday"
								onChange={(_, iso) => setBirthday(iso)}
							/>
							<Text size="xs" className={styles.readout}>
								iso: {birthday ?? 'null'}
							</Text>
							<DateInput label="Project kickoff" defaultValue={{ day: '14', month: '2', year: '2026' }} />
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Validation and states" note="Tab out of the first group to see the built-in check (required, then the parts that are missing). The second one carries an error from the page on the year only; the third is disabled.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<DateInput label="When does the campaign end?" required max={isoFromToday(365)} hint="Within the next 12 months" />
							<DateInput
								label="Company founded"
								defaultValue={{ day: '1', month: '6', year: '19' }}
								error="Year must include 4 numbers"
								errorSegments={['year']}
							/>
							<DateInput label="Invoice date" defaultValue={{ day: '3', month: '11', year: '2026' }} disabled />
						</div>
					</ThemePair>
				</Specimen>
				<Usage use="dates people know without a calendar: birthdays, document dates, a past start date." avoid="picking a near date by weekday or availability (use the Datepicker), or approximate dates (ask for month and year only)." />
			</ShowcaseSection>

			{/* ───────────────────────── Datepicker ───────────────────────── */}
			<ShowcaseSection
				id="datepicker"
				eyebrow={GROUP}
				title="Datepicker"
				description="A date field that also opens a calendar dialog (WAI-ARIA APG date picker dialog). Typing works in the locale’s numeric format; the button opens a month grid with today marked, the selected day filled, unavailable days struck through, and min / max that lock the month buttons. Month and weekday names come from Intl in the page locale."
			>
				<Specimen title="Default and booking" note="The booking field allows the next 60 days, weekdays only. Escape or a press outside closes the calendar; picking a day returns focus to the button.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Datepicker label="Start date" hint="When should we start?" />
							<Datepicker
								label="Book a discovery call"
								value={booking}
								onChange={setBooking}
								min={minBooking}
								max={maxBooking}
								isDateUnavailable={isWeekend}
								hint="Weekdays in the next 60 days"
								name="call"
							/>
							<Text size="xs" className={styles.readout}>
								value: {booking ?? 'null'}
							</Text>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="States" note="Type a date that does not exist (31/02) and leave the field: the typed-date message replaces the hint. Error from the page and disabled below.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Datepicker label="Launch date" defaultValue="2026-12-04" />
							<Datepicker label="Delivery date" error="Pick a date after the kickoff" />
							<Datepicker label="Invoice date" defaultValue="2026-11-03" disabled />
						</div>
					</ThemePair>
				</Specimen>
				<SpecTable
					columns={['Key (in the grid)', 'Does']}
					rows={[
						['← → ↑ ↓', 'Previous / next day, same day last / next week'],
						['Home / End', 'First / last day of the week'],
						['Page Up / Page Down', 'Same day, previous / next month (with Shift: year)'],
						['Enter / Space', 'Picks the day, closes, focus back on the button'],
						['Escape', 'Closes without picking'],
						['Tab', 'Cycles month buttons and the grid (the dialog is modal for assistive tech)'],
					]}
				/>
				<Usage use="near dates where the weekday or availability matters: bookings, deadlines, delivery." avoid="birthdays and other far-off dates people already know (use the Date input)." />
			</ShowcaseSection>

			{/* ───────────────────────── Color picker ───────────────────────── */}
			<ShowcaseSection
				id="color-picker"
				eyebrow={GROUP}
				title="Color picker"
				description="Brand swatches as a radio group, plus a hex field and the browser’s own picker for anything else. Swatches can name colour tokens, so the brand hexes stay in tokens.css; the value is always reported as a lowercase hex. The swatches are the only colour in the component."
			>
				<Specimen title="Brand swatches" note="Arrow keys move and pick inside the group; Tab goes on to the native picker and the hex field. The check takes the ink with the better contrast on each swatch.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<ColorPicker label="Project accent" defaultValue="--color-swatch-violet" onChange={setAccent} name="accent" />
							<Text size="xs" className={styles.readout}>
								onChange: {accent || '—'}
							</Text>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Variants and states" note="Swatches only (no custom colour), an invalid hex, disabled.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<ColorPicker label="Card tone" swatches={NEUTRALS} allowCustom={false} defaultValue="--color-swatch-ink" hint="Ink, paper or one accent" />
							<ColorPicker label="Highlight" error="Enter 6 hex digits (0–9, A–F)" />
							<ColorPicker label="Locked theme" defaultValue="--color-swatch-green" disabled />
						</div>
					</ThemePair>
				</Specimen>
				<Usage use="choosing a tag, theme or accent colour, mostly from a fixed set." avoid="setting brand colours in product UI (they come from tokens), or fine colour work that needs a colour area and sliders." />
			</ShowcaseSection>

			{/* ───────────────────────── File upload ───────────────────────── */}
			<ShowcaseSection
				id="file-upload"
				eyebrow={GROUP}
				title="File upload"
				description="A dropzone around a real file input. Files come from the button or a drop; each is checked against accept, size and count, then listed as a File row that uploads with its progress and a success check, or says why it was refused. Changes are announced politely and the native input keeps the accepted files for a plain form submit."
			>
				<Specimen title="Default" note="Drag files over the zone to see the drop state (solid stroke, the icon rises). Uploads are simulated here: files over 8 MB fail like a server limit would.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<FileUpload
								label="Attachments"
								hint="PDF or images, up to 10 MB each, 4 files at most"
								accept=".pdf,image/*"
								maxSize={10_000_000}
								maxFiles={4}
								optional
								name="attachments"
								onUpload={fakeUpload}
								onChange={(chosen) => setFiles(chosen.map((file) => file.name))}
							/>
							<Text size="xs" className={styles.readout}>
								onChange: {files.length ? files.join(', ') : '[]'}
							</Text>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Single file and states" note="One file replaces the last; an error from the page; disabled.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<FileUpload label="Portfolio" multiple={false} accept=".pdf" hint="One PDF" labels={{ choose: 'Choose a file', drop: 'Drag a PDF here or' }} />
							<FileUpload label="Brief" error="Attach the brief to continue" required />
							<FileUpload label="Contract" disabled hint="Available once the proposal is approved" />
						</div>
					</ThemePair>
				</Specimen>
				<Usage use="attaching documents or images to a form, with clear limits up front." avoid="media libraries or bulk imports (they need their own browser), or picking among files already uploaded." />
			</ShowcaseSection>

			{/* ───────────────────────── File ───────────────────────── */}
			<ShowcaseSection
				id="file"
				eyebrow={GROUP}
				title="File"
				description="One attachment: a type icon, the name (whole in its title when it truncates), size and type in the locale’s units, a status line and its actions, each named after the file. Uploading shows a hairline progress bar (role progressbar); success draws the Success check; an error says why."
			>
				<Specimen title="Types and actions" note="Download is a real link with the download attribute; remove is a button. One purpose icon per action.">
					<ThemePair align="start">
						<div className={styles.list}>
							<File name="discovery-workshop.pdf" size={2_480_000} href="/brand/logo-mark-light-filled.svg" onRemove={() => undefined} description="Added today" />
							<File name="hero-shot@2x.png" size={846_000} type="image/png" href="/brand/logo-mark-light-filled.svg" />
							<File name="brand-assets.zip" size={48_300_000} onRemove={() => undefined} />
							<File name="notes" size={1_200} />
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Status" note="Uploading with a percentage and without one (indeterminate), done, failed, and a name long enough to truncate.">
					<ThemePair align="start">
						<div className={styles.list}>
							<File name="moodboard-v3.pdf" size={5_600_000} status="uploading" progress={42} onRemove={() => undefined} />
							<File name="product-film.mp4" size={96_000_000} status="uploading" onRemove={() => undefined} />
							<File name="proposal-final.pdf" size={1_900_000} status="success" href="/brand/logo-mark-light-filled.svg" onRemove={() => undefined} />
							<File name="photo-shoot.heic" size={3_100_000} status="error" error="HEIC is not an accepted file type" onRemove={() => undefined} />
							<File
								name="2026-q4-quarterly-business-review-with-appendix-and-every-chart-the-board-asked-for-v12-final-final.pdf"
								size={12_400_000}
								href="/brand/logo-mark-light-filled.svg"
								onRemove={() => undefined}
							/>
						</div>
					</ThemePair>
				</Specimen>
				<Usage use="listing attachments, downloads and the files of a FileUpload." avoid="folders or file trees (use the Tree view), or a single inline download link in running text (use a Link)." />
			</ShowcaseSection>

			{/* ───────────────────────── Rich text editor ───────────────────────── */}
			<ShowcaseSection
				id="rich-text-editor"
				eyebrow={GROUP}
				title="Rich text editor"
				description="A dependency-free contentEditable with a WAI-ARIA toolbar: one tab stop, arrows / Home / End between tools, each a toggle whose pressed state follows the caret. Bold, italic, bulleted and numbered lists, and links through an inline address bar (⌘/Ctrl K). Paste keeps plain text, so onChange only ever hands back these few tags."
			>
				<Specimen title="Default and with content" note="Select text and press a tool (or ⌘/Ctrl B, I, K). Keyboard presses keep focus on the toolbar; clicks keep it in the text.">
					<ThemePair align="start">
						<div className={cx(styles.stack, styles.wide)}>
							<RichTextEditor label="Message" placeholder="Tell us about the project" hint="Links and lists are fine; no images." />
							<RichTextEditor label="Brief" defaultValue={BRIEF_HTML} onChange={setHtml} name="brief" />
							<Text size="xs" className={styles.readout}>
								onChange: {html}
							</Text>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="States" note="An error, disabled, and long content that scrolls inside the box.">
					<ThemePair align="start">
						<div className={cx(styles.stack, styles.wide)}>
							<RichTextEditor label="Summary" placeholder="Two or three sentences" error="Write a short summary" required />
							<RichTextEditor label="Archived note" defaultValue="<p>This brief is <b>archived</b> and can no longer be edited.</p>" disabled />
							<RichTextEditor label="Case study draft" defaultValue={LONG_HTML} />
						</div>
					</ThemePair>
				</Specimen>
				<SpecTable
					columns={['Key', 'Does']}
					rows={[
						['Tab', 'Toolbar (one stop), then the text'],
						['← → / Home End', 'Moves between tools'],
						['Enter / Space', 'Toggles the focused tool'],
						['⌘/Ctrl B · I · K', 'Bold · italic · link bar (Enter applies, Escape cancels)'],
					]}
				/>
				<Usage use="short formatted text: briefs, messages, notes with a list or a link." avoid="long documents, headings and media (use a real editor), or plain fields where formatting has no meaning (use a Textarea)." />
			</ShowcaseSection>

			{/* ───────────────────────── Rating ───────────────────────── */}
			<ShowcaseSection
				id="rating"
				eyebrow={GROUP}
				title="Rating"
				description="Two forms. Read-only, it draws partial stars to a tenth and names itself “Rated 4.5 out of 5” (role img), with an optional number and count. Interactive, it is a group of real radios under a legend: → / ↓ add a star, ← / ↑ remove one, and hover previews. The star fill is the component’s one hue."
			>
				<Specimen title="Read-only" note="sm · md · lg, partial values, the number and the count.">
					<ThemePair layout="column">
						<Cell label="sm · 4.3">
							<Rating readOnly value={4.3} size="sm" showValue />
						</Cell>
						<Cell label="md · 3.5 · count">
							<Rating readOnly value={3.5} showValue count={1284} />
						</Cell>
						<Cell label="lg · 2.7">
							<Rating readOnly value={2.7} size="lg" showValue />
						</Cell>
						<Cell label="empty · 0 of 5">
							<Rating readOnly value={0} />
						</Cell>
					</ThemePair>
				</Specimen>
				<Specimen title="Interactive" note="Tab enters at the checked star (or the first). Hover a star to preview before clicking.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Rating label="How was the workshop?" value={score} onChange={setScore} hint="1 is poor, 5 is excellent" />
							<Text size="xs" className={styles.readout}>
								value: {score ?? 'undefined'}
							</Text>
							<div className={styles.row}>
								<Rating label="Small" size="sm" defaultValue={2} />
								<Rating label="Large" size="lg" defaultValue={4} />
							</div>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="States" note="Required with an error, and disabled.">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Rating label="Rate the delivery" error="Choose a rating" required />
							<Rating label="Rated last week" defaultValue={4} disabled />
						</div>
					</ThemePair>
				</Specimen>
				<SpecTable
					columns={['Prop', 'Type', 'Notes']}
					rows={[
						[code('readOnly'), 'boolean', 'Display form: partial stars, role img'],
						[code('value · defaultValue · onChange'), 'number', 'Fractions only in read-only'],
						[code('size'), 'sm | md | lg', 'Stars 14 / 20 / 24; interactive targets 24 / 28 / 32'],
						[code('showValue · count'), 'boolean · number', 'Read-only extras, formatted by Intl'],
					]}
				/>
				<Usage use="showing an average score, or asking for a quick 1–5 judgement." avoid="precise scores or opinions that need words (use a scale with labels or a Textarea)." />
			</ShowcaseSection>
		</>
	);
}
