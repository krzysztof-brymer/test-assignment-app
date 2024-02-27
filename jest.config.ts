import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '\\.test\\.ts$',
  testPathIgnorePatterns: ['/lib/', '/node_modules/', 'config.test.ts'],
  moduleFileExtensions: ['ts', 'json', 'js', 'node'],
  setupFilesAfterEnv: ['./jest.setup.ts']
};

export default jestConfig;
