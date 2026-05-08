import { describe, it, expect } from 'vitest';
import { getAppPageRenderModel } from '../../App';

// Test: Forecasting nav still maps to Forecast Management Workspace

describe('Forecasting navigation', () => {
  it('Forecasting nav points to Forecast Management Workspace', () => {
    const model = getAppPageRenderModel();
    expect(model.pageIds).toContain('forecasting');
    expect(model.pageLabels).toContain('Forecasting');
    expect(model.defaultPageId).toBe('program-workspace');
  });
});
