# EPFOS Logical Database Schema v1

**Status:** Logical schema only. No physical database or backend code is implemented. Mock services remain in use. Frontend does not write durable records. This document guides future backend/database implementation.

## 1. Purpose
Define the logical database schema to support core financial planning, forecasting, and reporting for EPFOS, enabling future enterprise integration and auditability.

## 2. Schema Design Principles
- Entity-relationship clarity and normalization
- Support for enterprise metadata and audit
- Calendar-aware and period-based planning
- Extensible for future analytics and integration
- No direct frontend writes to durable storage

## 3. Core Entity Overview
- **Program**: Top-level funding/initiative
- **Project**: Work within a Program
- **CAR**: Capital Appropriation Request, funding vehicle
- **Workstream**: Logical grouping of work
- **FiscalYear/FiscalPeriod**: Calendar structure
- **BudgetStream/CostCategory**: Reference data for financial lines
- **FinancialLine**: Core transactional planning object
- **ProgramFinancialSummary**: Aggregated program-level financials
- **Calendar-aware entities**: For future forecasting
- **AuditEvent**: Enterprise audit trail

## 4. Entity Relationship Summary
- Program has many Projects, Workstreams, FinancialLines
- Project belongs to Program, may link to CAR, Workstream
- CAR may fund multiple Projects
- FinancialLine links to Program, Project, CAR, Workstream, BudgetStream, CostCategory, FiscalPeriod
- FiscalYear has many FiscalPeriods
- Calendar-aware entities relate to resource planning (future)

## 5. Program Table
- **Purpose:** Represents a top-level funding initiative
- **Key Fields:** id, name, description, status, createdAt, updatedAt, createdBy, updatedBy
- **Relationships:** Has many Projects, Workstreams, FinancialLines
- **Notes:** Program is the system-of-record for funding scope

## 6. Project Table
- **Purpose:** Represents a discrete body of work within a Program
- **Key Fields:** id, programId, carId, name, status, createdAt, updatedAt, createdBy, updatedBy
- **Relationships:** Belongs to Program, may link to CAR, has many FinancialLines
- **Notes:** Project is the system-of-record for delivery scope

## 7. CAR Table
- **Purpose:** Capital Appropriation Request (funding vehicle)
- **Key Fields:** id, carNumber, description, status, createdAt, updatedAt, createdBy, updatedBy
- **Relationships:** May fund multiple Projects, referenced by FinancialLines
- **Notes:** Not all Projects require a CAR

## 8. Workstream Table
- **Purpose:** Logical grouping of work within a Program
- **Key Fields:** id, programId, name, description, status, createdAt, updatedAt, createdBy, updatedBy
- **Relationships:** Belongs to Program, referenced by FinancialLines

## 9. FiscalYear Table
- **Purpose:** Defines a fiscal year
- **Key Fields:** id, year, startDate, endDate, status, createdAt, updatedAt, createdBy, updatedBy
- **Relationships:** Has many FiscalPeriods

## 10. FiscalPeriod Table
- **Purpose:** Defines a fiscal period (e.g., month, quarter)
- **Key Fields:** id, fiscalYearId, periodNumber, startDate, endDate, status, createdAt, updatedAt, createdBy, updatedBy
- **Relationships:** Belongs to FiscalYear, referenced by FinancialLines

## 11. BudgetStream Reference Table
- **Purpose:** Reference for budget streams (e.g., CapEx, OpEx)
- **Key Fields:** id, code, name, description, status
- **Relationships:** Referenced by FinancialLines

## 12. CostCategory Reference Table
- **Purpose:** Reference for cost categories (e.g., Labor, Materials)
- **Key Fields:** id, code, name, description, status
- **Relationships:** Referenced by FinancialLines

## 13. FinancialLine Table
- **Purpose:** Core transactional planning object (budget/forecast/actual)
- **Key Fields:** id, programId, projectId, carId, workstreamId, budgetStreamId, costCategoryId, fiscalPeriodId, amount, type, status, createdAt, updatedAt, createdBy, updatedBy
- **Relationships:** Links to Program, Project, CAR, Workstream, BudgetStream, CostCategory, FiscalPeriod
- **Notes:** FinancialLine is the system-of-record for planning/actuals. Run Cost is Expense-only for now. Delivery costs may link to Project/CAR; Run costs may exist at Program level.

## 14. Calendar-Aware Forecasting Entities (Design Only)
- **FiscalCalendar:** Defines fiscal structure (id, name, description)
- **HolidayCalendar:** Defines holiday sets (id, name, description)
- **Holiday:** Dates in a HolidayCalendar (id, holidayCalendarId, date, name)
- **Resource:** Person or asset (id, name, type, status)
- **ResourceAssignment:** Assigns Resource to Project/Workstream (id, resourceId, projectId, workstreamId, startDate, endDate)
- **PlannedAbsence:** Resource time off (id, resourceId, startDate, endDate, type)
- **ResourceAvailability:** Resource available hours (id, resourceId, fiscalPeriodId, availableHours)
- **ForecastAssumption:** Scenario/driver for forecasting (id, programId, description, value)
- **Notes:** These entities are for future calendar-aware forecasting. Not implemented yet.

## 15. AuditEvent Table
- **Purpose:** Enterprise audit trail for data changes
- **Key Fields:** id, entityType, entityId, eventType, eventTime, userId, details
- **Relationships:** Links to all auditable entities

## 16. Common Enterprise Metadata Fields
- id, createdAt, updatedAt, createdBy, updatedBy, status, version

## 17. Data Ownership and System-of-Record Notes
- Program, Project, CAR, FinancialLine are system-of-record for their respective domains
- Reference tables (BudgetStream, CostCategory) are managed centrally
- AuditEvent is authoritative for change history

## 18. Out of Scope for v1
- Physical database technology selection
- Production backend implementation
- Advanced analytics, reporting, or integration
- Non-REST protocols (GraphQL, gRPC, etc.)

## 19. Future Expansion Candidates
- Actuals ingestion and reconciliation
- Advanced forecasting and scenario modeling
- Integration with HR/resource systems
- Support for additional cost types and funding models
- Enhanced audit and compliance features

---

**Note:** This is a logical schema only. No backend or database code is implemented. Mock services remain in use. Calendar-aware forecasting entities are included for design readiness, not implementation. FinancialLine is the core transactional object. Run Cost is Expense-only for now. Delivery costs may link to Project/CAR; Run costs may exist at Program level.
