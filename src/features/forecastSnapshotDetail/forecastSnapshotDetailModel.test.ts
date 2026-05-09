import { describe, it, expect } from 'vitest';
import {
  forecastSnapshotDetailDrawerSections,
  getForecastSnapshotDetailSections,
  getPrimaryForecastSnapshotDetailSections,
  getPreviewForecastSnapshotDetailSections,
  ForecastSnapshotDetailDrawerSection,
  ForecastSnapshotSelectedLineDetailViewModel,
  getForecastSnapshotDetailRenderModel,
} from './forecastSnapshotDetailModel';

// Helper to get all section ids
function getSectionIds(sections: ForecastSnapshotDetailDrawerSection[]) {
  return sections.map((s) => s.id);
}

describe('Forecast Snapshot Detail Drawer Model', () => {
  it('should include all required drawer sections', () => {
    const ids = getSectionIds(forecastSnapshotDetailDrawerSections);
    expect(ids).toEqual(
      expect.arrayContaining([
        'drawerHeader',
        'selectedLineSummary',
        'financialValues',
        'monthlyContext',
        'classificationDetails',
        'versionSourceMetadata',
        'deltaContext',
        'closeAction',
      ])
    );
  });

  it('should have unique section ids', () => {
    const ids = getSectionIds(forecastSnapshotDetailDrawerSections);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('drawer header and selected line summary should be active', () => {
    const header = forecastSnapshotDetailDrawerSections.find((s) => s.id === 'drawerHeader');
    const summary = forecastSnapshotDetailDrawerSections.find((s) => s.id === 'selectedLineSummary');
    expect(header?.status).toBe('active');
    expect(summary?.status).toBe('active');
  });

  it('financial values section should be active', () => {
    const section = forecastSnapshotDetailDrawerSections.find((s) => s.id === 'financialValues');
    expect(section?.status).toBe('active');
  });

  it('metadata and delta sections should be active or preview', () => {
    const meta = forecastSnapshotDetailDrawerSections.find((s) => s.id === 'versionSourceMetadata');
    const delta = forecastSnapshotDetailDrawerSections.find((s) => s.id === 'deltaContext');
    expect(['active', 'preview']).toContain(meta?.status);
    expect(['active', 'preview']).toContain(delta?.status);
  });

  it('view model type supports read-only selected line detail', () => {
    const detail: ForecastSnapshotSelectedLineDetailViewModel = {
      selectedLineId: 'abc123',
      project: 'Project X',
      car: 'CAR-001',
      month: '2026-05',
      costCategory: 'Labor',
      budgetStream: 'Opex',
      forecast: 1000,
      actual: 900,
      budget: 950,
      variance: 50,
      variancePercent: 5.3,
      versionName: 'May 2026',
      versionKind: 'Snapshot',
      versionStatus: 'Active',
      sourceLabel: 'Manual',
      sourceMetadata: 'Imported',
      deltaAmount: 10,
      deltaPercent: 1.1,
      severity: 'low',
      isReadOnly: true,
    };
    expect(detail.isReadOnly).toBe(true);
  });

  it('render model does not include unsupported labels', () => {
    const detail: ForecastSnapshotSelectedLineDetailViewModel = {
      selectedLineId: 'abc123',
      project: 'Project X',
      car: 'CAR-001',
      month: '2026-05',
      costCategory: 'Labor',
      budgetStream: 'Opex',
      forecast: 1000,
      actual: 900,
      budget: 950,
      variance: 50,
      versionName: 'May 2026',
      versionKind: 'Snapshot',
      versionStatus: 'Active',
      isReadOnly: true,
    };
    const renderModel = getForecastSnapshotDetailRenderModel(detail);
    const forbidden = [
      'Edit Forecast',
      'Create Forecast Version',
      'Approve Forecast',
      'Run AI Explanation',
    ];
    const sectionTitles = renderModel.sections.map((s) => s.title);
    forbidden.forEach((label) => {
      expect(sectionTitles).not.toContain(label);
    });
  });

  it('forecastVersionId is not exposed in display fields by default', () => {
    const detail: ForecastSnapshotSelectedLineDetailViewModel = {
      selectedLineId: 'abc123',
      project: 'Project X',
      car: 'CAR-001',
      month: '2026-05',
      costCategory: 'Labor',
      budgetStream: 'Opex',
      forecast: 1000,
      actual: 900,
      budget: 950,
      variance: 50,
      versionName: 'May 2026',
      versionKind: 'Snapshot',
      versionStatus: 'Active',
      isReadOnly: true,
    };
    const renderModel = getForecastSnapshotDetailRenderModel(detail);
    // Should not have forecastVersionId in selectedLineDetail
    expect('forecastVersionId' in renderModel.selectedLineDetail).toBe(false);
  });

  it('getForecastSnapshotDetailSections returns all sections', () => {
    const sections = getForecastSnapshotDetailSections();
    expect(sections.length).toBe(forecastSnapshotDetailDrawerSections.length);
  });

  it('getPrimaryForecastSnapshotDetailSections returns only active sections', () => {
    const sections = getPrimaryForecastSnapshotDetailSections();
    expect(sections.every((s) => s.status === 'active')).toBe(true);
  });

  it('getPreviewForecastSnapshotDetailSections returns only preview sections', () => {
    const sections = getPreviewForecastSnapshotDetailSections();
    expect(sections.every((s) => s.status === 'preview')).toBe(true);
  });
});
