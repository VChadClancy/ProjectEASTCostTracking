# Sprint 13: Forecast Versioning + Delta Analysis

## 1. Sprint 13 Objective
Build the data model and service foundation for saved monthly forecast versions and delta analysis.

## 2. Locked Capability
- **Forecast Versioning + Delta Analysis**
- Project forecast versions
- Program budget forecast versions
- Monthly forecast snapshots
- Baseline / current / prior version classification
- Version-to-version comparison
- Baseline-to-current comparison
- Forecast vs actual comparison readiness
- Project-to-program rollup comparison readiness

## 3. Required Behavior
- Save monthly forecast snapshots
- Retrieve forecast versions
- Compare two forecast versions
- Calculate amount delta
- Calculate percent delta
- Calculate monthly movement
- Calculate cumulative movement
- Analyze delta by project, CAR, budget stream, and cost category

## 4. Example Version Names
- Project Forecast — January Version
- Project Forecast — February Version
- Program Budget Forecast — January Version
- Program Budget Forecast — February Version

## 5. In Scope for Sprint 13
- Typed frontend/domain forecast version model if appropriate
- Backend/shared forecast version types if appropriate
- Repository contracts
- Mock repository implementation
- Service layer for save/retrieve/compare
- Delta calculation helper/service
- Tests for save/retrieve/compare/delta behavior
- Documentation updates

## 6. Out of Scope for Sprint 13
- Full Forecast Management UI
- Forecast grid editing
- Delta visualization UI
- Approval workflow
- Actuals intake
- AI explanation engine
- Production persistence expansion unless explicitly required
- `schema.prisma` changes unless specifically approved later in the sprint

## 7. MED Product Guardrails
- Forecast versioning is a control capability, not a cluttered version list.
- UI later should use clean version selectors, comparison cards, and progressive disclosure.
- Delta analysis should support executive insight and operator drill-down.

## 8. Runtime Guardrails
- Frontend default remains mock
- Optional frontend API mode remains available
- Backend default remains mock
- Guarded Prisma FinancialLine path remains unchanged

## 9. Engineering Rules
- Do not add dependencies.
- Do not change `package.json`/`package-lock.json`.
- Do not change GitHub Actions.
- Do not implement UI in this checkpoint.
- Do not implement AI behavior.
- Do not implement actuals intake.
