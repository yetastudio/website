//! React Core
import type { ReactNode } from 'react';

//! Components
import { Accent } from '@/components/ui/text';

/**
 * Tags available inside translated copy (next-intl `t.rich`):
 *   <em>word</em>     editorial italic, underlined (calls to action, key words)
 *   <serif>word</serif> upright editorial serif (emphasis inside running copy)
 *   <br></br>          a line break the design forces at every width
 *   <brmd></brmd>      a line break from 768px up only (desktop compositions)
 */
export const richTags = {
	em: (chunks: ReactNode) => <Accent underline>{chunks}</Accent>,
	serif: (chunks: ReactNode) => <Accent italic={false}>{chunks}</Accent>,
	br: () => <br />,
	brmd: () => <br className="u-break-md" />,
};
