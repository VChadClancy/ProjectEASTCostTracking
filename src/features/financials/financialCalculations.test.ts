import {
  createInitialBudget,
  createAnnualRollupRows,
  createMonthlyRollupRows,
  sumNode,
} from "./financialCalculations";
import { MONTHS, COST_TYPES, CATEGORY_CONFIG } from "./financialConfig";
import type { BudgetModel, MetricPair } from "./financialTypes";
import { describe, it, expect } from "vitest";

// Helper to get a fresh budget for each test
function getBudget(): BudgetModel {
  return createInitialBudget();
}

function getLaborBusinessMetricPair(budget: BudgetModel, month: string, costType: string): MetricPair {
  const labor = budget[month][costType]["labor"];
  if (typeof labor === "object" && "Business" in labor) {
    return labor["Business"];
  }
  throw new Error("Labor does not have Business owner");
}

describe("financialCalculations", () => {
  it("createInitialBudget returns budget data for all 12 months", () => {
    const budget = createInitialBudget();
    MONTHS.forEach(month => {
      expect(budget[month]).toBeDefined();
    });
  });

  it("annual rollup includes a Grand Total row", () => {
    const budget = getBudget();
    const annual = createAnnualRollupRows(budget);
    const grandTotal = annual.find(row => row["Category"] === "All" && row["Level"] === "Grand Total");
    expect(grandTotal).toBeDefined();
    expect(typeof grandTotal?.Forecast).toBe("number");
  });

  it("monthly rollup includes rows for all 12 months", () => {
    const budget = getBudget();
    const monthly = createMonthlyRollupRows(budget);
    MONTHS.forEach(month => {
      expect(monthly.find(row => row["Period"] === month && row["Level"] === "Month Total")).toBeDefined();
    });
  });

  it("variance equals Actual minus Forecast", () => {
    const budget = getBudget();
    const pair = getLaborBusinessMetricPair(budget, "Jan", "Capital");
    pair.forecast = 1000;
    pair.actual = 1200;
    const monthly = createMonthlyRollupRows(budget);
    const jan = monthly.find(row => row["Period"] === "Jan" && row["Level"] === "Month Total");
    expect(jan).toBeDefined();
    if (jan) {
      expect(jan.Variance).toBeCloseTo(jan.Actual - jan.Forecast);
    }
  });

  it("Capital forecast plus Expense forecast equals Grand Total forecast", () => {
    const budget = getBudget();
    const capitalPair = getLaborBusinessMetricPair(budget, "Jan", "Capital");
    const expensePair = getLaborBusinessMetricPair(budget, "Jan", "Expense");
    capitalPair.forecast = 500;
    expensePair.forecast = 700;
    // Set all other months to 0 for these categories
    MONTHS.filter(m => m !== "Jan").forEach(month => {
      getLaborBusinessMetricPair(budget, month, "Capital").forecast = 0;
      getLaborBusinessMetricPair(budget, month, "Expense").forecast = 0;
    });
    const annual = createAnnualRollupRows(budget);
    const grandTotal = annual.find(row => row["Category"] === "All" && row["Level"] === "Grand Total");
    const capitalRow = annual.find(row => row["Cost Type"] === "Capital" && row["Category"] === "All" && row["Level"] === "Type Total");
    const expenseRow = annual.find(row => row["Cost Type"] === "Expense" && row["Category"] === "All" && row["Level"] === "Type Total");
    expect(grandTotal && capitalRow && expenseRow).toBeTruthy();
    if (grandTotal && capitalRow && expenseRow) {
      expect(grandTotal.Forecast).toBeCloseTo(capitalRow.Forecast + expenseRow.Forecast);
    }
  });

  it("sumNode correctly totals nested forecast values", () => {
    // Simulate a nested node structure
    const node = {
      children: [
        { forecast: 100 },
        { forecast: 200 },
      ],
    };
    const result = sumNode(node, "forecast");
    expect(result).toBe(300);
  });
});
