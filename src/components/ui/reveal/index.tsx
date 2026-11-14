'use client';

//! React Core
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

export type RevealProps = {
	/** Element to render (defaults to div). */
	as?: ElementType;
	/** `view` plays once the block scrolls into view; `mount` plays from first paint (above the fold). */
	trigger?: 'view' | 'mount';
	children: ReactNode;
	className?: string;
} & Partial<Record<'id' | 'aria-label' | 'aria-labelledby', string>>;

/**
 * transitions.dev "Texts reveal": stacked lines rise into place with a short stagger and a
 * blur, once. Mark the children with `revealLine(n)`. Without JS a <noscript> rule in the
 * root layout shows the lines at rest; with reduced motion they appear without moving.
 *
 * `mount` is pure CSS: the block is served already shown and a keyframe animation plays the
 * reveal at first paint, so above-the-fold words (the hero, the page's largest paint) never
 * wait for the JavaScript bundle to load and hydrate.
 */
export function Reveal({ as: Tag = 'div', trigger = 'view', children, className, ...rest }: RevealProps) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const block = ref.current;
		if (!block || trigger === 'mount') return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				block.classList.remove('is-hiding');
				block.classList.remove('is-shown');
				void block.offsetHeight;
				block.classList.add('is-shown');
				observer.disconnect();
			},
			{ rootMargin: '0px 0px -12% 0px' }
		);
		observer.observe(block);
		return () => observer.disconnect();
	}, [trigger]);

	return (
		<Tag ref={ref} className={cx('t-stagger', trigger === 'mount' && cx(styles.mount, 'is-shown'), className)} {...rest}>
			{children}
		</Tag>
	);
}

export default Reveal;
