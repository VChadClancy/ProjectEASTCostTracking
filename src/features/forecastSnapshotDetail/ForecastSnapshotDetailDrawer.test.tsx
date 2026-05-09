import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ForecastSnapshotDetailDrawer } from './ForecastSnapshotDetailDrawer';
import { emptyForecastSnapshotDetailViewModel } from './forecastSnapshotDetailDataAdapter';

// Minimal test renderer for React elements (no DOM)
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

describe('ForecastSnapshotDetailDrawer', () => {
  it('should export the component', () => {
    expect(ForecastSnapshotDetailDrawer).toBeInstanceOf(Function);
  });

  it('should return null when closed', () => {
    const el = ForecastSnapshotDetailDrawer({ isOpen: false, detail: emptyForecastSnapshotDetailViewModel, onClose: vi.fn() });
    expect(el).toBe(null);
  });

  it('should render as a React element when open', () => {
    const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail: emptyForecastSnapshotDetailViewModel, onClose: vi.fn() });
    expect(React.isValidElement(el)).toBe(true);
  });

  it('should render required section titles', () => {
    const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail: emptyForecastSnapshotDetailViewModel, onClose: vi.fn() });
    expect(findTextInTree(el, 'Selected Line Summary')).toBe(true);
    expect(findTextInTree(el, 'Financial Values')).toBe(true);
    expect(findTextInTree(el, 'Monthly Context')).toBe(true);
    expect(findTextInTree(el, 'Classification Details')).toBe(true);
    expect(findTextInTree(el, 'Version / Source Metadata')).toBe(true);
    expect(findTextInTree(el, 'Delta Context')).toBe(true);
  });

  it('should show read-only label', () => {
    const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail: emptyForecastSnapshotDetailViewModel, onClose: vi.fn() });
    expect(findTextInTree(el, 'Read-only')).toBe(true);
  });

  it('should show close action label', () => {
    const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail: emptyForecastSnapshotDetailViewModel, onClose: vi.fn() });
    expect(findTextInTree(el, 'Close')).toBe(true);
  });

  it('should not render raw JSON-like strings', () => {
    const detail = { ...emptyForecastSnapshotDetailViewModel, project: '{ "foo": 1 }', sourceMetadata: '{bar:2}' };
    const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail, onClose: vi.fn() });
    // Should not find the raw JSON string in the tree
    expect(findTextInTree(el, '{ "foo": 1 }')).toBe(false);
    expect(findTextInTree(el, '{bar:2}')).toBe(false);
  });

  it('should not expose forecastVersionId', () => {
    const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail: emptyForecastSnapshotDetailViewModel, onClose: vi.fn() });
    // Should not find this forbidden field
    expect(findTextInTree(el, 'forecastVersionId')).toBe(false);
  });

  it('should not introduce unsupported labels', () => {
    const el = ForecastSnapshotDetailDrawer({ isOpen: true, detail: emptyForecastSnapshotDetailViewModel, onClose: vi.fn() });
    expect(findTextInTree(el, 'Edit Forecast')).toBe(false);
    expect(findTextInTree(el, 'Create Forecast Version')).toBe(false);
    expect(findTextInTree(el, 'Approve Forecast')).toBe(false);
    expect(findTextInTree(el, 'Run AI Explanation')).toBe(false);
  });
});
