import express from 'express';
import {
  getFiscalYears,
  getFiscalPeriods,
  getHolidayCalendars,
  getHolidaysForCalendar,
  getProgramForecastCalendarContext,
} from '../controllers/calendarController';

const router = express.Router();

// GET /api/v1/fiscal-years
router.get('/fiscal-years', getFiscalYears);
// GET /api/v1/fiscal-periods
router.get('/fiscal-periods', getFiscalPeriods);
// GET /api/v1/holiday-calendars
router.get('/holiday-calendars', getHolidayCalendars);
// GET /api/v1/holiday-calendars/:calendarId/holidays
router.get('/holiday-calendars/:calendarId/holidays', getHolidaysForCalendar);
// GET /api/v1/programs/:programId/forecast-calendar-context
router.get('/programs/:programId/forecast-calendar-context', getProgramForecastCalendarContext);

export default router;
