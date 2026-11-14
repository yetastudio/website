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
//* Gallery (component.gallery): forms, advanced inputs, feedback, navigation, layout & content
export { Label } from './label';
export { Fieldset } from './fieldset';
export { Form, FormRow, FormActions } from './form';
export { RadioGroup, Radio } from './radio';
export { Select } from './select';
export { SearchInput } from './search-input';
export { Slider } from './slider';
export { Stepper } from './stepper';
export { Combobox } from './combobox';
export { DateInput } from './date-input';
export { Datepicker } from './datepicker';
export { ColorPicker, BRAND_SWATCHES } from './color-picker';
export { File, formatBytes } from './file';
export { FileUpload } from './file-upload';
export { RichTextEditor } from './rich-text-editor';
export { Rating } from './rating';
export { Alert } from './alert';
export { Badge } from './badge';
export { Spinner } from './spinner';
export { Skeleton, SkeletonReveal } from './skeleton';
export { ProgressBar } from './progress-bar';
export { ProgressIndicator } from './progress-indicator';
export { EmptyState } from './empty-state';
export { Popover } from './popover';
export { Breadcrumbs } from './breadcrumbs';
export { Navigation, NavGroup, NavItem } from './navigation';
export { Pagination } from './pagination';
export { Tabs, TabList, Tab, TabPanel } from './tabs';
export { DropdownMenu, MenuItem, MenuGroup, MenuSeparator } from './dropdown-menu';
export { Drawer } from './drawer';
export { SkipLink } from './skip-link';
export { TreeView, TreeItem } from './tree-view';
export { Card, CardMedia, CardHeader, CardBody, CardFooter } from './card';
export { Stack } from './stack';
export { List, ListItem } from './list';
export { Quote } from './quote';
export { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from './table';
export { Image } from './image';
export { Video } from './video';
export { ButtonGroup } from './button-group';
export { VisuallyHidden } from './visually-hidden';

export type { TextProps, HeadingProps, AccentProps, TextSize, TextTone } from './text';
export type { IconName, IconSize } from './icon';
export type { ButtonProps, ButtonSize, ButtonVariant } from './button';
export type { ChipProps, ChipTone } from './chip';
export type { SurfaceProps } from './surface';
export type { TileHue, TileShape } from './gradient-tile';
export type { Project, ProjectShot } from './project-card';
