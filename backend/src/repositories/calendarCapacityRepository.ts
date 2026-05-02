export interface CalendarCapacityRepository {
  getFiscalYears(): Promise<any[]>;
  getFiscalPeriods(fiscalYearId?: string): Promise<any[]>;
  getHolidayCalendars(): Promise<any[]>;
  getHolidays(calendarId?: string): Promise<any[]>;
  getResources(): Promise<any[]>;
  getResourceAvailability(resourceId: string): Promise<any>;
  getForecastCalendarContext(programId: string): Promise<any>;
}
