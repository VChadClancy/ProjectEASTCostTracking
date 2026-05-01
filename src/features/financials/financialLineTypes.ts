// FinancialLine type for financial planning lines
export interface FinancialLine {
  id: string;
  programId: string;
  projectId?: string;
  carId?: string;
  workstreamId?: string;
  fiscalYearId: string;
  fiscalPeriodId: string;
  budgetStream: 'Run' | 'Delivery';
  costType: string;
  costCategoryKey: string;
  allocationOwner?: string;
  forecastAmount: number;
  actualAmount: number;
  varianceAmount: number;
}
