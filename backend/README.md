# Project EAST Backend Service

## Purpose
This backend provides a RESTful API scaffold for Project EAST cost tracking and forecasting. It is designed to align with the API contract in [`docs/architecture/api-contract-v1.md`](../docs/architecture/api-contract-v1.md). The current implementation is a stub service for development and integration scaffolding.

## Current Status
- **Scaffold/stub service only**
- **No database persistence**
- **No authentication**
- **No frontend integration**
- **All route responses are static stubs**
- **Not production-ready**

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run in development mode:**
   ```sh
   npm run dev
   ```
3. **Typecheck:**
   ```sh
   npm run typecheck
   ```
4. **Run backend tests:**
   ```sh
   npm test
   ```
5. **Build for production:**
   ```sh
   npm run build
   ```
6. **Start the built server:**
   ```sh
   npm start
   ```

- The backend runs on **port 4000** by default.

## Health Endpoint
- `GET /api/health` — Returns service health status (always healthy in stub)

## API Route Summary

### Program Endpoints
- `GET /api/v1/programs` — List all programs
- `GET /api/v1/programs/:programId` — Get a program by ID
- `GET /api/v1/programs/:programId/projects` — List projects for a program
- `GET /api/v1/programs/:programId/forecast-calendar-context` — Get forecast calendar context for a program

### Project Endpoints
- `GET /api/v1/projects/:projectId` — Get a project by ID
- `GET /api/v1/projects/:projectId/cars` — List CARs for a project

### CAR Endpoints
- `GET /api/v1/cars/:carId` — Get a CAR by ID

### Workstream Endpoints
- `GET /api/v1/workstreams` — List all workstreams

### Financial Line Endpoints
- `GET /api/v1/financial-lines` — List all financial lines
- `GET /api/v1/financial-lines/:lineId` — Get a financial line by ID
- `POST /api/v1/financial-lines` — Create a financial line (stub)
- `PUT /api/v1/financial-lines/:lineId` — Update a financial line (stub)

### Calendar / Capacity Endpoints
- `GET /api/v1/fiscal-years` — List fiscal years
- `GET /api/v1/fiscal-periods` — List fiscal periods
- `GET /api/v1/holiday-calendars` — List holiday calendars
- `GET /api/v1/holiday-calendars/:calendarId/holidays` — List holidays for a calendar
- `GET /api/v1/programs/:programId/forecast-calendar-context` — Get forecast calendar context for a program

## Not Implemented Yet
- No database or persistent storage
- No authentication or authorization
- No frontend integration
- No real business logic; all endpoints return static stub data

## Alignment
- This backend is aligned to [`docs/architecture/api-contract-v1.md`](../docs/architecture/api-contract-v1.md)

---

**For API contract details, see [`docs/architecture/api-contract-v1.md`](../docs/architecture/api-contract-v1.md).**
