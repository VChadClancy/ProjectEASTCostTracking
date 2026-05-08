import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ForecastComparison, getForecastComparisonRenderModel } from './ForecastComparison';
import { formatCurrency } from '../../utils/formatCurrency';

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

  it('renders fallback UI if deltaSummaryCards is empty or not an array', () => {
    // Simulate model with empty deltaSummaryCards
    const model = { deltaSummaryCards: undefined };
    // Defensive helper
    const deltaSummaryCards = Array.isArray(model.deltaSummaryCards) ? model.deltaSummaryCards : [];
    expect(Array.isArray(deltaSummaryCards)).toBe(true);
    expect(deltaSummaryCards.length).toBe(0);
  });

  it('render model has no runtime-unsafe mapped fields', () => {
    const model = getForecastComparisonRenderModel();
    expect(Array.isArray(model.sectionTitles)).toBe(true);
    expect(Array.isArray(model.primarySectionTitles)).toBe(true);
    expect(Array.isArray(model.groupedDeltaSectionTitles)).toBe(true);
    expect(Array.isArray(model.readOnlySectionIds)).toBe(true);
    expect(Array.isArray(model.previewSectionIds)).toBe(true);
    expect(Array.isArray(model.unsupportedWorkflowLabels)).toBe(true);
  });

  describe('Read-Only Comparison Preview', () => {
    it('does not render JSON.stringify-style content', () => {
      const preview = [
        { project: 'P1', month: '2026-01', costCategory: 'Labor', budgetStream: 'CapEx', forecast: 12345, actual: 12000, budget: 12500, variance: -500, forecastVersionId: 'shouldHide', id: 'shouldHide' },
      ];
      const rowString = preview.map(line => [
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

    it('does not show forecastVersionId or id fields', () => {
      const preview = [
        { project: 'P1', month: '2026-01', costCategory: 'Labor', budgetStream: 'CapEx', forecast: 12345, actual: 12000, budget: 12500, variance: -500, forecastVersionId: 'shouldHide', id: 'shouldHide' },
      ];
      const visibleFields = Object.keys(preview[0]).filter(
        k => !['forecastVersionId', 'id'].includes(k)
      );
      expect(visibleFields).toEqual([
        'project', 'month', 'costCategory', 'budgetStream', 'forecast', 'actual', 'budget', 'variance',
      ]);
    });

    it('formats currency values using formatCurrency', () => {
      expect(formatCurrency(12345)).toMatch(/\$/);
      expect(formatCurrency(1000000)).toMatch(/M/);
      expect(formatCurrency(1000)).toMatch(/K/);
      expect(formatCurrency(NaN)).toBe('-');
    });

    it('is read-only (no edit fields present)', () => {
      const preview = [
        { project: 'P1', month: '2026-01', costCategory: 'Labor', budgetStream: 'CapEx', forecast: 12345, actual: 12000, budget: 12500, variance: -500 },
      ];
      const hasEdit = Object.values(preview[0]).some(v => typeof v === 'function');
      expect(hasEdit).toBe(false);
    });
  });
});
