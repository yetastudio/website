'use client';

//! Next Core
import Image from 'next/image';

//! React Core
import { useEffect, useRef, useState, type RefObject } from 'react';
import { flushSync } from 'react-dom';

//! Hooks
import { useTranslations } from 'next-intl';
import { useAutoplay } from '../use-autoplay';

//! Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import { TESTIMONIALS } from '@/components/layout/content';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import shared from './shared.module.css';
import styles from './testimonials.module.css';

/** transitions.dev 18: the decoupled exit, a quiet fade in place before the content swaps. */
const REVEAL_EXIT = 200;

/**
 * transitions.dev 04, text states swap: when `value` changes, the element exits up with a blur,
 * the text swaps, then it enters from below. Returns the value on show, which trails `value` by
 * the exit (`--text-swap-dur` on the element).
 */
function useTextSwap<T>(value: T, ref: RefObject<HTMLElement | null>) {
	const [shown, setShown] = useState(value);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// Picked back before the swap landed: just come back in.
		if (Object.is(value, shown)) {
			el.classList.remove(styles.isSwapExit);
			return;
		}
		const duration = parseFloat(getComputedStyle(el).getPropertyValue('--text-swap-dur')) || 150;
		el.classList.add(styles.isSwapExit);
		const timer = window.setTimeout(() => {
			el.classList.remove(styles.isSwapExit);
			el.classList.add(styles.isSwapEnter);
			flushSync(() => setShown(value));
			void el.offsetHeight;
			el.classList.remove(styles.isSwapEnter);
		}, duration);
		return () => window.clearTimeout(timer);
	}, [value, shown, ref]);

	return shown;
}

/**
 * transitions.dev 18, texts reveal: on a new `value` the lines fade out in place, the content
 * swaps while they are hidden, then they rise back in staggered. Adapted so the lines snap to
 * their start state at the swap, and every entrance rises the full distance.
 */
function useTextsReveal<T>(value: T, ref: RefObject<HTMLElement | null>) {
	const [shown, setShown] = useState(value);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (Object.is(value, shown)) {
			if (el.classList.contains(styles.isRevealHiding)) {
				el.classList.remove(styles.isRevealHiding);
				el.classList.add(styles.isRevealShown);
			}
			return;
		}
		el.classList.add(styles.isRevealHiding);
		el.classList.remove(styles.isRevealShown);
		const timer = window.setTimeout(() => {
			el.classList.remove(styles.isRevealHiding);
			el.classList.add(styles.isRevealReset);
			flushSync(() => setShown(value));
			void el.offsetHeight;
			el.classList.remove(styles.isRevealReset);
			el.classList.add(styles.isRevealShown);
		}, REVEAL_EXIT);
		return () => window.clearTimeout(timer);
	}, [value, shown, ref]);

	return shown;
}

/**
 * Testimonials A, after Harvey: the client's portrait on the left, the serif quote and the client's
 * wordmark on the right, and the system's autoplay dots pacing the rotation the way Harvey's thin
 * bars do. Each voice rises in staggered: portrait, quote, then the attribution. Every quote shares
 * one cell, so the frame never changes height. The one accent is the hue dot by the wordmark.
 */
