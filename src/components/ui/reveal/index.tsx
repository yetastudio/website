'use client';

//! React Core
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

//! Utils
import { cx } from '@/lib/cx';

export type RevealProps = {
	/** Element to render (defaults to div). */
	as?: ElementType;
	/** `view` plays once the block scrolls into view; `mount` plays right after hydration (above the fold). */
	trigger?: 'view' | 'mount';
	children: ReactNode;
	className?: string;
} & Partial<Record<'id' | 'aria-label' | 'aria-labelledby', string>>;

/**
 * transitions.dev "Texts reveal": stacked lines rise into place with a short stagger and a
 * blur, once. Mark the children with `revealLine(n)`. Without JS a <noscript> rule in the
 * root layout shows the lines at rest; with reduced motion they appear without moving.
 */
export function Reveal({ as: Tag = 'div', trigger = 'view', children, className, ...rest }: RevealProps) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const block = ref.current;
		if (!block) return;
		const show = () => {
			block.classList.remove('is-hiding');
			block.classList.remove('is-shown');
			void block.offsetHeight;
			block.classList.add('is-shown');
		};
		// Effects run after the first paint, so the lines already rest at their pre-reveal state.
		if (trigger === 'mount') {
			show();
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				show();
				observer.disconnect();
			},
			{ rootMargin: '0px 0px -12% 0px' }
		);
		observer.observe(block);
		return () => observer.disconnect();
	}, [trigger]);

	return (
		<Tag ref={ref} className={cx('t-stagger', className)} {...rest}>
			{children}
		</Tag>
	);
}

export default Reveal;
