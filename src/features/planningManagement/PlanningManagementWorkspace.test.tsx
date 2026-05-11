import { describe, it, expect } from "vitest";
import { getPlanningManagementWorkspaceRenderModel } from "./PlanningManagementWorkspace";

// Adapter-backed workspace render model tests

describe("PlanningManagementWorkspace (adapter-backed)", () => {
  it("renders summary cards from adapter", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(Array.isArray(model.summaryCardTitles)).toBe(true);
    expect(model.summaryCardTitles.length).toBeGreaterThan(0);
    expect(model.summaryCardTitles.some(t => /planned|fte|forecast/i.test(t))).toBe(true);
  });

  it("renders actual financial planning lines (not placeholder)", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(Array.isArray(model.financialLines)).toBe(true);
    expect(model.financialLines.length).toBeGreaterThan(0);
    model.financialLines.forEach(line => {
      expect(line).toHaveProperty("projectLabel");
      expect(line).toHaveProperty("carLabel");
      expect(line).toHaveProperty("plannedAmount");
    });
  });

  it("renders actual FTE/labor planning lines (not placeholder)", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(Array.isArray(model.fteLaborLines)).toBe(true);
    expect(model.fteLaborLines.length).toBeGreaterThan(0);
    model.fteLaborLines.forEach(line => {
      expect(line).toHaveProperty("namedEmployee");
      expect(line).toHaveProperty("fte");
      expect(line).toHaveProperty("laborRate");
      expect(line).toHaveProperty("calculatedLaborCost");
    });
  });

  it("does not show placeholder text or model labels", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(model.placeholderTextPresent).toBe(false);
  });

  it("does not introduce unsupported future-scope labels", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    model.unsupportedWorkflowLabels.forEach(label => {
      expect(model.summaryCardTitles.join(" ")).not.toMatch(new RegExp(label, "i"));
    });
  });

  it("form structure is present but not dominant", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(model.formReadiness).toBeDefined();
    expect(model.formReadiness.ready).toBe(true);
  });

  it("validation and scope guard notes are present", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    expect(model.validationReadiness).toBeDefined();
    expect(typeof model.scopeGuardNotes).toBe("string");
  });
});
