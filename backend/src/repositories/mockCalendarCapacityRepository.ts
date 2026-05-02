// Mock implementation of CalendarCapacityRepository
import { CalendarCapacityRepository } from './calendarCapacityRepository';
import { fiscalYears, fiscalPeriods, holidayCalendars, holidays } from '../data/mockCalendarData';
import { resources, resourceAvailability } from '../data/mockProgramData';

export class MockCalendarCapacityRepository implements CalendarCapacityRepository {
  async getFiscalYears(): Promise<any[]> {
    return fiscalYears;
  }
  async getFiscalPeriods(fiscalYearId?: string): Promise<any[]> {
    if (fiscalYearId) return fiscalPeriods.filter(p => p.fiscalYearId === fiscalYearId);
    return fiscalPeriods;
  }
  async getHolidayCalendars(): Promise<any[]> {
    return holidayCalendars;
  }
  async getHolidays(calendarId?: string): Promise<any[]> {
    if (calendarId) return holidays.filter(h => h.calendarId === calendarId);
    return holidays;
  }
  async getResources(): Promise<any[]> {
    return resources;
  }
  async getResourceAvailability(resourceId: string): Promise<any> {
    return resourceAvailability.find(r => r.resourceId === resourceId) || null;
  }
  async getForecastCalendarContext(programId: string): Promise<any> {
    // For mock, just return fiscal years, periods, and holidays for the program
    return {
      fiscalYears,
      fiscalPeriods,
      holidays,
    };
  }
}

export const mockCalendarCapacityRepository = new MockCalendarCapacityRepository();
