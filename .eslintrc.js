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
    // So we can use for...of
    'no-restricted-syntax': 0,
  },
};
