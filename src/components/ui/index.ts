// Design system barrel. Registry and status live in src/components/ui/REGISTRY.md.

//* Primitives
export { Text, Heading, Accent } from './text';
export { Icon, iconNames } from './icon';
export { Button } from './button';
export { Chip } from './chip';
export { Surface } from './surface';
export { BrandMark, LogoMark, MessyBrandMark, Wordmark } from './brand';

//* Patterns (Figma composites)
export { SectionHeader } from './section-header';
export { GradientTile } from './gradient-tile';
export { CraftCard } from './craft-card';
export { ProcessCard } from './process-card';
export { TestimonialCard } from './testimonial-card';
export { ProjectCard, CaseStudy, CaseStudyDialog } from './project-card';
export { SummaryCard } from './summary-card';
export { Carousel } from './carousel';
export { CardStack } from './card-stack';

//* Inspo components (not drawn in Figma, same visual language)
export { SegmentedControl } from './segmented-control';
export { ThemeSwitch } from './theme-switch';
export { Link } from './link';
export { Divider } from './divider';
export { Avatar, AvatarGroup } from './avatar';
export { PaginationDots } from './pagination-dots';
export { Tooltip } from './tooltip';
export { Accordion, AccordionItem } from './accordion';
export { Dialog } from './dialog';
export { Reveal } from './reveal';
export { revealLine } from './reveal/line';
export { LocaleSwitch } from './locale-switch';
export { ToastProvider, useToast } from './toast';
export { Input, Textarea } from './field';
export { Checkbox, Switch } from './checkbox';

//* Types
export type { TextProps, HeadingProps, AccentProps, TextSize, TextTone } from './text';
export type { IconName, IconSize } from './icon';
export type { ButtonProps, ButtonSize, ButtonVariant } from './button';
export type { ChipProps, ChipTone } from './chip';
export type { SurfaceProps } from './surface';
export type { TileHue, TileShape } from './gradient-tile';
export type { Project, ProjectShot } from './project-card';
