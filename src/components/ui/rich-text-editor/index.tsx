'use client';

//! React Core
import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type RichTextEditorLabels = {
	toolbar: string;
	bold: string;
	italic: string;
	bulletList: string;
	numberedList: string;
	link: string;
	/** The address field of the link bar. */
	linkUrl: string;
	applyLink: string;
	removeLink: string;
	cancel: string;
};

export type RichTextEditorProps = {
	label: string;
	hint?: ReactNode;
	error?: string;
	optional?: boolean;
	required?: boolean;
	disabled?: boolean;
	/** Initial HTML (uncontrolled). */
	defaultValue?: string;
	/** The editor's HTML after every change. */
	onChange?: (html: string) => void;
	placeholder?: string;
	/** Submits the HTML under this name (hidden input). */
	name?: string;
	labels?: Partial<RichTextEditorLabels>;
	className?: string;
};

type Tool = 'bold' | 'italic' | 'bulletList' | 'numberedList' | 'link';
type Pressed = Record<Tool, boolean>;

function useDefaultLabels(): RichTextEditorLabels {
	const t = useTranslations('common.ui.richTextEditor');
	return {
		toolbar: t('toolbar'),
		bold: t('bold'),
		italic: t('italic'),
		bulletList: t('bulletList'),
		numberedList: t('numberedList'),
		link: t('link'),
		linkUrl: t('linkUrl'),
		applyLink: t('applyLink'),
		removeLink: t('removeLink'),
		cancel: t('cancel'),
	};
}

/** Toolbar groups, split by separators. */
const GROUPS: Tool[][] = [['bold', 'italic'], ['bulletList', 'numberedList'], ['link']];

const ICONS: Record<Tool, IconName> = {
	bold: 'bold',
	italic: 'italic',
	bulletList: 'list',
	numberedList: 'list-ordered',
	link: 'link',
};

const COMMANDS: Partial<Record<Tool, string>> = {
	bold: 'bold',
	italic: 'italic',
	bulletList: 'insertUnorderedList',
	numberedList: 'insertOrderedList',
};

const SHORTCUTS: Partial<Record<Tool, string>> = { bold: 'B', italic: 'I', link: 'K' };

const NOTHING_PRESSED: Pressed = { bold: false, italic: false, bulletList: false, numberedList: false, link: false };

const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Accepts web, mail and phone links and site paths; adds https:// to a bare domain; refuses script URLs. */
function safeUrl(input: string): string | null {
	const url = input.trim();
	if (!url) return null;
	if (/^(https?:|mailto:|tel:)/i.test(url) || url.startsWith('/') || url.startsWith('#')) return url;
	if (/^[a-z][\w+.-]*:/i.test(url)) return null;
	return `https://${url}`;
}

const isEmptyHtml = (html: string) => !/<(li|img)\b/i.test(html) && html.replace(/<[^>]*>|&nbsp;/g, '').trim() === '';

/**
 * Inspo component (component.gallery "Rich text editor"): a dependency-free contentEditable with a
 * WAI-ARIA toolbar (one tab stop, arrows / Home / End move between tools, each a toggle with
 * aria-pressed that follows the selection). Bold, italic, bulleted and numbered lists, and links
 * through an inline address bar (⌘/Ctrl K). Pasting keeps plain text only, so the HTML handed to
 * `onChange` stays to these few tags.
 */
