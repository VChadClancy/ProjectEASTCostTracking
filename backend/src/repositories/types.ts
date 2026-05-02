// Shared types for repository filters and results
// Extend as needed for repository method signatures

export interface PaginationFilter {
  limit?: number;
  offset?: number;
}

export interface DateRangeFilter {
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
}

// Example: Used for filtering financial lines
export interface FinancialLineFilters extends PaginationFilter, DateRangeFilter {
  programId?: string;
  projectId?: string;
  carId?: string;
  workstreamId?: string;
  fiscalYearId?: string;
  fiscalPeriodId?: string;
  budgetStream?: string;
}

// Example: Used for creating/updating financial lines
export interface FinancialLineInput {
  programId: string;
  projectId: string;
  carId: string;
  workstreamId: string;
  fiscalPeriodId: string;
  amount: number;
  description?: string;
}
