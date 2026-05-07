// Program Workspace Data Adapter
// Produces a summary view model for the Program Workspace page
// Uses existing frontend financial services/helpers where appropriate

import { getProgramFinancialSummary } from "../../features/financials/programFinancialSummaryRepositoryService";
import { getFinancialLines } from "../../features/financials/financialLineRepositoryService";
import type { FinancialLine } from "../../features/financials/programFinancialRepository";
import type { FinancialLine as FinancialLineFull } from "../../features/financials/financialLineTypes";

// Types for the view model
export interface FinancialLinePreviewItem {
  id: string;
  label: string; // program/project/CAR identifier or display label
  budgetStream?: string;
  costCategoryKey?: string;
  forecastAmount?: number;
  actualAmount?: number;
  varianceAmount?: number;
  status?: string;
}

export interface ProjectCarOverviewItem {
  id: string;
  projectId?: string;
  projectName?: string;
  carId?: string;
  carName?: string;
  status?: string;
  budget?: number;
  forecast?: number;
  actual?: number;
  variance?: number;
  financialLineCount?: number;
}

export interface BudgetStreamFundingItem {
  budgetStream: string;
  totalBudget: number;
  totalForecast: number;
  totalActuals: number;
  variance: number;
  financialLineCount: number;
}

export interface ProgramWorkspaceSummaryViewModel {
  programName: string;
  totalBudget: number;
  totalForecast: number;
  totalActuals: number;
  varianceAmount: number;
  variancePercent: number;
  activeProjectCount: number;
  activeCarCount: number;
  financialLineCount: number;
  primaryBudgetStreams?: string[];
  varianceSignals?: VarianceSignal[];
  financialLinePreview?: FinancialLinePreviewItem[];
  projectsAndCarsOverview?: ProjectCarOverviewItem[];
  budgetStreamFunding?: BudgetStreamFundingItem[];
}

// Variance Signal type for lightweight variance signal foundation
export type VarianceSignalSeverity = 'healthy' | 'attention' | 'risk' | 'info';
export interface VarianceSignal {
  id: string;
  label: string;
  description: string;
  varianceAmount: number;
  variancePercent?: number;
  severity: VarianceSignalSeverity;
  relatedArea: 'program' | 'project' | 'CAR' | 'budgetStream' | 'financialLine';
}

