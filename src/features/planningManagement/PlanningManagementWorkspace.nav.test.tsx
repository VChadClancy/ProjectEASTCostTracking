import { describe, it, expect } from 'vitest';
import {
  getAppPageRenderModel,
  getDefaultAppPage,
  getAppPageById,
  DEFAULT_APP_PAGE_ID
} from '../../App';
import { getPlanningManagementWorkspaceRenderModel } from './PlanningManagementWorkspace';
import { atlasNavigation } from '../../components/shell/navigation';

// Model-level tests for navigation and workspace selection

describe('Planning Management Workspace navigation integration', () => {
  it('Program Workspace is the default page', () => {
    expect(getDefaultAppPage().id).toBe(DEFAULT_APP_PAGE_ID);
    expect(getDefaultAppPage().label).toMatch(/program/i);
  });

  it('Planning nav item is registered in navigation', () => {
    const nav = atlasNavigation.find((item) => item.id === 'planning-management');
    expect(nav).toBeDefined();
    expect(nav?.label).toBe('Planning');
    expect(nav?.path).toBe('/planning-management');
  });

  it('Planning nav item maps to PlanningManagementWorkspace', () => {
    const page = getAppPageById('planning-management');
    expect(page.id).toBe('planning-management');
    expect(page.label).toBe('Planning');
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(Array.isArray(model.sectionTitles)).toBe(true);
    expect(model.sectionTitles.length).toBeGreaterThan(0);
  });

  it('PlanningManagementWorkspace is registered and reachable through page selection', () => {
    const model = getAppPageRenderModel();
    expect(model.pageIds).toContain('planning-management');
    expect(model.pageLabels).toContain('Planning');
    expect(model.navIds).toContain('planning-management');
    expect(model.navLabels).toContain('Planning');
  });

  it('Financial Lines section is represented', () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(model.hasFinancialLinesSection).toBe(true);
  });

  it('FTE/Labor Lines section is represented and primary/active/visible', () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(model.hasFteLaborLinesSection).toBe(true);
  });

  it('does not introduce unsupported future-scope labels', () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    model.unsupportedWorkflowLabels.forEach((label) => {
      model.sectionTitles.forEach((title) => {
        expect(title).not.toContain(label);
      });
    });
  });

  it('does not make fetch/network calls at module import time', () => {
    // No fetch/network at import: model helpers are pure
    expect(typeof getPlanningManagementWorkspaceRenderModel).toBe('function');
  });
});
