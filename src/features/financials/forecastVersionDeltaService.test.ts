import { describe, it, expect } from 'vitest';
import {
  calculatePercentDelta,
  classifyDeltaSeverity,
  compareForecastVersions,
  calculateForecastVersionDeltaSummary,
  groupForecastDeltasByProject,
  groupForecastDeltasByCar,
  groupForecastDeltasByBudgetStream,
  groupForecastDeltasByCostCategory,
} from './forecastVersionDeltaService';
import { DeltaSeverity, ForecastVersionLine } from './forecastVersionTypes';

describe('Forecast Version Delta Calculation Service', () => {
  const baseLines: ForecastVersionLine[] = [
    {
      id: '1',
      forecastVersionId: 'A',
      projectId: 'P1',
      carId: 'CAR1',
      budgetStream: 'BS1',
      costCategory: 'CC1',
      month: '2026-05',
      budgetAmount: 1000,
      forecastAmount: 1200,
      actualAmount: 1100,
      varianceAmount: 100,
    },
    {
      id: '2',
      forecastVersionId: 'A',
      projectId: 'P2',
      carId: 'CAR2',
      budgetStream: 'BS2',
      costCategory: 'CC2',
      month: '2026-05',
      budgetAmount: 2000,
      forecastAmount: 2000,
      actualAmount: 2000,
      varianceAmount: 0,
    },
  ];
  const comparisonLines: ForecastVersionLine[] = [
    {
      id: '1',
      forecastVersionId: 'B',
      projectId: 'P1',
      carId: 'CAR1',
      budgetStream: 'BS1',
      costCategory: 'CC1',
      month: '2026-05',
      budgetAmount: 1000,
      forecastAmount: 1300,
      actualAmount: 1200,
      varianceAmount: 100,
    },
    {
      id: '3',
      forecastVersionId: 'B',
      projectId: 'P3',
      carId: 'CAR3',
      budgetStream: 'BS3',
      costCategory: 'CC3',
      month: '2026-05',
      budgetAmount: 500,
      forecastAmount: 500,
      actualAmount: 500,
      varianceAmount: 0,
    },
  ];

  it('calculates amount delta correctly', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    const d = deltas.find(d => d.projectId === 'P1');
    expect(d?.amountDelta).toBe(100);
  });

  it('calculates percent delta correctly', () => {
    expect(calculatePercentDelta(100, 110)).toBeCloseTo(0.1);
    expect(calculatePercentDelta(0, 100)).toBe(1);
    expect(calculatePercentDelta(100, 0)).toBeCloseTo(-1);
    expect(calculatePercentDelta(0, 0)).toBe(0);
  });

  it('handles zero base amount safely', () => {
    expect(calculatePercentDelta(0, 0)).toBe(0);
    expect(calculatePercentDelta(0, 100)).toBe(1);
  });

  it('handles missing snapshot line in base as positive/new delta', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    const d = deltas.find(d => d.projectId === 'P3');
    expect(d).toBeDefined();
    expect(d?.amountDelta).toBe(500);
  });

  it('handles missing comparison line as negative/removed delta', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    const d = deltas.find(d => d.projectId === 'P2');
    expect(d).toBeDefined();
    expect(d?.amountDelta).toBe(-2000);
  });

  it('groups deltas by project', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    const grouped = groupForecastDeltasByProject(deltas);
    expect(grouped['P1'].length).toBe(1);
    expect(grouped['P2'].length).toBe(1);
    expect(grouped['P3'].length).toBe(1);
  });

  it('groups deltas by CAR', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    const grouped = groupForecastDeltasByCar(deltas);
    expect(grouped['CAR1'].length).toBe(1);
    expect(grouped['CAR2'].length).toBe(1);
    expect(grouped['CAR3'].length).toBe(1);
  });

  it('groups deltas by budget stream', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    const grouped = groupForecastDeltasByBudgetStream(deltas);
    expect(grouped['BS1'].length).toBe(1);
    expect(grouped['BS2'].length).toBe(1);
    expect(grouped['BS3'].length).toBe(1);
  });

  it('groups deltas by cost category', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    const grouped = groupForecastDeltasByCostCategory(deltas);
    expect(grouped['CC1'].length).toBe(1);
    expect(grouped['CC2'].length).toBe(1);
    expect(grouped['CC3'].length).toBe(1);
  });

  it('cumulative movement is finite', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    for (const d of deltas) {
      expect(Number.isFinite(d.cumulativeMovement)).toBe(true);
    }
  });

  it('severity values are constrained', () => {
    const { deltas } = compareForecastVersions(baseLines, comparisonLines);
    for (const d of deltas) {
      expect(Object.values(DeltaSeverity)).toContain(d.severity);
    }
  });

  it('compareForecastVersions returns a valid comparison object', () => {
    const result = compareForecastVersions(baseLines, comparisonLines);
    expect(result.deltas.length).toBeGreaterThan(0);
    expect(result.summary).toBeDefined();
    expect(typeof result.summary.totalAmountDelta).toBe('number');
  });

  it('functions are deterministic for same inputs', () => {
    const r1 = compareForecastVersions(baseLines, comparisonLines);
    const r2 = compareForecastVersions(baseLines, comparisonLines);
    expect(r1).toEqual(r2);
  });
});
