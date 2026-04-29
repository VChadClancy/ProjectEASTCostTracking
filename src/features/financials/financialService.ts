import { createInitialBudget } from "./financialCalculations";
import type { BudgetModel } from "./financialTypes";

/**
 * Mock service for financial budget data.
 * In a real app, this would call an API or database.
 */
export function getInitialBudget(): BudgetModel {
  // Always return a new object to avoid shared state bugs
  return createInitialBudget();
}
