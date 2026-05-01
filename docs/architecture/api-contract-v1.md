# EPFOS Backend API Contract v1

**Status:** Design/contract only. No backend implementation yet. Mock services remain in use for frontend development. Frontend should call repository/API adapters, not own durable data directly. Calendar-aware forecasting endpoints are included for design readiness, not full implementation yet.

## 1. Purpose
Define the v1 API contract for the EPFOS backend service, supporting core financial planning and forecasting objects, and enabling future enterprise integration.

## 2. API Design Principles
- RESTful resource-oriented endpoints
- Predictable, consistent URL structure
- JSON request/response bodies
- Stateless operations
- Calendar-aware and period-based data support
- Enterprise metadata and auditability

## 3. Base Path and Versioning
- All endpoints are under `/api/v1/`
- Versioning via URL path

## 4. Common Response Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {},
  "errors": []
}
```
- `success`: boolean
- `data`: resource or array
- `meta`: pagination, totals, etc.
- `errors`: array of error objects

## 5. Error Response Shape
```json
{
  "success": false,
  "errors": [
    {
      "code": "RESOURCE_NOT_FOUND",
      "message": "Resource not found.",
      "field": "projectId"
    }
  ]
}
```

## 6. Pagination/Filtering Conventions
- Pagination: `?page=1&pageSize=50`
- Filtering: `?filter=...` (field-specific)
- Sorting: `?sort=field,-otherField`
- `meta` includes `total`, `page`, `pageSize`, `pages`

## 7. Enterprise Metadata Fields
- `id`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `status`, `version`

## 8. Program Endpoints
- `GET /api/v1/programs`
- `GET /api/v1/programs/{programId}`
- `GET /api/v1/programs/{programId}/projects`
- `GET /api/v1/programs/{programId}/financial-summary`
- `GET /api/v1/programs/{programId}/forecast-calendar-context`

## 9. Project Endpoints
- `GET /api/v1/projects/{projectId}`
- `GET /api/v1/projects/{projectId}/cars`

## 10. CAR Endpoints
- `GET /api/v1/cars/{carId}`

## 11. Workstream Endpoints
- `GET /api/v1/workstreams`

## 12. Fiscal Calendar Endpoints
- `GET /api/v1/fiscal-years`
- `GET /api/v1/fiscal-periods`
- `GET /api/v1/holiday-calendars`
- `GET /api/v1/holiday-calendars/{calendarId}/holidays`

## 13. Financial Line Endpoints
- `GET /api/v1/financial-lines`
- `POST /api/v1/financial-lines`
- `PUT /api/v1/financial-lines/{lineId}`

## 14. Program Financial Summary Endpoints
- `GET /api/v1/programs/{programId}/financial-summary`

## 15. Calendar-Aware Forecasting Endpoints
- `GET /api/v1/programs/{programId}/forecast-calendar-context`
- `GET /api/v1/resources`
- `GET /api/v1/resources/{resourceId}/availability`

## 16. Future Authentication/Authorization Assumptions
- Role-based access control (RBAC) will be required
- Endpoints will require authentication (e.g., OAuth2, JWT)
- Audit fields will be populated by backend

## 17. Out of Scope for v1
- Final database technology selection
- Production backend implementation
- Advanced reporting, analytics, and integration endpoints
- Non-REST protocols (GraphQL, gRPC, etc.)

---

**Note:** This document is a contract/design only. No backend code is implemented yet. Mock services remain in use until backend work begins. Calendar-aware forecasting endpoints are included for design readiness, not full implementation yet.
