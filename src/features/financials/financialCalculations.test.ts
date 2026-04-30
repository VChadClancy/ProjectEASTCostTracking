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
    // Find a Month Total row with all numeric values
    const jan = monthly.find(row =>
      row["Period"] === "Jan" &&
      row["Level"] === "Month Total"
    );
    expect(jan).toBeDefined();
    if (jan) {
      expect(Number.isFinite(jan.Forecast)).toBe(true);
      expect(Number.isFinite(jan.Actual)).toBe(true);
      expect(Number.isFinite(jan.Variance)).toBe(true);
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
    // Find annual Type Total rows for Capital and Expense, and Grand Total row
    const grandTotal = annual.find(row =>
      row["Category"] === "All" &&
      row["Level"] === "Grand Total"
    );
    const capitalRow = annual.find(row =>
      row["Cost Type"] === "Capital" &&
      row["Category"] === "All" &&
      row["Level"] === "Type Total"
    );
    const expenseRow = annual.find(row =>
      row["Cost Type"] === "Expense" &&
      row["Category"] === "All" &&
      row["Level"] === "Type Total"
    );
    expect(grandTotal && capitalRow && expenseRow).toBeTruthy();
    if (grandTotal && capitalRow && expenseRow) {
      expect(Number.isFinite(grandTotal.Forecast)).toBe(true);
      expect(Number.isFinite(capitalRow.Forecast)).toBe(true);
      expect(Number.isFinite(expenseRow.Forecast)).toBe(true);
      // Run Cost is only under Expense, so Capital + Expense = Grand Total
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

  it("createInitialBudget includes Hardware for all months and cost types", () => {
    const budget = createInitialBudget();
    MONTHS.forEach(month => {
      COST_TYPES.forEach(costType => {
        expect(budget[month][costType]["hardware"]).toBeDefined();
      });
    });
  });

  it("annual rollup includes Hardware category", () => {
    const budget = getBudget();
    const annual = createAnnualRollupRows(budget);
    const hardwareRows = annual.filter(row => row.Category === "Hardware");
    expect(hardwareRows.length).toBeGreaterThan(0);
    hardwareRows.forEach(row => {
      expect(row.Forecast).toBeDefined();
      expect(row.Actual).toBeDefined();
    });
  });

  it("monthly rollup includes Hardware category", () => {
    const budget = getBudget();
    const monthly = createMonthlyRollupRows(budget);
    const hardwareRows = monthly.filter(row => row.Category === "Hardware");
    expect(hardwareRows.length).toBeGreaterThan(0);
    hardwareRows.forEach(row => {
      expect(row.Forecast).toBeDefined();
      expect(row.Actual).toBeDefined();
    });
  });

  it("all current Delivery categories are classified as Delivery stream", () => {
    CATEGORY_CONFIG.filter((cat: any) => cat.stream === "Delivery").forEach((cat: any) => {
      expect(["labor", "te", "software", "hardware"]).toContain(cat.key);
    });
  });

  it("all new Run categories are classified as Run stream", () => {
    const runKeys = [
      "software_license",
      "support",
      "hosting",
      "maintenance",
      "other_run_cost",
    ];
    CATEGORY_CONFIG.filter((cat: any) => cat.stream === "Run").forEach((cat: any) => {
      expect(runKeys).toContain(cat.key);
    });
  });

  it("annual rollup includes all Run categories", () => {
    const budget = getBudget();
    const annual = createAnnualRollupRows(budget);
    [
      "Software License",
      "Support",
      "Hosting",
      "Maintenance",
      "Other Run Cost",
    ].forEach(label => {
      const rows = annual.filter(row => row.Category === label);
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach(row => {
        expect(row.Forecast).toBeDefined();
        expect(row.Actual).toBeDefined();
      });
    });
  });

  it("monthly rollup includes all Run categories", () => {
    const budget = getBudget();
    const monthly = createMonthlyRollupRows(budget);
    [
      "Software License",
      "Support",
      "Hosting",
      "Maintenance",
      "Other Run Cost",
    ].forEach(label => {
      const rows = monthly.filter(row => row.Category === label);
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach(row => {
        expect(row.Forecast).toBeDefined();
        expect(row.Actual).toBeDefined();
      });
    });
  });

  it("annual rollup includes Delivery and Run stream totals and Delivery + Run = Grand Total", () => {
    const budget = getBudget();
    const annual = createAnnualRollupRows(budget);
    const delivery = annual.find(row => row.Level === "Budget Stream Total" && row.Category === "Delivery");
    const run = annual.find(row => row.Level === "Budget Stream Total" && row.Category === "Run");
    const grandTotal = annual.find(row => row.Level === "Grand Total");
    expect(delivery).toBeDefined();
    expect(run).toBeDefined();
    expect(grandTotal).toBeDefined();
    if (delivery && run && grandTotal) {
      expect(Number.isFinite(delivery.Forecast)).toBe(true);
      expect(Number.isFinite(run.Forecast)).toBe(true);
      expect(Number.isFinite(grandTotal.Forecast)).toBe(true);
      expect(grandTotal.Forecast).toBeCloseTo(delivery.Forecast + run.Forecast);
      expect(Number.isFinite(delivery.Actual)).toBe(true);
      expect(Number.isFinite(run.Actual)).toBe(true);
      expect(Number.isFinite(grandTotal.Actual)).toBe(true);
      expect(grandTotal.Actual).toBeCloseTo(delivery.Actual + run.Actual);
      expect(Number.isFinite(delivery.Variance)).toBe(true);
      expect(Number.isFinite(run.Variance)).toBe(true);
      expect(Number.isFinite(grandTotal.Variance)).toBe(true);
      expect(grandTotal.Variance).toBeCloseTo(delivery.Variance + run.Variance);
    }
  });

  it("monthly rollup includes Delivery and Run stream totals and Delivery + Run = Grand Total for each month", () => {
    const budget = getBudget();
    const monthly = createMonthlyRollupRows(budget);
    MONTHS.forEach(month => {
      const delivery = monthly.find(row => row.Level === "Budget Stream Total" && row.Category === "Delivery" && row.Period === month);
      const run = monthly.find(row => row.Level === "Budget Stream Total" && row.Category === "Run" && row.Period === month);
      const grandTotal = monthly.find(row => row.Level === "Month Total" && row.Period === month);
      expect(delivery).toBeDefined();
      expect(run).toBeDefined();
      expect(grandTotal).toBeDefined();
      if (delivery && run && grandTotal) {
        expect(Number.isFinite(delivery.Forecast)).toBe(true);
        expect(Number.isFinite(run.Forecast)).toBe(true);
        expect(Number.isFinite(grandTotal.Forecast)).toBe(true);
        expect(grandTotal.Forecast).toBeCloseTo(delivery.Forecast + run.Forecast);
        expect(Number.isFinite(delivery.Actual)).toBe(true);
        expect(Number.isFinite(run.Actual)).toBe(true);
        expect(Number.isFinite(grandTotal.Actual)).toBe(true);
        expect(grandTotal.Actual).toBeCloseTo(delivery.Actual + run.Actual);
        expect(Number.isFinite(delivery.Variance)).toBe(true);
        expect(Number.isFinite(run.Variance)).toBe(true);
        expect(Number.isFinite(grandTotal.Variance)).toBe(true);
        expect(grandTotal.Variance).toBeCloseTo(delivery.Variance + run.Variance);
      }
    });
  });
});
