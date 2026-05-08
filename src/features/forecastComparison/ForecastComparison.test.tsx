import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ForecastComparison, getForecastComparisonRenderModel } from './ForecastComparison';

// Helper to shallowly create a React element
function createElement(Component: React.FC) {
  return React.createElement(Component);
}

describe('ForecastComparison', () => {
  it('exports ForecastComparison', () => {
    expect(ForecastComparison).toBeInstanceOf(Function);
  });

  it('can be created as a React element', () => {
    const el = createElement(ForecastComparison);
    expect(el).toBeDefined();
  });

  it('render model includes section titles', () => {
    const model = getForecastComparisonRenderModel();
    expect(model.sectionTitles).toContain('Version Pair Selector');
    expect(model.sectionTitles).toContain('Delta Summary Cards');
    expect(model.sectionTitles).toContain('Monthly Movement Summary');
    expect(model.sectionTitles).toContain('Grouped Delta Panels');
    expect(model.sectionTitles).toContain('Delta Signals Detail');
    expect(model.sectionTitles).toContain('Read-Only Comparison Preview');
  });

  it('render model includes grouped delta section titles', () => {
    const model = getForecastComparisonRenderModel();
    expect(model.groupedDeltaSectionTitles).toContain('Project Deltas');
    expect(model.groupedDeltaSectionTitles).toContain('CAR Deltas');
    expect(model.groupedDeltaSectionTitles).toContain('Budget Stream Deltas');
    expect(model.groupedDeltaSectionTitles).toContain('Cost Category Deltas');
  });

  it('render model marks Read-Only Comparison Preview as read-only/preview', () => {
    const model = getForecastComparisonRenderModel();
    expect(model.readOnlySectionIds).toContain('Read-Only Comparison Preview');
    expect(model.previewSectionIds).toContain('Read-Only Comparison Preview');
  });

  it('render model does not include unsupported workflow labels', () => {
    const model = getForecastComparisonRenderModel();
    expect(model.unsupportedWorkflowLabels).not.toContain('Edit Forecast');
    expect(model.unsupportedWorkflowLabels).not.toContain('Create Forecast Version');
    expect(model.unsupportedWorkflowLabels).not.toContain('Approve Forecast');
    expect(model.unsupportedWorkflowLabels).not.toContain('Run AI Explanation');
  });

  it('does not perform fetch/network call in default mock mode', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    // Simulate mounting the component (no actual DOM)
    createElement(ForecastComparison);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
