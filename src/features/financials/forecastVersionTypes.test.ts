import { describe, it, expect } from 'vitest';
import {
  ForecastVersionScope,
  ForecastVersionKind,
  ForecastVersionStatus,
  DeltaSeverity,
  allowedForecastVersionScopes,
  allowedForecastVersionKinds,
  allowedForecastVersionStatuses,
  allowedDeltaSeverities,
  ForecastVersion,
  ForecastVersionLine,
  ForecastVersionComparison,
  ForecastVersionDelta,
  ForecastVersionDeltaSummary,
} from './forecastVersionTypes';

describe('Forecast Version Domain Model', () => {
  it('allowed scopes include program and project', () => {
    expect(allowedForecastVersionScopes).toContain(ForecastVersionScope.Program);
    expect(allowedForecastVersionScopes).toContain(ForecastVersionScope.Project);
  });

  it('allowed kinds include baseline, current, prior, monthlySnapshot, scenario', () => {
    expect(allowedForecastVersionKinds).toEqual(
      expect.arrayContaining([
        ForecastVersionKind.Baseline,
        ForecastVersionKind.Current,
        ForecastVersionKind.Prior,
        ForecastVersionKind.MonthlySnapshot,
        ForecastVersionKind.Scenario,
      ])
    );
  });

  it('allowed statuses include draft, active, locked, archived', () => {
    expect(allowedForecastVersionStatuses).toEqual(
      expect.arrayContaining([
        ForecastVersionStatus.Draft,
        ForecastVersionStatus.Active,
        ForecastVersionStatus.Locked,
        ForecastVersionStatus.Archived,
      ])
    );
  });

  it('delta severities are constrained', () => {
    expect(allowedDeltaSeverities).toEqual(
      expect.arrayContaining([
        DeltaSeverity.Healthy,
        DeltaSeverity.Attention,
        DeltaSeverity.Risk,
        DeltaSeverity.Info,
      ])
    );
  });

  it('can create a valid program budget forecast version as a typed object', () => {
    const version: ForecastVersion = {
      id: 'fv-1',
      name: 'Program Budget Forecast — May',
      scope: ForecastVersionScope.Program,
      kind: ForecastVersionKind.MonthlySnapshot,
      status: ForecastVersionStatus.Active,
      programId: 'program-1',
      fiscalYear: 2026,
      versionMonth: '2026-05',
      createdAt: new Date().toISOString(),
    };
    expect(version.scope).toBe(ForecastVersionScope.Program);
    expect(version.programId).toBeDefined();
    expect(version.projectId).toBeUndefined();
  });

  it('can create a valid project forecast version as a typed object', () => {
    const version: ForecastVersion = {
      id: 'fv-2',
      name: 'Project Forecast — May',
      scope: ForecastVersionScope.Project,
      kind: ForecastVersionKind.MonthlySnapshot,
      status: ForecastVersionStatus.Active,
      programId: 'program-1',
      projectId: 'project-1',
      fiscalYear: 2026,
      versionMonth: '2026-05',
      createdAt: new Date().toISOString(),
    };
    expect(version.scope).toBe(ForecastVersionScope.Project);
    expect(version.projectId).toBeDefined();
  });

  it('monthly snapshot line can contain budget, forecast, actual, and variance amounts', () => {
    const line: ForecastVersionLine = {
      id: 'line-1',
      forecastVersionId: 'fv-1',
      budgetAmount: 1000,
      forecastAmount: 1100,
      actualAmount: 900,
      varianceAmount: 200,
    };
    expect(line.budgetAmount).toBe(1000);
    expect(line.forecastAmount).toBe(1100);
    expect(line.actualAmount).toBe(900);
    expect(line.varianceAmount).toBe(200);
  });

  it('comparison type can represent amount and percent deltas', () => {
    const delta: ForecastVersionDelta = {
      id: 'delta-1',
      amountDelta: 100,
      percentDelta: 0.1,
      severity: DeltaSeverity.Attention,
    };
    const summary: ForecastVersionDeltaSummary = {
      totalAmountDelta: 100,
      totalPercentDelta: 0.1,
      byProject: { 'project-1': 100 },
      byCar: {},
      byBudgetStream: {},
      byCostCategory: {},
      severityCounts: {
        [DeltaSeverity.Healthy]: 0,
        [DeltaSeverity.Attention]: 1,
        [DeltaSeverity.Risk]: 0,
        [DeltaSeverity.Info]: 0,
      },
    };
    const comparison: ForecastVersionComparison = {
      versionAId: 'fv-1',
      versionBId: 'fv-2',
      deltas: [delta],
      summary,
    };
    expect(comparison.deltas[0].amountDelta).toBe(100);
    expect(comparison.deltas[0].percentDelta).toBe(0.1);
    expect(comparison.summary.totalAmountDelta).toBe(100);
  });
});
