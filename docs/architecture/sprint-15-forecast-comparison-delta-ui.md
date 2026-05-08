# Sprint 15: Forecast Comparison / Delta Analysis UI v1 — Checkpoint 136 Scope & MED Guardrails

## 1. Sprint 15 Objective
Create a MED-aligned forecast comparison experience that lets users compare two forecast versions and quickly understand material movement.

## 2. In Scope
- Forecast Comparison page/section model
- Current vs comparison version selector refinement
- Delta summary cards
- Monthly movement summary
- Grouped delta panels
- Grouped deltas by project
- Grouped deltas by CAR
- Grouped deltas by budget stream
- Grouped deltas by cost category
- Delta signal detail section
- Read-only comparison preview
- Integration with Sprint 13 delta service
- Integration with Sprint 14 Forecast Management Workspace
- Mock default preserved
- API mode controlled

## 3. Out of Scope
- Forecast editing
- Create/edit/delete forecast version workflow
- Forecast approval workflow
- AI explanation engine
- Actuals intake
- Backend API routes
- Prisma schema changes
- Production persistence

## 4. MED Guardrails
- Executive-friendly summary first
- Clear what changed / why it matters
- No dense spreadsheet by default
- No edit buttons
- No fake approval controls
- No AI explanation controls yet
- Progressive disclosure for grouped details
- Eaton Blue as precision accent
- Severity colors only where meaningful

## 5. Initial Comparison Sections
- Comparison Header
- Version Pair Selector
- Delta Summary Cards
- Monthly Movement Summary
- Grouped Delta Panels
- Delta Signals Detail
- Read-Only Comparison Preview

## 6. Runtime Guardrails
- Frontend default remains mock-backed
- Optional API mode remains controlled
- Backend default remains mock-backed
- Guarded Prisma FinancialLine path remains unchanged

## 7. Sprint 15 Expected Outcome
- Users can see forecast comparison/delta analysis from the Forecast Management Workspace.
- The comparison UI consumes existing forecast version/delta services.
- No editing, approval, AI, or persistence expansion is introduced.
