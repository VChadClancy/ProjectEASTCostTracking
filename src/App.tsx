import React from "react";
import * as XLSX from "xlsx";
import Charts from "./Charts";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const COST_TYPES = ["Capital", "Expense"];
const OWNERS = ["Business", "Eaton IT", "External IT"];
const CATEGORY_CONFIG = [
  { key: "labor", label: "Labor", owners: OWNERS },
  { key: "te", label: "T&E", owners: OWNERS },
  { key: "software", label: "Software", owners: null },
];

const SAMPLE_BASES = {
  Capital: {
    labor: { Business: 12000, "Eaton IT": 16000, "External IT": 22000 },
    te: { Business: 1800, "Eaton IT": 2300, "External IT": 3600 },
    software: 9000,
  },
  Expense: {
    labor: { Business: 9000, "Eaton IT": 13000, "External IT": 17500 },
    te: { Business: 1400, "Eaton IT": 1900, "External IT": 2800 },
    software: 7000,
  },
};

function createMetricPair(baseValue, monthIndex, offset) {
  const forecast = Math.round(baseValue * (1 + monthIndex * 0.015 + offset));
  const actual = Math.round(forecast * (0.95 + (monthIndex % 4) * 0.02));

  return { forecast, actual };
}

function createInitialBudget() {
  return MONTHS.reduce((months, month, monthIndex) => {
    months[month] = COST_TYPES.reduce((types, costType) => {
      types[costType] = CATEGORY_CONFIG.reduce((categories, category, categoryIndex) => {
        const baseValue = SAMPLE_BASES[costType][category.key];

        if (category.owners) {
          categories[category.key] = category.owners.reduce((owners, owner, ownerIndex) => {
            owners[owner] = createMetricPair(baseValue[owner], monthIndex, (categoryIndex + ownerIndex) * 0.01);
            return owners;
          }, {});
        } else {
          categories[category.key] = createMetricPair(baseValue, monthIndex, categoryIndex * 0.015);
        }

        return categories;
      }, {});

      return types;
    }, {});

    return months;
  }, {});
}

function sumNode(node, metric) {
  if (typeof node?.[metric] === "number") {
    return node[metric];
  }

  return Object.values(node ?? {}).reduce((total, child) => total + sumNode(child, metric), 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatShare(value, total) {
  if (total <= 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

function createFileSafeName(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "project-budget";
}

function getRollupValue(
  budget: any,
  metric: string,
  month: string | null = null,
  costType: string | null = null,
  categoryKey: string | null = null,
  owner: string | null = null
) {
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

function createAnnualRollupRows(budget) {
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
    Variance: row.Actual - row.Forecast,
  }));
}

function createMonthlyRollupRows(budget) {
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
      Variance: row.Actual - row.Forecast,
    }));
  });
}

