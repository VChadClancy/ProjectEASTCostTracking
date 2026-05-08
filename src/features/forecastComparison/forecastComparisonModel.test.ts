import { describe, it, expect } from 'vitest';
import {
  forecastComparisonSections,
  getForecastComparisonSections,
  getPrimaryForecastComparisonSections,
  getPreviewForecastComparisonSections,
  getFutureForecastComparisonSections,
} from './forecastComparisonModel';

const forbiddenLabels = [
  'Edit Forecast',
  'Create Forecast Version',
  'Approve Forecast',
  'Run AI Explanation',
];

describe('ForecastComparisonModel', () => {
  it('includes all required sections', () => {
    const ids = forecastComparisonSections.map((s) => s.id);
    expect(ids).toContain('comparisonHeader');
    expect(ids).toContain('versionPairSelector');
    expect(ids).toContain('deltaSummaryCards');
    expect(ids).toContain('monthlyMovementSummary');
    expect(ids).toContain('groupedDeltaPanels');
    expect(ids).toContain('projectDeltas');
    expect(ids).toContain('carDeltas');
    expect(ids).toContain('budgetStreamDeltas');
    expect(ids).toContain('costCategoryDeltas');
    expect(ids).toContain('deltaSignalsDetail');
    expect(ids).toContain('readOnlyComparisonPreview');
  });

  it('primary visible section count is within MED guardrail range (3–6)', () => {
    const primary = getPrimaryForecastComparisonSections();
    expect(primary.length).toBeGreaterThanOrEqual(3);
    expect(primary.length).toBeLessThanOrEqual(6);
  });

  it('section ids are unique', () => {
    const ids = forecastComparisonSections.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('version pair selector exists', () => {
    const found = forecastComparisonSections.find((s) => s.id === 'versionPairSelector');
    expect(found).toBeDefined();
  });

  it('delta summary cards are active', () => {
    const found = forecastComparisonSections.find((s) => s.id === 'deltaSummaryCards');
    expect(found?.status).toBe('active');
  });

  it('read-only comparison preview is preview/read-only', () => {
    const found = forecastComparisonSections.find((s) => s.id === 'readOnlyComparisonPreview');
    expect(found?.status).toBe('preview');
  });

  it('grouped delta sections exist for project, CAR, budget stream, and cost category', () => {
    expect(forecastComparisonSections.find((s) => s.id === 'projectDeltas')).toBeDefined();
    expect(forecastComparisonSections.find((s) => s.id === 'carDeltas')).toBeDefined();
    expect(forecastComparisonSections.find((s) => s.id === 'budgetStreamDeltas')).toBeDefined();
    expect(forecastComparisonSections.find((s) => s.id === 'costCategoryDeltas')).toBeDefined();
  });

  it('does not introduce unsupported labels', () => {
    for (const section of forecastComparisonSections) {
      for (const forbidden of forbiddenLabels) {
        expect(section.title).not.toContain(forbidden);
        expect(section.description).not.toContain(forbidden);
      }
    }
  });
});
