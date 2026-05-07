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
  varianceSignals?: string[];
  financialLinePreview?: FinancialLinePreviewItem[];
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
    varianceSignals: Array.isArray(summary.varianceSignals) ? summary.varianceSignals : [],
    financialLinePreview: previewLines,
  };
}
