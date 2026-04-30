import type {
  Month,
  CostType,
  AllocationOwner,
  CostCategoryKey,
  BudgetModel,
} from "./financialTypes";

export const MONTHS: Month[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const COST_TYPES: CostType[] = ["Capital", "Expense"];

export const OWNERS: AllocationOwner[] = ["Business", "Eaton IT", "External IT"];

export const CATEGORY_CONFIG: { key: CostCategoryKey; label: string; owners: AllocationOwner[] | null }[] = [
  { key: "labor", label: "Labor", owners: OWNERS },
  { key: "te", label: "T&E", owners: OWNERS },
  { key: "software", label: "Software", owners: null },
  { key: "hardware", label: "Hardware", owners: null }, // Hardware is Direct only
];

export const SAMPLE_BASES: Record<CostType, Record<string, any>> = {
  Capital: {
    labor: { Business: 12000, "Eaton IT": 16000, "External IT": 22000 },
    te: { Business: 1800, "Eaton IT": 2300, "External IT": 3600 },
    software: 9000,
    hardware: 8000, // sample base value for Hardware (Capital)
  },
  Expense: {
    labor: { Business: 9000, "Eaton IT": 13000, "External IT": 17500 },
    te: { Business: 1400, "Eaton IT": 1900, "External IT": 2800 },
    software: 7000,
    hardware: 6000, // sample base value for Hardware (Expense)
  },
};
