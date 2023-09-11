const nextJest = require('next/jest')
const tsconfig = require('./tsconfig.json')
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig)

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testTimeout: 10000,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/__tests__',
    '<rootDir>/__mocks__',
    '<rootDir>/.next',
    '<rootDir>/public',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next',
    'jest.config.js',
    'next.config.js',
    '<rootDir>/__mocks__',
    '<rootDir>/__tests__/utils',
  ],
  moduleNameMapper,
  automock: false,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)