export function TestimonialsPortrait() {
	const t = useTranslations('testimonials');
	const [active, setActive] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<HTMLDivElement>(null);
	const autoplay = useAutoplay(rootRef);
	const shown = useTextsReveal(active, revealRef);

	return (
		<div className={shared.container}>
			<div ref={rootRef} className={cx(shared.frame, styles.portrait)} {...autoplay.handlers}>
				<div ref={revealRef} className={cx(styles.portraitVoice, styles.isRevealShown)} aria-live="polite">
					<div className={cx(styles.revealLine, styles.portraitPhoto)}>
						{TESTIMONIALS.map((item, index) => (
							<Image
								key={item.key}
								src={item.avatar}
								alt=""
								fill
								sizes="(min-width: 1024px) 200px, 30vw"
								className={styles.portraitImage}
								data-on={index === shown || undefined}
							/>
						))}
					</div>
					<div className={cx(styles.revealLine, styles.revealLine2, styles.stack, styles.portraitQuote)}>
						{TESTIMONIALS.map((item, index) => (
							<Text
								key={item.key}
								as="blockquote"
								family="serif"
								weight="regular"
								tone="strong"
								leading="snug"
								className={styles.portraitQuoteText}
								data-on={index === shown || undefined}
								aria-hidden={index !== shown || undefined}
							>
								{t(`items.${item.key}.quote`)}
							</Text>
						))}
					</div>
					<div className={cx(styles.revealLine, styles.revealLine3, styles.stack, styles.portraitBy)}>
						{TESTIMONIALS.map((item, index) => (
							<span
								key={item.key}
								className={styles.portraitByItem}
								data-on={index === shown || undefined}
								aria-hidden={index !== shown || undefined}
							>
								<span className={styles.portraitWordmark}>
									<span className={cx(shared.dot, shared.hued)} data-hue={item.hue} aria-hidden="true" />
									<Text as="span" size="xl" family="serif" tone="strong" leading="none">
										{t(`items.${item.key}.company`)}
									</Text>
								</span>
								<Text as="span" size="xs" tone="subtle">
									{`${t(`items.${item.key}.name`)} · ${t(`items.${item.key}.role`)}`}
								</Text>
							</span>
						))}
					</div>
				</div>
				<PaginationDots
					count={TESTIMONIALS.length}
					index={active}
					onSelect={setActive}
					itemLabel={t('card')}
					className={styles.portraitDots}
					autoplay={
						autoplay.enabled ? { paused: autoplay.paused, onComplete: () => setActive((index) => (index + 1) % TESTIMONIALS.length) } : undefined
					}
				/>
			</div>
		</div>
	);
}

/**
 * Testimonials B, after Paraform: a serif heading and one short quote in a quiet sky band, then the
 * clients' names as tabs along a hairline, the picked one underlined. The quote swaps in place.
 * The colour is the band's faint tint and the thin underline in the client's hue.
 */
export function TestimonialsTabs() {
	const t = useTranslations('testimonials');
	const [active, setActive] = useState(0);
	const quoteRef = useRef<HTMLDivElement>(null);
	const shown = useTextSwap(active, quoteRef);

	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.tabs)}>
				<div className={cx(shared.sky, styles.tabsBand)}>
					<Text as="h3" size="2xl" family="serif" weight="regular" tone="strong" leading="tight" className={styles.tabsTitle}>
						{t('chip')}
					</Text>
					{/* Every quote sits in one cell, so the band holds the longest and never jumps. */}
					<div ref={quoteRef} className={cx(styles.textSwap, styles.stack)} aria-live="polite">
						{TESTIMONIALS.map((item, index) => (
							<figure key={item.key} className={styles.tabsVoice} data-on={index === shown || undefined} aria-hidden={index !== shown || undefined}>
								<Text as="blockquote" size="lg" tone="strong" leading="snug">
									{t(`items.${item.key}.quote`)}
								</Text>
								<Text as="figcaption" size="xs" tone="subtle">
									{`${t(`items.${item.key}.name`)} · ${t(`items.${item.key}.role`)}`}
								</Text>
							</figure>
						))}
					</div>
				</div>
				<div className={styles.tabsRow} role="group" aria-label={t('carousel')}>
					{TESTIMONIALS.map((item, index) => {
						const on = index === active;
						return (
							<span key={item.key} className={cx(styles.tab, shared.hued)} data-hue={item.hue} data-on={on || undefined}>
								<Button variant="ghost" size="md" fullWidth aria-pressed={on} onClick={() => setActive(index)}>
									<Text as="span" family="serif" tone={on ? 'strong' : 'faint'} className={styles.tabName}>
										{t(`items.${item.key}.company`)}
									</Text>
								</Button>
							</span>
						);
					})}
				</div>
			</div>
		</div>
	);
}

