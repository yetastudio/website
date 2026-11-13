'use client';

//! Components
import { ShowcaseLayout, ShowcaseNav } from '@/components/showcase';
import { Accent, Chip, Heading, Text } from '@/components/ui';
import { Foundations } from './foundations';
import { InspoComponents, Primitives } from './primitives';
import { Composites } from './composites';

//! Styles
import styles from './styles.module.css';

const navItems = [
	{ id: 'color', label: 'Color', group: 'Foundations' },
	{ id: 'typography', label: 'Typography', group: 'Foundations' },
	{ id: 'space', label: 'Space & radius', group: 'Foundations' },
	{ id: 'motion', label: 'Motion', group: 'Foundations' },
	{ id: 'icons', label: 'Iconography', group: 'Foundations' },
	{ id: 'button', label: 'Button', group: 'Components' },
	{ id: 'chip', label: 'Chip', group: 'Components' },
	{ id: 'text', label: 'Text', group: 'Components' },
	{ id: 'brand-marks', label: 'Brand marks', group: 'Components' },
	{ id: 'section-header', label: 'Section header', group: 'Patterns' },
	{ id: 'gradient-tile', label: 'Gradient tile', group: 'Patterns' },
	{ id: 'craft-card', label: 'Craft card', group: 'Patterns' },
	{ id: 'process-card', label: 'Process card', group: 'Patterns' },
	{ id: 'testimonial-card', label: 'Testimonial card', group: 'Patterns' },
	{ id: 'project-card', label: 'Project card', group: 'Patterns' },
	{ id: 'summary-card', label: 'Summary card', group: 'Patterns' },
	{ id: 'inspo', label: 'Inspo components', group: 'Inspo' },
];

export default function DesignSystemShowcase() {
	return (
		<ShowcaseLayout nav={<ShowcaseNav label="Design system sections" items={navItems} />}>
			<header className={styles.intro}>
				<div className={styles.introMeta}>
					<Chip>Design System</Chip>
					<Chip>v1 · light + dark</Chip>
				</div>
				<Heading level={1} size="5xl" tone="display">
					Yeta ✹ Studio, in components
				</Heading>
				<Text size="lg" tone="subtle">
					Every token, component and state the site is built from, rendered live on both canvases. Built from the Figma library and
					extended with the pieces it was <Accent>missing</Accent>.
				</Text>
			</header>
			<Foundations />
			<Primitives />
			<Composites />
			<InspoComponents />
		</ShowcaseLayout>
	);
}
