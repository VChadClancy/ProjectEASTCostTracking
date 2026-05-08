import { describe, it, expect, vi } from 'vitest';
import {
  buildForecastVersionSelectorItems,
  buildForecastVersionSummary,
  buildForecastVersionComparisonViewModel,
  buildForecastVersionDeltaSignals,
  buildForecastVersionSnapshotSummary
} from './forecastVersionViewModelAdapter';
import { ForecastVersionScope, ForecastVersionKind, ForecastVersionStatus } from './forecastVersionTypes';
import { DeltaSeverity } from '../financials/forecastVersionTypes';

// Minimal stubs for types
const programVersion = {
  id: 'v1',
  name: 'FY26 Baseline',
  scope: ForecastVersionScope.Program,
  kind: ForecastVersionKind.Baseline,
  status: ForecastVersionStatus.Active,
  programId: 'p1',
  fiscalYear: 2026,
  versionMonth: '2026-05',
  createdAt: '2026-05-01T00:00:00Z',
  snapshotLines: [
    { id: 'l1', forecastVersionId: 'v1', budgetAmount: 1000000, forecastAmount: 950000, actualAmount: 900000, varianceAmount: 50000 }
  ]
};
const projectVersion = {
  id: 'v2',
  name: 'FY26 Project A',
  scope: ForecastVersionScope.Project,
  kind: ForecastVersionKind.Current,
  status: ForecastVersionStatus.Draft,
  programId: 'p1',
  projectId: 'pj1',
  fiscalYear: 2026,
  versionMonth: '2026-05',
  createdAt: '2026-05-01T00:00:00Z',
  snapshotLines: [
    { id: 'l2', forecastVersionId: 'v2', budgetAmount: 500000, forecastAmount: 480000, actualAmount: 470000, varianceAmount: 10000 }
  ]
};

const comparison = {
  versionAId: 'v1',
  versionBId: 'v2',
  deltas: [
    { id: 'd1', amountDelta: 20000, percentDelta: 2, severity: DeltaSeverity.Healthy },
    { id: 'd2', amountDelta: -10000, percentDelta: -1, severity: DeltaSeverity.Healthy }
  ],
  summary: {
    totalAmountDelta: 10000,
    totalPercentDelta: 1,
    byProject: {},
    byCar: {},
    byBudgetStream: {},
    byCostCategory: {},
    severityCounts: { healthy: 1, attention: 0, risk: 0, info: 0 }
  }
};

const comparisonMany = {
  versionAId: 'v1',
  versionBId: 'v2',
  deltas: Array.from({ length: 20 }, (_, i) => ({
    id: `G${i}`,
    amountDelta: i * 10000,
    percentDelta: i,
    severity: DeltaSeverity.Healthy
  })),
  summary: {
    totalAmountDelta: 1000000,
    totalPercentDelta: 25,
    byProject: {},
    byCar: {},
    byBudgetStream: {},
    byCostCategory: {},
    severityCounts: { healthy: 20, attention: 0, risk: 0, info: 0 }
  }
};

const emptyComparison = {
  versionAId: 'v1',
  versionBId: 'v2',
  deltas: [],
  summary: {
    totalAmountDelta: 0,
    totalPercentDelta: 0,
    byProject: {},
    byCar: {},
    byBudgetStream: {},
    byCostCategory: {},
    severityCounts: { healthy: 0, attention: 0, risk: 0, info: 0 }
  }
};

describe('ForecastVersionViewModelAdapter', () => {
  it('builds selector items from versions', () => {
    const items = buildForecastVersionSelectorItems([programVersion, projectVersion]);
    expect(items).toHaveLength(2);
    expect(items[0].label).toBe('FY26 Baseline');
    expect(items[1].label).toBe('FY26 Project A');
  });

  it('program versions produce Program Budget Forecast label', () => {
    const items = buildForecastVersionSelectorItems([programVersion]);
    expect(items[0].scopeLabel).toBe('Program Budget Forecast');
  });

  it('project versions produce Project Forecast label', () => {
    const items = buildForecastVersionSelectorItems([projectVersion]);
    expect(items[0].scopeLabel).toBe('Project Forecast');
  });

  it('summary totals are finite', () => {
    const summary = buildForecastVersionSummary(programVersion);
    expect(summary?.totalBudget).toBe(1000000);
    expect(summary?.totalForecast).toBe(950000);
    expect(summary?.totalActuals).toBe(900000);
    expect(summary?.totalVariance).toBe(50000);
  });

  it('comparison view model includes amount/percent deltas', () => {
    const vm = buildForecastVersionComparisonViewModel(comparison, programVersion, projectVersion);
    expect(vm?.amountDelta).toBe(10000);
    expect(vm?.percentDelta).toBe(1);
    expect(vm?.groupedDeltaSummaries.length).toBe(2);
  });

  it('delta signals are limited and severity constrained', () => {
    const signals = buildForecastVersionDeltaSignals(comparisonMany);
    expect(signals.length).toBeLessThanOrEqual(10);
    expect(['low', 'medium', 'high']).toContain(signals[0].severity);
  });

  it('empty inputs are handled safely', () => {
    expect(buildForecastVersionSelectorItems(undefined)).toEqual([]);
    expect(buildForecastVersionSummary(null)).toBeNull();
    expect(buildForecastVersionComparisonViewModel(undefined, programVersion, projectVersion)).toBeNull();
    expect(buildForecastVersionDeltaSignals(null)).toEqual([]);
    expect(buildForecastVersionSnapshotSummary(undefined)).toBeNull();
  });

  it('does not perform fetch or network calls', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    buildForecastVersionSelectorItems([programVersion, projectVersion]);
    buildForecastVersionSummary(programVersion);
    buildForecastVersionComparisonViewModel(emptyComparison, programVersion, projectVersion);
    buildForecastVersionDeltaSignals(emptyComparison);
    buildForecastVersionSnapshotSummary(programVersion);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
