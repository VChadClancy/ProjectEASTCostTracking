// Planning Management Data Adapter (Sprint 17, Checkpoint 155)
// Mock-backed only. No network or backend calls.

import {
  PlanningManagementWorkspaceViewModel,
  PlanningSummaryCardViewModel,
  FinancialPlanningLineViewModel,
  FteLaborPlanningLineViewModel,
  getPlanningManagementSections,
  PlanningLineType,
} from './planningManagementModel';
import { formatCurrency } from '../../utils/formatCurrency';

// Helper: Safe labor cost calculation
function calculateLaborCost(fte: number, laborRate: number): number {
  const safeFte = Number.isFinite(fte) ? fte : 0;
  const safeRate = Number.isFinite(laborRate) ? laborRate : 0;
  const cost = safeFte * safeRate;
  return Number.isFinite(cost) ? cost : 0;
}

// Helper: Format FTE for display
function formatFte(fte: number): string {
  if (!Number.isFinite(fte)) return '0.00';
  return fte.toFixed(2);
}

// Mock summary cards
const planningSummaryCards: PlanningSummaryCardViewModel[] = [
  {
    id: 'totalPlanned',
    title: 'Total Planned',
    value: formatCurrency(1200000),
    description: 'Total planned cost',
    icon: 'sum',
  },
  {
    id: 'totalFte',
    title: 'Total FTE',
    value: '8.50',
    description: 'Total FTE planned',
    icon: 'users',
  },
];

// Mock financial planning lines
const financialPlanningLines: FinancialPlanningLineViewModel[] = [
  {
    lineId: 'fin-001',
    programLabel: 'Atlas Core',
    projectLabel: 'Migration',
    carLabel: 'CAR-1001',
    lineType: 'software',
    fiscalPeriod: '2026-05',
    budgetStream: 'CapEx',
    costCategory: 'Software Licenses',
    plannedAmount: 50000,
    forecastAmount: 52000,
    notes: 'Renewal',
    status: 'active',
  },
  {
    lineId: 'fin-002',
    programLabel: 'Atlas Core',
    projectLabel: 'Migration',
    carLabel: 'CAR-1002',
    lineType: 'hardware',
    fiscalPeriod: '2026-05',
    budgetStream: 'OpEx',
    costCategory: 'Hardware',
    plannedAmount: 20000,
    forecastAmount: 21000,
    notes: 'New servers',
    status: 'active',
  },
];

// Mock FTE/labor planning lines
const fteLaborPlanningLines: FteLaborPlanningLineViewModel[] = [
  {
    lineId: 'fte-001',
    programLabel: 'Atlas Core',
    projectLabel: 'Migration',
    carLabel: 'CAR-1003',
    roleOrResource: 'Software Engineer',
    namedEmployee: 'Jane Doe',
    fiscalPeriod: '2026-05',
    fte: 1.0,
    laborRate: 120000,
    calculatedLaborCost: calculateLaborCost(1.0, 120000),
    budgetStream: 'OpEx',
    costCategory: 'Labor',
    notes: 'Lead dev',
    status: 'active',
    isReadOnly: false,
  },
  {
    lineId: 'fte-002',
    programLabel: 'Atlas Core',
    projectLabel: 'Migration',
    carLabel: 'CAR-1004',
    roleOrResource: 'QA Analyst',
    namedEmployee: 'John Smith',
    fiscalPeriod: '2026-05',
    fte: 0.5,
    laborRate: 90000,
    calculatedLaborCost: calculateLaborCost(0.5, 90000),
    budgetStream: 'OpEx',
    costCategory: 'Labor',
    notes: 'Part-time QA',
    status: 'active',
    isReadOnly: false,
  },
];

// Readiness metadata (mock)
const createEditReadiness = { ready: true };
const validationReadiness = { ready: true };
const scopeGuardNotes = 'All scope guardrails met.';

// Adapter function
export function getPlanningManagementWorkspaceViewModel(): PlanningManagementWorkspaceViewModel & {
  formatted: {
    summaryCards: PlanningSummaryCardViewModel[];
    financialLines: (FinancialPlanningLineViewModel & { formattedPlannedAmount: string; formattedForecastAmount?: string })[];
    fteLaborLines: (FteLaborPlanningLineViewModel & { formattedLaborRate: string; formattedCalculatedLaborCost: string; formattedFte: string })[];
  };
  createEditReadiness: typeof createEditReadiness;
  validationReadiness: typeof validationReadiness;
  scopeGuardNotes: string;
  selectedFinancialLine?: FinancialPlanningLineViewModel;
  selectedFteLaborLine?: FteLaborPlanningLineViewModel;
} {
  return {
    sections: getPlanningManagementSections(),
    financialLines: financialPlanningLines,
    fteLaborLines: fteLaborPlanningLines,
    summaryCards: planningSummaryCards,
    formatted: {
      summaryCards: planningSummaryCards,
      financialLines: financialPlanningLines.map(line => ({
        ...line,
        formattedPlannedAmount: formatCurrency(line.plannedAmount),
        formattedForecastAmount: line.forecastAmount !== undefined ? formatCurrency(line.forecastAmount) : undefined,
      })),
      fteLaborLines: fteLaborPlanningLines.map(line => ({
        ...line,
        formattedLaborRate: formatCurrency(line.laborRate),
        formattedCalculatedLaborCost: formatCurrency(line.calculatedLaborCost),
        formattedFte: formatFte(line.fte),
      })),
    },
    createEditReadiness,
    validationReadiness,
    scopeGuardNotes,
    selectedFinancialLine: financialPlanningLines[0],
    selectedFteLaborLine: fteLaborPlanningLines[0],
  };
}
