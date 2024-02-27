import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/test/.*|(\\.|/)(test|spec))\\.ts$',
  testPathIgnorePatterns: ['/lib/', '/node_modules/', 'config.test.ts'],
  moduleFileExtensions: ['ts', 'json', 'js', 'node'],
  silent: false
};

export default jestConfig;
