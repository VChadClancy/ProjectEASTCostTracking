import {
  Program,
  Project,
  CAR,
  Workstream,
  FiscalYear,
  FiscalPeriod
} from './programTypes';

// Mock Data
const programs: Program[] = [
  {
    id: 'program-east-001',
    name: 'EAST Modernization',
    description: 'Enterprise Application Systems Transformation',
    status: 'Active',
  },
];

const projects: Project[] = [
  {
    id: 'project-east-erp',
    programId: 'program-east-001',
    name: 'ERP Upgrade',
    description: 'Upgrade core ERP system',
    status: 'Active',
  },
  {
    id: 'project-east-hr',
    programId: 'program-east-001',
    name: 'HRIS Implementation',
    description: 'Implement new HR Information System',
    status: 'Active',
  },
  {
    id: 'project-east-analytics',
    programId: 'program-east-001',
    name: 'Analytics Platform',
    description: 'Deploy analytics and reporting platform',
    status: 'Draft',
  },
];

const cars: CAR[] = [
  {
    id: 'car-erp-001',
    projectId: 'project-east-erp',
    name: 'ERP Hardware',
    description: 'Purchase hardware for ERP',
    approvalStatus: 'Approved',
  },
  {
    id: 'car-erp-002',
    projectId: 'project-east-erp',
    name: 'ERP Software',
    description: 'ERP software licenses',
    approvalStatus: 'Pending',
  },
  {
    id: 'car-hr-001',
    projectId: 'project-east-hr',
    name: 'HRIS Consulting',
    description: 'Consulting for HRIS',
    approvalStatus: 'Approved',
  },
];

const workstreams: Workstream[] = [
  { id: 'ws-planning', name: 'Planning' },
  { id: 'ws-implementation', name: 'Implementation' },
  { id: 'ws-testing', name: 'Testing' },
  { id: 'ws-training', name: 'Training' },
];

const currentYear = new Date().getFullYear();
const fiscalYears: FiscalYear[] = [
  {
    id: `fy${currentYear}`,
    name: `${currentYear}`,
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`,
  },
  {
    id: `fy${currentYear + 1}`,
    name: `${currentYear + 1}`,
    startDate: `${currentYear + 1}-01-01`,
    endDate: `${currentYear + 1}-12-31`,
  },
];

const fiscalPeriods: FiscalPeriod[] = [];
for (const fy of fiscalYears) {
  for (let i = 1; i <= 12; i++) {
    const month = i.toString().padStart(2, '0');
    fiscalPeriods.push({
      id: `${fy.id}-p${month}`,
      fiscalYearId: fy.id,
      name: `Period ${i}`,
      startDate: `${fy.name}-${month}-01`,
      endDate: `${fy.name}-${month}-28`, // Simplified for mock
    });
  }
}

// Service Functions
export function getPrograms(): Program[] {
  return programs;
}

export function getProjects(): Project[] {
  return projects;
}

export function getCars(): CAR[] {
  return cars;
}

export function getWorkstreams(): Workstream[] {
  return workstreams;
}

export function getFiscalYears(): FiscalYear[] {
  return fiscalYears;
}

export function getFiscalPeriods(): FiscalPeriod[] {
  return fiscalPeriods;
}
