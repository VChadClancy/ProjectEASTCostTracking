// Repository abstraction for program financial data
// Sprint 4: Checkpoint 31

import { EnterpriseMetadata } from './enterpriseTypes';

// --- Filter Types ---
export interface FinancialLineFilters {
  programId?: string;
  projectId?: string;
  carId?: string;
  workstreamId?: string;
  fiscalYearId?: string;
  fiscalPeriodId?: string;
  // Add more filters as needed
}

// --- Entity Types (minimal, for type contract) ---
export interface Program extends EnterpriseMetadata {
  name: string;
}

export interface Project extends EnterpriseMetadata {
  programId: string;
  name: string;
}

export interface Car extends EnterpriseMetadata {
  projectId: string;
  name: string;
}

export interface Workstream extends EnterpriseMetadata {
  name: string;
}

export interface FiscalYear {
  id: string;
  name: string;
}

export interface FiscalPeriod {
  id: string;
  fiscalYearId: string;
  name: string;
}

export interface FinancialLine {
  id: string;
  // ...other fields as needed
}

export interface ProgramFinancialSummary {
  programId: string;
  // ...other summary fields as needed
}

// --- Repository Interface ---
export interface ProgramFinancialRepository {
  getPrograms(): Promise<Program[]>;
  getProjects(programId?: string): Promise<Project[]>;
  getCars(projectId?: string): Promise<Car[]>;
  getWorkstreams(): Promise<Workstream[]>;
  getFiscalYears(): Promise<FiscalYear[]>;
  getFiscalPeriods(fiscalYearId?: string): Promise<FiscalPeriod[]>;
  getFinancialLines(filters?: FinancialLineFilters): Promise<FinancialLine[]>;
  getProgramFinancialSummary(programId: string): Promise<ProgramFinancialSummary>;
}
