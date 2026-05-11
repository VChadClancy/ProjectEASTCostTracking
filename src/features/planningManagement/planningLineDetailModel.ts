// Planning Line Detail Models (Sprint 17, Checkpoint 157)
// Models for detail drawers (financial and FTE/labor)

export interface FinancialPlanningLineDetailViewModel {
  lineId: string;
  programLabel: string;
  projectLabel: string;
  carLabel: string;
  lineType: string;
  fiscalPeriod: string;
  budgetStream: string;
  costCategory: string;
  plannedAmount: number;
  forecastAmount?: number;
  notes?: string;
  status?: string;
  isReadOnly?: boolean;
  mode?: 'view' | 'edit' | 'create';
  readiness?: boolean;
}

export interface FteLaborPlanningLineDetailViewModel {
  lineId: string;
  programLabel: string;
  projectLabel: string;
  carLabel: string;
  roleOrResource: string;
  namedEmployee?: string;
  fiscalPeriod: string;
  fte: number;
  laborRate: number;
  calculatedLaborCost: number;
  budgetStream: string;
  costCategory: string;
  notes?: string;
  status?: string;
  isReadOnly?: boolean;
  mode?: 'view' | 'edit' | 'create';
  readiness?: boolean;
}
