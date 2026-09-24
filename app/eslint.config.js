// -----------------------------------------------------------
//  [*] ESLint configuration
//
//  Flat config, aligned with the faucet's vite app: the
//  recommended JS + react-hooks rule sets over every .js/.jsx
//  file, dist/ ignored. vite.config.js runs under node, so it
//  gets the node globals (process) in its own block.
// -----------------------------------------------------------

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // jsx-uses-vars is the ONE rule taken from
      // eslint-plugin-react: it marks a component as used
      // when it appears in JSX, so an unused component
      // import is a real error instead of being hidden by
      // an ignore-everything-capitalised pattern
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // The vite config is a node module, not browser code
    files: ['vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]
