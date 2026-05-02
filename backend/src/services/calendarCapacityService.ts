// Service for Calendar / Capacity: uses repository interface
import { CalendarCapacityRepository, mockCalendarCapacityRepository } from '../repositories';

const repo: CalendarCapacityRepository = mockCalendarCapacityRepository;

export async function getFiscalYears() {
  return repo.getFiscalYears();
}

export async function getFiscalPeriods(fiscalYearId?: string) {
  return repo.getFiscalPeriods(fiscalYearId);
}

export async function getHolidayCalendars() {
  return repo.getHolidayCalendars();
}

export async function getHolidays(calendarId?: string) {
  return repo.getHolidays(calendarId);
}

export async function getResources() {
  return repo.getResources();
}

export async function getResourceAvailability(resourceId: string) {
  return repo.getResourceAvailability(resourceId);
}

export async function getForecastCalendarContext(programId: string) {
  return repo.getForecastCalendarContext(programId);
}
