//! React Core
import type { ReactNode } from 'react';

//! Hooks
import { useTranslations } from 'next-intl';

//! Components
import { Accent, Divider, LogoMark, Surface, Text } from '@/components/ui';

//! Utils
import { cx } from '@/lib/cx';

//! Types
import type { LibraryVariantDef } from './variant-types';

//! Styles
import shared from './shared.module.css';
import styles from './about.module.css';

/** How many closing words of the statement fade to grey (Analogue Agency). */
const FADED_WORDS = 3;

/** The studio facts the case study already states, in the order the list reads. */
const FACTS = ['industry', 'services', 'country', 'url'] as const;

/** The words the copy already stands on: the three in “Why Yeta”, plus the pixel line's purpose. */
const VALUES = ['Creativity', 'Technology', 'Strategy', 'Purpose'] as const;

/** The value cell that holds the orb (OFF+BRAND's one colour). */
const ORB_CELL = 0;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * About A, after Analogue Agency: the studio's one-line statement set large with its closing words
 * fading to grey, a hairline, then the studio itself as a list of facts in place of portraits,
 * each row a mono label and a value. Neutral; the one accent is the hue dot before the label.
 */
function AboutStatement() {
	const footer = useTranslations('footer');
	const work = useTranslations('ourWork');
	const words = footer('about').split(' ');
	const lead = words.slice(0, -FADED_WORDS).join(' ');
	const tail = words.slice(-FADED_WORDS).join(' ');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.statement)}>
				<Text as="h3" size="3xl" weight="regular" leading="snug" tone="strong" className={styles.statementText}>
					{lead} <span className={styles.statementFade}>{tail}</span>
				</Text>
				<Divider />
				<dl className={styles.statementList}>
					{FACTS.map((fact) => (
						<div key={fact} className={styles.statementRow}>
							<Text as="dt" size="xs" tone="subtle" className={styles.mono}>
								{work(`facts.${fact}`)}
							</Text>
							<Text as="dd" size="md" tone="strong" leading="snug">
								{work(`projects.yeta.${fact}`)}
							</Text>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}

/**
 * About B, after incident.io's founders' note: a letter from the studio on a raised sheet, a serif
 * heading, the story in plain paragraphs from the copy, and a sign-off with the mark in a small
 * frame where incident.io puts a photo. The one accent is the thin pen stroke over the signature.
 */
function AboutNote() {
	const footer = useTranslations('footer');
	const why = useTranslations('whyYeta');
	const work = useTranslations('ourWork');
	const serif = (chunks: ReactNode) => <Accent italic={false}>{chunks}</Accent>;
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.note)}>
				<Surface as="article" tone="raised" radius="lg" padding="lg" bevel className={styles.notePaper}>
					<Text as="h3" size="3xl" family="serif" weight="regular" tone="strong" leading="tight" className={styles.noteTitle}>
						A note from the studio
					</Text>
					<div className={styles.noteBody}>
						<Text size="md" leading="relaxed">
							{work('projects.yeta.about')}
						</Text>
						<Text size="md" leading="relaxed">
							{why.rich('p1', { serif })}
						</Text>
						<Text size="md" leading="relaxed">
							{why.rich('p2', { serif })}
						</Text>
					</div>
					<div className={styles.noteSign}>
						<span className={cx(styles.notePen, shared.hued)} data-hue="violet" aria-hidden="true" />
						<span className={styles.noteSignRow}>
							<Surface as="span" tone="tint" radius="md" padding="sm" bevel className={styles.noteMark}>
								<LogoMark size={28} alt="" />
							</Surface>
							<span className={styles.noteSignName}>
								<Text as="span" size="xl" family="serif" italic tone="strong" leading="tight">
									{footer('signature')}
								</Text>
								<Text as="span" size="xs" tone="subtle">
									{`${work('projects.yeta.country')}, ${work('projects.yeta.year')}`}
								</Text>
							</span>
						</span>
					</div>
				</Surface>
			</div>
		</div>
	);
}

/**
 * About C, after Mother Design and OFF+BRAND: four one-word values set large in a hairline grid,
 * each cell numbered like a chapter index, with a small note card signed by the studio. Where
 * Mother Design puts a photo, one soft orb sits behind the first word (OFF+BRAND's only colour).
 */
function AboutWords() {
	const footer = useTranslations('footer');
	return (
		<div className={shared.container}>
			<div className={cx(shared.frame, styles.words)}>
				<ul className={styles.wordsGrid}>
					{VALUES.map((value, index) => (
						<li key={value} className={styles.wordsCell}>
							{index === ORB_CELL && <span className={cx(styles.wordsOrb, shared.hued)} data-hue="orange" aria-hidden="true" />}
							<Text as="span" size="xs" tone="faint" className={cx(styles.mono, shared.numeral)}>
								{pad(index + 1)}
							</Text>
							<Text as="span" family="serif" weight="regular" tone="strong" leading="none" className={styles.wordsWord}>
								{value}
							</Text>
						</li>
					))}
				</ul>
				<Surface tone="raised" radius="lg" padding="md" bevel className={styles.wordsNote}>
					<Text size="sm" leading="normal">
						{footer('about')}
					</Text>
					<Text as="span" size="md" family="serif" italic tone="strong">
						{footer('signature')}
					</Text>
				</Surface>
			</div>
		</div>
	);
}

/** The proposals for this shelf, in switcher order. */
export const ABOUT_VARIANTS: LibraryVariantDef[] = [
	{ id: 'a', label: 'Statement', refs: 'Analogue Agency', Component: AboutStatement },
	{ id: 'b', label: 'Studio note', refs: 'incident.io', Component: AboutNote },
	{ id: 'c', label: 'Word grid', refs: 'Mother Design, OFF+BRAND', Component: AboutWords },
];
