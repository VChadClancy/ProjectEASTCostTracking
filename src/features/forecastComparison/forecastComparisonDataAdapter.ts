// Forecast Comparison Data Adapter for Sprint 15
// Consumes forecast version services and delta outputs, builds comparison view model
// No data fetching at import time, no UI, no network, no mutation

import {
  getForecastVersions,
  getForecastVersionById,
  compareForecastVersions,
} from '../forecastVersions/forecastVersionService';
import {
  buildForecastVersionSelectorItems,
  buildForecastVersionSummary,
  buildForecastVersionComparisonViewModel,
  buildForecastVersionDeltaSignals,
  buildForecastVersionSnapshotSummary,
} from '../forecastVersions/forecastVersionViewModelAdapter';
import type { ForecastVersion } from '../forecastVersions/forecastVersionTypes';

export interface DeltaSummaryCard {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
  severity: 'low' | 'medium' | 'high';
  leftVersion: ReturnType<typeof buildForecastVersionSummary>;
  rightVersion: ReturnType<typeof buildForecastVersionSummary>;
}

export interface ForecastComparisonViewModel {
  baseVersion: ReturnType<typeof buildForecastVersionSummary> | null;
  comparisonVersion: ReturnType<typeof buildForecastVersionSummary> | null;
  versionPairSelector: ReturnType<typeof buildForecastVersionSelectorItems>;
  deltaSummaryCards: DeltaSummaryCard[];
  monthlyMovementSummary: any[];
  groupedDeltaPanels: Record<string, any[]>;
  projectDeltas: any[];
  carDeltas: any[];
  budgetStreamDeltas: any[];
  costCategoryDeltas: any[];
  deltaSignalsDetail: any[];
  readOnlyComparisonPreview: any[];
  empty: boolean;
  loading: boolean;
  error: string | null;
}

// Helper: limit array to max N, filter out non-finite
function finiteLimited(arr: any[], n: number) {
  return (Array.isArray(arr) ? arr : []).filter(
    (x) => typeof x === 'object' && isFinite(x.amountDelta ?? 0) && isFinite(x.percentDelta ?? 0)
  ).slice(0, n);
}

// Main adapter
export async function buildForecastComparisonViewModel({
  programId,
  projectId,
  baseVersionId,
  comparisonVersionId,
  useMock = true,
}: {
  programId?: string;
  projectId?: string;
  baseVersionId?: string;
  comparisonVersionId?: string;
  useMock?: boolean;
} = {}): Promise<ForecastComparisonViewModel> {
  let loading = true;
  let error: string | null = null;
  let versions: ForecastVersion[] = [];
  let baseVersion: ForecastVersion | undefined;
  let comparisonVersion: ForecastVersion | undefined;
  let comparison: any = null;

  try {
    // 1. Get all versions (mock-backed)
    versions = await getForecastVersions();
    // 2. Choose base/comparison versions
    if (baseVersionId) {
      baseVersion = versions.find(v => v.id === baseVersionId);
    } else {
      baseVersion = versions.find(v => v.kind === 'baseline') || versions[0];
    }
    if (comparisonVersionId) {
      comparisonVersion = versions.find(v => v.id === comparisonVersionId);
    } else {
      comparisonVersion = versions.find(v => v.kind === 'current' && v.scope === baseVersion?.scope) || versions[1];
    }
    // 3. Compare
    if (baseVersion && comparisonVersion) {
      comparison = await compareForecastVersions(baseVersion.id, comparisonVersion.id);
    }
    loading = false;
  } catch (e: any) {
    error = e?.message || 'Unknown error';
    loading = false;
  }

  // 4. Build view model fields
  const versionPairSelector = buildForecastVersionSelectorItems(versions);
  const baseSummary = buildForecastVersionSummary(baseVersion);
  const comparisonSummary = buildForecastVersionSummary(comparisonVersion);
  // Normalize deltaSummaryCards to always be an array of summary card objects
  const rawDeltaSummary = comparison && baseVersion && comparisonVersion
    ? buildForecastVersionComparisonViewModel(comparison, baseVersion, comparisonVersion)
    : null;
  const deltaSummaryCards = rawDeltaSummary ? [{
    id: 'delta-summary',
    label: 'Delta',
    value: rawDeltaSummary.amountDelta,
    secondaryValue: rawDeltaSummary.percentDelta,
    severity: rawDeltaSummary.severity,
    leftVersion: rawDeltaSummary.leftVersion,
    rightVersion: rawDeltaSummary.rightVersion,
  }] : [];

  // Defensive normalization for all mapped fields
  function safeArray(val: any): any[] { return Array.isArray(val) ? val : []; }
  const groupedDeltaPanels: Record<string, any[]> = {
    project: safeArray(comparison?.deltas?.filter((d: any) => d.group === 'project')).slice(0, 5),
    car: safeArray(comparison?.deltas?.filter((d: any) => d.group === 'car')).slice(0, 5),
    budgetStream: safeArray(comparison?.deltas?.filter((d: any) => d.group === 'budgetStream')).slice(0, 5),
    costCategory: safeArray(comparison?.deltas?.filter((d: any) => d.group === 'costCategory')).slice(0, 5),
  };
  const monthlyMovementSummary = safeArray(comparison?.deltas?.filter((d: any) => d.group === 'month')).slice(0, 5);
  const projectDeltas = groupedDeltaPanels.project;
  const carDeltas = groupedDeltaPanels.car;
  const budgetStreamDeltas = groupedDeltaPanels.budgetStream;
  const costCategoryDeltas = groupedDeltaPanels.costCategory;
  const deltaSignalsDetail = safeArray((comparison?.deltas || []).filter((d: any) => ['high', 'medium'].includes(d.severity))).slice(0, 5);
  const readOnlyComparisonPreview = safeArray(comparison?.deltas).slice(0, 6);

  // 10. Empty state
  const empty = !baseVersion || !comparisonVersion || !comparison;

  return {
    baseVersion: baseSummary,
    comparisonVersion: comparisonSummary,
    versionPairSelector,
    deltaSummaryCards,
    monthlyMovementSummary,
    groupedDeltaPanels,
    projectDeltas,
    carDeltas,
    budgetStreamDeltas,
    costCategoryDeltas,
    deltaSignalsDetail,
    readOnlyComparisonPreview,
    empty,
    loading,
    error,
  };
}
