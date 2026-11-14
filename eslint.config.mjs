import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
	...nextVitals,
	...nextTs,
	{
		// The barrels re-export every component (and every landing section). Importing one name from
		// them puts all of their client components in the page's bundle, so import each module directly.
		files: ['src/**/*.{ts,tsx}'],
		ignores: ['src/components/ui/index.ts', 'src/components/layout/index.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{ name: '@/components/ui', message: 'Import from the component module instead (e.g. @/components/ui/button): the barrel ships every client component.' },
						{ name: '@/components/layout', message: 'Import from the section module instead (e.g. @/components/layout/header): the barrel ships every landing section.' },
					],
				},
			],
		},
	},
	globalIgnores([
		'.next/**',
		'node_modules/**',
		'next-env.d.ts',
		// Vendored from the build-design-system skill.
		'scripts/check-system.mjs',
		'scripts/oklch.mjs',
		// Vendored third-party code: the Stageshow kit (MIT, see vendor/stageshow/LICENSE) and transitions.dev CSS.
		'vendor/**',
		// Pre-existing personal backup, not imported by the app.
		'src/app/[[]locale]/layout-backup.tsx',
	]),
]);
