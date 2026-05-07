// Program Workspace Page Model for Sprint 12
// Structure only, no data fetching or UI logic

export type ProgramWorkspaceSectionStatus = 'active' | 'preview' | 'future' | 'placeholder';

export interface ProgramWorkspaceSection {
  id: string;
  title: string;
  description: string;
  order: number;
  capabilityArea: string;
  status: ProgramWorkspaceSectionStatus;
}

export const programWorkspaceSections: ProgramWorkspaceSection[] = [
  {
    id: 'programFinancialSummary',
    title: 'Program Financial Summary',
    description: 'High-level financial overview for the program, including key metrics and signals.',
    order: 1,
    capabilityArea: 'financial-visibility',
    status: 'active',
  },
  {
    id: 'activeProjectsAndCars',
    title: 'Active Projects & CARs',
    description: 'List and overview of active projects and Capital Authorization Requests (CARs).',
    order: 2,
    capabilityArea: 'project-portfolio',
    status: 'active',
  },
  {
    id: 'financialLinePreview',
    title: 'Financial Line Preview',
    description: 'Preview of financial lines relevant to the program, with summary and quick access.',
    order: 3,
    capabilityArea: 'financial-lines',
    status: 'active',
  },
  {
    id: 'budgetStreamFunding',
    title: 'Budget Stream / Funding',
    description: 'Visibility into budget streams and funding allocations for the program.',
    order: 4,
    capabilityArea: 'funding',
    status: 'preview',
  },
  {
    id: 'varianceSignals',
    title: 'Variance Signals',
    description: 'Signals and alerts for financial variances and exceptions.',
    order: 5,
    capabilityArea: 'variance',
    status: 'preview',
  },
  {
    id: 'actualsIntakeReadiness',
    title: 'Actuals Intake Readiness',
    description: 'Marker for future actuals intake engine readiness and integration.',
    order: 6,
    capabilityArea: 'actuals-intake',
    status: 'future',
  },
];

export function getProgramWorkspaceSections(): ProgramWorkspaceSection[] {
  return [...programWorkspaceSections];
}

export function getPrimaryProgramWorkspaceSections(): ProgramWorkspaceSection[] {
  // MED guidance: 3–6 primary modules, status active or preview
  return programWorkspaceSections.filter(
    (section) => section.status === 'active' || section.status === 'preview'
  );
}

export function getFutureProgramWorkspaceSections(): ProgramWorkspaceSection[] {
  return programWorkspaceSections.filter(
    (section) => section.status === 'future' || section.status === 'placeholder'
  );
}
