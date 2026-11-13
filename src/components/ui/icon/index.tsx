//! React Core
import type { SVGAttributes } from 'react';

//! Icons
import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronDown,
	CircleAlert,
	Info,
	LoaderCircle,
	Minus,
	Monitor,
	Moon,
	Search,
	Sun,
	X,
	// Gallery · Navigation
	ChevronRight,
	Copy,
	Ellipsis,
	File,
	Folder,
	FolderOpen,
	Trash2,
	// Gallery · Feedback
	CircleCheck,
	Inbox,
	TriangleAlert,
	// Gallery · Advanced inputs
	Bold,
	ChevronLeft,
	Download,
	FileArchive,
	FileImage,
	FileText,
	Italic,
	Link,
	List,
	ListOrdered,
	Star,
	Upload,
	// Gallery · Layout & content
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Captions,
	ImageOff,
	Maximize,
	Minimize,
	Pause,
	Play,
	Volume2,
	VolumeX,
	type LucideIcon,
} from 'lucide-react';
import { glyphs, type GlyphName } from './glyphs';
import { extraGlyphs, type ExtraGlyphName } from './extra-glyphs';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

/**
 * Icons the Figma Design System does not draw. They come from Lucide at the
 * same 1.5 stroke so they sit next to the brand glyphs without a seam.
 */
const supplemental = {
	'arrow-left': ArrowLeft,
	'arrow-right': ArrowRight,
	check: Check,
	'chevron-down': ChevronDown,
	alert: CircleAlert,
	info: Info,
	loader: LoaderCircle,
	minus: Minus,
	monitor: Monitor,
	moon: Moon,
	search: Search,
	sun: Sun,
	close: X,
	// Gallery · Navigation
	'chevron-right': ChevronRight,
	copy: Copy,
	ellipsis: Ellipsis,
	file: File,
	folder: Folder,
	'folder-open': FolderOpen,
	trash: Trash2,
	// Gallery · Feedback
	'circle-check': CircleCheck,
	inbox: Inbox,
	'triangle-alert': TriangleAlert,
	// Gallery · Advanced inputs
	bold: Bold,
	'chevron-left': ChevronLeft,
	download: Download,
	'file-archive': FileArchive,
	'file-image': FileImage,
	'file-text': FileText,
	italic: Italic,
	link: Link,
	list: List,
	'list-ordered': ListOrdered,
	star: Star,
	upload: Upload,
	// Gallery · Layout & content
	'arrow-down': ArrowDown,
	'arrow-up': ArrowUp,
	'arrow-up-down': ArrowUpDown,
	captions: Captions,
	'image-off': ImageOff,
	maximize: Maximize,
	minimize: Minimize,
	pause: Pause,
	play: Play,
	volume: Volume2,
	'volume-off': VolumeX,
} satisfies Record<string, LucideIcon>;

export type SupplementalIconName = keyof typeof supplemental;
export type IconName = GlyphName | ExtraGlyphName | SupplementalIconName;
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export type IconProps = Omit<SVGAttributes<SVGSVGElement>, 'name'> & {
	name: IconName;
	/** sm 14 · md 18 · lg 20 · xl 24 (Figma Small / Medium / Large). Defaults to `lg`. */
	size?: IconSize;
	/** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
	label?: string;
};

export const iconNames: IconName[] = [
	...(Object.keys(glyphs) as GlyphName[]),
	...(Object.keys(extraGlyphs) as ExtraGlyphName[]),
	...(Object.keys(supplemental) as SupplementalIconName[]),
];

/** One icon API for the brand glyphs and the few supplemental ones. Colour is `currentColor`. */
export function Icon({ name, size = 'lg', label, className, ...rest }: IconProps) {
	const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
	const classes = cx(styles.icon, styles[size], className);

	if (name in supplemental) {
		const Supplemental = supplemental[name as SupplementalIconName];
		return <Supplemental className={classes} strokeWidth={1.5} focusable={false} {...a11y} {...rest} />;
	}

	const glyph = name in extraGlyphs ? extraGlyphs[name as ExtraGlyphName] : glyphs[name as GlyphName];
	return (
		<svg
			className={classes}
			viewBox={glyph.viewBox}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			focusable={false}
			{...a11y}
			{...rest}
		>
			{glyph.body}
		</svg>
	);
}

export type { GlyphName };
export default Icon;
