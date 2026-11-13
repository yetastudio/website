import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores([
		'.next/**',
		'node_modules/**',
		'next-env.d.ts',
		// Vendored from the build-design-system skill.
		'scripts/check-system.mjs',
		'scripts/oklch.mjs',
		// Pre-existing personal backup, not imported by the app.
		'src/app/[[]locale]/layout-backup.tsx',
	]),
]);
