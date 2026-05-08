// Forecast Comparison Page Model for Sprint 15
// Structure only, no data fetching or UI logic

export type ForecastComparisonSectionStatus = 'active' | 'preview' | 'future' | 'placeholder';

export interface ForecastComparisonSection {
  id: string;
  title: string;
  description: string;
  order: number;
  capabilityArea: string;
  status: ForecastComparisonSectionStatus;
}

export const forecastComparisonSections: ForecastComparisonSection[] = [
  {
    id: 'comparisonHeader',
    title: 'Comparison Header',
    description: 'Top-level summary and context for the forecast comparison.',
    order: 1,
    capabilityArea: 'summary',
    status: 'active',
  },
  {
    id: 'versionPairSelector',
    title: 'Version Pair Selector',
    description: 'Selects the current and comparison forecast versions.',
    order: 2,
    capabilityArea: 'versioning',
    status: 'active',
  },
  {
    id: 'deltaSummaryCards',
    title: 'Delta Summary Cards',
    description: 'Key delta metrics and signals at-a-glance.',
    order: 3,
    capabilityArea: 'summary',
    status: 'active',
  },
  {
    id: 'monthlyMovementSummary',
    title: 'Monthly Movement Summary',
    description: 'Summarizes material movement by month.',
    order: 4,
    capabilityArea: 'trend',
    status: 'active',
  },
  {
    id: 'groupedDeltaPanels',
    title: 'Grouped Delta Panels',
    description: 'Panels for grouped delta drill-downs.',
    order: 5,
    capabilityArea: 'drilldown',
    status: 'active',
  },
  {
    id: 'projectDeltas',
    title: 'Project Deltas',
    description: 'Delta breakdown grouped by project.',
    order: 6,
    capabilityArea: 'drilldown',
    status: 'preview',
  },
  {
    id: 'carDeltas',
    title: 'CAR Deltas',
    description: 'Delta breakdown grouped by CAR.',
    order: 7,
    capabilityArea: 'drilldown',
    status: 'preview',
  },
  {
    id: 'budgetStreamDeltas',
    title: 'Budget Stream Deltas',
    description: 'Delta breakdown grouped by budget stream.',
    order: 8,
    capabilityArea: 'drilldown',
    status: 'preview',
  },
  {
    id: 'costCategoryDeltas',
    title: 'Cost Category Deltas',
    description: 'Delta breakdown grouped by cost category.',
    order: 9,
    capabilityArea: 'drilldown',
    status: 'preview',
  },
  {
    id: 'deltaSignalsDetail',
    title: 'Delta Signals Detail',
    description: 'Detailed view of delta signals and drivers.',
    order: 10,
    capabilityArea: 'detail',
    status: 'active',
  },
  {
    id: 'readOnlyComparisonPreview',
    title: 'Read-Only Comparison Preview',
    description: 'Preview of the comparison in read-only mode.',
    order: 11,
    capabilityArea: 'preview',
    status: 'preview',
  },
];

export function getForecastComparisonSections(): ForecastComparisonSection[] {
  return forecastComparisonSections.slice();
}

export function getPrimaryForecastComparisonSections(): ForecastComparisonSection[] {
  // MED guidance: 3–6 primary modules visible by default (active, order <= 5)
  return forecastComparisonSections.filter(
    (section) => section.status === 'active' && section.order <= 5
  );
}

export function getPreviewForecastComparisonSections(): ForecastComparisonSection[] {
  return forecastComparisonSections.filter((section) => section.status === 'preview');
}

export function getFutureForecastComparisonSections(): ForecastComparisonSection[] {
  return forecastComparisonSections.filter((section) => section.status === 'future');
}
