# Notices

Stageshow source is MIT licensed; see `LICENSE`.

Product and operating-system names, familiar device geometry, app icons, and
illustrated interfaces are used as examples. Those names and marks remain
with their owners; the Stageshow license does not grant trademark rights or
imply endorsement. Adapt examples to the product you are illustrating.

The Radix-inspired look uses publicly documented color and spacing values;
its source is identified in `examples/looks/radix.css`. The app icons in `assets/app-icons.ts` are artwork from their respective app
bundles, as identified in that file; they are not covered by the Stageshow MIT
license. They remain illustrative references to those products. The Wikipedia
study includes two local photographs dedicated under CC0 1.0 (also used
in the Finder, Telegram and annotation studies); their authors,
original source pages and modifications are recorded in
[`examples/wikipedia/PHOTOS.md`](examples/wikipedia/PHOTOS.md). Other scenes
use CSS and vector illustrations. No third-party fonts are bundled, and the
playground does not fetch fonts or photographs from external services at runtime.

The local brand registry in `kit/brands/` includes SVG artwork from SVGL (MIT), payment-icons (Apache 2.0), Cryptocurrency Icons (CC0 1.0), and official Linear, American Express and Circle assets. Per-file sources, hashes and license files are listed in [`kit/brands/SOURCES.md`](kit/brands/SOURCES.md). The original artwork and brand usage terms remain with their respective owners.

`Phone frame="photo"` is optional. Supply your own permitted bezel image via
`--ss-phone-photo-light: url(...)` and optionally `--ss-phone-photo-dark`.
Without it, the kit uses its CSS-drawn `pro` frame. No bezel photographs are
bundled.

## Local changes (yeta.studio)

This vendored copy adds `yeta.css`, a look mapped to the Yeta Studio design
system's semantic tokens (`src/styles/tokens.css`), registers it as the
`yeta` theme in `looks.ts` and makes it the default theme of `Stage`
(`stage.tsx`, `stageshow.css`), and lets a look recolor named avatars
(`parts/Avatar.tsx` reads `--ss-person-1` to `-6` and `--ss-person-text`,
falling back to the upstream colors). Nothing else differs from upstream.
