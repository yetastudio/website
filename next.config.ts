import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack's default CSS chunking merges styles across routes, so the landing loaded the
    // /inspo and /design-system stylesheets. The graph strategy with a low request cost keeps each
    // page to (close to) the styles it renders: less CSS on every route for a few more requests.
    cssChunking: { type: 'graph', requestCost: 20000, weightDistribution: 0.5 },
  },
};

export default withNextIntl(nextConfig);
