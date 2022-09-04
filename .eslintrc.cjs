module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ['svelte3', "@typescript-eslint"],
    env: {
        browser: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: ["dist", '.eslintrc.*', 'vite.config.*', 'svelte.config.js'],
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3'
        }
    ],
    extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    rules: {
        "import/prefer-default-export": "off",
        "@typescript-eslint/quotes": ["error", "double"],
    },
    settings: {
        'svelte3/typescript': true
    }
};