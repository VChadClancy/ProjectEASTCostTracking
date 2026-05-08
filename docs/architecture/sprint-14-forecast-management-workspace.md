# Sprint 14: Forecast Management Workspace v1 — Checkpoint 126 Scope & MED Guardrails

## 1. Sprint 14 Objective
Create a MED-aligned Forecast Management Workspace that enables users to:
- View available forecast versions
- Select current and comparison versions
- See forecast summary cards
- Review read-only snapshot lines and summaries
- Access a version comparison entry point

## 2. In Scope
- Forecast Management Workspace page model
- Forecast Management Workspace layout
- Forecast version selector
- Current vs comparison version selector
- Forecast summary cards
- Read-only snapshot summary
- Read-only snapshot line preview
- Recent versions panel
- Comparison overview panel
- Delta signal preview
- Integration with Sprint 13 forecast version service and view model adapter
- Mock default preserved
- API mode controlled

## 3. Out of Scope
- Forecast grid editing
- Create/edit/delete forecast version workflow
- Forecast approval workflow
- Actuals intake
- AI forecast explanation
- Backend API routes
- Prisma schema changes
- Production persistence

## 4. MED Guardrails
- Read-first
- Clean enough for executives
- Useful enough for finance operators
- 3–6 primary visible modules
- Progressive disclosure
- No dense spreadsheet by default
- No fake workflow buttons
- No cluttered dashboard sprawl
- Eaton Blue used as precision accent
- Neutral workspace first

## 5. Initial Workspace Sections
- Version Selector
- Forecast Summary Cards
- Current Version Metadata
- Snapshot Summary
- Snapshot Lines Preview
- Recent Versions
- Comparison Overview
- Delta Signals Preview

## 6. Runtime Guardrails
- Frontend default remains mock
- Optional API mode remains controlled
- Backend default remains mock
- Guarded Prisma FinancialLine path remains unchanged

## 7. Sprint 14 Expected Outcome
- Forecast Management exists as a new workspace surface
- It consumes Sprint 13 services and adapters
- It remains read-first and comparison-ready
- It does not yet implement heavy editing or approvals
