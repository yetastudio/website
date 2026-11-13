'use client';

//! Hooks
import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';

//! Components
import { SegmentedControl } from '@/components/ui/segmented-control';

//! Types
import type { ThemePreference } from '@/types';

export type ThemeSwitchProps = {
	size?: 'sm' | 'md';
	/** Show text next to the icons. */
	withLabels?: boolean;
	className?: string;
};

/** Inspo component: picks System, Light or Dark. Built on SegmentedControl. */
export function ThemeSwitch({ size = 'sm', withLabels = false, className }: ThemeSwitchProps) {
	const t = useTranslations('theme');
	const { preference, setPreference } = useTheme();

	return (
		<SegmentedControl<ThemePreference>
			label={t('label')}
			size={size}
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
