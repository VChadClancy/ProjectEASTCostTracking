// Tests for Forecast Version Repository Factory (Sprint 13)
import { describe, it, expect } from 'vitest';
import { getForecastVersionRepository } from './forecastVersionRepositoryFactory';
import { mockForecastVersionRepository } from './mockForecastVersionRepository';

// No process.env usage; test config via DI or direct opts only

describe('getForecastVersionRepository', () => {
  it('returns mock repository by default', () => {
    const repo = getForecastVersionRepository();
    expect(repo).toBe(mockForecastVersionRepository);
  });

  it('returns mock repository if explicitly requested', () => {
    const repo = getForecastVersionRepository({ forecastVersionDataSource: 'mock' });
    expect(repo).toBe(mockForecastVersionRepository);
  });

  it('returns injected mockRepo if provided', () => {
    const fakeRepo = {} as any;
    const repo = getForecastVersionRepository({ mockRepo: fakeRepo });
    expect(repo).toBe(fakeRepo);
  });

  it('throws clear error if API mode requested and not implemented', () => {
    expect(() => getForecastVersionRepository({ forecastVersionDataSource: 'api' })).toThrow(/not implemented/i);
  });
});
