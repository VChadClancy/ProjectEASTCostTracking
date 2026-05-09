// Forecast Snapshot Detail Drawer model for Sprint 16
// MED-aligned, read-only, no edit/approval/AI controls

export type ForecastSnapshotDetailDrawerSectionStatus =
  | 'active'
  | 'preview'
  | 'future'
  | 'placeholder';

export interface ForecastSnapshotDetailDrawerSection {
  id: string;
  title: string;
  description: string;
  order: number;
  capabilityArea: string;
  status: ForecastSnapshotDetailDrawerSectionStatus;
}

export const forecastSnapshotDetailDrawerSections: ForecastSnapshotDetailDrawerSection[] = [
  {
    id: 'drawerHeader',
    title: 'Snapshot Detail',
    description: 'Header for the forecast snapshot detail drawer',
    order: 1,
    capabilityArea: 'summary',
    status: 'active',
  },
  {
    id: 'selectedLineSummary',
    title: 'Selected Line Summary',
    description: 'Summary of the selected forecast snapshot line',
    order: 2,
    capabilityArea: 'summary',
    status: 'active',
  },
  {
    id: 'financialValues',
    title: 'Financial Values',
    description: 'Forecast, actual, budget, and variance values',
    order: 3,
    capabilityArea: 'financials',
    status: 'active',
  },
  {
    id: 'monthlyContext',
    title: 'Monthly Context',
    description: 'Preview of monthly values for the selected line',
    order: 4,
    capabilityArea: 'context',
    status: 'active',
  },
  {
    id: 'classificationDetails',
    title: 'Classification Details',
    description: 'Project, CAR, cost category, budget stream',
    order: 5,
    capabilityArea: 'classification',
    status: 'active',
  },
  {
    id: 'versionSourceMetadata',
    title: 'Version / Source Metadata',
    description: 'Version, source, and status metadata',
    order: 6,
    capabilityArea: 'metadata',
    status: 'preview',
  },
  {
    id: 'deltaContext',
    title: 'Delta Context',
    description: 'Delta values and context if available',
    order: 7,
    capabilityArea: 'delta',
    status: 'preview',
  },
  {
    id: 'closeAction',
    title: 'Close',
    description: 'Close or back action for the drawer',
    order: 99,
    capabilityArea: 'interaction',
    status: 'active',
  },
];

export function getForecastSnapshotDetailSections() {
  return forecastSnapshotDetailDrawerSections;
}

export function getPrimaryForecastSnapshotDetailSections() {
  return forecastSnapshotDetailDrawerSections.filter(
    (s) => s.status === 'active'
  );
}

export function getPreviewForecastSnapshotDetailSections() {
  return forecastSnapshotDetailDrawerSections.filter(
    (s) => s.status === 'preview'
  );
}

export function getFutureForecastSnapshotDetailSections() {
  return forecastSnapshotDetailDrawerSections.filter(
    (s) => s.status === 'future'
  );
}

// View model for selected snapshot detail (read-only)
export interface ForecastSnapshotSelectedLineDetailViewModel {
  selectedLineId?: string;
  project: string;
  car: string;
  month: string;
  costCategory: string;
  budgetStream: string;
  forecast: number;
  actual: number;
  budget: number;
  variance: number;
  variancePercent?: number;
  versionName: string;
  versionKind: string;
  versionStatus: string;
  sourceLabel?: string;
  sourceMetadata?: string;
  deltaAmount?: number;
  deltaPercent?: number;
  severity?: string;
  isReadOnly: true;
}

// Extended view model for formatted display fields (for adapter only)
export interface ForecastSnapshotSelectedLineDetailViewModelWithFormatted extends ForecastSnapshotSelectedLineDetailViewModel {
  formattedForecast?: string;
  formattedActual?: string;
  formattedBudget?: string;
  formattedVariance?: string;
  formattedVariancePercent?: string;
  formattedDeltaAmount?: string;
  formattedDeltaPercent?: string;
}

// Render model for the drawer (excludes unsupported labels and forecastVersionId)
export interface ForecastSnapshotDetailDrawerRenderModel {
  sections: ForecastSnapshotDetailDrawerSection[];
  selectedLineDetail: ForecastSnapshotSelectedLineDetailViewModel;
}

export function getForecastSnapshotDetailRenderModel(
  selectedLineDetail: ForecastSnapshotSelectedLineDetailViewModel
): ForecastSnapshotDetailDrawerRenderModel {
  return {
    sections: forecastSnapshotDetailDrawerSections,
    selectedLineDetail,
  };
}
