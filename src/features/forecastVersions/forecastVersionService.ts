// Forecast Version Service for Sprint 13
// Thin async wrapper over repository, for DI and future logic
import { getForecastVersionRepository } from './forecastVersionRepositoryFactory';
import type { ForecastVersion } from './forecastVersionTypes';
import type { ForecastVersionFilters } from './forecastVersionRepository';
import type { ForecastVersionDelta, ForecastVersionDeltaSummary } from '../financials/forecastVersionDeltaService';

export async function getForecastVersions(filters?: ForecastVersionFilters) {
  return getForecastVersionRepository().getForecastVersions(filters);
}

export async function getForecastVersionById(versionId: string) {
  return getForecastVersionRepository().getForecastVersionById(versionId);
}

export async function getForecastVersionsByProgramId(programId: string) {
  return getForecastVersionRepository().getForecastVersionsByProgramId(programId);
}

export async function getForecastVersionsByProjectId(projectId: string) {
  return getForecastVersionRepository().getForecastVersionsByProjectId(projectId);
}

export async function saveForecastVersion(input: ForecastVersion) {
  return getForecastVersionRepository().saveForecastVersion(input);
}

export async function compareForecastVersions(baseVersionId: string, comparisonVersionId: string): Promise<{ deltas: ForecastVersionDelta[]; summary: ForecastVersionDeltaSummary } | undefined> {
  return getForecastVersionRepository().compareForecastVersions(baseVersionId, comparisonVersionId);
}
