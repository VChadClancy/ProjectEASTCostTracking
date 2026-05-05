import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';
import type { Program, Project, Car, Workstream, FiscalYear, FiscalPeriod } from './programFinancialRepository';

export async function getPrograms(): Promise<Program[]> {
  return getProgramFinancialRepository().getPrograms();
}

export async function getProjects(programId?: string): Promise<Project[]> {
  return getProgramFinancialRepository().getProjects(programId);
}

export async function getCars(projectId?: string): Promise<Car[]> {
  return getProgramFinancialRepository().getCars(projectId);
}

export async function getWorkstreams(): Promise<Workstream[]> {
  return getProgramFinancialRepository().getWorkstreams();
}

export async function getFiscalYears(): Promise<FiscalYear[]> {
  return getProgramFinancialRepository().getFiscalYears();
}

export async function getFiscalPeriods(fiscalYearId?: string): Promise<FiscalPeriod[]> {
  return getProgramFinancialRepository().getFiscalPeriods(fiscalYearId);
}
