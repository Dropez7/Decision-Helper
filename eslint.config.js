export default [
    { ignores: ['dist'] },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
            parser: tseslintParser,
        },
        plugins: {
            '@typescript-eslint': tseslintPlugin,
        },
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'prettier'
        ],
        rules: {
            ...tseslintPlugin.configs.recommended.rules,
        },
    },
];
