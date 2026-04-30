// Shared financial types for the cost tracking app

export type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

export type CostType = "Capital" | "Expense";

export type AllocationOwner = "Business" | "Eaton IT" | "External IT";

export type CostCategoryKey = string; // e.g., 'labor', 'te', 'software', 'hardware', etc.

export type MetricType = "forecast" | "actual";

export type MetricPair = {
  forecast: number;
  actual: number;
};

export type BudgetStream = "Delivery" | "Run";

// BudgetModel is a nested object: Month -> CostType -> CategoryKey -> (Owner? -> MetricPair | MetricPair)
// For now, all categories are assumed to be Delivery stream by default.
export type BudgetModel = {
  [month in Month]: {
    [costType in CostType]: {
      [categoryKey in CostCategoryKey]:
        | MetricPair
        | { [owner in AllocationOwner]: MetricPair };
    };
  };
};

export type RollupRow = {
  Level: string;
  Period: string;
  "Cost Type": string;
  Category: string;
  Allocation: string;
  Forecast: number;
  Actual: number;
  Variance: number;
};
