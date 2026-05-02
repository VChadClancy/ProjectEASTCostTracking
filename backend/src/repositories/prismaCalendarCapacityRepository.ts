import { CalendarCapacityRepository } from './calendarCapacityRepository';
import { NotImplementedError } from './prismaRepositoryUtils';

export class PrismaCalendarCapacityRepository implements CalendarCapacityRepository {
  async getFiscalYears(): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getFiscalPeriods(fiscalYearId?: string): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getHolidayCalendars(): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getHolidays(calendarId?: string): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getResources(): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getResourceAvailability(resourceId: string): Promise<any> {
    throw new NotImplementedError();
  }
  async getForecastCalendarContext(programId: string): Promise<any> {
    throw new NotImplementedError();
  }
}
