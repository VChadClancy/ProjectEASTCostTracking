// Calendar controller stubs for calendar-aware forecasting
import { Request, Response } from 'express';

// Use the existing API response envelope
type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export const getFiscalYears = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Stub: Fiscal years endpoint. Replace with database-backed service.',
    data: [2024, 2025, 2026],
  };
  res.json(response);
};

export const getFiscalPeriods = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Stub: Fiscal periods endpoint. Replace with database-backed service.',
    data: [
      { period: 'Q1', start: '2024-01-01', end: '2024-03-31' },
      { period: 'Q2', start: '2024-04-01', end: '2024-06-30' },
    ],
  };
  res.json(response);
};

export const getHolidayCalendars = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Stub: Holiday calendars endpoint. Replace with database-backed service.',
    data: [
      { id: 'us', name: 'US Federal Holidays' },
      { id: 'uk', name: 'UK Bank Holidays' },
    ],
  };
  res.json(response);
};

export const getHolidaysForCalendar = (req: Request, res: Response) => {
  const { calendarId } = req.params;
  const response: ApiResponse = {
    success: true,
    message: `Stub: Holidays for calendar ${calendarId}. Replace with database-backed service.`,
    data: [
      { date: '2024-01-01', name: 'New Year\'s Day' },
      { date: '2024-07-04', name: 'Independence Day' },
    ],
  };
  res.json(response);
};

export const getProgramForecastCalendarContext = (req: Request, res: Response) => {
  const { programId } = req.params;
  const response: ApiResponse = {
    success: true,
    message: `Stub: Forecast calendar context for program ${programId}. Replace with forecasting logic.`,
    data: {
      fiscalYear: 2024,
      calendarId: 'us',
      holidays: [],
    },
  };
  res.json(response);
};
