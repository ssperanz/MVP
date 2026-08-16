import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',

  testEnvironment: 'node',

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },

  testRegex: '.*\\.spec\\.ts$',

  moduleFileExtensions: ['ts', 'js', 'json'],
};

export default {
  ...config,
  maxWorkers: 1,
};