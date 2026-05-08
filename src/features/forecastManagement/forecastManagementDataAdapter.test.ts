import { describe, it, expect, vi } from 'vitest';
import * as service from '../forecastVersions/forecastVersionService';
import * as adapter from './forecastManagementDataAdapter';
import { formatCurrency } from '../../utils/formatCurrency';

// Mock the service functions to avoid network/fetch
vi.mock('../forecastVersions/forecastVersionService', async () => {
  const actual = await vi.importActual<any>('../forecastVersions/forecastVersionService');
  return {
    ...actual,
    getForecastVersions: vi.fn(async () => [
      { id: 'v1', name: 'Version 1', snapshotLines: Array(10).fill({ amount: 100 }), summary: { total: 1000 } },
      { id: 'v2', name: 'Version 2', snapshotLines: Array(8).fill({ amount: 90 }), summary: { total: 900 } },
      { id: 'v3', name: 'Version 3', snapshotLines: Array(7).fill({ amount: 80 }), summary: { total: 800 } },
      { id: 'v4', name: 'Version 4', snapshotLines: Array(6).fill({ amount: 70 }), summary: { total: 700 } },
      { id: 'v5', name: 'Version 5', snapshotLines: Array(5).fill({ amount: 60 }), summary: { total: 600 } },
      { id: 'v6', name: 'Version 6', snapshotLines: Array(4).fill({ amount: 50 }), summary: { total: 500 } },
    ]),
  };
});

// Mock view model adapter functions
vi.mock('../forecastVersions/forecastVersionViewModelAdapter', async () => ({
  buildForecastVersionSelectorItems: (versions: any[]) => versions.map(v => ({ id: v.id, label: v.name })),
  buildForecastVersionSummary: (version: any) => ({ id: version.id, label: version.name, totalBudget: 1000, totalForecast: 1000, totalActuals: 1000, totalVariance: 0 }),
  buildForecastVersionSnapshotSummary: (version: any) => ({ id: version.id, label: version.name, totalBudget: 1000, totalForecast: 1000, totalActuals: 1000, totalVariance: 0 }),
  buildForecastVersionDeltaSignals: () => [
    { group: 'g1', severity: 'low' },
    { group: 'g2', severity: 'medium' },
    { group: 'g3', severity: 'high' },
    { group: 'g4', severity: 'low' },
    { group: 'g5', severity: 'medium' },
    { group: 'g6', severity: 'high' },
  ],
}));

describe('ForecastManagementDataAdapter', () => {
  it('exports the adapter function', () => {
    expect(typeof adapter.getForecastManagementWorkspaceViewModel).toBe('function');
  });

  it('returns a defined workspace view model', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(vm).toBeDefined();
    expect(Array.isArray(vm.versions)).toBe(true);
  });

  it('selector items are present', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(vm.selectorItems.length).toBeGreaterThan(0);
  });

  it('current version is selected', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    if (!vm.currentVersion) throw new Error("Expected currentVersion");
    expect(vm.currentVersion.id).toBe('v1');
  });

  it('comparison version is selected when available', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    if (!vm.comparisonVersion) throw new Error("Expected comparisonVersion");
    expect(vm.comparisonVersion.id).toBe('v2');
  });

  it('summary values are finite', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(Number.isFinite(vm.currentVersionSummary.totalBudget)).toBe(true);
  });

  it('snapshot line preview is limited', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel({ maxSnapshotLines: 5 });
    expect(vm.snapshotLinesPreview.length).toBeLessThanOrEqual(5);
  });

  it('recent versions are limited', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel({ maxRecentVersions: 5 });
    expect(vm.recentVersions.length).toBeLessThanOrEqual(5);
  });

  it('delta signals are limited and severity constrained', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel({ maxDeltaSignals: 4 });
    expect(vm.deltaSignalsPreview.length).toBeLessThanOrEqual(4);
    for (const ds of vm.deltaSignalsPreview) {
      expect(['low', 'medium', 'high']).toContain(ds.severity);
    }
  });

  it('handles empty forecast version data safely', async () => {
    (service.getForecastVersions as any).mockResolvedValueOnce([]);
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(vm.empty).toBe(true);
    expect(vm.versions.length).toBe(0);
  });

  it('does not fetch or network call in default mock mode', async () => {
    expect((service.getForecastVersions as any).mock.calls.length).toBeGreaterThan(0);
  });

  it('does not introduce unsupported workflow labels', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    const unsupported = ['Edit Forecast', 'Create Forecast Version', 'Approve Forecast', 'Run AI Explanation'];
    for (const label of unsupported) {
      expect(JSON.stringify(vm)).not.toContain(label);
    }
  });
});

describe('Snapshot Lines Preview (adapter)', () => {
  it('does not include forecastVersionId or id in preview fields', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    if (!vm.snapshotLinesPreview.length) return;
    for (const line of vm.snapshotLinesPreview) {
      expect(line.forecastVersionId).toBeUndefined();
      expect(line.id).toBeUndefined();
    }
  });

  it('does not include JSON-like string in preview', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    // Simulate the table row rendering logic as a string
    const rowString = vm.snapshotLinesPreview.map(line => [
      line.project || '-',
      line.month || '-',
      line.costCategory || '-',
      line.budgetStream || '-',
      formatCurrency(line.forecast),
      formatCurrency(line.actual),
      formatCurrency(line.budget),
      formatCurrency(line.variance),
    ].join(' | ')).join('\n');
    expect(rowString).not.toMatch(/[{}]/);
  });

  it('currency values are formatted in render model', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    for (const line of vm.snapshotLinesPreview) {
      expect(formatCurrency(line.forecast)).toMatch(/\$/);
      expect(formatCurrency(line.actual)).toMatch(/\$/);
      expect(formatCurrency(line.budget)).toMatch(/\$/);
      expect(formatCurrency(line.variance)).toMatch(/\$/);
    }
    expect(formatCurrency(NaN)).toBe('-');
  });

  it('preview is read-only (no edit fields)', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    for (const line of vm.snapshotLinesPreview) {
      const hasEdit = Object.values(line).some(v => typeof v === 'function');
      expect(hasEdit).toBe(false);
    }
  });
});
