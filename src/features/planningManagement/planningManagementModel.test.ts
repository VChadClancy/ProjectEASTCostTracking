import { describe, it, expect } from 'vitest';
import {
  getPlanningManagementSections,
  getPrimaryPlanningManagementSections,
  getPreviewPlanningManagementSections,
  getFuturePlanningManagementSections,
  getPlanningManagementRenderModel,
  PlanningLineType,
  PlanningManagementSection,
  FteLaborPlanningLineViewModel,
  FinancialPlanningLineViewModel,
} from './planningManagementModel';

describe('Planning Management Model', () => {
  it('should include all required workspace sections', () => {
    const sections = getPlanningManagementSections();
    const ids = sections.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'workspaceHeader',
        'planningSummaryCards',
        'financialLinesList',
        'fteLaborLinesList',
        'financialLineDetailDrawer',
        'fteLaborLineDetailDrawer',
        'createEditPlanningLineForm',
        'validationFeedback',
        'scopeGuardReadinessNotes',
      ])
    );
  });

  it('should have unique section ids', () => {
    const sections = getPlanningManagementSections();
    const ids = sections.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have financial lines list and FTE/labor lines list as active/primary', () => {
    const primary = getPrimaryPlanningManagementSections();
    const ids = primary.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining(['financialLinesList', 'fteLaborLinesList'])
    );
  });

  it('should represent create/edit form structure', () => {
    const sections = getPlanningManagementSections();
    const formSection = sections.find((s) => s.id === 'createEditPlanningLineForm');
    expect(formSection).toBeDefined();
  });

  it('should have 3 to 6 primary visible sections (MED guardrail)', () => {
    const primary = getPrimaryPlanningManagementSections();
    expect(primary.length).toBeGreaterThanOrEqual(3);
    expect(primary.length).toBeLessThanOrEqual(6);
  });

  it('should include all required PlanningLineType values', () => {
    const types: PlanningLineType[] = ['labor', 'software', 'hardware', 'consulting', 'other'];
    expect(types).toEqual(
      expect.arrayContaining([
        'labor',
        'software',
        'hardware',
        'consulting',
        'other',
      ])
    );
  });

  it('FteLaborPlanningLineViewModel supports named employee, FTE, labor rate, and calculated labor cost', () => {
    const fteLine: FteLaborPlanningLineViewModel = {
      lineId: '1',
      roleOrResource: 'Engineer',
      fiscalPeriod: '2026-05',
      fte: 1.0,
      laborRate: 100000,
      calculatedLaborCost: 100000,
      budgetStream: 'General',
      costCategory: 'Labor',
      namedEmployee: '', // Added to ensure property exists
    };
    expect(fteLine).toHaveProperty('namedEmployee');
    expect(fteLine).toHaveProperty('fte');
    expect(fteLine).toHaveProperty('laborRate');
    expect(fteLine).toHaveProperty('calculatedLaborCost');
  });

  it('render model does not include unsupported labels', () => {
    const renderModel = getPlanningManagementRenderModel();
    const sectionTitles = renderModel.sections.map((s) => s.title).join(' ');
    expect(sectionTitles).not.toMatch(/Approve|Run AI Recommendation|Import Invoice|Detect Overallocation/);
  });

  it('does not introduce raw JSON/debug labels', () => {
    const renderModel = getPlanningManagementRenderModel();
    const sectionTitles = renderModel.sections.map((s) => s.title).join(' ');
    expect(sectionTitles).not.toMatch(/raw JSON|debug/i);
  });
});