function downloadFile(fileContent, fileName, mimeType) {
  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke on the next task so the browser can finish the download first.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function varianceClassName(variance) {
  if (variance > 0) {
    return "variance variance-over";
  }

  if (variance < 0) {
    return "variance variance-under";
  }

  return "variance";
}

function App() {
  const [projectName, setProjectName] = React.useState("Project EAST Budget");
  const [budget, setBudget] = React.useState(() => createInitialBudget());

  const annualForecast = MONTHS.reduce((total, month) => total + sumNode(budget[month], "forecast"), 0);
  const annualActual = MONTHS.reduce((total, month) => total + sumNode(budget[month], "actual"), 0);
  const annualVariance = annualActual - annualForecast;

  const capitalForecast = MONTHS.reduce((total, month) => total + sumNode(budget[month].Capital, "forecast"), 0);
  const capitalActual = MONTHS.reduce((total, month) => total + sumNode(budget[month].Capital, "actual"), 0);
  const expenseForecast = MONTHS.reduce((total, month) => total + sumNode(budget[month].Expense, "forecast"), 0);
  const expenseActual = MONTHS.reduce((total, month) => total + sumNode(budget[month].Expense, "actual"), 0);
  const annualRollupRows = createAnnualRollupRows(budget);
  const monthlyRollupRows = createMonthlyRollupRows(budget);

  function updateValue(month, costType, categoryKey, owner, metric, nextValue) {
    const parsedValue = Number(nextValue);
    const safeValue = Number.isFinite(parsedValue) ? parsedValue : 0;

    setBudget((currentBudget) => ({
      ...currentBudget,
      [month]: {
        ...currentBudget[month],
        [costType]: {
          ...currentBudget[month][costType],
          [categoryKey]: owner
            ? {
                ...currentBudget[month][costType][categoryKey],
                [owner]: {
                  ...currentBudget[month][costType][categoryKey][owner],
                  [metric]: safeValue,
                },
              }
            : {
                ...currentBudget[month][costType][categoryKey],
                [metric]: safeValue,
              },
        },
      },
    }));
  }

  function resetBudget() {
    setBudget(createInitialBudget());
  }

  function exportCsv() {
    const fileBaseName = createFileSafeName(projectName);
    const combinedRows = [
      ...annualRollupRows.map((row) => ({ Scope: "Annual", ...row })),
      ...monthlyRollupRows.map((row) => ({ Scope: "Monthly", ...row })),
    ];
    const worksheet = XLSX.utils.json_to_sheet(combinedRows, {
      header: ["Scope", "Level", "Period", "Cost Type", "Category", "Allocation", "Forecast", "Actual", "Variance"],
    });
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);

    downloadFile(csvContent, `${fileBaseName}-rollups.csv`, "text/csv;charset=utf-8;");
  }

  function exportExcel() {
    const fileBaseName = createFileSafeName(projectName);
    const workbook = XLSX.utils.book_new();
    const annualWorksheet = XLSX.utils.json_to_sheet(annualRollupRows, {
      header: ["Level", "Period", "Cost Type", "Category", "Allocation", "Forecast", "Actual", "Variance"],
    });
    const monthlyWorksheet = XLSX.utils.json_to_sheet(monthlyRollupRows, {
      header: ["Level", "Period", "Cost Type", "Category", "Allocation", "Forecast", "Actual", "Variance"],
    });

    XLSX.utils.book_append_sheet(workbook, annualWorksheet, "Annual Rollup");
    XLSX.utils.book_append_sheet(workbook, monthlyWorksheet, "Monthly Rollup");

    XLSX.writeFile(workbook, `${fileBaseName}-rollups.xlsx`);
  }

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Forecast vs Actuals</p>
          <input
            className="project-name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            aria-label="Project name"
          />
          <p className="hero-copy">
            Track monthly budget buckets across Capital and Expense with category-level detail for Labor, T&amp;E,
            and Software.
          </p>
        </div>
        <div className="hero-actions">
          <div className="hero-button-group">
            <button type="button" className="secondary-button" onClick={resetBudget}>
              Reset sample data
            </button>
            <button type="button" className="secondary-button" onClick={exportCsv}>
              Export CSV
            </button>
            <button type="button" className="primary-button" onClick={exportExcel}>
              Export Excel
            </button>
          </div>
          <div className="hero-note">
            <span>Exports include annual and monthly rollups</span>
            <strong>Business, Eaton IT, External IT</strong>
          </div>
        </div>
      </header>

      <section className="summary-grid" aria-label="Annual summary">
        <article className="summary-card accent-sand">
          <span>Annual Forecast</span>
          <strong>{formatCurrency(annualForecast)}</strong>
          <small>All monthly buckets</small>
        </article>
        <article className="summary-card accent-slate">
          <span>Annual Actual</span>
          <strong>{formatCurrency(annualActual)}</strong>
          <small>Current posted spend</small>
        </article>
        <article className="summary-card accent-sage">
          <span>Annual Variance</span>
          <strong className={varianceClassName(annualVariance)}>{formatCurrency(annualVariance)}</strong>
          <small>Actual minus forecast</small>
        </article>
        <article className="summary-card accent-ink">
          <span>Capital / Expense Mix</span>
          <strong>
            {formatShare(capitalForecast, annualForecast)} / {formatShare(expenseForecast, annualForecast)}
          </strong>
          <small>Based on forecast totals</small>
        </article>
      </section>

      <section className="rollup-panel">
        <div className="section-heading">
          <h2>Annual Rollup</h2>
          <p>Compare the total forecast and actual position for Capital and Expense.</p>
        </div>
        <div className="type-rollups">
          {[
            {
              name: "Capital",
              forecast: capitalForecast,
              actual: capitalActual,
            },
            {
              name: "Expense",
              forecast: expenseForecast,
              actual: expenseActual,
            },
          ].map((item) => {
            const variance = item.actual - item.forecast;

            return (
              <article key={item.name} className="type-rollup-card">
                <h3>{item.name}</h3>
                <dl>
                  <div>
                    <dt>Forecast</dt>
                    <dd>{formatCurrency(item.forecast)}</dd>
                  </div>
                  <div>
                    <dt>Actual</dt>
                    <dd>{formatCurrency(item.actual)}</dd>
                  </div>
                  <div>
                    <dt>Variance</dt>
                    <dd className={varianceClassName(variance)}>{formatCurrency(variance)}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      <Charts budget={budget} />

      <section className="month-jump-list" aria-label="Monthly jump links">
        {MONTHS.map((month) => (
          <a key={month} href={`#month-${month}`} className="month-chip">
            {month}
          </a>
        ))}
      </section>

      <section className="monthly-grid">
        {MONTHS.map((month) => {
          const monthForecast = sumNode(budget[month], "forecast");
          const monthActual = sumNode(budget[month], "actual");
          const monthVariance = monthActual - monthForecast;

          return (
            <article key={month} id={`month-${month}`} className="month-card">
              <div className="month-card-header">
                <div>
                  <p className="eyebrow">Monthly bucket</p>
                  <h2>{month}</h2>
                </div>
                <div className="month-card-totals">
                  <span>Forecast {formatCurrency(monthForecast)}</span>
                  <span>Actual {formatCurrency(monthActual)}</span>
                  <span className={varianceClassName(monthVariance)}>Variance {formatCurrency(monthVariance)}</span>
                </div>
              </div>

              <div className="type-panels">
                {COST_TYPES.map((costType) => {
                  const typeForecast = sumNode(budget[month][costType], "forecast");
                  const typeActual = sumNode(budget[month][costType], "actual");
                  const typeVariance = typeActual - typeForecast;

                  return (
                    <section key={costType} className="type-panel">
                      <div className="type-panel-header">
                        <div>
                          <h3>{costType}</h3>
                          <p>Labor and T&amp;E are split by ownership. Software is tracked as a single line.</p>
                        </div>
                        <div className="type-panel-summary">
                          <span>{formatCurrency(typeForecast)} forecast</span>
                          <span>{formatCurrency(typeActual)} actual</span>
                          <span className={varianceClassName(typeVariance)}>{formatCurrency(typeVariance)} variance</span>
                        </div>
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Allocation</th>
                            <th>Forecast</th>
                            <th>Actual</th>
                            <th>Variance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CATEGORY_CONFIG.map((category) => {
                            const categoryNode = budget[month][costType][category.key];
                            const categoryForecast = sumNode(categoryNode, "forecast");
                            const categoryActual = sumNode(categoryNode, "actual");
                            const categoryVariance = categoryActual - categoryForecast;

                            if (category.owners) {
                              return category.owners.map((owner, ownerIndex) => {
                                const ownerNode = categoryNode[owner];
                                const ownerVariance = ownerNode.actual - ownerNode.forecast;

                                return (
                                  <tr key={`${category.key}-${owner}`}>
                                    <td data-label="Category">{ownerIndex === 0 ? category.label : ""}</td>
                                    <td data-label="Allocation">{owner}</td>
                                    <td data-label="Forecast">
                                      <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={ownerNode.forecast}
                                        onChange={(event) =>
                                          updateValue(month, costType, category.key, owner, "forecast", event.target.value)
                                        }
                                      />
                                    </td>
                                    <td data-label="Actual">
                                      <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={ownerNode.actual}
                                        onChange={(event) =>
                                          updateValue(month, costType, category.key, owner, "actual", event.target.value)
                                        }
                                      />
                                    </td>
                                    <td data-label="Variance" className={varianceClassName(ownerVariance)}>
                                      {formatCurrency(ownerVariance)}
                                    </td>
                                  </tr>
                                );
                              }).concat(
                                <tr key={`${category.key}-total`} className="subtotal-row">
                                  <td data-label="Category" colSpan={2}>{category.label} subtotal</td>
                                  <td data-label="Forecast">{formatCurrency(categoryForecast)}</td>
                                  <td data-label="Actual">{formatCurrency(categoryActual)}</td>
                                  <td data-label="Variance" className={varianceClassName(categoryVariance)}>
                                    {formatCurrency(categoryVariance)}
                                  </td>
                                </tr>
                              );
                            }

                            return (
                              <tr key={category.key}>
                                <td data-label="Category">{category.label}</td>
                                <td data-label="Allocation">Direct</td>
                                <td data-label="Forecast">
                                  <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={categoryNode.forecast}
                                    onChange={(event) => updateValue(month, costType, category.key, null, "forecast", event.target.value)}
                                  />
                                </td>
                                <td data-label="Actual">
                                  <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={categoryNode.actual}
                                    onChange={(event) => updateValue(month, costType, category.key, null, "actual", event.target.value)}
                                  />
                                </td>
                                <td data-label="Variance" className={varianceClassName(categoryVariance)}>
                                  {formatCurrency(categoryVariance)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </section>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default App;