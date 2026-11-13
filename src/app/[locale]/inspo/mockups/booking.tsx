'use client';

//! Components
import { Button as KitButton, Segmented, Stage, Text, type Act } from '@stageshow';
import { Check } from 'lucide-react';
import { Accent, Button, GradientTile, Icon, Text as DsText } from '@/components/ui';
import { BOOKING_URL } from '@/components/layout/sections';

//! Utils
import { cx } from '@/lib/cx';

//! Styles
import styles from './scenes.module.css';
import mockups from './mockups.module.css';

// Proposal 07, booking preview. The intro-call card hangs off the top-left
// corner of a violet wash tile and runs off its right and bottom edges.
// Beats: the arrow picks Tuesday, then 11:30, then Confirm; the same button
// turns into Booked with a tick (label and icon change, the colour stays). The poster is that booked call. Loop: the
// arrow presses Reschedule, the picks clear (the last change first) and the
// same call is booked again, so the reset has its cause on screen.
//
// Real strings: the call, its length, the week, three times and the buttons.

type S = {
	day: number;
	dayOn: boolean;
	slot: number;
	slotOn: boolean;
	booked: boolean;
};

const DAYS = [
	['Mon', '17'],
	['Tue', '18'],
	['Wed', '19'],
	['Thu', '20'],
	['Fri', '21'],
] as const;
const SLOTS = ['10:00', '11:30', '16:00'] as const;
const POSTER: S = { day: 1, dayOn: true, slot: 1, slotOn: true, booked: true };

async function pick(a: Act<S>, target: string) {
	await a.move(target);
	await a.wait(140);
	await a.click();
}

async function script(a: Act<S>) {
	await a.wait(1900);
	// Reschedule: the booking clears, the last pick first
	a.mark('reschedule');
	await pick(a, 'reschedule');
	await a.set({ booked: false });
	await a.wait(120);
	await a.set({ slotOn: false });
	await a.wait(90);
	await a.set({ dayOn: false });
	await a.wait(600);

	// A day, a time, confirm
	a.mark('day');
	await pick(a, 'day-1');
	await a.set({ day: 1, dayOn: true });
	await a.wait(380);
	a.mark('slot');
	await pick(a, 'slot-1');
	await a.set({ slot: 1, slotOn: true });
	await a.wait(380);
	a.mark('confirm');
	await pick(a, 'confirm');
	await a.set({ booked: true });
	await a.wait(500);
	await a.move('rest');
	await a.wait(1500);
}

function BookingScene() {
	return (
		<Stage<S>
			width={340}
			height={236}
			initial={POSTER}
			poster={POSTER}
			script={script}
			cursor={{ at: 'rest', ripple: true }}
			className={styles.bookStage}
		>
			{(s) => (
				<>
					<div className={styles.bookCard}>
						<div className={styles.bookHead}>
							<Icon name="calendar" size="md" className={styles.bookIcon} />
							<Text className={styles.bookTitle}>Intro call</Text>
							<Text className={styles.bookMeta}>30 min</Text>
						</div>
						<Segmented
							className={styles.bookDays}
							data-none={!s.dayOn || undefined}
							value={s.day}
							targets={DAYS.map((_, i) => `day-${i}`)}
							items={DAYS.map(([weekday, date]) => (
								<span key={date} className={styles.bookDay}>
									<span className={styles.bookWeekday}>{weekday}</span>
									<span className={styles.bookDate}>{date}</span>
								</span>
							))}
						/>
						<Segmented
							className={styles.bookSlots}
							data-none={!s.slotOn || undefined}
							value={s.slot}
							targets={SLOTS.map((_, i) => `slot-${i}`)}
							items={SLOTS.map((slot) => (
								<span key={slot}>{slot}</span>
							))}
						/>
						<div className={styles.bookActions}>
							<KitButton
								variant="primary"
								icon={s.booked ? <Check size={12} strokeWidth={2.25} aria-hidden /> : undefined}
								data-target="confirm"
								data-idle={!s.slotOn || undefined}
							>
								{s.booked ? 'Booked' : 'Confirm'}
							</KitButton>
							<KitButton variant="ghost" data-target="reschedule" className={styles.bookReschedule} data-show={s.booked || undefined}>
								Reschedule
							</KitButton>
						</div>
					</div>
					<span data-target="rest" className={styles.bookRest} />
				</>
			)}
		</Stage>
	);
}

/** The closing call to action with the booking shown in place, on a violet wash. */
export function BookingMockup() {
	return (
		<div className={mockups.container}>
			<div className={mockups.booking}>
				<div className={mockups.bookingCopy}>
					<DsText as="p" size="xl" family="serif" weight="regular" leading="tight" tone="strong" balance>
						Let’s make something <Accent>great</Accent> together.
					</DsText>
					<DsText size="sm" tone="subtle" leading="relaxed">
						Pick a time for a 30-minute intro. You’ll get the invite right away.
					</DsText>
					<Button href={BOOKING_URL} size="md" iconStart="calendar">
						Book a call
					</Button>
				</div>
				<GradientTile hue="violet" shape="craft" className={mockups.bookingTile}>
					<div
						className={cx(styles.frame, styles.bookFrame)}
						role="img"
						aria-label="Mockup: an intro-call card; the cursor picks Tuesday 18 at 11:30 and confirms, and the button turns to Booked."
					>
						<BookingScene />
					</div>
				</GradientTile>
			</div>
		</div>
	);
}

export default BookingMockup;
