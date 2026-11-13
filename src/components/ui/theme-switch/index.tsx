'use client';

//! React Core
import { useState } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';

//! Components
import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Tooltip } from '@/components/ui/tooltip';

//! Types
import type { ThemePreference } from '@/types';

const ORDER: ReadonlyArray<ThemePreference> = ['system', 'light', 'dark'];
const ICON: Record<ThemePreference, IconName> = { system: 'monitor', light: 'sun', dark: 'moon' };

export type ThemeSwitchProps = {
	/** `segmented` shows the three modes; `cycle` is one button that steps System → Light → Dark. */
	variant?: 'segmented' | 'cycle';
	/** Segmented sizes are sm·md; the cycle button takes any Button size. */
	size?: 'sm' | 'md' | ButtonSize;
	/** Cycle button surface (glass over content, ghost inside a glass bar). */
	buttonVariant?: Extract<ButtonVariant, 'glass' | 'ghost'>;
	/** Show text next to the icons (segmented only). */
	withLabels?: boolean;
	className?: string;
};

/**
 * One icon-only button that steps through the three modes and shows the active one. The icon
 * changes with the transitions.dev "Icon swap" (two slots, a and b, crossfading with blur and
 * scale); a change the user did not make (the stored theme applied after hydration) swaps
 * without animating. The accessible name says the current mode and the next one.
 */
function ThemeCycle({ size, buttonVariant, className }: { size: ButtonSize; buttonVariant: 'glass' | 'ghost'; className?: string }) {
	const t = useTranslations('theme');
	const { preference, setPreference } = useTheme();
	const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
	const [swap, setSwap] = useState({ shown: preference, a: preference, b: preference, active: 'a' as 'a' | 'b', userPicked: false });

	// Adjust the slots during render when the preference changes.
	if (preference !== swap.shown) {
		if (swap.userPicked) {
			const idle = swap.active === 'a' ? 'b' : 'a';
			setSwap({ ...swap, shown: preference, [idle]: preference, active: idle, userPicked: false });
		} else {
			setSwap({ ...swap, shown: preference, [swap.active]: preference, userPicked: false });
		}
	}

	const name = t('cycle', { current: t(preference), next: t(next) });

	return (
		<Tooltip content={t('current', { current: t(preference) })} side="bottom" className={className}>
			<Button
				variant={buttonVariant}
				size={size}
				label={name}
				onClick={() => {
					setSwap((current) => ({ ...current, userPicked: true }));
					setPreference(next);
				}}
				iconNode={
					<span className="t-icon-swap" data-state={swap.active} aria-hidden="true">
						<span className="t-icon" data-icon="a">
							<Icon name={ICON[swap.a]} size="lg" />
						</span>
						<span className="t-icon" data-icon="b">
							<Icon name={ICON[swap.b]} size="lg" />
						</span>
					</span>
				}
			/>
		</Tooltip>
	);
}

/** Inspo component: picks System, Light or Dark, as three segments or as one cycling button. */
export function ThemeSwitch({ variant = 'segmented', size, buttonVariant = 'glass', withLabels = false, className }: ThemeSwitchProps) {
	const t = useTranslations('theme');
	const { preference, setPreference } = useTheme();

	if (variant === 'cycle') {
		return <ThemeCycle size={(size as ButtonSize | undefined) ?? 'lg'} buttonVariant={buttonVariant} className={className} />;
	}

	return (
		<SegmentedControl<ThemePreference>
			label={t('label')}
			size={size === 'md' ? 'md' : 'sm'}
			className={className}
			value={preference}
			onChange={setPreference}
			options={[
				{ value: 'system', label: t('system'), icon: 'monitor', iconOnly: !withLabels },
				{ value: 'light', label: t('light'), icon: 'sun', iconOnly: !withLabels },
				{ value: 'dark', label: t('dark'), icon: 'moon', iconOnly: !withLabels },
			]}
		/>
	);
}

export default ThemeSwitch;
