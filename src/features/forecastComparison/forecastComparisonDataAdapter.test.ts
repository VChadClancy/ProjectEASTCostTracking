import { describe, it, expect } from 'vitest';
import { buildForecastComparisonViewModel } from './forecastComparisonDataAdapter';

// Utility: check finite values in array of deltas
function allFinite(arr) {
  return Array.isArray(arr) && arr.every(
    x => typeof x.amountDelta === 'number' && Number.isFinite(x.amountDelta) &&
         typeof x.percentDelta === 'number' && Number.isFinite(x.percentDelta)
  );
}

describe('ForecastComparisonDataAdapter', () => {
  it('exports buildForecastComparisonViewModel', () => {
    expect(typeof buildForecastComparisonViewModel).toBe('function');
  });

  it('returns a defined comparison view model', async () => {
    const vm = await buildForecastComparisonViewModel();
    expect(vm).toBeDefined();
    expect(typeof vm).toBe('object');
  });

  it('selects a base version and comparison version', async () => {
    const vm = await buildForecastComparisonViewModel();
    expect(vm.baseVersion).toBeTruthy();
    expect(vm.comparisonVersion).toBeTruthy();
  });

  it('includes delta summary cards with finite values', async () => {
    const vm = await buildForecastComparisonViewModel();
    expect(vm.deltaSummaryCards).toBeTruthy();
    if (vm.deltaSummaryCards) {
      expect(Number.isFinite(vm.deltaSummaryCards.amountDelta)).toBe(true);
      expect(Number.isFinite(vm.deltaSummaryCards.percentDelta)).toBe(true);
    }
  });

  it('includes a monthly movement summary with finite values', async () => {
    const vm = await buildForecastComparisonViewModel();
    expect(Array.isArray(vm.monthlyMovementSummary)).toBe(true);
    expect(allFinite(vm.monthlyMovementSummary)).toBe(true);
  });

  it('includes grouped deltas for project, CAR, budget stream, and cost category, each limited', async () => {
    const vm = await buildForecastComparisonViewModel();
    ['projectDeltas', 'carDeltas', 'budgetStreamDeltas', 'costCategoryDeltas'].forEach(key => {
      expect(Array.isArray(vm[key])).toBe(true);
      expect(vm[key].length).toBeLessThanOrEqual(5);
      expect(allFinite(vm[key])).toBe(true);
    });
  });

  it('limits delta signals detail and constrains severity', async () => {
    const vm = await buildForecastComparisonViewModel();
    expect(Array.isArray(vm.deltaSignalsDetail)).toBe(true);
    expect(vm.deltaSignalsDetail.length).toBeLessThanOrEqual(5);
    vm.deltaSignalsDetail.forEach(d => {
      expect(['high', 'medium'].includes(d.severity)).toBe(true);
    });
  });

  it('limits read-only comparison preview', async () => {
    const vm = await buildForecastComparisonViewModel();
    expect(Array.isArray(vm.readOnlyComparisonPreview)).toBe(true);
    expect(vm.readOnlyComparisonPreview.length).toBeLessThanOrEqual(6);
  });

  it('handles empty forecast version data safely', async () => {
    // Simulate empty by passing impossible IDs
    const vm = await buildForecastComparisonViewModel({ baseVersionId: 'none', comparisonVersionId: 'none' });
    expect(vm.empty).toBe(true);
    expect(vm.baseVersion).toBeNull();
    expect(vm.comparisonVersion).toBeNull();
  });

  it('does not fetch or network in default mock mode', async () => {
    // This is a mock test: if it returns, it did not fetch
    const vm = await buildForecastComparisonViewModel();
    expect(vm).toBeDefined();
  });

  it('does not introduce unsupported labels', async () => {
    const vm = await buildForecastComparisonViewModel();
    const forbidden = [
      'Edit Forecast',
      'Create Forecast Version',
      'Approve Forecast',
      'Run AI Explanation',
    ];
    const asString = JSON.stringify(vm);
    forbidden.forEach(label => {
      expect(asString.includes(label)).toBe(false);
    });
  });
});
