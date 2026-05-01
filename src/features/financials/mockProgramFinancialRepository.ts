// Mock implementation of ProgramFinancialRepository
import type { ProgramFinancialRepository, FinancialLineFilters, Program, Project, Car, Workstream, FiscalYear, FiscalPeriod, FinancialLine, ProgramFinancialSummary } from './programFinancialRepository';
import { getPrograms as getMockPrograms, getProjects as getMockProjects, getCars as getMockCars, getWorkstreams as getMockWorkstreams, getFiscalYears as getMockFiscalYears, getFiscalPeriods as getMockFiscalPeriods } from './programService';
import { getFinancialLines as getMockFinancialLines } from './financialLineService';
import { getProgramFinancialSummary as getMockProgramFinancialSummary } from './programFinancialSummaryService';

// Helper to add EnterpriseMetadata fields and map status
const toEntityStatus = (status: any): 'Active' | 'Inactive' | 'Draft' | 'Archived' => {
  if (status === 'Active' || status === 'Inactive' || status === 'Draft' || status === 'Archived') return status;
  if (status === 'Completed') return 'Inactive';
  if (status === 'On Hold') return 'Draft';
  if (status === 'Cancelled') return 'Archived';
  return 'Active';
};
const addEnterpriseMetadata = <T extends { id: string }>(obj: T & { status?: any }): T & {
  status: 'Active' | 'Inactive' | 'Draft' | 'Archived';
  createdBy: string;
  createdAt: string;
} => ({
  ...obj,
  status: toEntityStatus(obj.status),
  createdBy: 'mock',
  createdAt: '2026-01-01T00:00:00Z',
});

export const mockProgramFinancialRepository: ProgramFinancialRepository = {
  async getPrograms() {
    return getMockPrograms().map(p => addEnterpriseMetadata(p));
  },
  async getProjects(programId) {
    let projects = getMockProjects();
    if (programId) {
      projects = projects.filter(p => p.programId === programId);
    }
    return projects.map(p => addEnterpriseMetadata({ ...p, programId: p.programId ?? '', status: p.status }));
  },
  async getCars(projectId) {
    let cars = getMockCars();
    if (projectId) {
      cars = cars.filter(c => c.projectId === projectId);
    }
    // Car requires status, createdBy, createdAt
    return cars.map(c => addEnterpriseMetadata({ ...c, projectId: c.projectId ?? '', status: 'Active' }));
  },
  async getWorkstreams() {
    // Workstream requires status, createdBy, createdAt
    return getMockWorkstreams().map(w => addEnterpriseMetadata({ ...w, status: 'Active' }));
  },
  async getFiscalYears() {
    return getMockFiscalYears();
  },
  async getFiscalPeriods(fiscalYearId) {
    let periods = getMockFiscalPeriods();
    if (fiscalYearId) {
      periods = periods.filter(p => p.fiscalYearId === fiscalYearId);
    }
    return periods;
  },
  async getFinancialLines(filters) {
    let lines = getMockFinancialLines();
    if (filters) {
      if (filters.programId) {
        lines = lines.filter(l => l.programId === filters.programId);
      }
      if (filters.projectId) {
        lines = lines.filter(l => l.projectId === filters.projectId);
      }
      if (filters.carId) {
        lines = lines.filter(l => l.carId === filters.carId);
      }
      if (filters.workstreamId) {
        lines = lines.filter(l => l.workstreamId === filters.workstreamId);
      }
      if (filters.fiscalYearId) {
        lines = lines.filter(l => l.fiscalYearId === filters.fiscalYearId);
      }
      if (filters.fiscalPeriodId) {
        lines = lines.filter(l => l.fiscalPeriodId === filters.fiscalPeriodId);
      }
    }
    return lines;
  },
  async getProgramFinancialSummary(programId) {
    const summary = getMockProgramFinancialSummary();
    return { programId, ...summary } as ProgramFinancialSummary;
  },
};
