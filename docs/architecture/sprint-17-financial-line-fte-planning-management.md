# Sprint 17: Financial Line + FTE Planning Management v1

## 1. Sprint 17 Objective
Create the first controlled planning management workspace for both financial planning lines and FTE/labor planning lines.

## 2. Approved In Scope
- Financial Line + FTE Planning Management workspace
- Financial line list
- FTE/labor planning line list
- Financial line detail drawer
- FTE/labor line detail drawer
- Create/edit financial planning line form structure
- Create/edit FTE planning line form structure
- Required field validation
- Program / project / CAR linkage
- Budget stream
- Cost category
- Line type
- Fiscal month / period
- Labor role/resource
- Named employee planning support
- FTE quantity
- Labor rate
- Calculated labor cost
- Monthly FTE values
- Monthly labor cost values
- Mock-backed default behavior
- Repository/service pattern alignment
- MED visual layout
- Mandatory visual application check before PR

## 3. Explicitly Not in Sprint 17 (but Approved Product Roadmap Scope)
- Resource availability calendars
- Capacity / overallocation detection
- Forecast version create/save
- Forecast publishing
- Actuals intake
- Invoice automation
- AI recommendations
- Approval workflow

## 4. Out of Scope Unless Explicitly Approved During This Sprint
- Backend API expansion beyond existing approved pattern
- Prisma schema changes
- New package dependencies
- React Router
- Production persistence expansion beyond existing pattern
- Integrations with SAP, Jira, MS Project, SharePoint, Power BI, HR systems

## 5. MED Guardrails
- Clean planning management surface
- FTE/labor planning is first-class, not hidden
- Summary first, detail on demand
- No dense spreadsheet by default
- No raw JSON/debug data
- No fake approval controls
- No AI recommendation controls yet
- Use Eaton/Atlas color alignment
- Visual application check required before PR

## 6. Initial Workspace Sections
- Workspace Header
- Planning Summary Cards
- Financial Lines Preview/List
- FTE/Labor Lines Preview/List
- Financial Line Detail Drawer
- FTE/Labor Line Detail Drawer
- Create/Edit Planning Line Form Structure
- Validation Feedback
- Scope Guard / Readiness Notes

## 7. Runtime Guardrails
- Frontend default remains mock-backed
- Optional API mode remains controlled
- Backend default remains mock-backed unless explicitly changed
- Existing guarded Prisma path remains unchanged unless explicitly approved

## 8. Expected Outcome
- Users can open a Financial Line + FTE Planning Management workspace.
- Users can see financial planning lines and FTE/labor planning lines.
- Users can inspect detail.
- Users can use create/edit form structure with validation.
- Labor/FTE lines show role/resource, named employee support, FTE, rate, month/period, and calculated labor cost.
- No availability, capacity detection, actuals intake, invoice automation, AI recommendations, or approval workflow is introduced in this sprint.

## 9. Mandatory Visual Check
- App must be launched locally before PR.
- Workspace must render.
- Financial lines must display cleanly.
- FTE/labor lines must display cleanly.
- Detail drawer/form must be readable.
- Currency/FTE/rate values must be formatted.
- No raw JSON/debug data should appear.
- Browser console must be checked for errors.
