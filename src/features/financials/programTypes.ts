// Program, Project, CAR, Workstream, FiscalYear, FiscalPeriod, and status types for enterprise financial planning

export type ProgramStatus = 'Draft' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
export type ProjectStatus = 'Draft' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface FiscalYear {
  id: string;
  name: string; // e.g., 'FY2026'
  startDate: string; // ISO date
  endDate: string; // ISO date
}

export interface FiscalPeriod {
  id: string;
  fiscalYearId: string;
  name: string; // e.g., 'Q1', 'Jan', 'Period 1'
  startDate: string; // ISO date
  endDate: string; // ISO date
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  status: ProgramStatus;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
}

export interface Project {
  id: string;
  programId?: string;
  name: string;
  description?: string;
  owner?: string;
  status: ProjectStatus;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
}

export interface CAR {
  id: string;
  projectId?: string;
  name: string;
  description?: string;
  owner?: string;
  approvalStatus: ApprovalStatus;
  approvedAmount?: number;
  capitalAmount?: number;
  expenseAmount?: number;
  fiscalYearId?: string;
  fiscalPeriodId?: string;
}

export interface Workstream {
  id: string;
  projectId?: string;
  name: string;
  description?: string;
  owner?: string;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
}
