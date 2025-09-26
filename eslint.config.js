import { defineConfig } from 'eslint-define-config'
import vuePlugin from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default defineConfig([
  // TS / JS
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2, { SwitchCase: 1 }],
    },
  },
  // Vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser, // <- tutaj obiekt parsera, nie string
      parserOptions: {
        parser: tsParser, // do <script lang="ts">
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: { vue: vuePlugin },
    rules: {
      'vue/no-unused-components': 'warn',
      'vue/html-indent': ['error', 2],
    },
  },
])
