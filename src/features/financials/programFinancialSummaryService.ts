import { getPrograms, getProjects, getCars, getWorkstreams } from './programService';
import { getFinancialLines } from './financialLineService';
import {
  rollupFinancialLinesByBudgetStream,
  rollupFinancialLinesByProject,
  rollupFinancialLinesByCar,
  rollupFinancialLinesByWorkstream
} from './programFinancialRollups';

// Dashboard summary types
export interface BudgetStreamRollupSummary {
  budgetStream: string;
  forecastAmount: number;
  actualAmount: number;
  varianceAmount: number;
  lineCount: number;
}
export interface ProjectRollupSummary {
  projectId: string;
  forecastAmount: number;
  actualAmount: number;
  varianceAmount: number;
  lineCount: number;
}
export interface CARRollupSummary {
  carId: string;
  forecastAmount: number;
  actualAmount: number;
  varianceAmount: number;
  lineCount: number;
}
export interface WorkstreamRollupSummary {
  workstreamId: string;
  forecastAmount: number;
  actualAmount: number;
  varianceAmount: number;
  lineCount: number;
}

export function getProgramFinancialSummary() {
  const programs = getPrograms();
  const projects = getProjects();
  const cars = getCars();
  const workstreams = getWorkstreams();
  const lines = getFinancialLines();

  // Assume one program for summary (can be extended for multi-program)
  const program = programs[0];
  const programId = program?.id;

  // Filter by programId (projects have programId, cars have projectId, workstreams have projectId)
  const programProjects = projects.filter(p => p.programId === programId);
  const programProjectIds = new Set(programProjects.map(p => p.id));
  const programCars = cars.filter(c => c.projectId && programProjectIds.has(c.projectId));
  const programCarIds = new Set(programCars.map(c => c.id));
  const programWorkstreams = workstreams.filter(w => w.projectId && programProjectIds.has(w.projectId));
  const programLines = lines.filter(l => l.programId === programId);

  // Totals
  const totalApprovedCARAmount = programCars.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const totalCapitalAmount = programCars.reduce((sum, c) => sum + (c.capitalAmount || 0), 0);
  const totalExpenseAmount = programCars.reduce((sum, c) => sum + (c.expenseAmount || 0), 0);

  // Financial line totals
  const financialLineTotals = {
    actual: programLines.reduce((sum, l) => sum + (l.actualAmount || 0), 0),
    forecast: programLines.reduce((sum, l) => sum + (l.forecastAmount || 0), 0),
    variance: programLines.reduce((sum, l) => sum + (l.varianceAmount || 0), 0),
  };

  // Rollups (map to dashboard-friendly fields)
  const budgetStreamRollups: BudgetStreamRollupSummary[] = rollupFinancialLinesByBudgetStream(programLines).map(r => ({
    budgetStream: r.id,
    forecastAmount: Number.isFinite(r.forecastAmount) ? r.forecastAmount : 0,
    actualAmount: Number.isFinite(r.actualAmount) ? r.actualAmount : 0,
    varianceAmount: Number.isFinite(r.varianceAmount) ? r.varianceAmount : 0,
    lineCount: r.lineCount
  }));
  const projectRollups: ProjectRollupSummary[] = rollupFinancialLinesByProject(programLines).map(r => ({
    projectId: r.id,
    forecastAmount: Number.isFinite(r.forecastAmount) ? r.forecastAmount : 0,
    actualAmount: Number.isFinite(r.actualAmount) ? r.actualAmount : 0,
    varianceAmount: Number.isFinite(r.varianceAmount) ? r.varianceAmount : 0,
    lineCount: r.lineCount
  }));
  const carRollups: CARRollupSummary[] = rollupFinancialLinesByCar(programLines).map(r => ({
    carId: r.id,
    forecastAmount: Number.isFinite(r.forecastAmount) ? r.forecastAmount : 0,
    actualAmount: Number.isFinite(r.actualAmount) ? r.actualAmount : 0,
    varianceAmount: Number.isFinite(r.varianceAmount) ? r.varianceAmount : 0,
    lineCount: r.lineCount
  }));
  const workstreamRollups: WorkstreamRollupSummary[] = rollupFinancialLinesByWorkstream(programLines).map(r => ({
    workstreamId: r.id,
    forecastAmount: Number.isFinite(r.forecastAmount) ? r.forecastAmount : 0,
    actualAmount: Number.isFinite(r.actualAmount) ? r.actualAmount : 0,
    varianceAmount: Number.isFinite(r.varianceAmount) ? r.varianceAmount : 0,
    lineCount: r.lineCount
  }));

  return {
    program: {
      ...program
    },
    projectCount: programProjects.length,
    carCount: programCars.length,
    workstreamCount: programWorkstreams.length,
    totalApprovedCARAmount,
    totalCapitalAmount,
    totalExpenseAmount,
    financialLineTotals,
    budgetStreamRollups,
    projectRollups,
    carRollups,
    workstreamRollups
  };
}
