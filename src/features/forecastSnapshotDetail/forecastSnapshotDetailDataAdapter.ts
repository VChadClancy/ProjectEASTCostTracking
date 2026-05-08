// Forecast Snapshot Detail Data Adapter for Sprint 16
// Pure transformation, no data fetching or backend calls
import {
  ForecastSnapshotSelectedLineDetailViewModel,
  ForecastSnapshotSelectedLineDetailViewModelWithFormatted,
} from './forecastSnapshotDetailModel';
import { formatCurrency, formatPercent } from '../../utils/formatCurrency';

// Types for input data (minimal, align with forecast management/preview types)
export interface SnapshotLineInput {
  selectedLineId?: string;
  project?: string;
  car?: string;
  month?: string;
  costCategory?: string;
  budgetStream?: string;
  forecast?: number | null;
  actual?: number | null;
  budget?: number | null;
  variance?: number | null;
  variancePercent?: number | null;
  versionName?: string;
  versionKind?: string;
  versionStatus?: string;
  sourceLabel?: string;
  sourceMetadata?: string;
  deltaAmount?: number | null;
  deltaPercent?: number | null;
  severity?: string;
  // forbidden: forecastVersionId, raw internal id, raw JSON
}

// Helper: safe finite number or fallback
function safeNumber(val: unknown, fallback = 0): number {
  return typeof val === 'number' && isFinite(val) ? val : fallback;
}

// Helper: safe percent (0-100 or -100 to 100)
function safePercent(val: unknown, fallback = 0): number {
  return typeof val === 'number' && isFinite(val) ? val : fallback;
}

// Helper: sanitize string to avoid exposing raw JSON-like strings
function sanitizeString(val: unknown): string {
  if (typeof val !== 'string') return '';
  // Remove if looks like a raw JSON object string
  if (/^\{.*\}$/.test(val.trim())) return '';
  return val;
}

// Adapter: converts input to detail view model
export function toForecastSnapshotDetailViewModel(
  input?: SnapshotLineInput | null
): ForecastSnapshotSelectedLineDetailViewModelWithFormatted {
  if (!input) return emptyForecastSnapshotDetailViewModel;
  return {
    selectedLineId: input.selectedLineId,
    project: sanitizeString(input.project),
    car: sanitizeString(input.car),
    month: sanitizeString(input.month),
    costCategory: sanitizeString(input.costCategory),
    budgetStream: sanitizeString(input.budgetStream),
    forecast: safeNumber(input.forecast),
    actual: safeNumber(input.actual),
    budget: safeNumber(input.budget),
    variance: safeNumber(input.variance),
    variancePercent: input.variancePercent != null && isFinite(input.variancePercent)
      ? input.variancePercent
      : undefined,
    versionName: sanitizeString(input.versionName),
    versionKind: sanitizeString(input.versionKind),
    versionStatus: sanitizeString(input.versionStatus),
    sourceLabel: sanitizeString(input.sourceLabel),
    sourceMetadata: sanitizeString(input.sourceMetadata),
    deltaAmount: input.deltaAmount != null && isFinite(input.deltaAmount)
      ? input.deltaAmount
      : undefined,
    deltaPercent: input.deltaPercent != null && isFinite(input.deltaPercent)
      ? input.deltaPercent
      : undefined,
    severity: sanitizeString(input.severity),
    isReadOnly: true,
    formattedForecast: formatCurrency(safeNumber(input.forecast)),
    formattedActual: formatCurrency(safeNumber(input.actual)),
    formattedBudget: formatCurrency(safeNumber(input.budget)),
    formattedVariance: formatCurrency(safeNumber(input.variance)),
    formattedVariancePercent:
      input.variancePercent != null && isFinite(input.variancePercent)
        ? formatPercent(input.variancePercent)
        : undefined,
    formattedDeltaAmount:
      input.deltaAmount != null && isFinite(input.deltaAmount)
        ? formatCurrency(input.deltaAmount)
        : undefined,
    formattedDeltaPercent:
      input.deltaPercent != null && isFinite(input.deltaPercent)
        ? formatPercent(input.deltaPercent)
        : undefined,
  };
}

// Fallback/empty view model
export const emptyForecastSnapshotDetailViewModel: ForecastSnapshotSelectedLineDetailViewModelWithFormatted = {
  selectedLineId: undefined,
  project: '',
  car: '',
  month: '',
  costCategory: '',
  budgetStream: '',
  forecast: 0,
  actual: 0,
  budget: 0,
  variance: 0,
  variancePercent: undefined,
  versionName: '',
  versionKind: '',
  versionStatus: '',
  sourceLabel: undefined,
  sourceMetadata: undefined,
  deltaAmount: undefined,
  deltaPercent: undefined,
  severity: undefined,
  isReadOnly: true,
  formattedForecast: formatCurrency(0),
  formattedActual: formatCurrency(0),
  formattedBudget: formatCurrency(0),
  formattedVariance: formatCurrency(0),
  formattedVariancePercent: undefined,
  formattedDeltaAmount: undefined,
  formattedDeltaPercent: undefined,
};
