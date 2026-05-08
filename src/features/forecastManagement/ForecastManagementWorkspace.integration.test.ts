import { describe, it, expect } from 'vitest';
import { getForecastManagementWorkspaceRenderModel } from './ForecastManagementWorkspace';
import { getForecastComparisonRenderModel } from '../forecastComparison/ForecastComparison';

// Test: Forecast Management render model includes Forecast Comparison section

describe('ForecastManagementWorkspace + ForecastComparison integration', () => {
  it('includes Forecast Comparison/Delta Analysis section', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    expect(model.sectionTitles).toContain('Comparison Overview');
  });

  it('ForecastComparison remains read-only/preview', () => {
    const comparisonModel = getForecastComparisonRenderModel();
    // Should only have read-only/preview sections
    expect(comparisonModel.readOnlySectionIds).toContain('Read-Only Comparison Preview');
    expect(comparisonModel.previewSectionIds).toContain('Read-Only Comparison Preview');
  });

  it('does not introduce unsupported workflow labels', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    const forbidden = [
      'Edit Forecast',
      'Create Forecast Version',
      'Approve Forecast',
      'Run AI Explanation',
    ];
    for (const label of forbidden) {
      expect(JSON.stringify(model)).not.toContain(label);
    }
  });
});
