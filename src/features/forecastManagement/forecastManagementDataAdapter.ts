// Forecast Management Workspace Data Adapter
// Consumes forecast version services and view model adapter (mock-backed by default)
// Builds a workspace view model for the Forecast Management Workspace

import {
  getForecastVersions,
} from '../forecastVersions/forecastVersionService';
import {
  buildForecastVersionSelectorItems,
  buildForecastVersionSummary,
  buildForecastVersionComparisonViewModel,
  buildForecastVersionDeltaSignals,
  buildForecastVersionSnapshotSummary,
} from '../forecastVersions/forecastVersionViewModelAdapter';
import type { ForecastVersion } from '../forecastVersions/forecastVersionTypes';

// Types
export interface ForecastManagementWorkspaceViewModel {
  versions: ForecastVersion[];
  selectorItems: any[];
  currentVersion: ForecastVersion | null;
  comparisonVersion: ForecastVersion | null;
  currentVersionSummary: any | null;
  snapshotSummary: any | null;
  snapshotLinesPreview: any[];
  recentVersions: ForecastVersion[];
  comparisonOverview: any | null;
  deltaSignalsPreview: any[];
  empty?: boolean;
  loading?: boolean;
  error?: string | null;
}

// Main adapter function
export async function getForecastManagementWorkspaceViewModel({
  filters = undefined,
  maxSnapshotLines = 6,
  maxRecentVersions = 5,
  maxDeltaSignals = 5,
} = {}): Promise<ForecastManagementWorkspaceViewModel> {
  // Use mock service only (no network/fetch)
  let versions: ForecastVersion[] = [];
  try {
    versions = await getForecastVersions(filters);
  } catch (e) {
    return { versions: [], selectorItems: [], currentVersion: null, comparisonVersion: null, currentVersionSummary: null, snapshotSummary: null, snapshotLinesPreview: [], recentVersions: [], comparisonOverview: null, deltaSignalsPreview: [], error: String(e) };
  }
  if (!versions.length) {
    return {
      versions: [],
      selectorItems: [],
      currentVersion: null,
      comparisonVersion: null,
      currentVersionSummary: null,
      snapshotSummary: null,
      snapshotLinesPreview: [],
      recentVersions: [],
      comparisonOverview: null,
      deltaSignalsPreview: [],
      empty: true,
    };
  }
  // Choose current and comparison version
  const currentVersion = versions[0];
  const comparisonVersion = versions.length > 1 ? versions[1] : null;
  // Selector items
  const selectorItems = buildForecastVersionSelectorItems(versions);
  // Summaries
  const currentVersionSummary = buildForecastVersionSummary(currentVersion);
  const snapshotSummary = buildForecastVersionSnapshotSummary(currentVersion);
  // Snapshot lines preview
  const snapshotLinesPreview = Array.isArray(currentVersion?.snapshotLines) ? currentVersion.snapshotLines.slice(0, maxSnapshotLines) : [];
  // Recent versions
  const recentVersions = versions.slice(0, maxRecentVersions);
  // Comparison overview (use summary or id/title)
  const comparisonOverview = comparisonVersion ? buildForecastVersionSummary(comparisonVersion) : null;
  // Delta signals preview (simulate comparison)
  let deltaSignalsPreview: any[] = [];
  if (comparisonVersion) {
    // Minimal valid ForecastVersionComparison for preview
    const fakeComparison = {
      versionAId: currentVersion.id,
      versionBId: comparisonVersion.id,
      deltas: [],
      summary: {
        totalAmountDelta: 0,
        totalPercentDelta: 0,
        byProject: {},
        byCar: {},
        byBudgetStream: {},
        byCostCategory: {},
        severityCounts: {
          healthy: 0,
          attention: 0,
          risk: 0,
          info: 0,
        },
      },
    };
    deltaSignalsPreview = buildForecastVersionDeltaSignals(fakeComparison).slice(0, maxDeltaSignals);
  }
  return {
    versions,
    selectorItems,
    currentVersion,
    comparisonVersion,
    currentVersionSummary,
    snapshotSummary,
    snapshotLinesPreview,
    recentVersions,
    comparisonOverview,
    deltaSignalsPreview,
  };
}
