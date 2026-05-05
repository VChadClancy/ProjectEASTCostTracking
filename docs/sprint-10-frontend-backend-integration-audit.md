# Sprint 10: Frontend/Backend Integration Audit

**Date:** 2026-05-05

## 1. Current Frontend Financial Data Flow

### Data Sourcing
- All financial data in the frontend (`src/features/financials/`) is currently sourced from mock data and services.
- The default repository is `mockProgramFinancialRepository`.
- The repository contract is defined in `programFinancialRepository.ts`.
- An API repository stub (`apiProgramFinancialRepository.ts`) exists but is not implemented or used.

### Repository Contract Methods
Defined in `programFinancialRepository.ts`:
- `getPrograms()`
- `getProjects(programId?)`
- `getCars(projectId?)`
- `getWorkstreams()`
- `getFiscalYears()`
- `getFiscalPeriods(fiscalYearId?)`
- `getFinancialLines(filters?)`
- `getProgramFinancialSummary(programId)`

### Repository Implementations
- **Mock:** `mockProgramFinancialRepository` (default, fully implemented)
- **API:** `ApiProgramFinancialRepository` (exists, all methods throw 'not implemented')

### Service/Utility Functions Consuming the Repository
- `financialLineService.ts` (mock data generation)
- `programFinancialSummaryService.ts` (summary rollups)
- `programService.ts` (mock program/project/car/workstream data)

### UI/Screen Usage
- Components and services in `src/features/financials/` consume financial summary and line data via the mock repository and services.
- No direct API calls for financial data in the frontend yet.

## 2. Backend API Route Availability

### Implemented Express Routes (all stub/placeholder, not DB-backed):
- `/api/v1/programs` (GET)
- `/api/v1/programs/:programId` (GET)
- `/api/v1/programs/:programId/projects` (GET)
- `/api/v1/financial-lines` (GET, POST)
- `/api/v1/financial-lines/:lineId` (GET, PUT)

### Route Handlers
- All handlers in `backend/src/controllers/` are stubbed and return static or empty data.
- No backend route currently returns real financial data from the database.

## 3. Proposed Integration Order
1. **Read-only integration:**
   - Implement API repository methods for `getPrograms`, `getProjects`, `getFinancialLines`, and `getProgramFinancialSummary`.
   - Integrate frontend to use API repository for read-only data (behind a feature flag or config).
2. **Fallback:**
   - Retain mock repository as fallback/default until API is stable.
3. **Write operations:**
   - Do not implement create/edit UI or backend until explicitly approved.
4. **Backend:**
   - Do not switch backend to Prisma by default in Sprint 10.

## 4. Known Gaps
- No backend route currently returns real financial data.
- API repository is not implemented.
- No runtime config for switching between mock/API repository.
- No tests for API repository.
- No create/edit UI for financial lines (by design).

## 5. Recommended Sprint 10 Integration Approach
- **Keep mock repository as fallback.**
- **Add controlled API repository selection later.**
- **Start with read-only financial summary and financial line reads.**
- **Do not implement create/edit UI in Sprint 10 unless explicitly approved.**
- **Do not switch backend to Prisma by default.**
- **Document all integration steps and gaps.**

---

**References:**
- Frontend repository contract: `src/features/financials/programFinancialRepository.ts`
- Mock repository: `src/features/financials/mockProgramFinancialRepository.ts`
- API repository stub: `src/features/financials/apiProgramFinancialRepository.ts`
- Backend routes: `backend/src/routes/`
- Backend controllers: `backend/src/controllers/`

---

*This document is for audit/documentation only. No application behavior has been changed.*
