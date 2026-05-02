# Database Technology Decision

## 1. Decision
EPFOS will use **PostgreSQL** as the governed relational application database and **Prisma** as the TypeScript ORM/database access layer.

**Architecture Path:**
Backend Service/API → Repository Layer → Prisma → PostgreSQL

## 2. Context
This document records the database technology decision for the EPFOS backend. It is an architecture checkpoint only—no implementation is included in this sprint. The backend currently uses mock data; this will remain until the repository and database layers are implemented in a future sprint.

## 3. Why PostgreSQL
- Mature, open-source, and widely adopted relational database
- Strong support for transactional integrity, relational modeling, and SQL standards
- Robust ecosystem, tooling, and cloud support
- Well-suited for core EPFOS entities: Program, Project, CAR, FinancialLine, FiscalPeriod, AuditEvent, and calendar-aware forecasting
- Supports future needs for reporting, analytics, and data governance

## 4. Why Prisma
- TypeScript-native ORM and database toolkit
- Strong type safety and autocompletion for models and queries
- Schema modeling, migration workflows, and repository pattern support
- Active community and documentation
- Enables clean separation between business logic and data access

## 5. How this fits the EPFOS architecture
- The backend will introduce a **Repository Layer** that abstracts data access
- Prisma will be used within repositories to interact with PostgreSQL
- The service and controller layers will remain decoupled from database details
- This enables future replacement or extension of the data layer with minimal impact

## 6. Relationship to the repository layer
- The repository layer will be the only part of the backend that directly uses Prisma
- All data access (read/write) will go through repositories
- This supports testability, maintainability, and future extensibility

## 7. What this enables later
- Real database persistence for all core entities
- Transactional workflows and auditability
- Data migrations and schema evolution
- Integration with reporting and analytics tools
- Secure, governed data management

## 8. What is intentionally deferred
- **No Prisma or PostgreSQL implementation in this checkpoint**
- Mock data remains active until repository/database implementation is ready
- The frontend remains disconnected from backend persistence for now
- No changes to application code, backend code, tests, or CI/CD

## 9. MED guardrails
- All database access must go through the repository layer
- No direct SQL or Prisma usage outside repositories
- Database schema changes must be tracked and reviewed
- Data migrations must be managed via Prisma workflows
- Security, audit, and compliance requirements will be addressed in future sprints

## 10. Open decisions for later
- Database deployment and hosting strategy (cloud, managed, on-premises)
- Initial schema design and migration plan
- Data seeding and migration from mock data
- Backup, recovery, and high-availability setup
- Performance optimization and monitoring
- Authentication and authorization integration

---

**This is an architecture decision document only. No implementation is included in this checkpoint.**
