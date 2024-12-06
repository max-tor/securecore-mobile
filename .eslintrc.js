module.exports = {
  root: true,
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: 'readonly',
    JSX: 'readonly',
  },
  env: {
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'jest',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'spaced-comment': ['error', 'always', {markers: ['/']}],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'import/no-cycle': 'off',
    indent: ['error', 2, {SwitchCase: 1}],
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'simple-import-sort/imports': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    quotes: ['error', 'single'],
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'react/display-name': ['off'],
    'newline-after-var': ['error'],
    'newline-before-return': ['error'],
    'react/function-component-definition': 'off',
    camelcase: [
      'error',
      {
        allow: [
          'region_with_type',
          'unrestricted_value',
          'from_bound',
          'to_bound',
        ],
      },
    ],

    // TypeScript
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['warn', {ignoreRestSiblings: true}],
    '@typescript-eslint/no-use-before-define': ['error'],

    // React
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/prop-types': 'off',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-curly-newline': 'off',
    'react/jsx-props-no-spreading': 0,
    'react/jsx-one-expression-per-line': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 0,
    'react/no-array-index-key': 'off',
    'react/no-unused-prop-types': 'off',
    'react/jsx-no-bind': 'off',

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        svg: 'always',
        png: 'always',
        json: 'always',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
      'babel-module': {},
    },
  },
};
