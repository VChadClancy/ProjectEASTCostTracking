# Financial Model v1 – Architecture Note

## Purpose
This document describes the current financial model implemented in Project EAST Cost Tracking. It provides a concise, business-friendly overview of the model’s structure, rules, and guiding principles for Sprint 2.

## Product Framing
The financial model supports enterprise budgeting and cost tracking for technology initiatives. It enables clear separation of project delivery costs and ongoing operational (run) costs, aligning with enterprise financial management practices.

## Minimal Enterprise Design Principles
- **Clarity:** Simple, unambiguous cost classification.
- **Separation of Concerns:** Distinct handling of Delivery (project) and Run (operational) costs.
- **Extensibility:** Designed for future expansion with minimal disruption.
- **Guardrails:** Explicit rules to prevent misclassification and ensure data integrity.

## Core Financial Concepts
- **Budget Stream:** Distinguishes between Delivery and Run costs.
- **Cost Type:** Differentiates Capital (CapEx) and Expense (OpEx) costs.
- **Cost Category:** Groups costs by business-relevant categories (e.g., Labor, Hardware, Software License).

## Budget Stream: Delivery vs Run
- **Delivery costs** are project/program execution costs (e.g., implementation, build, launch).
- **Run costs** are ongoing annual operating costs (e.g., software licenses, hosting, support).

## Cost Type: Capital vs Expense
- **Capital (CapEx):** Costs that can be capitalized (mainly Delivery stream).
- **Expense (OpEx):** Costs expensed in the current period (Delivery and Run streams).
- **Run costs are Expense-only for now.**

## Cost Categories
- **Delivery Categories:** Labor, TE (Travel & Expenses), Software, Hardware.
- **Run Categories:** Software License, Support, Hosting, Maintenance, Other Run Cost.
- **Hardware is a Delivery cost category and Direct-only for now.**
- **Run categories are Direct-only for now.**

## Delivery Cost Rules
- Delivery costs may be classified as Capital or Expense, depending on the cost type and accounting policy.
- Hardware is included as a Delivery category and is tracked as Direct cost only.

## Run Cost Rules
- Run costs are classified as Expense only (no Capitalization).
- Run costs do not automatically consume project or CAR budget.
- All Run categories are tracked as Direct cost only.

## Rollup Rules
- Costs are rolled up by:
  - **Month** (for monthly reporting)
  - **Annual** (for yearly totals)
  - **Budget Stream** (Delivery, Run)
  - **Cost Type** (Capital, Expense)
  - **Category** (e.g., Labor, Hardware, Software License)
- Grand Totals are calculated for both Delivery and Run streams, and for the overall budget.

## Current Exclusions / Not Yet Included
- No indirect/pooled cost allocation.
- No automated CAR/project budget consumption for Run costs.
- No multi-year or multi-project rollup.
- No advanced cost allocation or chargeback mechanisms.
- No support for non-Direct cost categories.

## Future Model Expansion
- Add indirect/pooled cost allocation.
- Support for multi-year and multi-project rollups.
- Enable automated budget consumption for Run costs if required.
- Expand cost categories and support for indirect costs.
- Integrate with enterprise financial systems for reconciliation.

## Program Model Types (Sprint 2 Preparation)
To prepare for future enterprise program financial planning, the following model types have been introduced in the codebase (no UI or business logic changes yet):
- **Program**
- **Project**
- **CAR** (Capital Appropriation Request)
- **Workstream**
- **FiscalYear**
- **FiscalPeriod**
- **ProgramStatus**
- **ProjectStatus**
- **ApprovalStatus**

These types are designed to support future financial planning, reporting, and budgeting features. They include fields for IDs, names, descriptions, owners, start/end dates, status, fiscal year/period, and CAR financial amounts. This is a model preparation step only; no application behavior or UI is changed in this checkpoint.

---
This note serves as a reference and guardrail for ongoing and future development. Any changes to the model should be reviewed against these principles and rules.