// Adapter function
export async function getProgramWorkspaceSummary({
  programId = undefined,
  summaryData = undefined,
  financialLinesData = undefined,
}: {
  programId?: string;
  summaryData?: any;
  financialLinesData?: FinancialLine[];
} = {}): Promise<ProgramWorkspaceSummaryViewModel> {
  // Use injected data for testability, otherwise fetch from service
  let summary = summaryData;
  let financialLines: FinancialLine[] | undefined = financialLinesData;
  if (!summary) {
    if (!programId) {
      // If no programId, return safe empty
      return {
        programName: "",
        totalBudget: 0,
        totalForecast: 0,
        totalActuals: 0,
        varianceAmount: 0,
        variancePercent: 0,
        activeProjectCount: 0,
        activeCarCount: 0,
        financialLineCount: 0,
        primaryBudgetStreams: [],
        varianceSignals: [],
        financialLinePreview: [],
        projectsAndCarsOverview: [],
        budgetStreamFunding: [],
      };
    }
    summary = await getProgramFinancialSummary(programId);
  }
  if (!financialLines) {
    if (programId) {
      financialLines = await getFinancialLines({ programId });
    } else {
      financialLines = [];
    }
  }
  if (!summary) {
    return {
      programName: "",
      totalBudget: 0,
      totalForecast: 0,
      totalActuals: 0,
      varianceAmount: 0,
      variancePercent: 0,
      activeProjectCount: 0,
      activeCarCount: 0,
      financialLineCount: 0,
      primaryBudgetStreams: [],
      varianceSignals: [],
      financialLinePreview: [],
      projectsAndCarsOverview: [],
      budgetStreamFunding: [],
    };
  }
  // Map summary fields to view model, with safe fallbacks
  const totalBudget = Number(summary.totalBudget) || 0;
  const totalForecast = Number(summary.totalForecast) || 0;
  const totalActuals = Number(summary.totalActuals) || 0;
  const varianceAmount = Number(summary.varianceAmount) || (totalBudget - totalForecast);
  const variancePercent = totalBudget !== 0 ? (varianceAmount / totalBudget) * 100 : 0;

  // Map top 5-6 financial lines for preview
  const previewLines = (Array.isArray(financialLines) ? (financialLines as FinancialLineFull[]) : [])
    .slice(0, 5)
    .map((line) => ({
      id: line.id,
      label: line.projectId || line.carId || line.programId || line.id,
      budgetStream: line.budgetStream,
      costCategoryKey: line.costCategoryKey,
      forecastAmount: line.forecastAmount,
      actualAmount: line.actualAmount,
      varianceAmount: line.varianceAmount,
      status: (line as any).status || undefined,
    }));

  // --- Active Projects / CARs Overview ---
  // Group by projectId or carId, roll up safe fields, limit to top 5
  const projectCarMap: Record<string, ProjectCarOverviewItem> = {};
  if (Array.isArray(financialLines)) {
    for (const line of financialLines as FinancialLineFull[]) {
      const key = line.projectId || line.carId;
      if (!key) continue;
      if (!projectCarMap[key]) {
        projectCarMap[key] = {
          id: key,
          projectId: line.projectId,
          projectName: (line as any).projectName,
          carId: line.carId,
          carName: (line as any).carName,
          status: (line as any).status,
          budget: 0,
          forecast: 0,
          actual: 0,
          variance: 0,
          financialLineCount: 0,
        };
      }
      projectCarMap[key].budget = (projectCarMap[key].budget || 0) + (typeof (line as any).budget === 'number' ? (line as any).budget : 0);
      projectCarMap[key].forecast = (projectCarMap[key].forecast || 0) + (typeof line.forecastAmount === 'number' ? line.forecastAmount : 0);
      projectCarMap[key].actual = (projectCarMap[key].actual || 0) + (typeof line.actualAmount === 'number' ? line.actualAmount : 0);
      projectCarMap[key].variance = (projectCarMap[key].variance || 0) + (typeof line.varianceAmount === 'number' ? line.varianceAmount : 0);
      projectCarMap[key].financialLineCount = (projectCarMap[key].financialLineCount || 0) + 1;
    }
  }
  const projectsAndCarsOverview = Object.values(projectCarMap).slice(0, 5);

  // --- Budget Stream / Funding Overview ---
  const budgetStreamMap: Record<string, BudgetStreamFundingItem> = {};
  if (Array.isArray(financialLines)) {
    for (const line of financialLines as FinancialLineFull[]) {
      const stream = typeof line.budgetStream === 'string' && line.budgetStream.trim() ? line.budgetStream.trim() : 'Unspecified';
      if (!budgetStreamMap[stream]) {
        budgetStreamMap[stream] = {
          budgetStream: stream,
          totalBudget: 0,
          totalForecast: 0,
          totalActuals: 0,
          variance: 0,
          financialLineCount: 0,
        };
      }
      budgetStreamMap[stream].totalBudget += isFinite(Number((line as any).budget)) ? Number((line as any).budget) : 0;
      budgetStreamMap[stream].totalForecast += isFinite(Number(line.forecastAmount)) ? Number(line.forecastAmount) : 0;
      budgetStreamMap[stream].totalActuals += isFinite(Number(line.actualAmount)) ? Number(line.actualAmount) : 0;
      budgetStreamMap[stream].variance += isFinite(Number(line.varianceAmount)) ? Number(line.varianceAmount) : 0;
      budgetStreamMap[stream].financialLineCount += 1;
    }
  }
  let budgetStreamFunding = Object.values(budgetStreamMap)
    .map(item => ({
      ...item,
      totalBudget: isFinite(item.totalBudget) ? item.totalBudget : 0,
      totalForecast: isFinite(item.totalForecast) ? item.totalForecast : 0,
      totalActuals: isFinite(item.totalActuals) ? item.totalActuals : 0,
      variance: isFinite(item.variance) ? item.variance : 0,
      financialLineCount: isFinite(item.financialLineCount) ? item.financialLineCount : 0,
    }))
    .sort((a, b) => b.totalBudget - a.totalBudget)
    .slice(0, 5);
  // Safe fallback for empty
  if (!Array.isArray(budgetStreamFunding) || budgetStreamFunding.length === 0) {
    budgetStreamFunding = [];
  }

  // --- Variance Signals (lightweight foundation) ---
  const allowedSeverities: VarianceSignalSeverity[] = ['healthy', 'attention', 'risk', 'info'];
  const varianceSignals: VarianceSignal[] = [];

  // 1. Program-level variance
  if (isFinite(varianceAmount) && Math.abs(varianceAmount) > 0) {
    let severity: VarianceSignalSeverity = 'healthy';
    if (Math.abs(variancePercent) > 20) severity = 'risk';
    else if (Math.abs(variancePercent) > 10) severity = 'attention';
    else if (Math.abs(variancePercent) > 2) severity = 'info';
    varianceSignals.push({
      id: 'program-variance',
      label: 'Program Variance',
      description: `Program variance is ${varianceAmount >= 0 ? 'under' : 'over'} budget by ${Math.abs(varianceAmount).toLocaleString()} (${variancePercent.toFixed(1)}%)`,
      varianceAmount,
      variancePercent,
      severity,
      relatedArea: 'program',
    });
  }

  // 2. Top project/CAR variances (by absolute value)
  if (Array.isArray(projectsAndCarsOverview)) {
    const sorted = [...projectsAndCarsOverview]
      .filter(item => isFinite(item.variance ?? 0) && Math.abs(item.variance ?? 0) > 0)
      .sort((a, b) => Math.abs((b.variance || 0)) - Math.abs((a.variance || 0)))
      .slice(0, 2);
    for (const item of sorted) {
      let percent = 0;
      if (isFinite(item.budget ?? 0) && (item.budget ?? 0)) {
        percent = (item.variance ?? 0) / (item.budget ?? 1) * 100;
      }
      let severity: VarianceSignalSeverity = 'healthy';
      if (Math.abs(percent) > 20) severity = 'risk';
      else if (Math.abs(percent) > 10) severity = 'attention';
      else if (Math.abs(percent) > 2) severity = 'info';
      varianceSignals.push({
        id: `projectcar-${item.id}`,
        label: item.projectName || item.carName || item.id,
        description: `Variance for ${item.projectName || item.carName || item.id} is ${item.variance! >= 0 ? 'under' : 'over'} budget by ${Math.abs(item.variance!).toLocaleString()} (${percent.toFixed(1)}%)`,
        varianceAmount: item.variance!,
        variancePercent: percent,
        severity,
        relatedArea: item.projectId ? 'project' : 'CAR',
      });
    }
  }

  // 3. Top budget stream variances (by absolute value)
  if (Array.isArray(budgetStreamFunding)) {
    const sorted = [...budgetStreamFunding]
      .filter(item => isFinite(item.variance) && Math.abs(item.variance) > 0)
      .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
      .slice(0, 2);
    for (const item of sorted) {
      let percent = 0;
      if (isFinite(item.totalBudget ?? 0) && (item.totalBudget ?? 0)) {
        percent = item.variance / (item.totalBudget ?? 1) * 100;
      }
      let severity: VarianceSignalSeverity = 'healthy';
      if (Math.abs(percent) > 20) severity = 'risk';
      else if (Math.abs(percent) > 10) severity = 'attention';
      else if (Math.abs(percent) > 2) severity = 'info';
      varianceSignals.push({
        id: `budgetstream-${item.budgetStream}`,
        label: item.budgetStream,
        description: `Variance for budget stream ${item.budgetStream} is ${item.variance >= 0 ? 'under' : 'over'} budget by ${Math.abs(item.variance).toLocaleString()} (${percent.toFixed(1)}%)`,
        varianceAmount: item.variance,
        variancePercent: percent,
        severity,
        relatedArea: 'budgetStream',
      });
    }
  }

  // Limit to top 3-5 signals, filter for allowed severities only
  const safeVarianceSignals = varianceSignals
    .filter(sig => allowedSeverities.includes(sig.severity))
    .slice(0, 5);

  return {
    programName: summary.programName || "",
    totalBudget: isFinite(totalBudget) ? totalBudget : 0,
    totalForecast: isFinite(totalForecast) ? totalForecast : 0,
    totalActuals: isFinite(totalActuals) ? totalActuals : 0,
    varianceAmount: isFinite(varianceAmount) ? varianceAmount : 0,
    variancePercent: isFinite(variancePercent) ? variancePercent : 0,
    activeProjectCount: Number(summary.activeProjectCount) || 0,
    activeCarCount: Number(summary.activeCarCount) || 0,
    financialLineCount: Number(summary.financialLineCount) || 0,
    primaryBudgetStreams: Array.isArray(summary.primaryBudgetStreams) ? summary.primaryBudgetStreams : [],
    varianceSignals: safeVarianceSignals,
    financialLinePreview: previewLines,
    projectsAndCarsOverview,
    budgetStreamFunding,
  };
}
