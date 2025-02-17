import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    setupFilesAfterEnv: ['<rootDir>/test/__setup__.ts'],
};

export default config;