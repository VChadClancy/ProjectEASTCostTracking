// Planning Management Workspace Model for Sprint 17

export type PlanningLineType =
  | 'labor'
  | 'software'
  | 'hardware'
  | 'consulting'
  | 'other';

export type PlanningManagementSectionStatus = 'active' | 'preview' | 'future' | 'placeholder';

export interface PlanningManagementSection {
  id: string;
  title: string;
  description: string;
  order: number;
  capabilityArea: string;
  status: PlanningManagementSectionStatus;
}

export interface FinancialPlanningLineViewModel {
  lineId: string;
  programLabel?: string;
  projectLabel?: string;
  carLabel?: string;
  lineType: PlanningLineType;
  fiscalPeriod: string;
  budgetStream: string;
  costCategory: string;
  plannedAmount: number;
  forecastAmount?: number;
  notes?: string;
  status?: string;
}

export interface FteLaborPlanningLineViewModel {
  lineId: string;
  programLabel?: string;
  projectLabel?: string;
  carLabel?: string;
  roleOrResource: string;
  namedEmployee?: string;
  fiscalPeriod: string;
  fte: number;
  laborRate: number;
  calculatedLaborCost: number;
  budgetStream: string;
  costCategory: string;
  notes?: string;
  status?: string;
  isReadOnly?: boolean;
}

export interface PlanningSummaryCardViewModel {
  id: string;
  title: string;
  value: number | string;
  description?: string;
  icon?: string;
}

export interface PlanningManagementWorkspaceViewModel {
  sections: PlanningManagementSection[];
  financialLines: FinancialPlanningLineViewModel[];
  fteLaborLines: FteLaborPlanningLineViewModel[];
  summaryCards: PlanningSummaryCardViewModel[];
}

// Section definitions
const planningManagementSections: PlanningManagementSection[] = [
  {
    id: 'workspaceHeader',
    title: 'Workspace Header',
    description: 'Header for the planning management workspace.',
    order: 1,
    capabilityArea: 'workspace',
    status: 'active',
  },
  {
    id: 'planningSummaryCards',
    title: 'Planning Summary Cards',
    description: 'Summary cards for key planning metrics.',
    order: 2,
    capabilityArea: 'summary',
    status: 'active',
  },
  {
    id: 'financialLinesList',
    title: 'Financial Lines List',
    description: 'List of financial planning lines.',
    order: 3,
    capabilityArea: 'financial',
    status: 'active',
  },
  {
    id: 'fteLaborLinesList',
    title: 'FTE/Labor Lines List',
    description: 'List of FTE/labor planning lines.',
    order: 4,
    capabilityArea: 'fteLabor',
    status: 'active',
  },
  {
    id: 'financialLineDetailDrawer',
    title: 'Financial Line Detail Drawer',
    description: 'Detail drawer for financial planning lines.',
    order: 5,
    capabilityArea: 'financial',
    status: 'preview',
  },
  {
    id: 'fteLaborLineDetailDrawer',
    title: 'FTE/Labor Line Detail Drawer',
    description: 'Detail drawer for FTE/labor planning lines.',
    order: 6,
    capabilityArea: 'fteLabor',
    status: 'preview',
  },
  {
    id: 'createEditPlanningLineForm',
    title: 'Create/Edit Planning Line Form',
    description: 'Form for creating or editing planning lines.',
    order: 7,
    capabilityArea: 'form',
    status: 'preview',
  },
  {
    id: 'validationFeedback',
    title: 'Validation Feedback',
    description: 'Validation feedback for planning line forms.',
    order: 8,
    capabilityArea: 'validation',
    status: 'future',
  },
  {
    id: 'scopeGuardReadinessNotes',
    title: 'Scope Guard / Readiness Notes',
    description: 'Notes on scope guardrails and readiness.',
    order: 9,
    capabilityArea: 'scope',
    status: 'future',
  },
];

export function getPlanningManagementSections(): PlanningManagementSection[] {
  return planningManagementSections;
}

export function getPrimaryPlanningManagementSections(): PlanningManagementSection[] {
  return planningManagementSections.filter(
    (section) => section.status === 'active'
  );
}

export function getPreviewPlanningManagementSections(): PlanningManagementSection[] {
  return planningManagementSections.filter(
    (section) => section.status === 'preview'
  );
}

export function getFuturePlanningManagementSections(): PlanningManagementSection[] {
  return planningManagementSections.filter(
    (section) => section.status === 'future'
  );
}

export function getPlanningManagementRenderModel(): PlanningManagementWorkspaceViewModel {
  return {
    sections: planningManagementSections,
    financialLines: [],
    fteLaborLines: [],
    summaryCards: [],
  };
}
