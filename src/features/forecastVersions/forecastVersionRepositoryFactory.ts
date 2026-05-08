// Forecast Version Repository Factory for Sprint 13
// Selects repository implementation based on config/env, defaults to mock
import { appConfig } from '../../config/appConfig';
import { mockForecastVersionRepository } from './mockForecastVersionRepository';
import type { ForecastVersionRepository } from './forecastVersionRepository';

/**
 * Returns a ForecastVersionRepository implementation based on appConfig.forecastVersionDataSource.
 * Allows optional override for config/env and dependency injection for tests.
 */
export function getForecastVersionRepository(
  opts?: { forecastVersionDataSource?: string; mockRepo?: ForecastVersionRepository; apiRepo?: ForecastVersionRepository }
): ForecastVersionRepository {
  const source = opts?.forecastVersionDataSource ?? (appConfig as any).forecastVersionDataSource;
  if (source === 'api') {
    if (opts?.apiRepo) return opts.apiRepo;
    // No API repo implemented yet; fallback to mock or throw
    throw new Error('API ForecastVersionRepository not implemented.');
  }
  // fallback to mock
  if (opts?.mockRepo) return opts.mockRepo;
  return mockForecastVersionRepository;
}
