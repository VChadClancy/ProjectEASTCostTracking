// Forecast Version Repository Contract for Sprint 13
// Domain: Forecast Versioning

import { ForecastVersion, ForecastVersionKind, ForecastVersionStatus, ForecastVersionScope } from './forecastVersionTypes';
import { ForecastVersionDelta, ForecastVersionDeltaSummary } from '../financials/forecastVersionDeltaService';

export interface ForecastVersionFilters {
  scope?: ForecastVersionScope;
  kind?: ForecastVersionKind;
  status?: ForecastVersionStatus;
  programId?: string;
  projectId?: string;
  fiscalYear?: number;
  versionMonth?: string;
}

export interface ForecastVersionRepository {
  getForecastVersions(filters?: ForecastVersionFilters): Promise<ForecastVersion[]>;
  getForecastVersionById(versionId: string): Promise<ForecastVersion | undefined>;
  getForecastVersionsByProgramId(programId: string): Promise<ForecastVersion[]>;
  getForecastVersionsByProjectId(projectId: string): Promise<ForecastVersion[]>;
  saveForecastVersion(input: ForecastVersion): Promise<ForecastVersion>;
  compareForecastVersions(baseVersionId: string, comparisonVersionId: string): Promise<{ deltas: ForecastVersionDelta[]; summary: ForecastVersionDeltaSummary } | undefined>;
}