export function RichTextEditor({
	label,
	hint,
	error,
	optional,
	required,
	disabled,
	defaultValue = '',
	onChange,
	placeholder,
	name,
	labels,
	className,
}: RichTextEditorProps) {
	const t = useTranslations('common');
	const copy = { ...useDefaultLabels(), ...labels };
	const id = useId();
	const labelId = `${id}-label`;
	const editorId = `${id}-editor`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const urlId = `${id}-url`;

	// The initial HTML is handed to the DOM once; after that the browser owns the content.
	const [initialHtml] = useState(() => ({ __html: defaultValue }));
	const [html, setHtml] = useState(defaultValue);
	const [empty, setEmpty] = useState(() => isEmptyHtml(defaultValue));
	const [pressed, setPressed] = useState<Pressed>(NOTHING_PRESSED);
	const [focusIndex, setFocusIndex] = useState(0);
	const [linkBar, setLinkBar] = useState<{ open: boolean; url: string; editing: boolean }>({ open: false, url: '', editing: false });

	const editorRef = useRef<HTMLDivElement>(null);
	const toolRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const urlRef = useRef<HTMLInputElement>(null);
	const savedRange = useRef<Range | null>(null);

	const message = disabled ? undefined : error;
	const tools = GROUPS.flat();

	const linkAt = (node: Node | null) => {
		const element = node instanceof Element ? node : node?.parentElement;
		const anchor = element?.closest('a');
		return anchor && editorRef.current?.contains(anchor) ? anchor : null;
	};

	// Pressed states follow the caret; the last range in the editor is kept for the toolbar and link bar.
	useEffect(() => {
		const onSelectionChange = () => {
			const editor = editorRef.current;
			const selection = document.getSelection();
			if (!editor || !selection?.rangeCount || !editor.contains(selection.anchorNode)) return;
			savedRange.current = selection.getRangeAt(0).cloneRange();
			setPressed({
				bold: document.queryCommandState('bold'),
				italic: document.queryCommandState('italic'),
				bulletList: document.queryCommandState('insertUnorderedList'),
				numberedList: document.queryCommandState('insertOrderedList'),
				link: Boolean(linkAt(selection.anchorNode)),
			});
		};
		document.addEventListener('selectionchange', onSelectionChange);
		return () => document.removeEventListener('selectionchange', onSelectionChange);
	}, []);

	useEffect(() => {
		if (linkBar.open) urlRef.current?.focus();
	}, [linkBar.open]);

	const emit = () => {
		const editor = editorRef.current;
		if (!editor) return;
		const next = editor.innerHTML;
		setHtml(next);
		setEmpty(isEmptyHtml(next));
		onChange?.(next);
	};

	/** Puts focus and the last selection back in the editor, so a command applies where the person was. */
	const restore = () => {
		const editor = editorRef.current;
		if (!editor) return;
		editor.focus({ preventScroll: true });
		const range = savedRange.current;
		const selection = document.getSelection();
		if (range && selection && editor.contains(range.startContainer)) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	const openLinkBar = () => {
		const anchor = linkAt(savedRange.current?.startContainer ?? null);
		setLinkBar({ open: true, url: anchor?.getAttribute('href') ?? '', editing: Boolean(anchor) });
	};

	const closeLinkBar = () => {
		setLinkBar({ open: false, url: '', editing: false });
		restore();
	};

	const applyLink = () => {
		const url = safeUrl(linkBar.url);
		restore();
		if (url) {
			const anchor = linkAt(savedRange.current?.startContainer ?? null);
			const selection = document.getSelection();
			if (anchor) anchor.setAttribute('href', url);
			else if (selection && !selection.isCollapsed) document.execCommand('createLink', false, url);
			else document.execCommand('insertHTML', false, `<a href="${escapeHtml(url)}">${escapeHtml(linkBar.url.trim())}</a>`);
		}
		setLinkBar({ open: false, url: '', editing: false });
		emit();
	};

	const removeLink = () => {
		restore();
		const anchor = linkAt(savedRange.current?.startContainer ?? null);
		if (anchor) {
			const range = document.createRange();
			range.selectNodeContents(anchor);
			const selection = document.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
		document.execCommand('unlink');
		setLinkBar({ open: false, url: '', editing: false });
		emit();
	};

	const run = (tool: Tool, event?: MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		if (tool === 'link') {
			openLinkBar();
			return;
		}
		restore();
		document.execCommand(COMMANDS[tool] as string, false);
		emit();
		// Keyboard presses (detail 0) keep focus on the tool, as a toolbar should; clicks stay in the text.
		if (event && event.detail === 0) toolRefs.current[tools.indexOf(tool)]?.focus();
	};

	const onToolbarKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const last = tools.length - 1;
		const next =
			event.key === 'ArrowRight'
				? (focusIndex + 1) % tools.length
				: event.key === 'ArrowLeft'
					? (focusIndex - 1 + tools.length) % tools.length
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? last
							: -1;
		if (next < 0) return;
		event.preventDefault();
		setFocusIndex(next);
		toolRefs.current[next]?.focus();
	};

	const onEditorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			openLinkBar();
		}
	};

	const describedBy = message ? errorId : hint ? hintId : undefined;

	return (
		<div className={cx(styles.field, message && styles.invalid, disabled && styles.disabled, className)}>
			<span id={labelId} className={styles.label}>
				{label}
				{optional && <span className={styles.optional}> ({t('optional')})</span>}
			</span>
			<div className={styles.box}>
				<div role="toolbar" aria-label={copy.toolbar} aria-controls={editorId} className={styles.toolbar} onKeyDown={onToolbarKeyDown}>
					{GROUPS.map((group, groupIndex) => (
						<Fragment key={group.join('-')}>
							{groupIndex > 0 && <span role="separator" aria-orientation="vertical" className={styles.separator} />}
							{group.map((tool) => {
								const index = tools.indexOf(tool);
								const shortcut = SHORTCUTS[tool];
								return (
									<button
										key={tool}
										ref={(node) => {
											toolRefs.current[index] = node;
										}}
										type="button"
										className={styles.tool}
										tabIndex={index === focusIndex ? 0 : -1}
										aria-label={copy[tool]}
										aria-pressed={pressed[tool]}
										aria-keyshortcuts={shortcut ? `Control+${shortcut} Meta+${shortcut}` : undefined}
										title={copy[tool]}
										disabled={disabled}
										// Keep the text selection: a press must not move focus out of the editor.
										onMouseDown={(event) => event.preventDefault()}
										onFocus={() => setFocusIndex(index)}
										onClick={(event) => run(tool, event)}
									>
										<Icon name={ICONS[tool]} size="md" />
									</button>
								);
							})}
						</Fragment>
					))}
				</div>
				{linkBar.open && (
					<div className={styles.linkBar}>
						<label htmlFor={urlId} className="u-visually-hidden">
							{copy.linkUrl}
						</label>
						<input
							ref={urlRef}
							id={urlId}
							type="url"
							inputMode="url"
							className={styles.url}
							placeholder="https://"
							value={linkBar.url}
							onChange={(event) => setLinkBar((current) => ({ ...current, url: event.target.value }))}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									event.preventDefault();
									applyLink();
								} else if (event.key === 'Escape') {
									event.preventDefault();
									event.stopPropagation();
									closeLinkBar();
								}
							}}
						/>
						<Button size="sm" onClick={applyLink}>
							{copy.applyLink}
						</Button>
						{linkBar.editing && (
							<Button size="sm" variant="ghost" onClick={removeLink}>
								{copy.removeLink}
							</Button>
						)}
						<Button size="sm" variant="ghost" icon="close" label={copy.cancel} onClick={closeLinkBar} />
					</div>
				)}
				<div
					ref={editorRef}
					id={editorId}
					role="textbox"
					aria-multiline="true"
					aria-labelledby={labelId}
					aria-describedby={describedBy}
					aria-placeholder={placeholder}
					aria-invalid={Boolean(message) || undefined}
					aria-required={required || undefined}
					aria-disabled={disabled || undefined}
					contentEditable={!disabled}
					tabIndex={disabled ? -1 : 0}
					data-empty={empty || undefined}
					data-placeholder={placeholder}
					data-lenis-prevent
					className={styles.editor}
					dangerouslySetInnerHTML={initialHtml}
					onInput={emit}
					onFocus={() => document.execCommand('defaultParagraphSeparator', false, 'p')}
					onKeyDown={onEditorKeyDown}
					onPaste={(event) => {
						event.preventDefault();
						document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
					}}
				/>
			</div>
			{name && <input type="hidden" name={name} value={html} />}
			{message ? (
				<p id={errorId} className={styles.error}>
					<Icon name="alert" size="sm" />
					{message}
				</p>
			) : (
				hint && (
					<p id={hintId} className={styles.hint}>
						{hint}
					</p>
				)
			)}
		</div>
	);
}

export default RichTextEditor;
