//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Surface, Text } from '@/components/ui';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './library.module.css';

/** The words the copy already stands on: the three in “Why Yeta”, plus the pixel line's purpose. */
const VALUES = ['Creativity', 'Technology', 'Strategy', 'Purpose'] as const;

/** How many closing words of the statement fade to grey (Analogue Agency). */
const FADED_WORDS = 4;

/**
 * Library 09, About the studio. The studio's one-line statement with its closing words fading out
 * (Analogue Agency), four one-word values in a hairline grid (Mother Design) and a short note
 * signed by the studio rather than by invented people (incident.io's founders' note).
 */
export function AboutMockup() {
	const footer = useTranslations('footer');
	const why = useTranslations('whyYeta');
	const words = footer('about').split(' ');
	const lead = words.slice(0, -FADED_WORDS).join(' ');
	const tail = words.slice(-FADED_WORDS).join(' ');
	return (
		<div className={styles.container}>
			<div className={cx(styles.frame, styles.about)}>
				<Text as="h3" size="3xl" weight="regular" leading="snug" tone="strong" className={styles.aboutStatement}>
					{lead} <span className={styles.aboutFade}>{tail}</span>
				</Text>
				<div className={styles.aboutBody}>
					<ul className={styles.aboutValues}>
						{VALUES.map((value) => (
							<li key={value} className={styles.aboutValue}>
								<Text as="span" family="serif" weight="regular" tone="strong" leading="none" className={styles.aboutWord}>
									{value}
								</Text>
							</li>
						))}
					</ul>
					<Surface tone="raised" radius="lg" padding="md" bevel className={styles.aboutNote}>
						<Text as="span" size="lg" family="serif" italic tone="strong">
							A note from the studio
						</Text>
						<Text size="sm" tone="subtle" leading="relaxed">
							{why.rich('p2', { serif: (chunks) => chunks })}
						</Text>
						<Text as="span" size="md" family="serif" italic tone="strong" className={styles.aboutSignature}>
							{footer('signature')}
						</Text>
					</Surface>
				</div>
			</div>
		</div>
	);
}

export default AboutMockup;
