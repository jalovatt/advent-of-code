module.exports = {
  testMatch: [
    '**/?(*.)spec.(?:t|j)s',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__template/',
  ],
  transform: {
    '^.+\\.(?:t|j)s$': '@swc/jest',
  },
  moduleFileExtensions: [
    'js',
    'ts',
    'txt',
  ]
};
