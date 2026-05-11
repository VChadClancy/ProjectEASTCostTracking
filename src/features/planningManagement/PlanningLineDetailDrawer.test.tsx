import { describe, it, expect } from "vitest";
import * as Drawer from "./PlanningLineDetailDrawer";
import React from "react";

const financial: Drawer.PlanningLineDetailDrawerProps["financialDetail"] = {
  lineId: "1",
  programLabel: "Program A",
  projectLabel: "Project X",
  carLabel: "CAR-123",
  lineType: "Expense",
  fiscalPeriod: "2026-Q2",
  budgetStream: "CapEx",
  costCategory: "Hardware",
  plannedAmount: 10000,
  forecastAmount: 12000,
  notes: "Test note",
  status: "Planned",
  isReadOnly: true,
  mode: "view",
  readiness: true,
};
const fteLabor: Drawer.PlanningLineDetailDrawerProps["fteLaborDetail"] = {
  lineId: "2",
  programLabel: "Program B",
  projectLabel: "Project Y",
  carLabel: "CAR-456",
  roleOrResource: "Engineer",
  namedEmployee: "Jane Doe",
  fiscalPeriod: "2026-Q3",
  fte: 1.5,
  laborRate: 85.5,
  calculatedLaborCost: 12825,
  budgetStream: "OpEx",
  costCategory: "Labor",
  notes: "Labor note",
  status: "Confirmed",
  isReadOnly: true,
  mode: "view",
  readiness: true,
};

describe("PlanningLineDetailDrawer", () => {
  it("exports component", () => {
    expect(typeof Drawer.PlanningLineDetailDrawer).toBe("function");
  });
  it("returns null when closed", () => {
    const el = Drawer.PlanningLineDetailDrawer({ open: false, onClose: () => {} });
    expect(el).toBe(null);
  });
  it("renders required fields for financial detail", () => {
    const el = Drawer.PlanningLineDetailDrawer({ open: true, onClose: () => {}, financialDetail: financial });
    const html = JSON.stringify(el);
    expect(html).toMatch(/Program/);
    expect(html).toMatch(/Project/);
    expect(html).toMatch(/CAR/);
    expect(html).toMatch(/Line Type/);
    expect(html).toMatch(/Fiscal Period/);
    expect(html).toMatch(/Budget Stream/);
    expect(html).toMatch(/Cost Category/);
    expect(html).toMatch(/Planned Amount/);
    expect(html).toMatch(/Forecast Amount/);
    expect(html).toMatch(/Test note/);
    expect(html).toMatch(/Planned/);
  });
  it("renders required fields for FTE/labor detail", () => {
    const el = Drawer.PlanningLineDetailDrawer({ open: true, onClose: () => {}, fteLaborDetail: fteLabor });
    const html = JSON.stringify(el);
    expect(html).toMatch(/Program/);
    expect(html).toMatch(/Project/);
    expect(html).toMatch(/CAR/);
    expect(html).toMatch(/Role\/Resource/);
    expect(html).toMatch(/Named Employee/);
    expect(html).toMatch(/FTE/);
    expect(html).toMatch(/Labor Rate/);
    expect(html).toMatch(/Calculated Labor Cost/);
    expect(html).toMatch(/OpEx/);
    expect(html).toMatch(/Labor/);
    expect(html).toMatch(/Labor note/);
    expect(html).toMatch(/Confirmed/);
  });
  it("renders safe empty state if no detail", () => {
    const el = Drawer.PlanningLineDetailDrawer({ open: true, onClose: () => {} });
    const html = JSON.stringify(el);
    expect(html).toMatch(/No planning line selected/);
  });
  it("does not render forbidden labels or debug", () => {
    const el = Drawer.PlanningLineDetailDrawer({ open: true, onClose: () => {}, financialDetail: financial });
    const html = JSON.stringify(el);
    expect(html).not.toMatch(/Approve|Run AI Recommendation|Import Invoice|Detect Overallocation|json|debug/i);
  });
});
