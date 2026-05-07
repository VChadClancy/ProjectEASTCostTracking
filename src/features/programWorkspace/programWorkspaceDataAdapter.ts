// Program Workspace Data Adapter
// Produces a summary view model for the Program Workspace page
// Uses existing frontend financial services/helpers where appropriate

import { getProgramFinancialSummary } from "../../features/financials/programFinancialSummaryRepositoryService";

// Types for the view model
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
}

// Adapter function
export async function getProgramWorkspaceSummary({
  programId = undefined,
  summaryData = undefined,
}: {
  programId?: string;
  summaryData?: any;
} = {}): Promise<ProgramWorkspaceSummaryViewModel> {
  // Use injected data for testability, otherwise fetch from service
  let summary = summaryData;
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
      };
    }
    summary = await getProgramFinancialSummary(programId);
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
    };
  }
  // Map summary fields to view model, with safe fallbacks
  const totalBudget = Number(summary.totalBudget) || 0;
  const totalForecast = Number(summary.totalForecast) || 0;
  const totalActuals = Number(summary.totalActuals) || 0;
  const varianceAmount = Number(summary.varianceAmount) || (totalBudget - totalForecast);
  const variancePercent = totalBudget !== 0 ? (varianceAmount / totalBudget) * 100 : 0;
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
  };
}
