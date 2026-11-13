'use client';

//! React Core
import { useTransition } from 'react';

//! Hooks
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

//! Components
import { SegmentedControl } from '@/components/ui/segmented-control';

//! Config
import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

const names: Record<Locale, string> = { en: 'English', es: 'Español', pt: 'Português' };

/** Inspo component: switches between the site's locales, keeping the current path. */
export function LocaleSwitch({ size = 'sm', className }: { size?: 'sm' | 'md'; className?: string }) {
	const t = useTranslations('common');
	const locale = useLocale() as Locale;
	const router = useRouter();
	const pathname = usePathname();
	const [, startTransition] = useTransition();

	return (
		<SegmentedControl<Locale>
			label={t('language')}
			size={size}
			className={className}
			value={locale}
			onChange={(next) => startTransition(() => router.replace(pathname, { locale: next, scroll: false }))}
			options={routing.locales.map((code) => ({ value: code, label: code.toUpperCase(), ariaLabel: names[code] }))}
		/>
	);
}

export default LocaleSwitch;
