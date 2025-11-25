import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ['examples/**', 'scripts/**', '**/lib-esm/**', '**/node_modules/**', 'dist-pages/**'],
  },
  {
    files: ['packages/**/src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-eval': 'error',
      'no-debugger': 'error',
      'no-console': 'error',
      'no-var': 'error',
      'no-unsafe-finally': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-namespace': 'error',
      // 以前の設定では無効だったルールを維持
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-constant-condition': 'off',
      'no-empty': 'off',
    },
  },
);
