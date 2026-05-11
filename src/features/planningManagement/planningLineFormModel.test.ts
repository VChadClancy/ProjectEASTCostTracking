import { describe, it, expect } from 'vitest';
import {
  financialPlanningLineFormModel,
  fteLaborPlanningLineFormModel,
  validateFinancialPlanningLineForm,
  validateFteLaborPlanningLineForm,
  calculateLaborCost,
} from './planningLineFormModel';

describe('FinancialPlanningLineFormModel', () => {
  it('includes all required fields', () => {
    const ids = financialPlanningLineFormModel.fields.map(f => f.id);
    expect(ids).toContain('projectLabel');
    expect(ids).toContain('carLabel');
    expect(ids).toContain('lineType');
    expect(ids).toContain('fiscalPeriod');
    expect(ids).toContain('budgetStream');
    expect(ids).toContain('costCategory');
    expect(ids).toContain('plannedAmount');
  });
});

describe('FteLaborPlanningLineFormModel', () => {
  it('includes all required fields', () => {
    const ids = fteLaborPlanningLineFormModel.fields.map(f => f.id);
    expect(ids).toContain('projectLabel');
    expect(ids).toContain('carLabel');
    expect(ids).toContain('roleOrResource');
    expect(ids).toContain('fiscalPeriod');
    expect(ids).toContain('fte');
    expect(ids).toContain('laborRate');
    expect(ids).toContain('budgetStream');
    expect(ids).toContain('costCategory');
  });
});

describe('validateFinancialPlanningLineForm', () => {
  it('catches missing required fields', () => {
    const errors = validateFinancialPlanningLineForm({});
    expect(errors.some(e => e.includes('Project'))).toBe(true);
    expect(errors.some(e => e.includes('CAR'))).toBe(true);
    expect(errors.some(e => e.includes('Line Type'))).toBe(true);
    expect(errors.some(e => e.includes('Fiscal Period'))).toBe(true);
    expect(errors.some(e => e.includes('Budget Stream'))).toBe(true);
    expect(errors.some(e => e.includes('Cost Category'))).toBe(true);
    expect(errors.some(e => e.includes('Planned Amount'))).toBe(true);
  });
  it('catches negative planned amount', () => {
    const errors = validateFinancialPlanningLineForm({
      projectLabel: 'Migration',
      carLabel: 'CAR-1001',
      lineType: 'software',
      fiscalPeriod: '2026-05',
      budgetStream: 'CapEx',
      costCategory: 'Software Licenses',
      plannedAmount: -100,
    });
    expect(errors.some(e => e.includes('Planned Amount'))).toBe(true);
  });
  it('catches invalid fiscal period', () => {
    const errors = validateFinancialPlanningLineForm({
      projectLabel: 'Migration',
      carLabel: 'CAR-1001',
      lineType: 'software',
      fiscalPeriod: 'May 2026',
      budgetStream: 'CapEx',
      costCategory: 'Software Licenses',
      plannedAmount: 100,
    });
    expect(errors.some(e => e.includes('Fiscal Period'))).toBe(true);
  });
});

describe('validateFteLaborPlanningLineForm', () => {
  it('catches missing required fields', () => {
    const errors = validateFteLaborPlanningLineForm({});
    expect(errors.some(e => e.includes('Project'))).toBe(true);
    expect(errors.some(e => e.includes('CAR'))).toBe(true);
    expect(errors.some(e => e.includes('Role/Resource'))).toBe(true);
    expect(errors.some(e => e.includes('Fiscal Period'))).toBe(true);
    expect(errors.some(e => e.includes('FTE'))).toBe(true);
    expect(errors.some(e => e.includes('Labor Rate'))).toBe(true);
    expect(errors.some(e => e.includes('Budget Stream'))).toBe(true);
    expect(errors.some(e => e.includes('Cost Category'))).toBe(true);
  });
  it('catches negative FTE', () => {
    const errors = validateFteLaborPlanningLineForm({
      projectLabel: 'Migration',
      carLabel: 'CAR-1003',
      roleOrResource: 'Software Engineer',
      fiscalPeriod: '2026-05',
      fte: -1,
      laborRate: 120000,
      budgetStream: 'OpEx',
      costCategory: 'Labor',
    });
    expect(errors.some(e => e.includes('FTE'))).toBe(true);
  });
  it('catches negative labor rate', () => {
    const errors = validateFteLaborPlanningLineForm({
      projectLabel: 'Migration',
      carLabel: 'CAR-1003',
      roleOrResource: 'Software Engineer',
      fiscalPeriod: '2026-05',
      fte: 1,
      laborRate: -120000,
      budgetStream: 'OpEx',
      costCategory: 'Labor',
    });
    expect(errors.some(e => e.includes('Labor Rate'))).toBe(true);
  });
  it('catches invalid fiscal period', () => {
    const errors = validateFteLaborPlanningLineForm({
      projectLabel: 'Migration',
      carLabel: 'CAR-1003',
      roleOrResource: 'Software Engineer',
      fiscalPeriod: 'May 2026',
      fte: 1,
      laborRate: 120000,
      budgetStream: 'OpEx',
      costCategory: 'Labor',
    });
    expect(errors.some(e => e.includes('Fiscal Period'))).toBe(true);
  });
});

describe('calculateLaborCost', () => {
  it('returns finite correct value', () => {
    expect(calculateLaborCost(1, 100000)).toBe(100000);
    expect(calculateLaborCost(0.5, 80000)).toBe(40000);
    expect(calculateLaborCost(NaN, 80000)).toBe(0);
    expect(calculateLaborCost(1, NaN)).toBe(0);
    expect(calculateLaborCost(Infinity, 80000)).toBe(0);
    expect(calculateLaborCost(1, Infinity)).toBe(0);
  });
});

describe('No unsupported future-scope labels', () => {
  it('does not include unsupported labels in form models', () => {
    const allLabels = [
      ...financialPlanningLineFormModel.fields.map(f => f.label),
      ...fteLaborPlanningLineFormModel.fields.map(f => f.label),
    ];
    expect(allLabels.some(l => l.includes('Approve'))).toBe(false);
    expect(allLabels.some(l => l.includes('Run AI Recommendation'))).toBe(false);
    expect(allLabels.some(l => l.includes('Import Invoice'))).toBe(false);
    expect(allLabels.some(l => l.includes('Detect Overallocation'))).toBe(false);
  });
});
