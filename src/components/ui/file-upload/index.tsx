'use client';

//! React Core
import { useEffect, useId, useRef, useState, type DragEvent, type ReactNode } from 'react';

//! Hooks
import { useLocale, useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { File as FileRow, formatBytes, type FileLabels, type FileStatus } from '@/components/ui/file';
import { Icon } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/** The browser's File (this module also imports the File row component). */
type BrowserFile = globalThis.File;

export type FileUploadLabels = {
	/** Before the button, on devices that can drag ("Drag files here or"). */
	drop: string;
	/** Button text. */
	choose: string;
	/** Rejected type; receives the file name. */
	type: (name: string) => string;
	/** Too large; receives the file name and the limit. */
	size: (name: string, limit: string) => string;
	/** More files than `maxFiles`. */
	count: (max: number) => string;
	/** Announced after adding. */
	added: (count: number) => string;
	/** Announced after removing; receives the file name. */
	removed: (name: string) => string;
	/** Announced when an upload ends; receives the file name. */
	uploaded: (name: string) => string;
	/** An upload that failed without a message. */
	failed: string;
};

export type FileUploadProps = {
	label: string;
	/** Say what is accepted here (types, size, how many). */
	hint?: ReactNode;
	error?: string;
	optional?: boolean;
	required?: boolean;
	disabled?: boolean;
	/** Same syntax as the native `accept`: `.pdf,image/*`. Checked on drop too. */
	accept?: string;
	/** Bytes per file. */
	maxSize?: number;
	multiple?: boolean;
	maxFiles?: number;
	/** The native input submits the accepted files under this name (dropped ones included). */
	name?: string;
	/** The accepted files, after every add or remove. */
	onChange?: (files: BrowserFile[]) => void;
	/** Uploads one file. Call `report` with 0–100 as it goes; resolve when done, reject with an Error to fail it. */
	onUpload?: (file: BrowserFile, report: (percent: number) => void) => Promise<void>;
	labels?: Partial<FileUploadLabels>;
	/** Passed to every file row. */
	fileLabels?: Partial<FileLabels>;
	className?: string;
};

type Item = { id: number; file: BrowserFile; status: FileStatus; progress?: number; error?: string };

function useDefaultLabels(): FileUploadLabels {
	const t = useTranslations('common.ui.fileUpload');
	return {
		drop: t('drop'),
		choose: t('choose'),
		type: (name) => t('type', { name }),
		size: (name, limit) => t('size', { name, limit }),
		count: (max) => t('count', { max }),
		added: (count) => t('added', { count }),
		removed: (name) => t('removed', { name }),
		uploaded: (name) => t('uploaded', { name }),
		failed: t('failed'),
	};
}

/** The files that made it in (not refused, not failed). */
const acceptedFiles = (list: Item[]) => list.filter((item) => item.status !== 'error').map((item) => item.file);

function matchesAccept(file: BrowserFile, accept?: string) {
	if (!accept) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return accept
		.split(',')
		.map((token) => token.trim().toLowerCase())
		.filter(Boolean)
		.some((token) =>
			token.startsWith('.') ? name.endsWith(token) : token.endsWith('/*') ? type.startsWith(token.slice(0, -1)) : type === token
		);
}

/**
 * Inspo component (component.gallery "File upload"): a dropzone around a real file input. Files come
 * from the button (the native picker) or a drop; each is checked against `accept`, `maxSize` and
 * `maxFiles` and listed as a File row: accepted ones upload through `onUpload` with their progress
 * and a success check, rejected ones say why and can be removed. Changes are announced politely,
 * and the native input keeps the accepted files so a plain form submit sends them.
 */
export function FileUpload({
	label,
	hint,
	error,
	optional,
	required,
	disabled,
	accept,
	maxSize,
	multiple = true,
	maxFiles,
	name,
	onChange,
	onUpload,
	labels,
	fileLabels,
	className,
}: FileUploadProps) {
	const t = useTranslations('common');
	const locale = useLocale();
	const copy = { ...useDefaultLabels(), ...labels };
	const id = useId();
	const inputId = `${id}-input`;
	const labelId = `${id}-label`;
	const buttonId = `${id}-button`;
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;

	const [items, setItems] = useState<Item[]>([]);
	const [dragging, setDragging] = useState(false);
	const [limitError, setLimitError] = useState<string | null>(null);
	const [announcement, setAnnouncement] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
	const dragDepth = useRef(0);
	const nextId = useRef(0);

	const message = disabled ? undefined : (error ?? limitError ?? undefined);

	// The native input always holds the accepted files (dropped ones included, failed uploads left out),
	// so a plain form submit sends them. The latest list is mirrored for the upload callbacks.
	const itemsRef = useRef<Item[]>([]);
	useEffect(() => {
		itemsRef.current = items;
		const input = inputRef.current;
		if (!input || typeof DataTransfer === 'undefined') return;
		const transfer = new DataTransfer();
		acceptedFiles(items).forEach((file) => transfer.items.add(file));
		input.files = transfer.files;
	}, [items]);

	const sync = (next: Item[]) => onChange?.(acceptedFiles(next));

	const patch = (itemId: number, changes: Partial<Item>) =>
		setItems((current) => current.map((item) => (item.id === itemId ? { ...item, ...changes } : item)));

	const upload = (item: Item) => {
		if (!onUpload) return;
		onUpload(item.file, (percent) => patch(item.id, { progress: percent }))
			.then(() => {
				patch(item.id, { status: 'success', progress: 100 });
				setAnnouncement(copy.uploaded(item.file.name));
			})
			.catch((reason: unknown) => {
				patch(item.id, { status: 'error', error: reason instanceof Error && reason.message ? reason.message : copy.failed });
				sync(itemsRef.current.filter((entry) => entry.id !== item.id));
			});
	};

	const add = (incoming: BrowserFile[]) => {
		if (disabled || !incoming.length) return;
		const kept = multiple ? items : [];
		let room = maxFiles ? maxFiles - kept.filter((item) => item.status !== 'error').length : Infinity;
		let overflow = false;
		const added: Item[] = [];
		for (const file of multiple ? incoming : incoming.slice(0, 1)) {
			const reason = !matchesAccept(file, accept)
				? copy.type(file.name)
				: maxSize !== undefined && file.size > maxSize
					? copy.size(file.name, formatBytes(maxSize, locale))
					: undefined;
			if (!reason && room <= 0) {
				overflow = true;
				continue;
			}
			if (!reason) room -= 1;
			nextId.current += 1;
			added.push({
				id: nextId.current,
				file,
				status: reason ? 'error' : onUpload ? 'uploading' : 'idle',
				progress: reason || !onUpload ? undefined : 0,
				error: reason,
			});
		}
		const next = [...kept, ...added];
		// Functional so progress reported in between is not lost.
		setItems((current) => (multiple ? [...current, ...added] : added));
		setLimitError(overflow && maxFiles ? copy.count(maxFiles) : null);
		setAnnouncement(copy.added(added.filter((item) => item.status !== 'error').length));
		sync(next);
		added.filter((item) => item.status === 'uploading').forEach(upload);
	};

	const remove = (item: Item) => {
		const next = items.filter((entry) => entry.id !== item.id);
		setItems((current) => current.filter((entry) => entry.id !== item.id));
		setLimitError(null);
		setAnnouncement(copy.removed(item.file.name));
		sync(next);
		// The row (and its button) is gone: focus returns to the way in.
		buttonRef.current?.focus();
	};

	const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer.types).includes('Files');

	const describedBy = [hint ? hintId : null, message ? errorId : null].filter(Boolean).join(' ') || undefined;

	return (
		<div className={cx(styles.field, disabled && styles.disabled, className)}>
			<label id={labelId} htmlFor={inputId} className={styles.label}>
				{label}
				{optional && <span className={styles.optional}> ({t('optional')})</span>}
			</label>
			{hint && (
				<p id={hintId} className={styles.hint}>
					{hint}
				</p>
			)}
			<div
				className={cx(styles.dropzone, dragging && styles.dragging, message && styles.invalid)}
				onDragEnter={(event) => {
					if (disabled || !hasFiles(event)) return;
					event.preventDefault();
					dragDepth.current += 1;
					setDragging(true);
				}}
				onDragOver={(event) => {
					if (disabled || !hasFiles(event)) return;
					event.preventDefault();
					event.dataTransfer.dropEffect = 'copy';
				}}
				onDragLeave={() => {
					dragDepth.current = Math.max(0, dragDepth.current - 1);
					if (dragDepth.current === 0) setDragging(false);
				}}
				onDrop={(event) => {
					if (disabled || !hasFiles(event)) return;
					event.preventDefault();
					dragDepth.current = 0;
					setDragging(false);
					add(Array.from(event.dataTransfer.files));
				}}
			>
				<span className={cx(styles.tile, 'u-bevel')} aria-hidden="true">
					<Icon name="upload" size="md" />
				</span>
				<span className={styles.prompt}>
					<span className={styles.dropText}>{copy.drop}</span>
					<Button
						ref={buttonRef}
						id={buttonId}
						size="md"
						disabled={disabled}
						aria-labelledby={`${buttonId} ${labelId}`}
						aria-describedby={describedBy}
						onClick={() => inputRef.current?.click()}
					>
						{copy.choose}
					</Button>
				</span>
				<input
					ref={inputRef}
					id={inputId}
					type="file"
					className="u-visually-hidden"
					tabIndex={-1}
					name={name}
					accept={accept}
					multiple={multiple}
					required={required && !items.some((item) => item.status !== 'error')}
					disabled={disabled}
					onChange={(event) => {
						const chosen = Array.from(event.target.files ?? []);
						// Reset so picking the same file again still fires; the items effect refills it with the accepted files.
						event.target.value = '';
						add(chosen);
					}}
				/>
			</div>
			{message && (
				<p id={errorId} className={styles.error}>
					<Icon name="alert" size="sm" />
					{message}
				</p>
			)}
			{items.length > 0 && (
				<ul className={styles.list} aria-labelledby={labelId}>
					{items.map((item) => (
						<FileRow
							key={item.id}
							as="li"
							name={item.file.name}
							size={item.file.size}
							type={item.file.type}
							status={item.status}
							progress={item.progress}
							error={item.error}
							labels={fileLabels}
							onRemove={() => remove(item)}
						/>
					))}
				</ul>
			)}
			<span role="status" className="u-visually-hidden">
				{announcement}
			</span>
		</div>
	);
}

export default FileUpload;
