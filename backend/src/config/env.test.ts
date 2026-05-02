import { describe, it, expect } from 'vitest';
import { loadConfig } from './env';

describe('config/env', () => {
  it('applies defaults when env is not set', () => {
    const config = loadConfig({});
    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(4000);
    expect(config.API_VERSION).toBe('v1');
    expect(config.DATABASE_URL).toBeUndefined();
    expect(config.REPOSITORY_MODE).toBe('mock');
  });

  it('parses PORT from env', () => {
    const config = loadConfig({ PORT: '12345' });
    expect(config.PORT).toBe(12345);
  });

  it('invalid REPOSITORY_MODE falls back to mock', () => {
    const config = loadConfig({ REPOSITORY_MODE: 'invalid' });
    expect(config.REPOSITORY_MODE).toBe('mock');
  });

  it('DATABASE_URL is optional', () => {
    expect(loadConfig({ DATABASE_URL: '' }).DATABASE_URL).toBeUndefined();
    expect(loadConfig({}).DATABASE_URL).toBeUndefined();
    expect(loadConfig({ DATABASE_URL: 'postgres://foo' }).DATABASE_URL).toBe('postgres://foo');
  });

  it('REPOSITORY_MODE prisma is accepted', () => {
    const config = loadConfig({ REPOSITORY_MODE: 'prisma' });
    expect(config.REPOSITORY_MODE).toBe('prisma');
  });

  it('NODE_ENV, API_VERSION, and other values are respected', () => {
    const config = loadConfig({ NODE_ENV: 'production', API_VERSION: 'v2' });
    expect(config.NODE_ENV).toBe('production');
    expect(config.API_VERSION).toBe('v2');
  });
});
