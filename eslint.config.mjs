import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'next-env.d.ts',
			// Vendored from the build-design-system skill.
			'scripts/check-system.mjs',
			'scripts/oklch.mjs',
			// Pre-existing personal backup, not imported by the app.
			'src/app/[[]locale]/layout-backup.tsx',
		],
	},
	...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