/**
 * Testimonials C, after Amigo: one frosted panel, the client's name set as a wordmark on the left
 * and the serif quote on the right, the clients' faces in a small row that picks the voice and
 * lifts under the pointer. The one accent is a faint glow in the client's hue behind the glass,
 * there only so the frost has something to blur.
 */
export function TestimonialsGlass() {
	const t = useTranslations('testimonials');
	const [active, setActive] = useState(0);
	const quoteRef = useRef<HTMLDivElement>(null);
	const groupRef = useRef<HTMLUListElement>(null);
	const shown = useTextSwap(active, quoteRef);

	// transitions.dev 11, avatar group hover: lift the hovered face, its neighbours by a power
	// falloff, and ease all of them back on leave. The timing function is set before the values.
	const lift = (hovered: number | null, phase: 'in' | 'out') => {
		const group = groupRef.current;
		if (!group) return;
		const style = getComputedStyle(group);
		const read = (name: string, fallback: number) => {
			const value = parseFloat(style.getPropertyValue(name));
			return Number.isFinite(value) ? value : fallback;
		};
		const distance = read('--avatar-lift', -4);
		const falloff = read('--avatar-falloff', 0.45);
		const scale = read('--avatar-scale', 1.05);
		const ease = style.getPropertyValue(phase === 'out' ? '--avatar-ease-out' : '--avatar-ease-in').trim();
		Array.from(group.children).forEach((child, index) => {
			if (!(child instanceof HTMLElement)) return;
			child.style.transitionTimingFunction = ease;
			const shift = hovered === null ? 0 : distance * falloff ** Math.abs(index - hovered);
			child.style.setProperty('--avatar-shift', `${shift.toFixed(3)}px`);
			child.style.setProperty('--avatar-scale-active', hovered === index ? String(scale) : '1');
		});
	};

	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.glass)}>
				<span className={cx(styles.glassGlow, shared.hued)} data-hue={TESTIMONIALS[shown].hue} aria-hidden="true" />
				<Surface tone="glass" radius="xl" padding="lg" bevel className={styles.glassPanel}>
					<div ref={quoteRef} className={cx(styles.textSwap, styles.stack)} aria-live="polite">
						{TESTIMONIALS.map((item, index) => (
							<figure key={item.key} className={styles.glassVoice} data-on={index === shown || undefined} aria-hidden={index !== shown || undefined}>
								<Text as="figcaption" family="serif" italic tone="strong" leading="none" className={styles.glassWordmark}>
									{t(`items.${item.key}.company`)}
								</Text>
								<div className={styles.glassWords}>
									<Text as="blockquote" size="xl" family="serif" weight="regular" tone="strong" leading="snug">
										{t(`items.${item.key}.quote`)}
									</Text>
									<Text as="span" size="xs" tone="subtle">
										{`${t(`items.${item.key}.name`)} · ${t(`items.${item.key}.role`)}`}
									</Text>
								</div>
							</figure>
						))}
					</div>
					<ul ref={groupRef} className={styles.avatarGroup} aria-label={t('carousel')} onPointerLeave={() => lift(null, 'out')}>
						{TESTIMONIALS.map((item, index) => {
							const name = t(`items.${item.key}.name`);
							return (
								<li key={item.key} className={styles.avatarItem} data-on={index === active || undefined}>
									<Button
										variant="ghost"
										size="sm"
										label={`${name}, ${t(`items.${item.key}.company`)}`}
										aria-pressed={index === active}
										onPointerEnter={() => lift(index, 'in')}
										onClick={() => setActive(index)}
									>
										<Avatar name={name} src={item.avatar} size="md" />
									</Button>
								</li>
							);
						})}
					</ul>
				</Surface>
			</div>
		</div>
	);
}
