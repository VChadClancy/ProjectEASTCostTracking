# Sprint 17: Financial Line + FTE Planning Management v1

## Checkpoint 160 Implementation Summary

### 1. Workspace Model
- Workspace header
- Planning summary cards
- Financial lines list
- FTE/labor lines list
- Financial line detail drawer
- FTE/labor line detail drawer
- Create/edit planning line form structure
- Validation feedback
- Scope guard/readiness notes

### 2. Data Adapter
- Mock-backed Planning Management view model
- Planning summary cards
- Financial planning line data
- FTE/labor planning line data
- Named employee support
- FTE quantity
- Labor rate
- Calculated labor cost
- Formatted FTE and currency values
- Safe handling of missing numeric values

### 3. Layout Component
- MED-aligned Planning Management workspace
- Financial lines visible
- FTE/labor lines visible as first-class section
- Summary first
- Clean list/card presentation
- No dense spreadsheet by default
- No raw JSON/debug output

### 4. Detail and Form Models
- Financial planning line detail model
- FTE/labor planning line detail model
- Financial planning line form model
- FTE/labor planning line form model
- Required field definitions
- Validation helpers
- Labor cost calculation helper

### 5. Detail Drawer and Form UI
- Financial line detail drawer UI
- FTE/labor line detail drawer UI
- Create/edit form structure UI
- Required fields displayed
- Validation readiness represented
- No persistence workflow yet

### 6. Navigation Integration
- Planning/Planning Management nav item added
- Planning nav maps to PlanningManagementWorkspace
- Program Workspace remains default app content
- No React Router added

### 7. Runtime Behavior
- Frontend default remains mock-backed
- Optional API mode remains controlled
- Backend default remains mock-backed unless explicitly changed
- Existing guarded Prisma path remains unchanged unless explicitly approved

### 8. Scope Guard
- FTE/labor planning remains first-class core scope
- No resource availability calendars in Sprint 17
- No capacity/overallocation detection in Sprint 17
- No forecast version create/save in Sprint 17
- No forecast publishing in Sprint 17
- No actuals intake in Sprint 17
- No invoice automation in Sprint 17
- No AI recommendations in Sprint 17
- No approval workflow in Sprint 17
- No backend API expansion beyond existing approved pattern
- No Prisma schema changes unless explicitly approved

### 9. Mandatory Visual Check
- App must be launched locally before PR.
- Program Workspace must still open by default.
- Planning nav must open Planning Management.
- Financial lines must render cleanly.
- FTE/labor lines must render cleanly and visibly.
- Detail drawer/form UI must be readable.
- Currency/FTE/rate values must be formatted.
- No raw JSON/debug data should appear.
- Browser console must be checked for errors.

### 10. Sprint 18 Handoff
- Approved roadmap next capability is Resource Availability Calendars v1.
- This supports later Capacity / Overallocation Detection.
- Do not silently add capacity detection or AI recommendations into Sprint 18 without explicit sprint scope confirmation.
