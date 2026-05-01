// Calendar-aware forecasting types/interfaces for EPFOS
// Aligned to architecture docs, simple and type-focused

import type { EntityStatus, SourceSystem, EnterpriseMetadata } from './enterpriseTypes';

export interface FiscalCalendar extends EnterpriseMetadata {
  name: string;
  description?: string;
}

export interface HolidayCalendar extends EnterpriseMetadata {
  name: string;
  description?: string;
}

export interface Holiday extends EnterpriseMetadata {
  holidayCalendarId: string;
  date: string; // ISO date string
  name: string;
  description?: string;
}

export interface Resource extends EnterpriseMetadata {
  name: string;
  description?: string;
  type?: string;
}

export interface ResourceAssignment extends EnterpriseMetadata {
  resourceId: string;
  projectId?: string;
  workstreamId?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
}

export interface PlannedAbsence extends EnterpriseMetadata {
  resourceId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  type?: string;
}

export interface ResourceAvailability extends EnterpriseMetadata {
  resourceId: string;
  fiscalPeriodId: string;
  availableHours: number;
}

export interface ForecastAssumption extends EnterpriseMetadata {
  programId: string;
  description?: string;
  value?: number | string;
}

export interface WorkingDayProfile extends EnterpriseMetadata {
  name: string;
  description?: string;
  effectiveStartDate: string; // ISO date string
  effectiveEndDate?: string; // ISO date string
  daysOfWeek: number[]; // 0=Sunday, 1=Monday, ...
}
