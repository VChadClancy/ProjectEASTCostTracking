// Pure Forecast Version Delta Calculation Service for Sprint 13
// Deterministic, side-effect free, no I/O, no dependencies
import {
  ForecastVersionLine,
  ForecastVersionDelta,
  ForecastVersionDeltaSummary,
  DeltaSeverity,
} from './forecastVersionTypes';

// Utility: Safe percent delta calculation
export function calculatePercentDelta(baseAmount: number, comparisonAmount: number): number {
  if (!isFinite(baseAmount) || !isFinite(comparisonAmount)) return 0;
  if (baseAmount === 0) return comparisonAmount === 0 ? 0 : 1;
  const percent = (comparisonAmount - baseAmount) / Math.abs(baseAmount);
  return isFinite(percent) ? percent : 0;
}

// Utility: Classify delta severity
export function classifyDeltaSeverity(amountDelta: number, percentDelta: number, context?: { baseAmount?: number }): DeltaSeverity {
  if (!isFinite(amountDelta) || !isFinite(percentDelta)) return DeltaSeverity.Info;
  const absAmount = Math.abs(amountDelta);
  const absPercent = Math.abs(percentDelta);
  if (absAmount < 1e-6 || absPercent < 0.01) return DeltaSeverity.Healthy;
  if (absPercent < 0.1 && absAmount < 1000) return DeltaSeverity.Attention;
  if (absPercent >= 0.1 || absAmount >= 1000) return DeltaSeverity.Risk;
  return DeltaSeverity.Info;
}

// Core: Compare two sets of snapshot lines and produce deltas
export function compareForecastVersions(
  baseLines: ForecastVersionLine[],
  comparisonLines: ForecastVersionLine[]
): { deltas: ForecastVersionDelta[]; summary: ForecastVersionDeltaSummary } {
  const baseMap = new Map<string, ForecastVersionLine>();
  baseLines.forEach(line => baseMap.set(lineKey(line), line));
  const compMap = new Map<string, ForecastVersionLine>();
  comparisonLines.forEach(line => compMap.set(lineKey(line), line));
  const allKeys = new Set([...baseMap.keys(), ...compMap.keys()]);
  const deltas: ForecastVersionDelta[] = [];
  for (const key of allKeys) {
    const base = baseMap.get(key);
    const comp = compMap.get(key);
    const baseAmount = base?.forecastAmount ?? 0;
    const compAmount = comp?.forecastAmount ?? 0;
    const amountDelta = compAmount - baseAmount;
    const percentDelta = calculatePercentDelta(baseAmount, compAmount);
    const monthlyMovement = compAmount - (base?.actualAmount ?? 0);
    const cumulativeMovement = (comp?.actualAmount ?? 0) - (base?.actualAmount ?? 0);
    const severity = classifyDeltaSeverity(amountDelta, percentDelta, { baseAmount });
    deltas.push({
      id: key,
      projectId: comp?.projectId ?? base?.projectId,
      carId: comp?.carId ?? base?.carId,
      budgetStream: comp?.budgetStream ?? base?.budgetStream,
      costCategory: comp?.costCategory ?? base?.costCategory,
      vendor: comp?.vendor ?? base?.vendor,
      resource: comp?.resource ?? base?.resource,
      month: comp?.month ?? base?.month,
      fiscalPeriodId: comp?.fiscalPeriodId ?? base?.fiscalPeriodId,
      amountDelta,
      percentDelta,
      monthlyMovement: isFinite(monthlyMovement) ? monthlyMovement : 0,
      cumulativeMovement: isFinite(cumulativeMovement) ? cumulativeMovement : 0,
      severity,
    });
  }
  const summary = calculateForecastVersionDeltaSummary(baseLines, comparisonLines, deltas);
  return { deltas, summary };
}

// Helper: Key for matching lines (by project, car, budgetStream, costCategory, month)
function lineKey(line: ForecastVersionLine): string {
  return [
    line.projectId ?? '',
    line.carId ?? '',
    line.budgetStream ?? '',
    line.costCategory ?? '',
    line.month ?? '',
  ].join('|');
}

// Delta summary calculation
export function calculateForecastVersionDeltaSummary(
  baseLines: ForecastVersionLine[],
  comparisonLines: ForecastVersionLine[],
  deltas?: ForecastVersionDelta[]
): ForecastVersionDeltaSummary {
  const _deltas = deltas ?? compareForecastVersions(baseLines, comparisonLines).deltas;
  let totalAmountDelta = 0;
  let totalPercentDelta = 0;
  const byProject: Record<string, number> = {};
  const byCar: Record<string, number> = {};
  const byBudgetStream: Record<string, number> = {};
  const byCostCategory: Record<string, number> = {};
  const severityCounts: Record<DeltaSeverity, number> = {
    [DeltaSeverity.Healthy]: 0,
    [DeltaSeverity.Attention]: 0,
    [DeltaSeverity.Risk]: 0,
    [DeltaSeverity.Info]: 0,
  };
  for (const d of _deltas) {
    totalAmountDelta += d.amountDelta;
    totalPercentDelta += d.percentDelta;
    if (d.projectId) byProject[d.projectId] = (byProject[d.projectId] || 0) + d.amountDelta;
    if (d.carId) byCar[d.carId] = (byCar[d.carId] || 0) + d.amountDelta;
    if (d.budgetStream) byBudgetStream[d.budgetStream] = (byBudgetStream[d.budgetStream] || 0) + d.amountDelta;
    if (d.costCategory) byCostCategory[d.costCategory] = (byCostCategory[d.costCategory] || 0) + d.amountDelta;
    severityCounts[d.severity] = (severityCounts[d.severity] || 0) + 1;
  }
  return {
    totalAmountDelta: isFinite(totalAmountDelta) ? totalAmountDelta : 0,
    totalPercentDelta: isFinite(totalPercentDelta) ? totalPercentDelta : 0,
    byProject,
    byCar,
    byBudgetStream,
    byCostCategory,
    severityCounts,
  };
}

// Grouping helpers
export function groupForecastDeltasByProject(deltas: ForecastVersionDelta[]): Record<string, ForecastVersionDelta[]> {
  const grouped: Record<string, ForecastVersionDelta[]> = {};
  for (const d of deltas) {
    const key = d.projectId ?? 'unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  }
  return grouped;
}

export function groupForecastDeltasByCar(deltas: ForecastVersionDelta[]): Record<string, ForecastVersionDelta[]> {
  const grouped: Record<string, ForecastVersionDelta[]> = {};
  for (const d of deltas) {
    const key = d.carId ?? 'unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  }
  return grouped;
}

export function groupForecastDeltasByBudgetStream(deltas: ForecastVersionDelta[]): Record<string, ForecastVersionDelta[]> {
  const grouped: Record<string, ForecastVersionDelta[]> = {};
  for (const d of deltas) {
    const key = d.budgetStream ?? 'unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  }
  return grouped;
}

export function groupForecastDeltasByCostCategory(deltas: ForecastVersionDelta[]): Record<string, ForecastVersionDelta[]> {
  const grouped: Record<string, ForecastVersionDelta[]> = {};
  for (const d of deltas) {
    const key = d.costCategory ?? 'unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  }
  return grouped;
}
