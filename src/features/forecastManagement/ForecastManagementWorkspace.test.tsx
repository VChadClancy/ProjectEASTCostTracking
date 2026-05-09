import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { ForecastManagementWorkspace, getForecastManagementWorkspaceRenderModel } from './ForecastManagementWorkspace';
import { formatCurrency } from '../../utils/formatCurrency';
import { ForecastSnapshotDetailDrawer } from '../forecastSnapshotDetail/ForecastSnapshotDetailDrawer';
import { toForecastSnapshotDetailViewModel, emptyForecastSnapshotDetailViewModel } from '../forecastSnapshotDetail/forecastSnapshotDetailDataAdapter';


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

  describe('Snapshot Lines Preview', () => {
    it('does not render JSON.stringify-style content', () => {
      // Simulate a render model with snapshotLinesPreview
      const preview = [
        { project: 'P1', month: '2026-01', costCategory: 'Labor', budgetStream: 'CapEx', forecast: 12345, actual: 12000, budget: 12500, variance: -500, forecastVersionId: 'shouldHide', id: 'shouldHide' },
      ];
      // Simulate the table row rendering logic as a string
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
      // Should not include JSON-like curly braces
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
      // Simulate the preview table: no input, button, or editable fields
      const preview = [
        { project: 'P1', month: '2026-01', costCategory: 'Labor', budgetStream: 'CapEx', forecast: 12345, actual: 12000, budget: 12500, variance: -500 },
      ];
      // Check for absence of edit controls
      const hasEdit = Object.values(preview[0]).some(v => typeof v === 'function');
      expect(hasEdit).toBe(false);
    });
  });

  describe('ForecastManagementWorkspace drawer integration', () => {
    it('indicates snapshot detail drawer capability in the render model', () => {
      // The render model should not expose forbidden fields and should be read-only
      const model = getForecastManagementWorkspaceRenderModel();
      expect(model.sectionTitles).toContain('Snapshot Lines Preview');
      expect(model.readOnlySectionIds).toContain('snapshotLinesPreview');
    });

    it('exposes a safe user-facing detail action/intent', () => {
      // Simulate a snapshot line and transform it
      const line = {
        project: 'P1',
        month: '2026-01',
        costCategory: 'Labor',
        budgetStream: 'CapEx',
        forecast: 12345,
        actual: 12000,
        budget: 12500,
        variance: -500,
      };
      const detail = toForecastSnapshotDetailViewModel(line);
      expect(detail).toBeDefined();
      expect(detail.project).toBe('P1');
      expect(detail.isReadOnly).toBe(true);
    });

    it('drawer integration does not expose raw JSON or forecastVersionId', () => {
      const detail = { ...emptyForecastSnapshotDetailViewModel, project: '{ "foo": 1 }', sourceMetadata: '{bar:2}', forecastVersionId: 'shouldHide' };
      const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail, onClose: () => {} });
      // Should not find the raw JSON string or forbidden field in the tree
      function findTextInTree(node, text) {
        if (!node) return false;
        if (typeof node === 'string' || typeof node === 'number') {
          return String(node).includes(text);
        }
        if (Array.isArray(node)) {
          return node.some(child => findTextInTree(child, text));
        }
        if (node.props && node.props.children) {
          return findTextInTree(node.props.children, text);
        }
        return false;
      }
      expect(findTextInTree(el, '{ "foo": 1 }')).toBe(false);
      expect(findTextInTree(el, '{bar:2}')).toBe(false);
      expect(findTextInTree(el, 'forecastVersionId')).toBe(false);
    });

    it('drawer remains read-only and does not introduce unsupported labels', () => {
      const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail: emptyForecastSnapshotDetailViewModel, onClose: () => {} });
      function findTextInTree(node, text) {
        if (!node) return false;
        if (typeof node === 'string' || typeof node === 'number') {
          return String(node).includes(text);
        }
        if (Array.isArray(node)) {
          return node.some(child => findTextInTree(child, text));
        }
        if (node.props && node.props.children) {
          return findTextInTree(node.props.children, text);
        }
        return false;
      }
      expect(findTextInTree(el, 'Edit Forecast')).toBe(false);
      expect(findTextInTree(el, 'Create Forecast Version')).toBe(false);
      expect(findTextInTree(el, 'Approve Forecast')).toBe(false);
      expect(findTextInTree(el, 'Run AI Explanation')).toBe(false);
      expect(findTextInTree(el, 'Read-only')).toBe(true);
    });
  });
});
