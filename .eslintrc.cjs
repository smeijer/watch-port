module.exports = {
	extends: ['@smeijer/eslint-config'],
	rules: {
		'@typescript-eslint/no-misused-promises': [
			'error',
			{
				checksVoidReturn: false,
			},
		],
	},
	overrides: [
		{
			files: ['./scripts/**/*.ts'],
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./tsconfig.eslint.json'],
			},
		},
	],
};
