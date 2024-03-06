module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	parser: '@typescript-eslint/parser',
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',
		'react/jsx-boolean-value': 'error',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'no-nested-ternary': 'off',
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				tabWidth: 2,
				singleQuote: true,
				printWidth: 100,
				bracketSpacing: true,
				parenSpacing: true,
				bracketSameLine: false,
			},
		],
	},
	overrides: [
		{
			files: [ '**/test/**/*.js', '**/__tests__/**/*.js', '**/*.spec.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-unit' ],
			settings: {
				jest: {
					version: 26,
				},
			},
		},
		{
			files: [ 'test/e2e/**/*.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-e2e' ],
			rules: {
				'jest/expect-expect': 'off',
			},
		},
	],
};
