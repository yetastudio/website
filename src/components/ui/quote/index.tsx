//! React Core
import type { ReactNode } from 'react';

//! Components
import { Avatar } from '@/components/ui/avatar';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type QuoteVariant = 'block' | 'pull';
export type QuoteSize = 'sm' | 'md' | 'lg';
export type QuoteTone = 'neutral' | 'pink' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet';

export type QuoteProps = {
	/** The quoted words. A string is wrapped in a paragraph; pass paragraphs for longer quotes. */
	children: ReactNode;
	/** Who said it. */
	author?: string;
	/** Their role. With `company`, joined by the ✹ the testimonial cards use. */
	role?: ReactNode;
	company?: ReactNode;
	/** Title of the work it comes from (talk, article, book), set in a `cite` element. */
	source?: ReactNode;
	/** Portrait for the attribution row (uses Avatar; initials when it fails to load). */
	avatar?: string;
	/** URL of the source, for the blockquote's `cite` attribute. */
	cite?: string;
	/**
	 * `block`: a quotation in the flow of the page (`figure` > `blockquote` + `figcaption`).
	 * `pull`: a passage lifted from the surrounding article, set large in PP Editorial New (`aside`).
	 */
	variant?: QuoteVariant;
	/** sm 14 · md 16 · lg 20 for block quotes; pull quotes step up to 20 · 24 · 32. */
	size?: QuoteSize;
	/** `center` is the testimonial-card composition; block quotes default to `start`, pull quotes to `center`. */
	align?: 'start' | 'center';
	/** A brand hue for the accent only: the block quote's rule or the pull quote's mark. */
	tone?: QuoteTone;
	className?: string;
};

/**
 * Inspo component (component.gallery "Quote"): block and pull quotes in the testimonial cards' voice.
 * Attribution sits in a `figcaption`, outside the `blockquote`, because it is not part of the quote;
 * `cite` holds a work's title only, never a person's name.
 */
export function Quote({
	children,
	author,
	role,
	company,
	source,
	avatar,
	cite,
	variant = 'block',
	size = 'md',
	align,
	tone = 'neutral',
	className,
}: QuoteProps) {
	const resolvedAlign = align ?? (variant === 'pull' ? 'center' : 'start');
	const hasAttribution = Boolean(author || role || company || source);

	const figure = (
		<figure
			className={cx(
				styles.quote,
				styles[variant],
				styles[`size-${size}`],
				styles[`align-${resolvedAlign}`],
				styles[`tone-${tone}`],
				variant === 'pull' ? undefined : className
			)}
		>
			{variant === 'pull' && (
				<span className={styles.mark} aria-hidden="true">
					&ldquo;
				</span>
			)}
			<blockquote className={styles.body} cite={cite}>
				{typeof children === 'string' ? <p>{children}</p> : children}
			</blockquote>
			{hasAttribution && (
				<figcaption className={styles.attribution}>
					{avatar && author && (
						<span className={styles.avatar} aria-hidden="true">
							<Avatar name={author} src={avatar} size={size === 'lg' ? 'md' : 'sm'} />
						</span>
					)}
					<span className={styles.who}>
						{author && <span className={styles.author}>{author}</span>}
						{(role || company) && (
							<span className={styles.role}>
								{role}
								{role && company && (
									<>
										<span aria-hidden="true"> ✹ </span>
										<span className="u-visually-hidden">, </span>
									</>
								)}
								{company}
							</span>
						)}
						{source && <cite className={styles.source}>{source}</cite>}
					</span>
				</figcaption>
			)}
		</figure>
	);

	return variant === 'pull' ? <aside className={cx(styles.aside, className)}>{figure}</aside> : figure;
}

export default Quote;
