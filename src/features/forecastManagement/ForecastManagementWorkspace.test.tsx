import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { ForecastManagementWorkspace, getForecastManagementWorkspaceRenderModel } from './ForecastManagementWorkspace';


describe('ForecastManagementWorkspace', () => {
  it('exports the component', () => {
    expect(ForecastManagementWorkspace).toBeTypeOf('function');
  });

  it('can be created as a React element', () => {
    const el = React.createElement(ForecastManagementWorkspace);
    expect(el).toBeDefined();
    expect(el.type).toBe(ForecastManagementWorkspace);
  });

  it('renders section titles from the page model', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    expect(Array.isArray(model.sectionTitles)).toBe(true);
    expect(model.sectionTitles.length).toBeGreaterThan(0);
    // Should include all primary section titles
    for (const title of model.sectionTitles) {
      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
    }
  });

  it('includes Version Selector section', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    expect(model.sectionTitles).toContain('Version Selector');
  });

  it('marks Snapshot Lines Preview as read-only/preview', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    expect(model.readOnlySectionIds).toContain('snapshotLinesPreview');
    expect(model.previewSectionTitles).toContain('Snapshot Lines Preview');
  });

  it('does not introduce unsupported workflow labels', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    // These labels should not appear in any section title
    for (const forbidden of model.unsupportedWorkflowLabels) {
      for (const title of model.sectionTitles) {
        expect(title).not.toContain(forbidden);
      }
    }
  });
});
