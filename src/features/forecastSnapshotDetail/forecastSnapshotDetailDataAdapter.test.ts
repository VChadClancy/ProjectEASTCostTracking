import { describe, it, expect } from 'vitest';
import {
  toForecastSnapshotDetailViewModel,
  emptyForecastSnapshotDetailViewModel,
  SnapshotLineInput,
} from './forecastSnapshotDetailDataAdapter';
import { ForecastSnapshotSelectedLineDetailViewModelWithFormatted } from './forecastSnapshotDetailModel';

// 1. Adapter export exists
describe('Forecast Snapshot Detail Data Adapter', () => {
  it('exports the adapter', () => {
    expect(typeof toForecastSnapshotDetailViewModel).toBe('function');
  });

  // 2. Converts selected snapshot line to detail view model
  it('converts a valid snapshot line to detail view model', () => {
    const input: SnapshotLineInput = {
      selectedLineId: 'line-1',
      project: 'Project X',
      car: 'CAR-123',
      month: '2026-05',
      costCategory: 'Labor',
      budgetStream: 'Stream A',
      forecast: 1000,
      actual: 900,
      budget: 950,
      variance: 50,
      variancePercent: 5.26,
      versionName: 'v1',
      versionKind: 'baseline',
      versionStatus: 'approved',
      sourceLabel: 'Manual',
      sourceMetadata: 'User input',
      deltaAmount: 10,
      deltaPercent: 1,
      severity: 'low',
    };
    const vm = toForecastSnapshotDetailViewModel(input) as ForecastSnapshotSelectedLineDetailViewModelWithFormatted;
    expect(vm.project).toBe('Project X');
    expect(vm.car).toBe('CAR-123');
    expect(vm.forecast).toBe(1000);
    expect(vm.actual).toBe(900);
    expect(vm.budget).toBe(950);
    expect(vm.variance).toBe(50);
    expect(vm.variancePercent).toBe(5.26);
    expect(vm.versionName).toBe('v1');
    expect(vm.versionKind).toBe('baseline');
    expect(vm.versionStatus).toBe('approved');
    expect(vm.sourceLabel).toBe('Manual');
    expect(vm.sourceMetadata).toBe('User input');
    expect(vm.deltaAmount).toBe(10);
    expect(vm.deltaPercent).toBe(1);
    expect(vm.severity).toBe('low');
    expect(vm.isReadOnly).toBe(true);
    // 3. Financial values are finite and formatted
    expect(vm.formattedForecast).toMatch(/\d/);
    expect(vm.formattedActual).toMatch(/\d/);
    expect(vm.formattedBudget).toMatch(/\d/);
    expect(vm.formattedVariance).toMatch(/\d/);
    expect(vm.formattedVariancePercent).toMatch(/%/);
    expect(vm.formattedDeltaAmount).toMatch(/\d/);
    expect(vm.formattedDeltaPercent).toMatch(/%/);
  });

  // 4. Missing numeric values default safely
  it('handles missing or invalid numeric values safely', () => {
    const input: SnapshotLineInput = {
      project: 'P',
      forecast: undefined,
      actual: null,
      budget: NaN,
      variance: Infinity,
      variancePercent: undefined,
      deltaAmount: undefined,
      deltaPercent: undefined,
    };
    const vm = toForecastSnapshotDetailViewModel(input) as ForecastSnapshotSelectedLineDetailViewModelWithFormatted;
    expect(vm.forecast).toBe(0);
    expect(vm.actual).toBe(0);
    expect(vm.budget).toBe(0);
    expect(vm.variance).toBe(0);
    expect(vm.variancePercent).toBeUndefined();
    expect(vm.deltaAmount).toBeUndefined();
    expect(vm.deltaPercent).toBeUndefined();
    expect(vm.formattedForecast).toMatch(/\d/);
    expect(vm.formattedActual).toMatch(/\d/);
    expect(vm.formattedBudget).toMatch(/\d/);
    expect(vm.formattedVariance).toMatch(/\d/);
  });

  // 5. isReadOnly is true
  it('always sets isReadOnly to true', () => {
    const vm = toForecastSnapshotDetailViewModel({});
    expect(vm.isReadOnly).toBe(true);
  });

  // 6. No forecastVersionId is exposed
  it('does not expose forecastVersionId', () => {
    const input: any = { forecastVersionId: 'should-not-be-exposed' };
    const vm = toForecastSnapshotDetailViewModel(input);
    expect((vm as any).forecastVersionId).toBeUndefined();
  });

  // 7. No raw JSON-like strings are exposed
  it('does not expose raw JSON object strings', () => {
    const input: any = { project: '{"foo":1}' };
    const vm = toForecastSnapshotDetailViewModel(input);
    expect(vm.project).not.toMatch(/^\{.*\}$/);
  });

  // 8. Empty selection is handled safely
  it('returns empty view model for null/undefined input', () => {
    expect(toForecastSnapshotDetailViewModel(null)).toEqual(emptyForecastSnapshotDetailViewModel);
    expect(toForecastSnapshotDetailViewModel(undefined)).toEqual(emptyForecastSnapshotDetailViewModel);
  });

  // 9. Unsupported labels are not introduced
  it('does not introduce unsupported labels', () => {
    const vm = toForecastSnapshotDetailViewModel({});
    const forbidden = [
      'Edit Forecast',
      'Create Forecast Version',
      'Approve Forecast',
      'Run AI Explanation',
    ];
    const values = Object.values(vm).join(' ');
    forbidden.forEach(label => {
      expect(values).not.toContain(label);
    });
  });
});
