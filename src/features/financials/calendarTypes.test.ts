import { describe, it, expect } from "vitest";
// Basic type-focused tests for calendarTypes
import type {
  FiscalCalendar,
  HolidayCalendar,
  Holiday,
  Resource,
  ResourceAssignment,
  PlannedAbsence,
  ResourceAvailability,
  ForecastAssumption,
  WorkingDayProfile
} from './calendarTypes';

describe('FiscalCalendar', () => {
  it('should allow creation of a valid fiscal calendar', () => {
    const cal: FiscalCalendar = {
      id: 'fc1',
      name: 'FY26',
      description: 'Fiscal Year 2026',
      status: 'Active',
      createdBy: 'user',
      createdAt: new Date().toISOString(),
      updatedBy: 'user',
      updatedAt: new Date().toISOString(),
      sourceSystem: 'EPFOS'
    };
    expect(cal.name).toBe('FY26');
  });
});

describe('ResourceAvailability', () => {
  it('should allow creation of a valid resource availability', () => {
    const avail: ResourceAvailability = {
      id: 'ra1',
      resourceId: 'r1',
      fiscalPeriodId: 'fp1',
      availableHours: 160,
      status: 'Active',
      createdBy: 'user',
      createdAt: new Date().toISOString()
    };
    expect(avail.availableHours).toBe(160);
  });
});
