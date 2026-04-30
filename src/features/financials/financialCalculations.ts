import { MONTHS, COST_TYPES, CATEGORY_CONFIG, SAMPLE_BASES } from "./financialConfig";
import type { BudgetModel, MetricPair } from "./financialTypes";

export function createMetricPair(baseValue: number, monthIndex: number, offset: number): MetricPair {
  const forecast = Math.round(baseValue * (1 + monthIndex * 0.015 + offset));
  const actual = Math.round(forecast * (0.95 + (monthIndex % 4) * 0.02));
  return { forecast, actual };
}

export function createInitialBudget(): BudgetModel {
  // @ts-expect-error: dynamic object construction
  return MONTHS.reduce((months, month, monthIndex) => {
    months[month] = COST_TYPES.reduce((types, costType) => {
      types[costType] = CATEGORY_CONFIG.reduce((categories, category, categoryIndex) => {
        // Delivery categories: always present for both Capital and Expense
        if (category.stream === "Delivery") {
          const baseValue = SAMPLE_BASES[costType][category.key];
          if (category.owners) {
            categories[category.key] = category.owners.reduce((owners, owner, ownerIndex) => {
              owners[owner] = createMetricPair(baseValue[owner], monthIndex, (categoryIndex + ownerIndex) * 0.01);
              return owners;
            }, {});
          } else {
            categories[category.key] = createMetricPair(baseValue, monthIndex, categoryIndex * 0.015);
          }
        } else if (category.stream === "Run") {
          // Run categories: only real values for Expense, zero for Capital
          if (costType === "Expense") {
            const baseValue = SAMPLE_BASES.Expense[category.key];
            categories[category.key] = createMetricPair(baseValue, monthIndex, categoryIndex * 0.015);
          } else {
            // Capital: zero-valued direct entry
            categories[category.key] = { forecast: 0, actual: 0 };
          }
        }
        return categories;
      }, {});
      return types;
    }, {});
    return months;
  }, {});
}

function safeNumber(val: any): number {
  return Number.isFinite(val) ? val : 0;
}

export function sumNode(node: any, metric: string): number {
  if (typeof node?.[metric] === "number") {
    return node[metric];
  }
  return (Object.values(node ?? {}) as any[]).reduce((total: number, child: any) => total + sumNode(child, metric), 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatShare(value: number, total: number): string {
  if (total <= 0) {
    return "0%";
  }
  return `${Math.round((value / total) * 100)}%`;
}

export function getRollupValue(
  budget: any,
  metric: string,
  month: string | null = null,
  costType: string | null = null,
  categoryKey: string | null = null,
  owner: string | null = null
): number {
  if (!month) {
    return MONTHS.reduce(
      (total, currentMonth) => total + getRollupValue(budget, metric, currentMonth, costType, categoryKey, owner),
      0
    );
  }
  if (!costType) {
    return sumNode(budget[month], metric);
  }
  if (!categoryKey) {
    return sumNode(budget[month][costType], metric);
  }
  const categoryNode = budget[month][costType][categoryKey];
  if (!owner) {
    return sumNode(categoryNode, metric);
  }
  return categoryNode[owner][metric];
}

export function createAnnualRollupRows(budget: any) {
  const rows = [
    {
      Level: "Grand Total",
      Period: "Annual",
      "Cost Type": "All",
      Category: "All",
      Allocation: "All",
      Forecast: getRollupValue(budget, "forecast"),
      Actual: getRollupValue(budget, "actual"),
    },
  ];
  COST_TYPES.forEach((costType) => {
    rows.push({
      Level: "Type Total",
      Period: "Annual",
      "Cost Type": costType,
      Category: "All",
      Allocation: "All",
      Forecast: getRollupValue(budget, "forecast", null, costType),
      Actual: getRollupValue(budget, "actual", null, costType),
    });
    CATEGORY_CONFIG.forEach((category) => {
      rows.push({
        Level: "Category Subtotal",
        Period: "Annual",
        "Cost Type": costType,
        Category: category.label,
        Allocation: "All",
        Forecast: getRollupValue(budget, "forecast", null, costType, category.key),
        Actual: getRollupValue(budget, "actual", null, costType, category.key),
      });
      if (category.owners) {
        category.owners.forEach((owner) => {
          rows.push({
            Level: "Detail",
            Period: "Annual",
            "Cost Type": costType,
            Category: category.label,
            Allocation: owner,
            Forecast: getRollupValue(budget, "forecast", null, costType, category.key, owner),
            Actual: getRollupValue(budget, "actual", null, costType, category.key, owner),
          });
        });
        return;
      }
      rows.push({
        Level: "Detail",
        Period: "Annual",
        "Cost Type": costType,
        Category: category.label,
        Allocation: "Direct",
        Forecast: getRollupValue(budget, "forecast", null, costType, category.key),
        Actual: getRollupValue(budget, "actual", null, costType, category.key),
      });
    });
  });
  return rows.map((row) => ({
    ...row,
    Forecast: safeNumber(row.Forecast),
    Actual: safeNumber(row.Actual),
    Variance: safeNumber(row.Actual) - safeNumber(row.Forecast),
  }));
}

export function createMonthlyRollupRows(budget: any) {
  return MONTHS.flatMap((month) => {
    const rows = [
      {
        Level: "Month Total",
        Period: month,
        "Cost Type": "All",
        Category: "All",
        Allocation: "All",
        Forecast: getRollupValue(budget, "forecast", month),
        Actual: getRollupValue(budget, "actual", month),
      },
    ];
    COST_TYPES.forEach((costType) => {
      rows.push({
        Level: "Type Total",
        Period: month,
        "Cost Type": costType,
        Category: "All",
        Allocation: "All",
        Forecast: getRollupValue(budget, "forecast", month, costType),
        Actual: getRollupValue(budget, "actual", month, costType),
      });
      CATEGORY_CONFIG.forEach((category) => {
        rows.push({
          Level: "Category Subtotal",
          Period: month,
          "Cost Type": costType,
          Category: category.label,
          Allocation: "All",
          Forecast: getRollupValue(budget, "forecast", month, costType, category.key),
          Actual: getRollupValue(budget, "actual", month, costType, category.key),
        });
        if (category.owners) {
          category.owners.forEach((owner) => {
            rows.push({
              Level: "Detail",
              Period: month,
              "Cost Type": costType,
              Category: category.label,
              Allocation: owner,
              Forecast: getRollupValue(budget, "forecast", month, costType, category.key, owner),
              Actual: getRollupValue(budget, "actual", month, costType, category.key, owner),
            });
          });
          return;
        }
        rows.push({
          Level: "Detail",
          Period: month,
          "Cost Type": costType,
          Category: category.label,
          Allocation: "Direct",
          Forecast: getRollupValue(budget, "forecast", month, costType, category.key),
          Actual: getRollupValue(budget, "actual", month, costType, category.key),
        });
      });
    });
    return rows.map((row) => ({
      ...row,
      Forecast: safeNumber(row.Forecast),
      Actual: safeNumber(row.Actual),
      Variance: safeNumber(row.Actual) - safeNumber(row.Forecast),
    }));
  });
}

export function varianceClassName(variance: number): string {
  if (variance > 0) {
    return "variance variance-over";
  }
  if (variance < 0) {
    return "variance variance-under";
  }
  return "variance";
}
