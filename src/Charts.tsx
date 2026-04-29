import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const COST_TYPES = ["Capital", "Expense"];
const ALLOCATIONS = ["Business", "Eaton IT", "External IT"];
const CATEGORIES = [
  { key: "labor", label: "Labor", allocations: ALLOCATIONS },
  { key: "te", label: "T&E", allocations: ALLOCATIONS },
  { key: "software", label: "Software", allocations: ["Direct"] },
];

function sumNode(node, metric) {
  if (typeof node?.[metric] === "number") return node[metric];
  return Object.values(node ?? {}).reduce((t, c) => t + sumNode(c, metric), 0);
}

function formatK(value) {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function formatTooltipDollar(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const PALETTE = {
  forecastAll: "#b58e4f",
  actualAll: "#497261",
  forecastCapital: "#34596b",
  actualCapital: "#6ab0cc",
  forecastExpense: "#c96a3d",
  actualExpense: "#e8a87c",
  varianceLine: "#a3392e",
};

function buildMonthlyRows(budget) {
  return MONTHS.map((month) => {
    const forecast = sumNode(budget[month], "forecast");
    const actual = sumNode(budget[month], "actual");
    const capitalForecast = sumNode(budget[month].Capital, "forecast");
    const capitalActual = sumNode(budget[month].Capital, "actual");
    const expenseForecast = sumNode(budget[month].Expense, "forecast");
    const expenseActual = sumNode(budget[month].Expense, "actual");

    return {
      month,
      forecast,
      actual,
      variance: actual - forecast,
      capitalForecast,
      capitalActual,
      expenseForecast,
      expenseActual,
    };
  });
}

function buildCategoryRows(budget) {
  const categoryList = [
    { key: "labor", label: "Labor" },
    { key: "te", label: "T&E" },
    { key: "software", label: "Software" },
  ];

  return COST_TYPES.flatMap((costType) =>
    categoryList.map((cat) => {
      const forecast = MONTHS.reduce(
        (t, m) => t + sumNode(budget[m][costType][cat.key], "forecast"),
        0
      );
      const actual = MONTHS.reduce(
        (t, m) => t + sumNode(budget[m][costType][cat.key], "actual"),
        0
      );

      return {
        name: `${costType} – ${cat.label}`,
        forecast,
        actual,
        variance: actual - forecast,
      };
    })
  );
}

// ─── Chart type components ──────────────────────────────────────────────────

function TrendLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={data} margin={{ top: 8, right: 32, bottom: 8, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,33,38,0.08)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatK} tick={{ fontSize: 12 }} width={70} />
        <Tooltip
          formatter={(value, name) => [formatTooltipDollar(value), name]}
          contentStyle={{ borderRadius: 14, border: "1px solid rgba(24,33,38,0.1)", fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: "1rem" }} />
        <ReferenceLine y={0} stroke={PALETTE.varianceLine} strokeDasharray="4 2" />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Total Forecast"
          stroke={PALETTE.forecastAll}
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Total Actual"
          stroke={PALETTE.actualAll}
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="capitalForecast"
          name="Capital Forecast"
          stroke={PALETTE.forecastCapital}
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="capitalActual"
          name="Capital Actual"
          stroke={PALETTE.actualCapital}
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="expenseForecast"
          name="Expense Forecast"
          stroke={PALETTE.forecastExpense}
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="expenseActual"
          name="Expense Actual"
          stroke={PALETTE.actualExpense}
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CategoryBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={data} margin={{ top: 8, right: 32, bottom: 48, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,33,38,0.08)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          angle={-25}
          textAnchor="end"
          interval={0}
        />
        <YAxis tickFormatter={formatK} tick={{ fontSize: 12 }} width={70} />
        <Tooltip
          formatter={(value, name) => [formatTooltipDollar(value), name]}
          contentStyle={{ borderRadius: 14, border: "1px solid rgba(24,33,38,0.1)", fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: "3.5rem" }} />
        <ReferenceLine y={0} stroke={PALETTE.varianceLine} />
        <Bar dataKey="forecast" name="Annual Forecast" fill={PALETTE.forecastAll} radius={[6, 6, 0, 0]} />
        <Bar dataKey="actual" name="Annual Actual" fill={PALETTE.actualAll} radius={[6, 6, 0, 0]} />
        <Bar dataKey="variance" name="Variance" fill={PALETTE.varianceLine} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function MonthlyBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={data} margin={{ top: 8, right: 32, bottom: 8, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,33,38,0.08)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatK} tick={{ fontSize: 12 }} width={70} />
        <Tooltip
          formatter={(value, name) => [formatTooltipDollar(value), name]}
          contentStyle={{ borderRadius: 14, border: "1px solid rgba(24,33,38,0.1)", fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: "1rem" }} />
        <ReferenceLine y={0} stroke={PALETTE.varianceLine} />
        <Bar dataKey="capitalForecast" name="Capital Forecast" fill={PALETTE.forecastCapital} radius={[4, 4, 0, 0]} />
        <Bar dataKey="capitalActual" name="Capital Actual" fill={PALETTE.actualCapital} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenseForecast" name="Expense Forecast" fill={PALETTE.forecastExpense} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenseActual" name="Expense Actual" fill={PALETTE.actualExpense} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function getBowlingStatusMark(row) {
  if (row.forecast <= 0) {
    return { label: "N/A", className: "bowling-mark-na" };
  }

  const varianceRatio = row.variance / row.forecast;

  if (varianceRatio <= -0.05) {
    return { label: "X", className: "bowling-mark-strike" };
  }

  if (varianceRatio < 0) {
    return { label: "/", className: "bowling-mark-spare" };
  }

  if (varianceRatio <= 0.03) {
    return { label: "|", className: "bowling-mark-even" };
  }

  return { label: "-", className: "bowling-mark-open" };
}

function getAllocationMetricForMonth(budget, month, scope, categoryKey, allocation, metric) {
  const scopes = scope === "Total" ? COST_TYPES : [scope];

  return scopes.reduce((scopeTotal, costType) => {
    const categoryNode = budget[month][costType][categoryKey];

    if (allocation === "Direct") {
      return scopeTotal + (categoryNode?.[metric] ?? 0);
    }

    return scopeTotal + (categoryNode?.[allocation]?.[metric] ?? 0);
  }, 0);
}

function buildBowlingBreakdownRows(budget) {
  const scopeOrder = ["Expense", "Capital", "Total"];

  return scopeOrder.flatMap((scope) =>
    CATEGORIES.flatMap((category) =>
      category.allocations.map((allocation) => {
        const months = MONTHS.map((month) => {
          const forecast = getAllocationMetricForMonth(budget, month, scope, category.key, allocation, "forecast");
          const actual = getAllocationMetricForMonth(budget, month, scope, category.key, allocation, "actual");

          return {
            month,
            forecast,
            actual,
            variance: actual - forecast,
          };
        });

        const annualForecast = months.reduce((total, monthRow) => total + monthRow.forecast, 0);
        const annualActual = months.reduce((total, monthRow) => total + monthRow.actual, 0);

        return {
          scope,
          category: category.label,
          allocation,
          months,
          annualForecast,
          annualActual,
          annualVariance: annualActual - annualForecast,
        };
      })
    )
  );
}

function BowlingTableChart({ rows }) {
  const monthlyTotals = MONTHS.map((month) => {
    const forecast = rows.reduce((total, row) => total + row.months.find((monthRow) => monthRow.month === month).forecast, 0);
    const actual = rows.reduce((total, row) => total + row.months.find((monthRow) => monthRow.month === month).actual, 0);

    return {
      month,
      forecast,
      actual,
      variance: actual - forecast,
    };
  });

  const totalAnnualForecast = rows.reduce((total, row) => total + row.annualForecast, 0);
  const totalAnnualActual = rows.reduce((total, row) => total + row.annualActual, 0);
  const totalAnnualVariance = totalAnnualActual - totalAnnualForecast;

  return (
    <div className="bowling-wrap">
      <div className="bowling-legend">
        <span><strong>X</strong> strong under forecast</span>
        <span><strong>/</strong> slightly under forecast</span>
        <span><strong>|</strong> on plan (+/-3%)</span>
        <span><strong>-</strong> over forecast</span>
      </div>

      <div className="bowling-scroll">
        <table className="bowling-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Allocation</th>
              {MONTHS.map((month) => (
                <th key={month}>{month}</th>
              ))}
              <th>Annual F</th>
              <th>Annual A</th>
              <th>Annual V</th>
              <th>Annual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const annualMark = getBowlingStatusMark({
                forecast: row.annualForecast,
                variance: row.annualVariance,
              });

              return (
                <tr key={`${row.scope}-${row.category}-${row.allocation}`}>
                  <th>{row.scope}</th>
                  <td>{row.category}</td>
                  <td>{row.allocation}</td>
                  {row.months.map((monthRow) => {
                    const mark = getBowlingStatusMark(monthRow);

                    return (
                      <td key={`${row.scope}-${row.category}-${row.allocation}-${monthRow.month}`}>
                        <span
                          className={`bowling-mark ${mark.className}`}
                          title={`Forecast ${formatTooltipDollar(monthRow.forecast)} | Actual ${formatTooltipDollar(monthRow.actual)} | Variance ${formatTooltipDollar(monthRow.variance)}`}
                        >
                          {mark.label}
                        </span>
                      </td>
                    );
                  })}
                  <td className="bowling-total-cell">{formatK(row.annualForecast)}</td>
                  <td className="bowling-total-cell">{formatK(row.annualActual)}</td>
                  <td className={`bowling-total-cell ${row.annualVariance > 0 ? "bowling-over" : "bowling-under"}`}>
                    {formatK(row.annualVariance)}
                  </td>
                  <td className="bowling-total-cell">
                    <span className={`bowling-mark ${annualMark.className}`}>{annualMark.label}</span>
                  </td>
                </tr>
              );
            })}
            <tr className="bowling-grand-total-row">
              <th colSpan={3}>Grand Total</th>
              {monthlyTotals.map((monthRow) => {
                const mark = getBowlingStatusMark(monthRow);

                return (
                  <td key={`grand-${monthRow.month}`}>
                    <span
                      className={`bowling-mark ${mark.className}`}
                      title={`Forecast ${formatTooltipDollar(monthRow.forecast)} | Actual ${formatTooltipDollar(monthRow.actual)} | Variance ${formatTooltipDollar(monthRow.variance)}`}
                    >
                      {mark.label}
                    </span>
                  </td>
                );
              })}
              <td className="bowling-total-cell">{formatK(totalAnnualForecast)}</td>
              <td className="bowling-total-cell">{formatK(totalAnnualActual)}</td>
              <td className={`bowling-total-cell ${totalAnnualVariance > 0 ? "bowling-over" : "bowling-under"}`}>
                {formatK(totalAnnualVariance)}
              </td>
              <td className="bowling-total-cell">
                <span
                  className={`bowling-mark ${getBowlingStatusMark({ forecast: totalAnnualForecast, variance: totalAnnualVariance }).className}`}
                >
                  {getBowlingStatusMark({ forecast: totalAnnualForecast, variance: totalAnnualVariance }).label}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ─── Tab bar + outer shell ───────────────────────────────────────────────────

const CHART_TABS = [
  { id: "line", label: "Line — Monthly Trend" },
  { id: "bar-monthly", label: "Bar — Monthly Breakdown" },
  { id: "bar-category", label: "Bar — Category Breakdown" },
  { id: "bowling-table", label: "Table — Bowling Style" },
];

export default function Charts({ budget }) {
  const [activeTab, setActiveTab] = React.useState("line");

  const monthlyRows = buildMonthlyRows(budget);
  const categoryRows = buildCategoryRows(budget);
  const bowlingRows = buildBowlingBreakdownRows(budget);

  return (
    <section className="charts-panel">
      <div className="charts-header">
        <div>
          <p className="eyebrow">Data visualisation</p>
          <h2>Chart Views</h2>
        </div>
        <div className="chart-tabs" role="tablist">
          {CHART_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={activeTab === tab.id}
              className={`chart-tab${activeTab === tab.id ? " chart-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-body" role="tabpanel">
        {activeTab === "line" && (
          <>
            <p className="chart-body-desc">Monthly forecast vs actual for total spend, with Capital and Expense breakdown lines.</p>
            <TrendLineChart data={monthlyRows} />
          </>
        )}
        {activeTab === "bar-monthly" && (
          <>
            <p className="chart-body-desc">Monthly Capital and Expense forecast vs actual side-by-side.</p>
            <MonthlyBarChart data={monthlyRows} />
          </>
        )}
        {activeTab === "bar-category" && (
          <>
            <p className="chart-body-desc">Annual forecast vs actual broken down by cost type and category. Variance bars highlight over/under positions.</p>
            <CategoryBarChart data={categoryRows} />
          </>
        )}
        {activeTab === "bowling-table" && (
          <>
            <p className="chart-body-desc">Bowling-style monthly scorecard split by Expense, Capital, and Total with cost-category and allocation breakdowns.</p>
            <BowlingTableChart rows={bowlingRows} />
          </>
        )}
      </div>
    </section>
  );
}
