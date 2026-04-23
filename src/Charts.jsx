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
  const CATEGORIES = [
    { key: "labor", label: "Labor" },
    { key: "te", label: "T&E" },
    { key: "software", label: "Software" },
  ];

  return COST_TYPES.flatMap((costType) =>
    CATEGORIES.map((cat) => {
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


// ─── Tab bar + outer shell ───────────────────────────────────────────────────

const CHART_TABS = [
  { id: "line", label: "Line — Monthly Trend" },
  { id: "bar-monthly", label: "Bar — Monthly Breakdown" },
  { id: "bar-category", label: "Bar — Category Breakdown" },
];

export default function Charts({ budget }) {
  const [activeTab, setActiveTab] = React.useState("line");

  const monthlyRows = buildMonthlyRows(budget);
  const categoryRows = buildCategoryRows(budget);

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
      </div>
    </section>
  );
}
