//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Button } from '@/components/ui/button';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import { BOOKING_URL } from '@/components/layout/sections';

//! Styles
import styles from './mockups.module.css';

/** The clients who already appear in the testimonials, each set in type in its own register. */
const CLIENTS = [
	{ key: 'jorge', style: 'serif' },
	{ key: 'marcelo', style: 'lower' },
	{ key: 'lisette', style: 'caps' },
] as const;

/**
 * Proposal 05: the client wall. Names come from the testimonials (`testimonials.items.*.company`)
 * and are set in type, never drawn as lookalike logos; the last tile is the invitation.
 */
export function ClientWallMockup() {
	const t = useTranslations('testimonials');
	return (
		<div className={styles.wall}>
			<Text as="p" size="lg" family="serif" italic align="center" tone="strong">
				Brands we’ve moved forward
			</Text>
			<ul className={styles.wallGrid}>
				{CLIENTS.map((client) => (
					<li key={client.key}>
						<Surface tone="tint" radius="xl" bevel className={styles.wallTile}>
							<span className={styles[`wordmark-${client.style}`]}>{t(`items.${client.key}.company`)}</span>
						</Surface>
					</li>
				))}
				<li>
					<Surface tone="tint" radius="xl" bevel className={styles.wallTile}>
						<Button href={BOOKING_URL} variant="ghost" size="md" iconStart="plus">
							Your brand
						</Button>
					</Surface>
				</li>
			</ul>
		</div>
	);
}

export default ClientWallMockup;
