// Forecast Version View Model Adapter for Sprint 13
// Consumes forecast version service outputs and produces MED-friendly view models
// Pure functions only, no side effects, no fetch/service calls

import type { ForecastVersion, ForecastVersionKind, ForecastVersionScope } from './forecastVersionTypes';
import type { ForecastVersionComparison, ForecastVersionDelta } from '../financials/forecastVersionTypes';

// --- View Model Types ---

export interface ForecastVersionSelectorItem {
  id: string;
  label: string;
  scopeLabel: string;
  kindLabel: string;
  statusLabel: string;
  versionMonthLabel: string;
}

export interface ForecastVersionSummaryCardModel {
  id: string;
  label: string;
  scopeLabel: string;
  kindLabel: string;
  statusLabel: string;
  versionMonthLabel: string;
  totalBudget: number;
  totalForecast: number;
  totalActuals: number;
  totalVariance: number;
}

export interface ForecastVersionComparisonViewModel {
  leftVersion: ForecastVersionSummaryCardModel;
  rightVersion: ForecastVersionSummaryCardModel;
  amountDelta: number;
  percentDelta: number;
  severity: 'low' | 'medium' | 'high';
  groupedDeltaSummaries: ForecastVersionDeltaSignalModel[];
}

export interface ForecastVersionDeltaSignalModel {
  group: string;
  amountDelta: number;
  percentDelta: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ForecastVersionSnapshotSummaryModel {
  id: string;
  label: string;
  kindLabel: string;
  statusLabel: string;
  versionMonthLabel: string;
  totalBudget: number;
  totalForecast: number;
  totalActuals: number;
  totalVariance: number;
}

// --- Label helpers ---

function getScopeLabel(scope: ForecastVersionScope): string {
  if (scope === 'program') return 'Program Budget Forecast';
  if (scope === 'project') return 'Project Forecast';
  return 'Unknown';
}

function getKindLabel(kind: ForecastVersionKind): string {
  switch (kind) {
    case 'baseline': return 'Baseline';
    case 'current': return 'Current';
    case 'prior': return 'Prior';
    case 'monthlySnapshot': return 'Monthly Snapshot';
    case 'scenario': return 'Scenario';
    default: return 'Unknown';
  }
}

function getStatusLabel(status: string): string {
  // Could be more sophisticated
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getVersionMonthLabel(versionMonth: string): string {
  // Expects YYYY-MM, returns e.g. 'May 2026'
  const [year, month] = versionMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function safeNumber(n: unknown): number {
  return Number.isFinite(n) ? (n as number) : 0;
}

function getSeverity(amountDelta: number, percentDelta: number): 'low' | 'medium' | 'high' {
  if (Math.abs(percentDelta) >= 20 || Math.abs(amountDelta) >= 1000000) return 'high';
  if (Math.abs(percentDelta) >= 10 || Math.abs(amountDelta) >= 100000) return 'medium';
  return 'low';
}

function sumSnapshotLines(lines: any[] | undefined, key: string): number {
  if (!Array.isArray(lines)) return 0;
  return lines.reduce((sum, l) => sum + (typeof l[key] === 'number' ? l[key] : 0), 0);
}

// --- Adapter Functions ---

export function buildForecastVersionSelectorItems(versions: ForecastVersion[] | undefined | null): ForecastVersionSelectorItem[] {
  if (!Array.isArray(versions)) return [];
  return versions.map(v => ({
    id: v.id,
    label: v.name,
    scopeLabel: getScopeLabel(v.scope),
    kindLabel: getKindLabel(v.kind),
    statusLabel: getStatusLabel(v.status),
    versionMonthLabel: getVersionMonthLabel(v.versionMonth),
  }));
}

export function buildForecastVersionSummary(version: ForecastVersion | undefined | null): ForecastVersionSummaryCardModel | null {
  if (!version) return null;
  return {
    id: version.id,
    label: version.name,
    scopeLabel: getScopeLabel(version.scope),
    kindLabel: getKindLabel(version.kind),
    statusLabel: getStatusLabel(version.status),
    versionMonthLabel: getVersionMonthLabel(version.versionMonth),
    totalBudget: sumSnapshotLines(version.snapshotLines, 'budgetAmount'),
    totalForecast: sumSnapshotLines(version.snapshotLines, 'forecastAmount'),
    totalActuals: sumSnapshotLines(version.snapshotLines, 'actualAmount'),
    totalVariance: sumSnapshotLines(version.snapshotLines, 'varianceAmount'),
  };
}

export function buildForecastVersionComparisonViewModel(comparison: ForecastVersionComparison | undefined | null, leftVersion?: ForecastVersion, rightVersion?: ForecastVersion): ForecastVersionComparisonViewModel | null {
  if (!comparison || !leftVersion || !rightVersion) return null;
  const left = buildForecastVersionSummary(leftVersion);
  const right = buildForecastVersionSummary(rightVersion);
  if (!left || !right) return null;
  const amountDelta = safeNumber(comparison.summary.totalAmountDelta);
  const percentDelta = safeNumber(comparison.summary.totalPercentDelta);
  const severity = getSeverity(amountDelta, percentDelta);
  const groupedDeltaSummaries = buildForecastVersionDeltaSignals(comparison);
  return {
    leftVersion: left,
    rightVersion: right,
    amountDelta,
    percentDelta,
    severity,
    groupedDeltaSummaries,
  };
}

export function buildForecastVersionDeltaSignals(comparison: ForecastVersionComparison | undefined | null): ForecastVersionDeltaSignalModel[] {
  if (!comparison || !Array.isArray(comparison.deltas)) return [];
  // Limit to 10 signals, clamp severity
  return comparison.deltas.slice(0, 10).map((d): ForecastVersionDeltaSignalModel => {
    const amountDelta = safeNumber(d.amountDelta);
    const percentDelta = safeNumber(d.percentDelta);
    return {
      group: d.id,
      amountDelta,
      percentDelta,
      severity: getSeverity(amountDelta, percentDelta),
    };
  });
}

export function buildForecastVersionSnapshotSummary(version: ForecastVersion | undefined | null): ForecastVersionSnapshotSummaryModel | null {
  if (!version) return null;
  return {
    id: version.id,
    label: version.name,
    kindLabel: getKindLabel(version.kind),
    statusLabel: getStatusLabel(version.status),
    versionMonthLabel: getVersionMonthLabel(version.versionMonth),
    totalBudget: sumSnapshotLines(version.snapshotLines, 'budgetAmount'),
    totalForecast: sumSnapshotLines(version.snapshotLines, 'forecastAmount'),
    totalActuals: sumSnapshotLines(version.snapshotLines, 'actualAmount'),
    totalVariance: sumSnapshotLines(version.snapshotLines, 'varianceAmount'),
  };
}
