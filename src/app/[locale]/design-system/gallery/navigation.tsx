'use client';

/*
 * Design system gallery · Navigation.
 * Components from component.gallery that the site's library was missing, one ShowcaseSection each.
 * NAV feeds the showcase's side navigation; ids must match each ShowcaseSection id.
 */

//! React Core
import { useState, type MouseEvent, type ReactNode } from 'react';

//! Components
import { Cell, ShowcaseSection, Specimen, ThemePair } from '@/components/showcase';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer } from '@/components/ui/drawer';
import { DropdownMenu, MenuGroup, MenuItem, MenuSeparator } from '@/components/ui/dropdown-menu';
import { NavGroup, NavItem, Navigation } from '@/components/ui/navigation';
import { Pagination } from '@/components/ui/pagination';
import { SkipLink } from '@/components/ui/skip-link';
import { Surface } from '@/components/ui/surface';
import { Tab, TabList, TabPanel, Tabs } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { TreeItem, TreeView } from '@/components/ui/tree-view';

//! Styles
import styles from './navigation.module.css';

const GROUP = 'Gallery · Navigation';

export const NAV: Array<{ id: string; label: string; group: string }> = [
	{ id: 'breadcrumbs', label: 'Breadcrumbs', group: GROUP },
	{ id: 'navigation', label: 'Navigation', group: GROUP },
	{ id: 'pagination', label: 'Pagination', group: GROUP },
	{ id: 'tabs', label: 'Tabs', group: GROUP },
	{ id: 'dropdown-menu', label: 'Dropdown menu', group: GROUP },
	{ id: 'drawer', label: 'Drawer', group: GROUP },
	{ id: 'skip-link', label: 'Skip link', group: GROUP },
	{ id: 'tree-view', label: 'Tree view', group: GROUP },
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

const TRAIL: BreadcrumbItem[] = [
	{ label: 'Home', href: '#breadcrumbs' },
	{ label: 'Work', href: '#breadcrumbs' },
	{ label: 'Case studies', href: '#breadcrumbs' },
	{ label: 'Lumen rebrand' },
];

const DEEP_TRAIL: BreadcrumbItem[] = [
	{ label: 'Home', href: '#breadcrumbs' },
	{ label: 'Work', href: '#breadcrumbs' },
	{ label: 'Case studies', href: '#breadcrumbs' },
	{ label: 'Lumen rebrand', href: '#breadcrumbs' },
	{ label: 'Brand system', href: '#breadcrumbs' },
	{ label: 'Logo', href: '#breadcrumbs' },
	{ label: 'Clear space' },
];

const LONG_TRAIL: BreadcrumbItem[] = [
	{ label: 'Home', href: '#breadcrumbs' },
	{ label: 'Insights and field notes from the studio', href: '#breadcrumbs' },
	{ label: 'How we rebuilt a fintech onboarding without adding a single new screen' },
];

type SidebarId = 'overview' | 'projects' | 'inbox' | 'calendar' | 'brand' | 'settings';

const BAR = ['work', 'process', 'studio', 'journal'] as const;
type BarId = (typeof BAR)[number];

export default function NavigationGallery() {
	const [sidebar, setSidebar] = useState<SidebarId>('projects');
	const [bar, setBar] = useState<BarId>('process');
	const [page, setPage] = useState(5);
	const [compactPage, setCompactPage] = useState(3);
	const [drawer, setDrawer] = useState<'filters' | 'details' | 'long' | null>(null);
	const [lastAction, setLastAction] = useState('Nothing yet');
	const [file, setFile] = useState<string | null>('hero-tsx');

	const pickSidebar = (id: SidebarId) => (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		setSidebar(id);
	};
	const pickBar = (id: BarId) => (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		setBar(id);
	};

	return (
		<>
			{/* ───────────────────────── Breadcrumbs ───────────────────────── */}
			<ShowcaseSection
				id="breadcrumbs"
				eyebrow={GROUP}
				title="Breadcrumbs"
				description="Where this page sits in the hierarchy. A labelled nav landmark around an ordered list; separators are decorative and the current page is plain text with aria-current=&quot;page&quot;."
			>
				<Specimen title="Default" note="Ancestors are locale-aware DS Links: subtle, underline and strong on hover, focus ring on keyboard focus.">
					<ThemePair>
						<Breadcrumbs items={TRAIL} />
					</ThemePair>
				</Specimen>
				<Specimen title="Separators & sizes" note="chevron (default) or slash; md 14px or sm 12px type.">
					<ThemePair layout="column">
						<Cell label="slash · md">
							<Breadcrumbs items={TRAIL} separator="slash" />
						</Cell>
						<Cell label="chevron · sm">
							<Breadcrumbs items={TRAIL} size="sm" />
						</Cell>
					</ThemePair>
				</Specimen>
				<Specimen
					title="Collapsed trail"
					note="Past maxItems (4) the middle levels fold into an overflow DropdownMenu of links: the root, the parent and the current page stay."
				>
					<ThemePair>
						<Breadcrumbs items={DEEP_TRAIL} />
					</ThemePair>
				</Specimen>
				<Specimen title="Long labels & a single level" note="Each label truncates at 250px with the full text in its title; a root page shows one item.">
					<ThemePair layout="column">
						<Cell label="long labels">
							<Breadcrumbs items={LONG_TRAIL} />
						</Cell>
						<Cell label="root only">
							<Breadcrumbs items={[{ label: 'Home' }]} />
						</Cell>
					</ThemePair>
				</Specimen>
				<Usage use="deep, hierarchical sites (case studies, docs, a shop)." avoid="flat sites or a step-by-step flow; that is a stepper, not a trail." />
			</ShowcaseSection>

			{/* ───────────────────────── Navigation ───────────────────────── */}
			<ShowcaseSection
				id="navigation"
				eyebrow={GROUP}
				title="Navigation"
				description="A nav landmark with grouped links, purpose icons and counts. The current link carries aria-current and sits on the header's active pill: black on light, white on dark."
			>
				<Specimen title="Vertical, grouped" note="Click a link: the active pill moves to it. Hover tints a row; Disabled is text, out of the tab order.">
					<ThemePair align="start">
						<div className={styles.sidebar}>
							<Navigation label="Workspace">
								<NavGroup heading="Workspace">
									<NavItem href="#navigation" icon="blocks" current={sidebar === 'overview'} onClick={pickSidebar('overview')}>
										Overview
									</NavItem>
									<NavItem href="#navigation" icon="notebook" badge="12" badgeLabel="12 projects" current={sidebar === 'projects'} onClick={pickSidebar('projects')}>
										Projects
									</NavItem>
									<NavItem href="#navigation" icon="inbox" badge="3" badgeLabel="3 unread" current={sidebar === 'inbox'} onClick={pickSidebar('inbox')}>
										Inbox
									</NavItem>
									<NavItem href="#navigation" icon="calendar" current={sidebar === 'calendar'} onClick={pickSidebar('calendar')}>
										Calendar
									</NavItem>
								</NavGroup>
								<NavGroup heading="Studio">
									<NavItem href="#navigation" icon="palette" current={sidebar === 'brand'} onClick={pickSidebar('brand')}>
										Brand guidelines and the long-form voice notes
									</NavItem>
									<NavItem href="#navigation" icon="enhance" current={sidebar === 'settings'} onClick={pickSidebar('settings')}>
										Settings
									</NavItem>
									<NavItem href="#navigation" icon="launch" badge="Soon" disabled>
										Releases
									</NavItem>
								</NavGroup>
							</Navigation>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen
					title="Horizontal"
					note="The header's glass bar: the active pill is the transitions.dev Tabs sliding pill, it slides when the current link changes and scrolls sideways on narrow screens."
				>
					<ThemePair layout="column">
						<Navigation label="Studio sections" orientation="horizontal">
							{BAR.map((id) => (
								<NavItem key={id} href="#navigation" current={bar === id} onClick={pickBar(id)}>
									{id[0].toUpperCase() + id.slice(1)}
								</NavItem>
							))}
						</Navigation>
						<Navigation label="Studio sections with icons" orientation="horizontal">
							<NavItem href="#navigation" icon="discover" current="location">
								Discover
							</NavItem>
							<NavItem href="#navigation" icon="design-spline">
								Design
							</NavItem>
							<NavItem href="#navigation" icon="code" badge="2">
								Develop
							</NavItem>
						</Navigation>
					</ThemePair>
				</Specimen>
				<Usage use="moving between the pages or sections of one product or area." avoid="actions (use Button or DropdownMenu) or switching views in place (use Tabs)." />
			</ShowcaseSection>

			{/* ───────────────────────── Pagination ───────────────────────── */}
			<ShowcaseSection
				id="pagination"
				eyebrow={GROUP}
				title="Pagination"
				description="Pages of a long list. Every page is named “Page n”, the current one is aria-current=&quot;page&quot; on the active pill, ellipses are decorative and the bar keeps the same number of slots on every page. Not the carousel's PaginationDots."
			>
				<Specimen title="Full" note="Previous and Next are ghost Buttons; at the ends they stay focusable with aria-disabled. Pass getHref for real links (server-rendered lists).">
					<ThemePair>
						<Pagination page={page} pageCount={12} onPageChange={setPage} variant="full" />
					</ThemePair>
				</Specimen>
				<Specimen title="Edges & short lists" note="First and last page disable one arrow; seven pages or fewer show every number; one page disables both.">
					<ThemePair layout="column">
						<Cell label="page 1 of 12">
							<Pagination page={1} pageCount={12} variant="full" />
						</Cell>
						<Cell label="page 12 of 12 · siblingCount 2">
							<Pagination page={12} pageCount={12} siblingCount={2} variant="full" />
						</Cell>
						<Cell label="page 2 of 4">
							<Pagination page={2} pageCount={4} variant="full" />
						</Cell>
						<Cell label="page 1 of 1">
							<Pagination page={1} pageCount={1} variant="full" />
						</Cell>
					</ThemePair>
				</Specimen>
				<Specimen title="Compact & auto" note="compact reads “Page 3 of 12” between icon buttons and announces the change politely. auto (the default) switches to compact on phones (under 480px).">
					<ThemePair layout="column">
						<Cell label="compact">
							<Pagination page={compactPage} pageCount={12} onPageChange={setCompactPage} variant="compact" />
						</Cell>
						<Cell label="auto">
							<Pagination page={compactPage} pageCount={12} onPageChange={setCompactPage} />
						</Cell>
					</ThemePair>
				</Specimen>
				<Usage use="long lists people scan in order (journal, case studies, search results)." avoid="carousels (PaginationDots) or feeds people only scroll (load more)." />
			</ShowcaseSection>

			{/* ───────────────────────── Tabs ───────────────────────── */}
			<ShowcaseSection
				id="tabs"
				eyebrow={GROUP}
				title="Tabs"
				description="Switch between panels in place. WAI-ARIA APG tabs: one tab stop, arrows move and select, Home/End jump; the selected tab sits on the Tabs sliding pill, SegmentedControl's material."
			>
				<Specimen title="Default" note="Arrow keys move and select (automatic activation); Archive is disabled: focusable, never selected. Tab from a tab goes to its panel.">
					<ThemePair align="start">
						<Tabs defaultValue="overview">
							<TabList label="Project">
								<Tab value="overview" icon="blocks">
									Overview
								</Tab>
								<Tab value="files" icon="notebook" badge="8">
									Files
								</Tab>
								<Tab value="activity" icon="calendar">
									Activity
								</Tab>
								<Tab value="archive" disabled>
									Archive
								</Tab>
							</TabList>
							<TabPanel value="overview">
								<Text size="sm" tone="subtle">
									A product site and design system for a fintech launch, shipped in six weeks.
								</Text>
							</TabPanel>
							<TabPanel value="files">
								<Text size="sm" tone="subtle">
									Eight files: the brief, two moodboards, the Figma library and four exports.
								</Text>
							</TabPanel>
							<TabPanel value="activity">
								<Text size="sm" tone="subtle">
									Last update two days ago: the case study went live.
								</Text>
							</TabPanel>
							<TabPanel value="archive">
								<Text size="sm" tone="subtle">
									Archived work.
								</Text>
							</TabPanel>
						</Tabs>
					</ThemePair>
				</Specimen>
				<Specimen title="Small, full width & manual" note="activation=&quot;manual&quot;: arrows only move focus, Enter or Space selects (use it when a panel is slow to render).">
					<ThemePair align="start">
						<div className={styles.stack}>
							<Tabs defaultValue="week" size="sm" activation="manual">
								<TabList label="Range" fullWidth>
									<Tab value="day">Day</Tab>
									<Tab value="week">Week</Tab>
									<Tab value="month">Month</Tab>
								</TabList>
								<TabPanel value="day">
									<Text size="sm" tone="subtle">
										Today
									</Text>
								</TabPanel>
								<TabPanel value="week">
									<Text size="sm" tone="subtle">
										This week
									</Text>
								</TabPanel>
								<TabPanel value="month">
									<Text size="sm" tone="subtle">
										This month
									</Text>
								</TabPanel>
							</Tabs>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Vertical & long labels" note="Vertical lists use Up/Down; the pill slides on both axes. A long row scrolls sideways instead of wrapping.">
					<ThemePair align="start" layout="column">
						<Tabs defaultValue="profile" orientation="vertical">
							<TabList label="Settings">
								<Tab value="profile">Profile</Tab>
								<Tab value="notifications" badge="2">
									Notifications
								</Tab>
								<Tab value="billing">Billing</Tab>
							</TabList>
							<TabPanel value="profile">
								<Text size="sm" tone="subtle">
									Name, photo and the timezone we book calls in.
								</Text>
							</TabPanel>
							<TabPanel value="notifications">
								<Text size="sm" tone="subtle">
									Two channels need attention.
								</Text>
							</TabPanel>
							<TabPanel value="billing">
								<Text size="sm" tone="subtle">
									Invoices are sent on the first business day.
								</Text>
							</TabPanel>
						</Tabs>
						<Tabs defaultValue="discovery">
							<TabList label="Process stages">
								<Tab value="discovery">Discovery and research</Tab>
								<Tab value="definition">Definition of the product</Tab>
								<Tab value="design">Design and prototyping</Tab>
								<Tab value="development">Development and integration</Tab>
							</TabList>
							<TabPanel value="discovery">
								<Text size="sm" tone="subtle">
									Interviews, audits and a map of what already works.
								</Text>
							</TabPanel>
							<TabPanel value="definition">
								<Text size="sm" tone="subtle">
									Scope, flows and the success metric.
								</Text>
							</TabPanel>
							<TabPanel value="design">
								<Text size="sm" tone="subtle">
									Figma library first, screens second.
								</Text>
							</TabPanel>
							<TabPanel value="development">
								<Text size="sm" tone="subtle">
									Next.js, the design system and the CMS.
								</Text>
							</TabPanel>
						</Tabs>
					</ThemePair>
				</Specimen>
				<Usage use="peer views of one object that people compare or switch often." avoid="steps in order (a stepper), page navigation (Navigation) or one value in a form (SegmentedControl)." />
			</ShowcaseSection>

			{/* ───────────────────────── Dropdown menu ───────────────────────── */}
			<ShowcaseSection
				id="dropdown-menu"
				eyebrow={GROUP}
				title="Dropdown menu"
				description="Actions behind a button. WAI-ARIA APG menu button: Enter, Space or ArrowDown open on the first item (ArrowUp on the last), arrows wrap, Home/End jump, typing finds an item, Escape closes and returns focus. Menu dropdown motion, origin-aware."
			>
				<Specimen title="Default" note="Purpose icons, shortcut hints (aria-keyshortcuts), a labelled group, a link item, a destructive item and a disabled one (focusable, inert).">
					<ThemePair align="start">
						<div className={styles.stack}>
							<DropdownMenu trigger={{ iconStart: 'menu', children: 'Actions' }}>
								<MenuItem icon="write" shortcut="⌘E" keyshortcuts="Meta+E" onSelect={() => setLastAction('Edit')}>
									Edit
								</MenuItem>
								<MenuItem icon="copy" shortcut="⌘D" keyshortcuts="Meta+D" onSelect={() => setLastAction('Duplicate')}>
									Duplicate
								</MenuItem>
								<MenuItem icon="external-link" href="https://cal.com/yetastudio">
									Book a review call
								</MenuItem>
								<MenuSeparator />
								<MenuGroup label="Share">
									<MenuItem icon="link" onSelect={() => setLastAction('Copy link')}>
										Copy link
									</MenuItem>
									<MenuItem icon="calendar" onSelect={() => setLastAction('Schedule')}>
										Schedule post
									</MenuItem>
								</MenuGroup>
								<MenuSeparator />
								<MenuItem icon="pin" disabled>
									Pin to home
								</MenuItem>
								<MenuItem icon="trash" tone="danger" shortcut="⌘⌫" keyshortcuts="Meta+Backspace" onSelect={() => setLastAction('Delete')}>
									Delete project
								</MenuItem>
							</DropdownMenu>
							<Text size="xs" tone="faint" aria-live="polite">
								Last action: {lastAction}
							</Text>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Icon trigger, end-aligned & upward" note="align=&quot;end&quot; grows from the button's right corner; side=&quot;top&quot; opens upward and flips automatically when the viewport has no room.">
					<ThemePair>
						<Cell label="icon only · align end">
							<DropdownMenu align="end" trigger={{ icon: 'ellipsis', label: 'More options', variant: 'glass' }}>
								<MenuItem icon="write">Rename</MenuItem>
								<MenuItem icon="copy">Duplicate</MenuItem>
								<MenuSeparator />
								<MenuItem icon="trash" tone="danger">
									Remove
								</MenuItem>
							</DropdownMenu>
						</Cell>
						<Cell label="side top · long labels">
							<DropdownMenu side="top" trigger={{ iconStart: 'spark', children: 'Suggestions' }}>
								<MenuItem icon="enhance">Tighten the hero copy to a single, confident sentence</MenuItem>
								<MenuItem icon="spark">Swap the stock photo for a product shot</MenuItem>
							</DropdownMenu>
						</Cell>
						<Cell label="nothing to do">
							<DropdownMenu trigger={{ iconStart: 'menu', variant: 'ghost', children: 'Bulk actions' }}>
								<MenuItem disabled>Select items first</MenuItem>
							</DropdownMenu>
						</Cell>
					</ThemePair>
				</Specimen>
				<Usage use="a short list of actions on one object, or overflow actions that don't fit." avoid="choosing a form value (a select) or primary navigation (Navigation)." />
			</ShowcaseSection>

			{/* ───────────────────────── Drawer ───────────────────────── */}
			<ShowcaseSection
				id="drawer"
				eyebrow={GROUP}
				title="Drawer"
				description="A panel that slides in from an edge, for filters and details. Built on Dialog's sheets: native <dialog>, focus trapped, Escape and the backdrop close it, focus returns to the button, Panel reveal motion."
			>
				<Specimen title="Side & bottom" note="Header (title + close), a description line, a scrolling body and an optional footer. Opens in the page's own theme.">
					<ThemePair>
						<Button iconStart="target" aria-haspopup="dialog" onClick={() => setDrawer('filters')}>
							Filters
						</Button>
						<Button iconStart="notebook" aria-haspopup="dialog" onClick={() => setDrawer('details')}>
							Project details
						</Button>
						<Button iconStart="book" aria-haspopup="dialog" onClick={() => setDrawer('long')}>
							Long content
						</Button>
					</ThemePair>
				</Specimen>
				<Usage use="secondary tasks that keep the page in view: filters, details, a mobile menu." avoid="a decision that must block the page (Dialog) or a single short message (Toast)." />
			</ShowcaseSection>

			<Drawer
				open={drawer === 'filters'}
				onClose={() => setDrawer(null)}
				title="Filters"
				description="Narrow the case studies by service and industry."
				footer={
					<>
						<Button variant="ghost" onClick={() => setDrawer(null)}>
							Clear
						</Button>
						<Button onClick={() => setDrawer(null)}>Show 12 results</Button>
					</>
				}
			>
				<div className={styles.filters}>
					<Checkbox label="Brand identity" defaultChecked />
					<Checkbox label="Product design" defaultChecked />
					<Checkbox label="Development" />
					<Checkbox label="Design systems" description="Libraries, tokens and docs." />
					<Checkbox label="Motion" disabled description="No case studies yet." />
				</div>
			</Drawer>
			<Drawer open={drawer === 'details'} onClose={() => setDrawer(null)} side="bottom" title="Lumen rebrand" description="Fintech · 6 weeks · 2024">
				<Text size="sm" tone="subtle">
					A bottom sheet: on phones the case study details open here, with the page still in view above.
				</Text>
			</Drawer>
			<Drawer open={drawer === 'long'} onClose={() => setDrawer(null)} title="Process notes" description="The body scrolls; the header and footer stay put." footer={<Button onClick={() => setDrawer(null)}>Done</Button>}>
				<div className={styles.longCopy}>
					{Array.from({ length: 14 }, (_, index) => (
						<Text key={index} size="sm" tone="subtle">
							{index + 1}. We start every project by listening: what the product does, who it serves and what already works. Then we write
							the brief back in our words, so nothing is assumed.
						</Text>
					))}
				</div>
			</Drawer>

			{/* ───────────────────────── Skip link ───────────────────────── */}
			<ShowcaseSection
				id="skip-link"
				eyebrow={GROUP}
				title="Skip link"
				description="The first tab stop of a page: hidden until it gets keyboard focus, then it jumps past the header to the main landmark. The header renders the same link inline and can switch to this component."
			>
				<Specimen title="Hidden until focused" note="Tab into the frame: the link slides in. position=&quot;absolute&quot; scopes it to this frame; the page shell uses the default fixed position.">
					<ThemePair>
						<div className={styles.page}>
							<SkipLink targetId="skip-link" position="absolute" />
							<Text size="sm" tone="subtle">
								Header, logo and nav would sit here. Keyboard users skip them in one keystroke.
							</Text>
						</div>
					</ThemePair>
				</Specimen>
				<Specimen title="Focused" note="What keyboard focus shows: the inverse pill at the top-left corner.">
					<ThemePair>
						<div className={styles.page}>
							<SkipLink targetId="skip-link" position="absolute" className={styles.revealed}>
								Skip to main content
							</SkipLink>
							<Text size="sm" tone="subtle">
								Lands on the element with the matching id.
							</Text>
						</div>
					</ThemePair>
				</Specimen>
				<Usage use="every page with a header or long navigation before the content." avoid="in-page section links people should see (a table of contents)." />
			</ShowcaseSection>

			{/* ───────────────────────── Tree view ───────────────────────── */}
			<ShowcaseSection
				id="tree-view"
				eyebrow={GROUP}
				title="Tree view"
				description="Nested hierarchy, such as a file system. WAI-ARIA APG tree: one tab stop, Up/Down through visible nodes, Right opens or enters, Left closes or goes up, Home/End, * opens siblings, type-ahead, Enter/Space select. Branches open with Card resize."
			>
				<Specimen title="Files, selectable" note="Folder and file icons, trailing meta; the selected node sits on the control pill (aria-selected, like Tabs), not the aria-current active pill. Clicking a folder opens and selects it.">
					<ThemePair align="start">
						<Surface tone="raised" radius="lg" padding="xs" className={styles.sidebar}>
							<TreeView label="Project files" defaultExpanded={['src', 'components']} selectedId={file} onSelect={setFile}>
								<TreeItem id="src" label="src">
									<TreeItem id="app" label="app">
										<TreeItem id="layout-tsx" label="layout.tsx" meta="2 KB" />
										<TreeItem id="page-tsx" label="page.tsx" meta="4 KB" />
									</TreeItem>
									<TreeItem id="components" label="components">
										<TreeItem id="hero-tsx" label="hero.tsx" meta="6 KB" />
										<TreeItem id="header-tsx" label="header.tsx" meta="8 KB" />
										<TreeItem id="case-study-dialog" label="case-study-dialog-with-a-very-long-file-name.tsx" meta="12 KB" />
									</TreeItem>
									<TreeItem id="styles" label="styles">
										<TreeItem id="tokens-css" label="tokens.css" meta="14 KB" />
									</TreeItem>
								</TreeItem>
								<TreeItem id="public" label="public">
									<TreeItem id="fonts" label="fonts" disabled>
										<TreeItem id="funnel" label="FunnelDisplay.woff2" />
									</TreeItem>
									<TreeItem id="favicon" label="favicon.svg" icon="spark" meta="1 KB" />
								</TreeItem>
								<TreeItem id="readme" label="README.md" icon="book" meta="3 KB" />
							</TreeView>
						</Surface>
					</ThemePair>
				</Specimen>
				<Specimen title="Expand only" note="selectable={false}: no aria-selected; Enter and Space open and close branches. fonts above is disabled: focusable, never selected or opened.">
					<ThemePair align="start">
						<Surface tone="raised" radius="lg" padding="xs" className={styles.sidebar}>
							<TreeView label="Services" selectable={false} defaultExpanded={['design']}>
								<TreeItem id="strategy" label="Strategy" icon="target">
									<TreeItem id="research" label="Research" icon="discover" />
									<TreeItem id="positioning" label="Positioning" icon="spark" />
								</TreeItem>
								<TreeItem id="design" label="Design" icon="design-spline">
									<TreeItem id="identity" label="Identity" icon="palette" />
									<TreeItem id="product" label="Product" icon="blocks" />
								</TreeItem>
								<TreeItem id="build" label="Build" icon="code">
									<TreeItem id="web" label="Web" icon="development" />
								</TreeItem>
							</TreeView>
						</Surface>
					</ThemePair>
				</Specimen>
				<Usage use="real nesting people open and close: files, taxonomies, org charts." avoid="flat lists (a List) or one level of disclosure (Accordion)." />
			</ShowcaseSection>
		</>
	);
}
