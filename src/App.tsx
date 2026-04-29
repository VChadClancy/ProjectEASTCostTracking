import React from "react";
import * as XLSX from "xlsx";
import Charts from "./Charts";
import { MONTHS, COST_TYPES, OWNERS, CATEGORY_CONFIG } from "./features/financials/financialConfig";
import {
  createMetricPair,
  createInitialBudget,
  sumNode,
  formatCurrency,
  formatShare,
  getRollupValue,
  createAnnualRollupRows,
  createMonthlyRollupRows,
  varianceClassName,
} from "./features/financials/financialCalculations";
import { exportCsv, exportExcel } from "./features/financials/exportService";
import { getInitialBudget } from "./features/financials/financialService";

function App() {
  const [projectName, setProjectName] = React.useState("Project EAST Budget");
  const [budget, setBudget] = React.useState(() => getInitialBudget());

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
    setBudget(getInitialBudget());
  }

  function exportCsvHandler() {
    exportCsv(projectName, annualRollupRows, monthlyRollupRows);
  }

  function exportExcelHandler() {
    exportExcel(projectName, annualRollupRows, monthlyRollupRows);
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
            <button type="button" className="secondary-button" onClick={exportCsvHandler}>
              Export CSV
            </button>
            <button type="button" className="primary-button" onClick={exportExcelHandler}>
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

                            // Fix: Only access .forecast/.actual if not an owners category
                            if (
                              categoryNode &&
                              typeof (categoryNode as any).forecast === "number" &&
                              typeof (categoryNode as any).actual === "number"
                            ) {
                              const directNode = categoryNode as { forecast: number; actual: number };
                              return (
                                <tr key={category.key}>
                                  <td data-label="Category">{category.label}</td>
                                  <td data-label="Allocation">Direct</td>
                                  <td data-label="Forecast">
                                    <input
                                      type="number"
                                      min="0"
                                      step="100"
                                      value={directNode.forecast}
                                      onChange={(event) => updateValue(month, costType, category.key, null, "forecast", event.target.value)}
                                    />
                                  </td>
                                  <td data-label="Actual">
                                    <input
                                      type="number"
                                      min="0"
                                      step="100"
                                      value={directNode.actual}
                                      onChange={(event) => updateValue(month, costType, category.key, null, "actual", event.target.value)}
                                    />
                                  </td>
                                  <td data-label="Variance" className={varianceClassName(categoryVariance)}>
                                    {formatCurrency(categoryVariance)}
                                  </td>
                                </tr>
                              );
                            }
                            return null;
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