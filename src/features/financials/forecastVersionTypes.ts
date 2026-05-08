// Forecast Version domain model and related types for Sprint 13

// 1. Core Enums/Unions
export enum ForecastVersionScope {
  Program = 'program',
  Project = 'project',
}

export enum ForecastVersionKind {
  Baseline = 'baseline',
  Current = 'current',
  Prior = 'prior',
  MonthlySnapshot = 'monthlySnapshot',
  Scenario = 'scenario',
}

export enum ForecastVersionStatus {
  Draft = 'draft',
  Active = 'active',
  Locked = 'locked',
  Archived = 'archived',
}

export enum DeltaSeverity {
  Healthy = 'healthy',
  Attention = 'attention',
  Risk = 'risk',
  Info = 'info',
}

export const allowedForecastVersionScopes = [
  ForecastVersionScope.Program,
  ForecastVersionScope.Project,
] as const;

export const allowedForecastVersionKinds = [
  ForecastVersionKind.Baseline,
  ForecastVersionKind.Current,
  ForecastVersionKind.Prior,
  ForecastVersionKind.MonthlySnapshot,
  ForecastVersionKind.Scenario,
] as const;

export const allowedForecastVersionStatuses = [
  ForecastVersionStatus.Draft,
  ForecastVersionStatus.Active,
  ForecastVersionStatus.Locked,
  ForecastVersionStatus.Archived,
] as const;

export const allowedDeltaSeverities = [
  DeltaSeverity.Healthy,
  DeltaSeverity.Attention,
  DeltaSeverity.Risk,
  DeltaSeverity.Info,
] as const;

// 2. Forecast Version Metadata
export interface ForecastVersion {
  id: string;
  name: string;
  description?: string;
  scope: ForecastVersionScope;
  kind: ForecastVersionKind;
  status: ForecastVersionStatus;
  programId: string;
  projectId?: string;
  fiscalYear: number;
  fiscalMonth?: number;
  fiscalPeriodId?: string;
  versionMonth: string; // e.g. '2026-05'
  createdAt: string; // ISO date
  createdBy?: string;
  lockedAt?: string;
  lockedBy?: string;
  sourceVersionId?: string;
  notes?: string;
}

// 3. Monthly Snapshot Line/Item
export interface ForecastVersionLine {
  id: string;
  forecastVersionId: string;
  financialLineId?: string;
  projectId?: string;
  carId?: string;
  budgetStream?: string;
  costCategory?: string;
  vendor?: string;
  resource?: string;
  month?: string; // e.g. '2026-05'
  fiscalPeriodId?: string;
  budgetAmount: number;
  forecastAmount: number;
  actualAmount: number;
  varianceAmount: number;
}

// 4. Delta Analysis Types
export interface ForecastVersionComparison {
  versionAId: string;
  versionBId: string;
  deltas: ForecastVersionDelta[];
  summary: ForecastVersionDeltaSummary;
}

export interface ForecastVersionDelta {
  id: string;
  projectId?: string;
  carId?: string;
  budgetStream?: string;
  costCategory?: string;
  vendor?: string;
  resource?: string;
  month?: string;
  fiscalPeriodId?: string;
  amountDelta: number;
  percentDelta: number;
  monthlyMovement?: number;
  cumulativeMovement?: number;
  severity: DeltaSeverity;
}

export interface ForecastVersionDeltaSummary {
  totalAmountDelta: number;
  totalPercentDelta: number;
  byProject: Record<string, number>;
  byCar: Record<string, number>;
  byBudgetStream: Record<string, number>;
  byCostCategory: Record<string, number>;
  severityCounts: Record<DeltaSeverity, number>;
}
