import type {
  Month,
  CostType,
  AllocationOwner,
  CostCategoryKey,
  BudgetModel,
  BudgetStream,
} from "./financialTypes";

export const MONTHS: Month[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const COST_TYPES: CostType[] = ["Capital", "Expense"];

export const OWNERS: AllocationOwner[] = ["Business", "Eaton IT", "External IT"];

export const CATEGORY_CONFIG: { key: CostCategoryKey; label: string; owners: AllocationOwner[] | null; stream: BudgetStream }[] = [
  // Delivery stream
  { key: "labor", label: "Labor", owners: OWNERS, stream: "Delivery" },
  { key: "te", label: "T&E", owners: OWNERS, stream: "Delivery" },
  { key: "software", label: "Software", owners: null, stream: "Delivery" },
  { key: "hardware", label: "Hardware", owners: null, stream: "Delivery" },
  // Run stream
  { key: "software_license", label: "Software License", owners: null, stream: "Run" },
  { key: "support", label: "Support", owners: null, stream: "Run" },
  { key: "hosting", label: "Hosting", owners: null, stream: "Run" },
  { key: "maintenance", label: "Maintenance", owners: null, stream: "Run" },
  { key: "other_run_cost", label: "Other Run Cost", owners: null, stream: "Run" },
];

export const SAMPLE_BASES: Record<CostType, Record<string, any>> = {
  Capital: {
    labor: { Business: 12000, "Eaton IT": 16000, "External IT": 22000 },
    te: { Business: 1800, "Eaton IT": 2300, "External IT": 3600 },
    software: 9000,
    hardware: 8000,
    // No Run categories for Capital by default
  },
  Expense: {
    labor: { Business: 9000, "Eaton IT": 13000, "External IT": 17500 },
    te: { Business: 1400, "Eaton IT": 1900, "External IT": 2800 },
    software: 7000,
    hardware: 6000,
    software_license: 5000,
    support: 3000,
    hosting: 4000,
    maintenance: 3500,
    other_run_cost: 2000,
  },
};
