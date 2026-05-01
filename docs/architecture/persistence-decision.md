# Persistence Architecture Decision

## 1. Decision
EPFOS will adopt a database-backed service model. The frontend will not directly own or persist durable business data. All core financial objects will be persisted through a backend API/service layer into a governed database.

## 2. Context
Enterprise financial systems require robust data governance, auditability, and integration. Direct frontend persistence or local-first models do not meet these needs.

## 3. Architecture Pattern
A service-oriented architecture (SOA) with a clear separation between frontend, backend service, and governed database. The backend API/service layer mediates all durable data operations.

## 4. What the Frontend Owns
- UI/UX logic
- Transient client state
- API contracts and DTOs
- No durable business data

## 5. What the Backend Service Owns
- Business rules and validation
- Authorization and access control
- Orchestration of persistence
- API endpoints for all core financial objects
- Integration logic

## 6. What the Governed Database Owns
- Durable storage of financial and planning records
- Audit trails and change history
- Data integrity and backup/recovery

## 7. Why Local-First Persistence Was Not Selected
Local-first models complicate governance, auditability, and enterprise integration. They are not suitable for regulated financial data.

## 8. Why Frontend-Owned Durable State Was Not Selected
Frontend-owned persistence cannot guarantee data integrity, security, or compliance. It is not enterprise-ready.

## 9. Enterprise Readiness Benefits
- Centralized data governance
- Role-based access and auditability
- Easier integrations and reporting
- Reliable backup and recovery

## 10. Calendar-Aware Forecasting Implications
API and schema design must support time-based financial planning, forecasting, and period management. Calendar-awareness is a core requirement.

## 11. Near-Term Implementation Guidance
- Define clear API/service contracts
- Establish backend abstractions for business rules and persistence
- Do not implement full production backend yet

## 12. Current Mock-Service Transition Plan
Mock services are temporary adapters for frontend development. They will be replaced by real backend services as contracts are finalized.

## 13. Open Decisions for Later Sprints
- Final database technology selection
- Production backend implementation
- Advanced integration and reporting features

---

**Key Statements:**
- The frontend is not the system of record.
- Mock services are temporary development adapters.
- The backend service will own business rules, validation, authorization, and persistence orchestration.
- The governed database will store all durable financial and planning records.
- Calendar-aware forecasting must be considered in API and schema design.
- Sprint 4 focuses on defining architecture contracts and abstractions, not full backend implementation.
