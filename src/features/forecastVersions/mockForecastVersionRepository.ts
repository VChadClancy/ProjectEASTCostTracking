// Mock Forecast Version Repository for Sprint 13
// Deterministic, in-memory, no network, no mutation leaks
import { ForecastVersionRepository, ForecastVersionFilters } from './forecastVersionRepository';
import {
  ForecastVersion,
  ForecastVersionKind,
  ForecastVersionStatus,
  ForecastVersionScope,
  ForecastVersionLine
} from './forecastVersionTypes';
import { compareForecastVersions as pureCompareForecastVersions, ForecastVersionDelta, ForecastVersionDeltaSummary } from '../financials/forecastVersionDeltaService';

// --- Mock Data ---
const mockForecastVersions: ForecastVersion[] = [
  {
    id: 'ver-prog-2026-baseline',
    name: 'Program 2026 Baseline',
    scope: ForecastVersionScope.Program,
    kind: ForecastVersionKind.Baseline,
    status: ForecastVersionStatus.Active,
    programId: 'prog-1',
    fiscalYear: 2026,
    versionMonth: '2026-01',
    createdBy: 'user1',
    createdAt: '2026-01-10T12:00:00Z',
    snapshotLines: [
      { id: 'l1', forecastVersionId: 'ver-prog-2026-baseline', projectId: 'proj-1', forecastAmount: 10000, actualAmount: 9000, budgetAmount: 9500, varianceAmount: 1000, month: '2026-01', costCategory: 'Labor', budgetStream: 'CapEx' },
      { id: 'l2', forecastVersionId: 'ver-prog-2026-baseline', projectId: 'proj-2', forecastAmount: 20000, actualAmount: 18000, budgetAmount: 19000, varianceAmount: 2000, month: '2026-01', costCategory: 'Materials', budgetStream: 'OpEx' },
    ],
  },
  {
    id: 'ver-prog-2026-current',
    name: 'Program 2026 Current',
    scope: ForecastVersionScope.Program,
    kind: ForecastVersionKind.Current,
    status: ForecastVersionStatus.Active,
    programId: 'prog-1',
    fiscalYear: 2026,
    versionMonth: '2026-02',
    createdBy: 'user2',
    createdAt: '2026-02-10T12:00:00Z',
    snapshotLines: [
      { id: 'l1', forecastVersionId: 'ver-prog-2026-current', projectId: 'proj-1', forecastAmount: 11000, actualAmount: 9500, budgetAmount: 10000, varianceAmount: 1500, month: '2026-02', costCategory: 'Labor', budgetStream: 'CapEx' },
      { id: 'l2', forecastVersionId: 'ver-prog-2026-current', projectId: 'proj-2', forecastAmount: 21000, actualAmount: 18500, budgetAmount: 20000, varianceAmount: 2500, month: '2026-02', costCategory: 'Materials', budgetStream: 'OpEx' },
    ],
  },
  {
    id: 'ver-proj-1-2026-snap-jan',
    name: 'Project 1 Jan Snapshot',
    scope: ForecastVersionScope.Project,
    kind: ForecastVersionKind.MonthlySnapshot,
    status: ForecastVersionStatus.Archived,
    programId: 'prog-1',
    projectId: 'proj-1',
    fiscalYear: 2026,
    versionMonth: '2026-01',
    createdBy: 'user3',
    createdAt: '2026-01-31T23:59:59Z',
    snapshotLines: [
      { id: 'l1', forecastVersionId: 'ver-proj-1-2026-snap-jan', projectId: 'proj-1', forecastAmount: 10000, actualAmount: 9000, budgetAmount: 9500, varianceAmount: 1000, month: '2026-01', costCategory: 'Labor', budgetStream: 'CapEx' },
    ],
  },
  {
    id: 'ver-proj-1-2026-snap-feb',
    name: 'Project 1 Feb Snapshot',
    scope: ForecastVersionScope.Project,
    kind: ForecastVersionKind.MonthlySnapshot,
    status: ForecastVersionStatus.Active,
    programId: 'prog-1',
    projectId: 'proj-1',
    fiscalYear: 2026,
    versionMonth: '2026-02',
    createdBy: 'user3',
    createdAt: '2026-02-29T23:59:59Z',
    snapshotLines: [
      { id: 'l1', forecastVersionId: 'ver-proj-1-2026-snap-feb', projectId: 'proj-1', forecastAmount: 12000, actualAmount: 9500, budgetAmount: 11000, varianceAmount: 1500, month: '2026-02', costCategory: 'Labor', budgetStream: 'CapEx' },
    ],
  },
];

function safeCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const mockForecastVersionRepository: ForecastVersionRepository = {
  async getForecastVersions(filters?: ForecastVersionFilters) {
    let result = mockForecastVersions;
    if (filters) {
      if (filters.scope) result = result.filter(v => v.scope === filters.scope);
      if (filters.kind) result = result.filter(v => v.kind === filters.kind);
      if (filters.status) result = result.filter(v => v.status === filters.status);
      if (filters.programId) result = result.filter(v => v.programId === filters.programId);
      if (filters.projectId) result = result.filter(v => v.projectId === filters.projectId);
      if (filters.fiscalYear) result = result.filter(v => v.fiscalYear === filters.fiscalYear);
      if (filters.versionMonth) result = result.filter(v => v.versionMonth === filters.versionMonth);
    }
    return safeCopy(result);
  },
  async getForecastVersionById(versionId: string) {
    const found = mockForecastVersions.find(v => v.id === versionId);
    return found ? safeCopy(found) : undefined;
  },
  async getForecastVersionsByProgramId(programId: string) {
    return safeCopy(mockForecastVersions.filter(v => v.programId === programId));
  },
  async getForecastVersionsByProjectId(projectId: string) {
    return safeCopy(mockForecastVersions.filter(v => v.projectId === projectId));
  },
  async saveForecastVersion(input: ForecastVersion) {
    // In-memory append, no mutation leak
    const copy = safeCopy(input);
    mockForecastVersions.push(copy);
    return safeCopy(copy);
  },
  async compareForecastVersions(baseVersionId: string, comparisonVersionId: string) {
    const base = mockForecastVersions.find(v => v.id === baseVersionId);
    const comp = mockForecastVersions.find(v => v.id === comparisonVersionId);
    if (!base || !comp) return undefined;
    const { deltas, summary } = pureCompareForecastVersions(base.snapshotLines, comp.snapshotLines);
    return { deltas: safeCopy(deltas), summary: safeCopy(summary) };
  },
};
