import { appConfig } from '../../config/appConfig';
import type { ProgramFinancialRepository, FinancialLineFilters, Program, Project, Car, Workstream, FiscalYear, FiscalPeriod, FinancialLine, ProgramFinancialSummary } from './programFinancialRepository';

export class ApiProgramFinancialRepository implements ProgramFinancialRepository {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || appConfig.apiBaseUrl;
  }

  /**
   * Internal fetch helper with error and envelope handling
   */
  protected async fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, options);
    } catch (err) {
      throw new Error(`Network error: ${(err as Error).message}`);
    }
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const text = await response.text();
        message += `: ${text}`;
      } catch {}
      throw new Error(message);
    }
    let json: any;
    try {
      json = await response.json();
    } catch {
      throw new Error('Malformed JSON response');
    }
    // Backend envelope: { success, data, message }
    if (typeof json !== 'object' || json === null) {
      throw new Error('Malformed API envelope');
    }
    if ('success' in json) {
      if (!json.success) {
        throw new Error(json.message || 'API returned success: false');
      }
      if (!('data' in json)) {
        throw new Error('API envelope missing data');
      }
      return json.data as T;
    }
    // If no envelope, assume raw data (for dev/mocks)
    return json as T;
  }

  async getPrograms(): Promise<Program[]> {
    return this.fetchJson<Program[]>('/programs');
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
