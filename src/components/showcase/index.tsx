//! React Core
import type { ReactNode } from 'react';

//! Components
import { Heading, Text } from '@/components/ui/text';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** A titled block of the showcase pages (/design-system, /brand). */
export function ShowcaseSection({
	id,
	eyebrow,
	title,
	description,
	children,
	className,
}: {
	id: string;
	eyebrow?: string;
	title: string;
	description?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section id={id} className={cx(styles.section, className)} aria-labelledby={`${id}-title`}>
			<header className={styles.sectionHeader}>
				{eyebrow && (
					<Text as="span" size="xs" tone="subtle" className={styles.eyebrow}>
						{eyebrow}
					</Text>
				)}
				<Heading level={2} size="3xl" id={`${id}-title`} tone="display">
					{title}
				</Heading>
				{description && (
					<Text size="md" tone="subtle" className={styles.description}>
						{description}
					</Text>
				)}
			</header>
			{children}
		</section>
	);
}

/** A labelled specimen block inside a section. */
export function Specimen({ title, note, children, className }: { title: string; note?: ReactNode; children: ReactNode; className?: string }) {
	return (
		<div className={cx(styles.specimen, className)}>
			<div className={styles.specimenHeader}>
				<Heading level={3} size="lg" weight="regular">
					{title}
				</Heading>
				{note && (
					<Text size="sm" tone="subtle">
						{note}
					</Text>
				)}
			</div>
			{children}
		</div>
	);
}

/**
 * Renders the same children on a light and a dark canvas side by side.
 * Works because every colour token resolves through `light-dark()`.
 */
export function ThemePair({
	children,
	layout = 'row',
	align = 'center',
	className,
}: {
	children: ReactNode;
	layout?: 'row' | 'column' | 'grid';
	align?: 'center' | 'start';
	className?: string;
}) {
	return (
		<div className={cx(styles.pair, className)}>
			{(['light', 'dark'] as const).map((scheme) => (
				<div key={scheme} data-scheme={scheme} className={cx(styles.canvas, scheme === 'light' ? 'scheme-light' : 'scheme-dark')}>
					<Text as="span" size="2xs" tone="faint" className={styles.canvasLabel}>
						{scheme === 'light' ? 'Light' : 'Dark'}
					</Text>
					<div className={cx(styles.stage, styles[`stage-${layout}`], align === 'start' && styles.alignStart)}>{children}</div>
				</div>
			))}
		</div>
	);
}

/** A single labelled cell inside a stage (e.g. one button state). */
export function Cell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
	return (
		<div className={cx(styles.cell, className)}>
			<div className={styles.cellBody}>{children}</div>
			<Text as="span" size="2xs" tone="faint">
				{label}
			</Text>
		</div>
	);
}

/** A key/value table for props, tokens and motion presets. */
export function SpecTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
	return (
		<div className={styles.tableWrap}>
			<table className={styles.table}>
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column} scope="col">
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, index) => (
						<tr key={index}>
							{row.map((cell, cellIndex) => (
								<td key={cellIndex}>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/** Sticky in-page navigation for the showcase pages. */
export function ShowcaseNav({ label, items }: { label: string; items: Array<{ id: string; label: string; group?: string }> }) {
	const groups = items.reduce<Record<string, typeof items>>((acc, item) => {
		const key = item.group ?? '';
		(acc[key] ??= []).push(item);
		return acc;
	}, {});
	return (
		<nav aria-label={label} className={styles.nav}>
			{Object.entries(groups).map(([group, entries]) => (
				<div key={group} className={styles.navGroup}>
					{group && (
						<Text as="span" size="2xs" tone="faint" className={styles.navGroupLabel}>
							{group}
						</Text>
					)}
					<ul>
						{entries.map((item) => (
							<li key={item.id}>
								<a href={`#${item.id}`} className={styles.navLink}>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
}

/** Two-column layout: sticky nav + content. */
export function ShowcaseLayout({ nav, children }: { nav: ReactNode; children: ReactNode }) {
	return (
		<div className={styles.layout}>
			<aside className={styles.aside}>{nav}</aside>
			<div className={styles.content}>{children}</div>
		</div>
	);
}
