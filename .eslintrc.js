module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    project: ['./tsconfig.json', './jest.config.js'],
  },
  rules: {
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    'object-curly-newline': [
      'error',
      {
        minProperties: 8,
        consistent: true,
      },
    ],
    'no-bitwise': 0,
    'no-continue': 0,
    // So we can use for...of (bad for perf though, probably shouldn't)
    'no-restricted-syntax': 0,
    'prefer-destructuring': 0,
    'no-labels': 0,
    '@typescript-eslint/no-loop-func': 0,
    'no-param-reassign': 0,
    'no-nested-ternary': 0,
    'no-constant-condition': 0,
  },
};
