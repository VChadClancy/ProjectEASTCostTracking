# Sprint 12: Program Financial Workspace v1

## 1. Sprint 12 Objective
- Build the first MED-aligned operating workspace for program financial visibility.
- Users should quickly understand program financial position across programs, projects, CARs, financial lines, funding, and variance signals.

## 2. What Program Workspace v1 Now Includes
- **Summary cards**: Top-level program financials (budget, forecast, actuals, variance, etc.)
- **Financial line preview**: Preview of top financial lines for the program
- **Active Projects / CARs overview**: Rollup and overview of active projects and CARs
- **Budget stream / funding view**: Funding breakdown by budget stream
- **Variance signals**: Key variance signals at program, project/CAR, and budget stream levels
- **Actuals intake readiness marker**: Future/placeholder indicators for actuals intake features

## 3. Current Runtime Behavior
- **Frontend default remains mock**: The default frontend mode uses mock data
- **Optional API mode remains available**: API mode can be enabled for integration
- **Backend default remains mock**: Backend also defaults to mock data
- **Guarded Prisma FinancialLine path remains unchanged**: Direct database access is still protected and not default

## 4. Scope Guard (Explicitly Out of Scope for Sprint 12)
- No financial line create/edit/delete workflow
- No actuals intake upload or processing
- No OCR or document extraction
- No actuals posting
- No AI explanation engine
- No project scheduling/Gantt
- No procurement/accounting workflow

## 5. Intended Sprint 13 Handoff Options
- **Option A: Financial Line Management v1**
  - Enable create/edit/delete for financial lines and controlled planning data maintenance
- **Option B: Forecast Management Workspace v1**
  - Focus on planning/forecast user experience before enabling edits
- **Option C: Actuals Source Configuration Foundation**
  - Accelerate intake engine foundation and source configuration

## 6. Recommendation for Next Sprint
- **Recommended next sprint is Financial Line Management v1** if the goal is to enable controlled planning data maintenance and editing.
- **Recommended next sprint is Forecast Management Workspace v1** if the focus is on planning/forecast UX before enabling edits.
- **Recommended next sprint is Actuals Source Configuration** if the priority is to accelerate the actuals intake engine foundation.

## 7. Engineering Rules
- Use existing AtlasAppShell.
- Use atlasTheme tokens.
- Use reusable MED shell components where practical.
- Do not add dependencies.
- Do not change backend code unless explicitly required later.
- Do not change schema.prisma.
- Do not change package.json/package-lock.json.
- Do not change GitHub Actions.

## 8. Sprint 12 Expected Outcome
- A clean Program Workspace v1 that becomes the central operating surface for later Forecasting, Actuals Intake, Timeline, Variance, and AI workflows.
