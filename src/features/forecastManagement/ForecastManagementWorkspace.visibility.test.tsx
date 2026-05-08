import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { getForecastManagementWorkspaceRenderModel } from './ForecastManagementWorkspace';

describe('ForecastManagementWorkspace visibility', () => {
  it('has all required visible sections in the render model', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    // Required section titles
    const requiredSections = [
      'Version Selector',
      'Forecast Summary Cards',
      'Snapshot Summary',
    ];
    // Optionally present sections
    const optionalSections = [
      'Forecast Comparison',
      'Delta Analysis',
      'Comparison Overview',
      'Delta Signals Preview',
    ];
    // Check required sections are present
    for (const title of requiredSections) {
      expect(model.sectionTitles).toContain(title);
    }
    // At least one comparison/delta section should be present
    const hasComparison = optionalSections.some(title => model.sectionTitles.includes(title));
    expect(hasComparison).toBe(true);
    // No hidden style tokens in section titles
    for (const title of model.sectionTitles) {
      expect(title).not.toMatch(/display: ?none|visibility: ?hidden|opacity: ?0|height: ?0/i);
    }
    // No forbidden workflow labels
    expect(model.unsupportedWorkflowLabels).toEqual([]);
  });
});
