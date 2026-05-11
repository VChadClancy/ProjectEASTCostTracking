// Planning Line Form Models & Validation (Sprint 17, Checkpoint 157)

export type FieldType = 'text' | 'number' | 'select' | 'currency' | 'fiscalPeriod';

export interface PlanningLineFormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  section?: string;
  helperText?: string;
  validate?: (value: any) => string | undefined;
}

export interface FinancialPlanningLineFormModel {
  fields: PlanningLineFormField[];
}

export interface FteLaborPlanningLineFormModel {
  fields: PlanningLineFormField[];
}

// Financial Planning Line Form Fields
export const financialPlanningLineFormModel: FinancialPlanningLineFormModel = {
  fields: [
    { id: 'projectLabel', label: 'Project', type: 'text', required: true },
    { id: 'carLabel', label: 'CAR', type: 'text', required: true },
    { id: 'lineType', label: 'Line Type', type: 'select', required: true },
    { id: 'fiscalPeriod', label: 'Fiscal Period', type: 'fiscalPeriod', required: true },
    { id: 'budgetStream', label: 'Budget Stream', type: 'select', required: true },
    { id: 'costCategory', label: 'Cost Category', type: 'select', required: true },
    { id: 'plannedAmount', label: 'Planned Amount', type: 'currency', required: true, validate: v => (v == null || v === '' ? 'Required' : v < 0 ? 'Must be >= 0' : undefined) },
    { id: 'forecastAmount', label: 'Forecast Amount', type: 'currency', required: false },
    { id: 'notes', label: 'Notes', type: 'text', required: false },
    { id: 'status', label: 'Status', type: 'text', required: false },
  ],
};

// FTE/Labor Planning Line Form Fields
export const fteLaborPlanningLineFormModel: FteLaborPlanningLineFormModel = {
  fields: [
    { id: 'projectLabel', label: 'Project', type: 'text', required: true },
    { id: 'carLabel', label: 'CAR', type: 'text', required: true },
    { id: 'roleOrResource', label: 'Role/Resource', type: 'text', required: true },
    { id: 'namedEmployee', label: 'Named Employee', type: 'text', required: false },
    { id: 'fiscalPeriod', label: 'Fiscal Period', type: 'fiscalPeriod', required: true },
    { id: 'fte', label: 'FTE', type: 'number', required: true, validate: v => (v == null || v === '' ? 'Required' : v < 0 ? 'Must be >= 0' : undefined) },
    { id: 'laborRate', label: 'Labor Rate', type: 'currency', required: true, validate: v => (v == null || v === '' ? 'Required' : v < 0 ? 'Must be >= 0' : undefined) },
    { id: 'budgetStream', label: 'Budget Stream', type: 'select', required: true },
    { id: 'costCategory', label: 'Cost Category', type: 'select', required: true },
    { id: 'notes', label: 'Notes', type: 'text', required: false },
    { id: 'status', label: 'Status', type: 'text', required: false },
  ],
};

// Validation helpers
export function validateFinancialPlanningLineForm(input: Record<string, any>): string[] {
  const errors: string[] = [];
  for (const field of financialPlanningLineFormModel.fields) {
    if (field.required && (input[field.id] == null || input[field.id] === '')) {
      errors.push(`${field.label} is required`);
    }
    if (field.validate) {
      const err = field.validate(input[field.id]);
      if (err) errors.push(`${field.label}: ${err}`);
    }
    if (field.id === 'fiscalPeriod' && typeof input[field.id] === 'string' && !/^\d{4}-\d{2}$/.test(input[field.id])) {
      errors.push('Fiscal Period must be YYYY-MM');
    }
    if (field.id === 'lineType' && typeof input[field.id] === 'string' && !input[field.id]) {
      errors.push('Line Type is invalid');
    }
  }
  return errors;
}

export function validateFteLaborPlanningLineForm(input: Record<string, any>): string[] {
  const errors: string[] = [];
  for (const field of fteLaborPlanningLineFormModel.fields) {
    if (field.required && (input[field.id] == null || input[field.id] === '')) {
      errors.push(`${field.label} is required`);
    }
    if (field.validate) {
      const err = field.validate(input[field.id]);
      if (err) errors.push(`${field.label}: ${err}`);
    }
    if (field.id === 'fiscalPeriod' && typeof input[field.id] === 'string' && !/^\d{4}-\d{2}$/.test(input[field.id])) {
      errors.push('Fiscal Period must be YYYY-MM');
    }
  }
  return errors;
}

// Safe labor cost calculation
export function calculateLaborCost(fte: number, laborRate: number): number {
  const safeFte = Number.isFinite(fte) ? fte : 0;
  const safeRate = Number.isFinite(laborRate) ? laborRate : 0;
  const cost = safeFte * safeRate;
  return Number.isFinite(cost) ? cost : 0;
}
