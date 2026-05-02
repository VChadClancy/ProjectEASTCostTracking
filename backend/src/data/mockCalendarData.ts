// Mock Calendar, Fiscal Year, Fiscal Period, Holiday Calendar, Holiday data for backend

export const fiscalYears = [
  { id: 'FY25', name: 'Fiscal Year 2025', start: '2025-01-01', end: '2025-12-31' },
  { id: 'FY26', name: 'Fiscal Year 2026', start: '2026-01-01', end: '2026-12-31' }
];

export const fiscalPeriods = [
  { id: 'FY25-P1', fiscalYearId: 'FY25', name: 'January 2025', start: '2025-01-01', end: '2025-01-31' },
  { id: 'FY25-P2', fiscalYearId: 'FY25', name: 'February 2025', start: '2025-02-01', end: '2025-02-28' },
  { id: 'FY26-P1', fiscalYearId: 'FY26', name: 'January 2026', start: '2026-01-01', end: '2026-01-31' }
];

export const holidayCalendars = [
  { id: 'us', name: 'US Holidays', country: 'US' }
];

export const holidays = [
  { id: 'us-2025-01-01', calendarId: 'us', name: 'New Year\'s Day', date: '2025-01-01' },
  { id: 'us-2025-07-04', calendarId: 'us', name: 'Independence Day', date: '2025-07-04' },
  { id: 'us-2025-12-25', calendarId: 'us', name: 'Christmas Day', date: '2025-12-25' }
];
