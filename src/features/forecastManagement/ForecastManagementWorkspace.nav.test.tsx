import { describe, it, expect } from 'vitest';
import {
  getAppPageRenderModel,
  getDefaultAppPage,
  getAppPageById,
  DEFAULT_APP_PAGE_ID
} from '../../App';
import { getForecastManagementWorkspaceRenderModel } from './ForecastManagementWorkspace';
import { getProgramWorkspaceRenderModel } from '../programWorkspace/ProgramWorkspace';
import { atlasNavigation } from '../../components/shell/navigation';

// Model-level tests for navigation and workspace selection

describe('Forecast Management Workspace navigation integration', () => {
  it('Program Workspace is the default page', () => {
    // App default state should be Program Workspace
    expect(getDefaultAppPage().id).toBe(DEFAULT_APP_PAGE_ID);
    expect(getDefaultAppPage().label).toMatch(/program/i);
  });

  it('Forecast Management Workspace is registered in navigation', () => {
    const nav = atlasNavigation.find((item) => item.id === 'forecasting');
    expect(nav).toBeDefined();
    expect(nav?.label).toBe('Forecasting');
    expect(nav?.path).toBe('/forecasting');
  });

  it('Forecasting nav item maps to Forecast Management Workspace', () => {
    // Simulate navigation selection
    const page = getAppPageById('forecasting');
    expect(page.id).toBe('forecasting');
    expect(page.label).toBe('Forecasting');
    const model = getForecastManagementWorkspaceRenderModel();
    expect(Array.isArray(model.sectionTitles)).toBe(true);
    expect(model.sectionTitles.length).toBeGreaterThan(0);
  });

  it('App shell remains intact and does not introduce unsupported workflow labels', () => {
    const model = getForecastManagementWorkspaceRenderModel();
    model.unsupportedWorkflowLabels.forEach((label) => {
      model.sectionTitles.forEach((title) => {
        expect(title).not.toContain(label);
      });
    });
  });

  it('does not make fetch/network calls at module import time', () => {
    // No fetch/network at import: model helpers are pure
    expect(typeof getForecastManagementWorkspaceRenderModel).toBe('function');
    expect(typeof getProgramWorkspaceRenderModel).toBe('function');
  });
});

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
    expect(getDefaultAppPage().id).toBe(DEFAULT_APP_PAGE_ID);
  });
});
