// Service for Calendar / Capacity: provides access to mock data for calendar and capacity
import {
  fiscalYears,
  fiscalPeriods,
  holidayCalendars,
  holidays
} from '../data/mockCalendarData';

// Fiscal Years
type FiscalYear = typeof fiscalYears[number];
export function getFiscalYears(): FiscalYear[] {
  return Array.isArray(fiscalYears) ? fiscalYears : [];
}

// Fiscal Periods (optionally filter by fiscalYearId)
type FiscalPeriod = typeof fiscalPeriods[number];
export function getFiscalPeriods(fiscalYearId?: string): FiscalPeriod[] {
  if (!Array.isArray(fiscalPeriods)) return [];
  if (!fiscalYearId) return fiscalPeriods;
  return fiscalPeriods.filter(p => p.fiscalYearId === fiscalYearId);
}

// Holiday Calendars
type HolidayCalendar = typeof holidayCalendars[number];
export function getHolidayCalendars(): HolidayCalendar[] {
  return Array.isArray(holidayCalendars) ? holidayCalendars : [];
}

// Holidays (optionally filter by calendarId)
type Holiday = typeof holidays[number];
export function getHolidays(calendarId?: string): Holiday[] {
  if (!Array.isArray(holidays)) return [];
  if (!calendarId) return holidays;
  return holidays.filter(h => h.calendarId === calendarId);
}

// Resources (not implemented in mock data)
export function getResources(): any[] {
  return [];
}

// Resource Availability (not implemented in mock data)
export function getResourceAvailability(resourceId: string): null {
  return null;
}

// Forecast Calendar Context (mock-safe)
export function getForecastCalendarContext(programId: string) {
  return {
    programId,
    fiscalYears: getFiscalYears(),
    fiscalPeriods: getFiscalPeriods(),
    holidayCalendars: getHolidayCalendars(),
    resources: getResources(),
    message: 'This is mock-backed. Forecasting logic is not implemented yet.'
  };
}
