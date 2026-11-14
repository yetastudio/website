'use client';

//! React Core
import { useMemo, type ReactNode } from 'react';

//! Hooks
import { useLocale, useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

export type FileLabels = {
	/** Download action; receives the file name. */
	download: (name: string) => string;
	/** Remove action; receives the file name. */
	remove: (name: string) => string;
	/** Progress bar name; receives the file name. */
	uploading: (name: string) => string;
	/** Status line while uploading; receives the percentage. */
	progress: (percent: number) => string;
	/** Status line while uploading with no percentage. */
	pending: string;
	/** Status line once done. */
	success: string;
};

export type FileProps = {
	name: string;
	/** Bytes. Shown with the locale's units (kB, MB). */
	size?: number;
	/** MIME type; picks the icon with the extension. */
	type?: string;
	status?: FileStatus;
	/** 0–100 while uploading. Omit for an indeterminate wait. */
	progress?: number;
	/** Why it failed (status `error`). */
	error?: string;
	/** Extra meta after the size (a date, an owner). */
	description?: ReactNode;
	/** Adds a download action (a link with `download`). */
	href?: string;
	/** Adds a remove action. */
	onRemove?: () => void;
	/** `li` inside a list of files (FileUpload renders one). */
	as?: 'div' | 'li';
	labels?: Partial<FileLabels>;
	className?: string;
};

function useDefaultLabels(): FileLabels {
	const t = useTranslations('common.ui.file');
	return {
		download: (name) => t('download', { name }),
		remove: (name) => t('remove', { name }),
		uploading: (name) => t('uploading', { name }),
		progress: (percent) => t('progress', { percent }),
		pending: t('pending'),
		success: t('success'),
	};
}

const UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;

/** 1 234 567 → "1.2 MB" in the locale's own units. */
export function formatBytes(bytes: number, locale: string) {
	let size = Math.max(0, bytes);
	let unit = 0;
	while (size >= 1000 && unit < UNITS.length - 1) {
		size /= 1000;
		unit += 1;
	}
	return new Intl.NumberFormat(locale, {
		style: 'unit',
		unit: UNITS[unit],
		unitDisplay: 'short',
		maximumFractionDigits: unit === 0 || size >= 100 ? 0 : 1,
	}).format(size);
}

function iconFor(name: string, type?: string): IconName {
	const extension = name.split('.').pop()?.toLowerCase() ?? '';
	if (type?.startsWith('image/') || /^(png|jpe?g|gif|webp|avif|svg|heic)$/.test(extension)) return 'file-image';
	if (/(zip|compressed|tar|gzip)/.test(type ?? '') || /^(zip|rar|7z|tar|gz)$/.test(extension)) return 'file-archive';
	if (type?.startsWith('text/') || /(pdf|word|document|rtf)/.test(type ?? '') || /^(pdf|docx?|txt|md|rtf|pages|odt)$/.test(extension))
		return 'file-text';
	return 'file';
}

/** The extension as a short tag ("PDF"), when the name has one. */
const extensionOf = (name: string) => (name.includes('.') ? name.split('.').pop()?.toUpperCase() : undefined);

/**
 * Inspo component (component.gallery "File"): one attachment row. A type icon, the name (kept
 * whole in the title when it truncates), size and type, a status line and its actions: download
 * (a real link) and remove, each named after the file. While uploading a thin bar shows progress
 * (role progressbar); success draws the transitions.dev "Success check"; an error states why.
 */
export function File({
	name,
	size,
	type,
	status = 'idle',
	progress,
	error,
	description,
	href,
	onRemove,
	as: Tag = 'div',
	labels,
	className,
}: FileProps) {
	const locale = useLocale();
	const copy = { ...useDefaultLabels(), ...labels };
	const icon = useMemo(() => iconFor(name, type), [name, type]);
	const extension = extensionOf(name);
	const percent = progress === undefined ? undefined : Math.round(Math.min(100, Math.max(0, progress)));

	const meta = [size !== undefined ? formatBytes(size, locale) : null, extension].filter(Boolean).join(' · ');

	return (
		<Tag className={cx(styles.file, 'u-bevel', styles[status], className)}>
			<span className={styles.tile} aria-hidden="true">
				<Icon name={icon} size="md" />
			</span>
			<span className={styles.body}>
				<span className={styles.name} title={name}>
					{name}
				</span>
				<span className={styles.meta}>
					{status === 'error' && error ? (
						<span className={styles.errorText}>
							<Icon name="alert" size="sm" />
							{error}
						</span>
					) : status === 'uploading' ? (
						<span>{percent === undefined ? copy.pending : copy.progress(percent)}</span>
					) : status === 'success' ? (
						<span className={styles.successText}>
							<span className={cx('t-success-check', styles.check)} data-state="in" aria-hidden="true">
								<Icon name="check" size="sm" />
							</span>
							{meta ? `${copy.success} · ${meta}` : copy.success}
						</span>
					) : (
						<>
							{meta && <span>{meta}</span>}
							{description && <span className={styles.metaRest}>{meta ? ' · ' : ''}{description}</span>}
						</>
					)}
				</span>
			</span>
			{(href || onRemove) && (
				<span className={styles.actions}>
					{href && status !== 'uploading' && (
						<Button href={href} download={name} variant="ghost" size="md" icon="download" label={copy.download(name)} />
					)}
					{onRemove && <Button variant="ghost" size="md" icon="close" label={copy.remove(name)} onClick={onRemove} />}
				</span>
			)}
			{status === 'uploading' && (
				<span
					className={cx(styles.track, percent === undefined && styles.indeterminate)}
					role="progressbar"
					aria-label={copy.uploading(name)}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={percent}
				>
					<span className={styles.bar} style={percent === undefined ? undefined : { transform: `scaleX(${percent / 100})` }} />
				</span>
			)}
		</Tag>
	);
}

export default File;
