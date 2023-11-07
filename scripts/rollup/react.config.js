import { getPackageJSON, resolvePkgPath, getBaseRollupPlugin } from './utils';

import generatePackageJson from 'rollup-plugin-generate-package-json';

// react包路径
const { name, module } = getPackageJSON('react');
const pkgPath = resolvePkgPath(name);

// react产物路径
const pkgDistPath = resolvePkgPath(name, true);
export default [
	// react
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [
			...getBaseRollupPlugin(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				// 自定义pkg字段
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
	},
	// jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugin()
	}
];
