# Sprint 12: Program Financial Workspace v1

## 1. Sprint 12 Objective
- Build the first MED-aligned operating workspace for program financial visibility.
- Users should quickly understand program financial position across programs, projects, CARs, financial lines, funding, and variance signals.

## 2. In Scope
- Program Workspace page structure
- Financial summary cards
- Financial line preview/list
- Project/CAR overview sections
- Funding / budget stream visibility
- Basic filter/search foundation
- MED workspace cards
- Clean empty/loading/error states
- Preserve mock default
- Preserve API mode

## 3. Out of Scope
- Full financial line create/edit workflow
- Actuals intake engine
- Document review workspace
- Dashboard redesign
- AI implementation
- Auth/RBAC
- Approval workflow
- Production deployment

## 4. MED Design Guardrails
- One primary purpose: program financial operating workspace
- No dense ERP-style screen
- No fake dashboard sprawl
- 3–6 primary modules visible by default
- Progressive disclosure for details
- Use Eaton Blue as precision accent only
- Neutral premium workspace first

## 5. Recommended Workspace Sections
- Program financial summary
- Active projects / CARs
- Financial line preview
- Budget stream / funding view
- Variance signals
- Future actuals intake readiness marker

## 6. Current Runtime Behavior
- Default frontend mode remains mock
- Optional frontend API mode remains available
- Backend default remains mock
- Guarded local Prisma FinancialLine path remains unchanged

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
