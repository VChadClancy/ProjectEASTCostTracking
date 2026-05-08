import { describe, it, expect, vi } from 'vitest';
import * as adapter from './forecastManagementDataAdapter';

// This test checks the render model for ForecastManagementWorkspace using the data adapter

describe('ForecastManagementWorkspace Render Model', () => {
  it('includes adapter-backed selector items', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(Array.isArray(vm.selectorItems)).toBe(true);
    expect(vm.selectorItems.length).toBeGreaterThan(0);
  });

  it('represents current version metadata', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(vm.currentVersion).toBeDefined();
    expect(typeof vm.currentVersion?.id).toBe('string');
    expect(vm.currentVersion?.id.length).toBeGreaterThan(0);
  });

  it('represents comparison version metadata when available', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(vm.comparisonVersion).toBeDefined();
    expect(typeof vm.comparisonVersion?.id).toBe('string');
    expect(vm.comparisonVersion?.id.length).toBeGreaterThan(0);
  });

  it('includes summary card data', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    expect(vm.currentVersionSummary).toBeDefined();
    expect(Number.isFinite(vm.currentVersionSummary.totalBudget)).toBe(true);
  });

  it('limits snapshot lines preview and keeps it read-only', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel({ maxSnapshotLines: 3 });
    expect(Array.isArray(vm.snapshotLinesPreview)).toBe(true);
    expect(vm.snapshotLinesPreview.length).toBeLessThanOrEqual(3);
  });

  it('limits recent versions', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel({ maxRecentVersions: 2 });
    expect(Array.isArray(vm.recentVersions)).toBe(true);
    expect(vm.recentVersions.length).toBeLessThanOrEqual(2);
  });

  it('limits delta signals preview and constrains severity', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel({ maxDeltaSignals: 2 });
    expect(Array.isArray(vm.deltaSignalsPreview)).toBe(true);
    expect(vm.deltaSignalsPreview.length).toBeLessThanOrEqual(2);
    for (const ds of vm.deltaSignalsPreview) {
      expect(['low', 'medium', 'high']).toContain(ds.severity);
    }
  });

  it('does not introduce unsupported workflow labels', async () => {
    const vm = await adapter.getForecastManagementWorkspaceViewModel();
    const unsupported = ['Edit Forecast', 'Create Forecast Version', 'Approve Forecast', 'Run AI Explanation'];
    for (const label of unsupported) {
      expect(JSON.stringify(vm)).not.toContain(label);
    }
  });

  it('handles empty forecast version data safely', async () => {
    // Use the pure helper for empty input
    const vm = adapter.buildForecastManagementWorkspaceViewModelFromVersions([]);
    expect(vm.empty).toBe(true);
    expect(vm.versions.length).toBe(0);
  });

  it('does not fetch or network call in default mock mode', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await adapter.getForecastManagementWorkspaceViewModel();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
