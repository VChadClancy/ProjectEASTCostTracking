import { describe, it, expect } from 'vitest';
import {
  FinancialPlanningLineDetailViewModel,
  FteLaborPlanningLineDetailViewModel,
} from './planningLineDetailModel';

// Test: Financial detail model supports required display fields
const financialDetail: FinancialPlanningLineDetailViewModel = {
  lineId: 'fin-001',
  programLabel: 'Atlas Core',
  projectLabel: 'Migration',
  carLabel: 'CAR-1001',
  lineType: 'software',
  fiscalPeriod: '2026-05',
  budgetStream: 'CapEx',
  costCategory: 'Software Licenses',
  plannedAmount: 50000,
  forecastAmount: 52000,
  notes: 'Renewal',
  status: 'active',
  isReadOnly: false,
  mode: 'view',
  readiness: true,
};

describe('FinancialPlanningLineDetailViewModel', () => {
  it('supports all required display fields', () => {
    expect(financialDetail.lineId).toBeTypeOf('string');
    expect(financialDetail.programLabel).toBeTypeOf('string');
    expect(financialDetail.projectLabel).toBeTypeOf('string');
    expect(financialDetail.carLabel).toBeTypeOf('string');
    expect(financialDetail.lineType).toBeTypeOf('string');
    expect(financialDetail.fiscalPeriod).toBeTypeOf('string');
    expect(financialDetail.budgetStream).toBeTypeOf('string');
    expect(financialDetail.costCategory).toBeTypeOf('string');
    expect(financialDetail.plannedAmount).toBeTypeOf('number');
    expect(financialDetail.forecastAmount).toBeTypeOf('number');
    expect(financialDetail.notes).toBeTypeOf('string');
    expect(financialDetail.status).toBeTypeOf('string');
    expect(financialDetail.isReadOnly).toBeTypeOf('boolean');
    expect(financialDetail.mode).toBeTypeOf('string');
    expect(financialDetail.readiness).toBeTypeOf('boolean');
  });
});

// Test: FTE/labor detail model supports named employee, FTE, labor rate, calculated labor cost
const fteDetail: FteLaborPlanningLineDetailViewModel = {
  lineId: 'fte-001',
  programLabel: 'Atlas Core',
  projectLabel: 'Migration',
  carLabel: 'CAR-1003',
  roleOrResource: 'Software Engineer',
  namedEmployee: 'Jane Doe',
  fiscalPeriod: '2026-05',
  fte: 1.0,
  laborRate: 120000,
  calculatedLaborCost: 120000,
  budgetStream: 'OpEx',
  costCategory: 'Labor',
  notes: 'Lead dev',
  status: 'active',
  isReadOnly: false,
  mode: 'view',
  readiness: true,
};

describe('FteLaborPlanningLineDetailViewModel', () => {
  it('supports named employee, FTE, labor rate, calculated labor cost', () => {
    expect(fteDetail.namedEmployee).toBeTypeOf('string');
    expect(fteDetail.fte).toBeTypeOf('number');
    expect(fteDetail.laborRate).toBeTypeOf('number');
    expect(fteDetail.calculatedLaborCost).toBeTypeOf('number');
  });
});
