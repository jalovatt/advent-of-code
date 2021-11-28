module.exports = {
  testMatch: [
    '**/?(*.)spec.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__template/',
  ],
  transform: {
    '^.+\\.js$': '@swc/jest',
  },
};
