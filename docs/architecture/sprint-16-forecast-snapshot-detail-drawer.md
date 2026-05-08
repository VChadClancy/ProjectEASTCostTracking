# Sprint 16: Forecast Snapshot Detail Drawer

## 1. Sprint 16 Objective
Add a clean, read-only forecast snapshot detail drawer so users can inspect a selected snapshot line without turning the Forecasting workspace into a dense spreadsheet.

## 2. In Scope
- Forecast snapshot detail drawer model
- Selected snapshot line detail view model
- Drawer layout component
- Forecast Management integration
- Project / CAR / budget stream / cost category details
- Monthly values preview
- Forecast / actual / budget / variance context
- Delta context when available
- Version/source metadata
- Clean close/back interaction
- MED layout and Eaton/Atlas color alignment
- Mandatory visual application check before PR

## 3. Out of Scope
- Forecast editing
- Create/edit/delete forecast version workflow
- Forecast approval workflow
- Actuals intake
- AI explanation engine
- Backend API routes
- Prisma schema changes
- Production persistence

## 4. MED Guardrails
- Summary first, detail on demand
- Drawer should not feel like a spreadsheet
- No edit controls
- No approval controls
- No AI explanation controls
- Selected line detail should be readable in seconds
- Use Eaton Blue for selected/active accents
- Use white/light neutral surfaces
- Use restrained status colors

## 5. Initial Drawer Sections
- Drawer Header
- Selected Line Summary
- Financial Values
- Monthly Context
- Classification Details
- Version / Source Metadata
- Delta Context
- Close Action

## 6. Runtime Guardrails
- Frontend default remains mock-backed
- Optional API mode remains controlled
- Backend default remains mock-backed
- Guarded Prisma FinancialLine path remains unchanged

## 7. Expected Outcome
- From Forecast Management, users can inspect a forecast snapshot line in a clean, read-only drawer.
- The drawer supports detail-on-demand without introducing editing, approvals, or persistence expansion.

## 8. Mandatory Visual Check
- App must be launched locally before PR.
- Forecasting screen must render.
- Drawer must open/close.
- Snapshot detail must be readable.
- No raw JSON/debug data should appear.
- Browser console must be checked for errors.
