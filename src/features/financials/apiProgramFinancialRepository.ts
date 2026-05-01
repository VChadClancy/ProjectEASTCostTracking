import type { ProgramFinancialRepository, FinancialLineFilters, Program, Project, Car, Workstream, FiscalYear, FiscalPeriod, FinancialLine, ProgramFinancialSummary } from './programFinancialRepository';

export class ApiProgramFinancialRepository implements ProgramFinancialRepository {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getPrograms(): Promise<Program[]> {
    throw new Error('API repository is not implemented yet.');
  }

  async getProjects(programId?: string): Promise<Project[]> {
    throw new Error('API repository is not implemented yet.');
  }

  async getCars(projectId?: string): Promise<Car[]> {
    throw new Error('API repository is not implemented yet.');
  }

  async getWorkstreams(): Promise<Workstream[]> {
    throw new Error('API repository is not implemented yet.');
  }

  async getFiscalYears(): Promise<FiscalYear[]> {
    throw new Error('API repository is not implemented yet.');
  }

  async getFiscalPeriods(fiscalYearId?: string): Promise<FiscalPeriod[]> {
    throw new Error('API repository is not implemented yet.');
  }

  async getFinancialLines(filters?: FinancialLineFilters): Promise<FinancialLine[]> {
    throw new Error('API repository is not implemented yet.');
  }

  async getProgramFinancialSummary(programId: string): Promise<ProgramFinancialSummary> {
    throw new Error('API repository is not implemented yet.');
  }
}
