import { describe, it, expect } from 'vitest';
import {
  getForecastManagementWorkspaceSections,
  getPrimaryForecastManagementWorkspaceSections,
  getPreviewForecastManagementWorkspaceSections,
  getFutureForecastManagementWorkspaceSections,
  ForecastManagementWorkspaceSection,
} from './forecastManagementWorkspaceModel';

const forbiddenLabels = [
  'Edit Forecast',
  'Approve Forecast',
  'Create Forecast Version',
  'Run AI Explanation',
];

describe('ForecastManagementWorkspaceModel', () => {
  it('includes all required sections', () => {
    const sections = getForecastManagementWorkspaceSections();
    const ids = sections.map((s) => s.id);
    expect(ids).toContain('versionSelector');
    expect(ids).toContain('forecastSummaryCards');
    expect(ids).toContain('currentVersionMetadata');
    expect(ids).toContain('snapshotSummary');
    expect(ids).toContain('snapshotLinesPreview');
    expect(ids).toContain('recentVersions');
    expect(ids).toContain('comparisonOverview');
    expect(ids).toContain('deltaSignalsPreview');
  });

  it('primary visible section count is within MED guardrail range (3–6)', () => {
    const primary = getPrimaryForecastManagementWorkspaceSections();
    expect(primary.length).toBeGreaterThanOrEqual(3);
    expect(primary.length).toBeLessThanOrEqual(6);
  });

  it('section ids are unique', () => {
    const sections = getForecastManagementWorkspaceSections();
    const ids = sections.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('version selector is active', () => {
    const sections = getForecastManagementWorkspaceSections();
    const versionSelector = sections.find((s) => s.id === 'versionSelector');
    expect(versionSelector?.status).toBe('active');
  });

  it('snapshot lines preview is read-only/preview', () => {
    const sections = getForecastManagementWorkspaceSections();
    const snapshotLines = sections.find((s) => s.id === 'snapshotLinesPreview');
    expect(snapshotLines?.status === 'preview' || snapshotLines?.status === 'active').toBe(true);
  });

  it('comparison overview is preview/active but not full workflow', () => {
    const sections = getForecastManagementWorkspaceSections();
    const comparison = sections.find((s) => s.id === 'comparisonOverview');
    expect(comparison).toBeDefined();
    expect(comparison?.status === 'preview' || comparison?.status === 'active').toBe(true);
  });

  it('does not introduce unsupported labels', () => {
    const sections = getForecastManagementWorkspaceSections();
    for (const section of sections) {
      for (const label of forbiddenLabels) {
        expect(section.title).not.toContain(label);
        expect(section.description).not.toContain(label);
      }
    }
  });
});
