module.exports = {
  ...require('@babel/preset-env').default,
  preset: 'ts-jest',
  rootDir: `.`,
  setupFiles: [],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  testTimeout: 120000,
  transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { babelConfig: true }] },
  verbose: true,
  watchman: false,
}
