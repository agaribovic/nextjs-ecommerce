const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', 
  },
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/mockCakes.ts",  
  ],
};

module.exports = createJestConfig(customJestConfig);
