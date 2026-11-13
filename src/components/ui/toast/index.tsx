'use client';

//! React Core
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Icon, type IconName } from '@/components/ui/icon';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './styles.module.css';

type ToastTone = 'neutral' | 'success' | 'danger';
type ToastItem = { id: number; message: string; tone: ToastTone };
type ToastContextValue = { notify: (message: string, tone?: ToastTone) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

const toneIcon: Record<ToastTone, IconName> = { neutral: 'info', success: 'check', danger: 'alert' };
const DURATION_MS = 4000;

/**
 * Inspo component: a polite live region at the bottom of the screen. Messages stay
 * 4s, pause while hovered or focused, and can be dismissed.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
	const t = useTranslations('common');
	const [items, setItems] = useState<ToastItem[]>([]);
	const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
	const nextId = useRef(0);

	const dismiss = useCallback((id: number) => {
		clearTimeout(timers.current.get(id));
		timers.current.delete(id);
		setItems((list) => list.filter((item) => item.id !== id));
	}, []);

	const schedule = useCallback(
		(id: number) => {
			clearTimeout(timers.current.get(id));
			timers.current.set(id, setTimeout(() => dismiss(id), DURATION_MS));
		},
		[dismiss]
	);

	const notify = useCallback(
		(message: string, tone: ToastTone = 'neutral') => {
			const id = ++nextId.current;
			setItems((list) => [...list.slice(-2), { id, message, tone }]);
			schedule(id);
		},
		[schedule]
	);

	const value = useMemo(() => ({ notify }), [notify]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ol className={styles.region} aria-live="polite" aria-label={t('notifications')}>
				{items.map((item) => (
					<li
						key={item.id}
						className={cx(styles.toast, styles[item.tone], 'u-bevel')}
						onPointerEnter={() => clearTimeout(timers.current.get(item.id))}
						onPointerLeave={() => schedule(item.id)}
						onFocus={() => clearTimeout(timers.current.get(item.id))}
						onBlur={() => schedule(item.id)}
					>
						<Icon name={toneIcon[item.tone]} size="md" className={styles.icon} />
						<span className={styles.message}>{item.message}</span>
						<button type="button" className={styles.dismiss} aria-label={t('dismiss')} onClick={() => dismiss(item.id)}>
							<Icon name="close" size="sm" />
						</button>
					</li>
				))}
			</ol>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) throw new Error('useToast must be used within a ToastProvider');
	return context;
}
