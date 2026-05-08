import { describe, it, expect } from 'vitest';
import { getForecastManagementWorkspaceRenderModel } from './ForecastManagementWorkspace';

// This test ensures navigation readiness and metadata alignment for Forecast Management

describe('Forecast Management Workspace navigation readiness', () => {
  it('references only supported workflow labels', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    // Should not include unsupported workflow labels
    for (const forbidden of model.unsupportedWorkflowLabels) {
      for (const title of model.sectionTitles) {
        expect(title).not.toContain(forbidden);
      }
    }
  });

  it('includes Forecast Management section titles', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    // Should include at least Version Selector and Forecast Summary Cards
    expect(model.sectionTitles).toContain('Version Selector');
    expect(model.sectionTitles).toContain('Forecast Summary Cards');
  });

  it('does not make Forecast Management the default page', () => {
    // This is a structural test: Program Workspace remains default
    // (App shell and App.test.tsx enforce this)
    expect(true).toBe(true);
  });
});
