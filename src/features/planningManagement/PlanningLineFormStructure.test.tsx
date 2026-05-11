import { describe, it, expect } from "vitest";
import * as Form from "./PlanningLineFormStructure";
import React from "react";

describe("PlanningLineFormStructure", () => {
  it("exports component", () => {
    expect(typeof Form.PlanningLineFormStructure).toBe("function");
  });
  it("renders required fields for financial form", () => {
    const el = Form.PlanningLineFormStructure({ mode: "financial" });
    const html = JSON.stringify(el);
    [
      "Program",
      "Project",
      "CAR",
      "Line Type",
      "Fiscal Period",
      "Budget Stream",
      "Cost Category",
      "Planned Amount"
    ].forEach(label => expect(html).toMatch(new RegExp(label)));
  });
  it("renders required fields for FTE/labor form", () => {
    const el = Form.PlanningLineFormStructure({ mode: "fteLabor" });
    const html = JSON.stringify(el);
    [
      "Program",
      "Project",
      "CAR",
      "Role/Resource",
      "FTE",
      "Labor Rate",
      "Calculated Labor Cost"
    ].forEach(label => expect(html).toMatch(new RegExp(label)));
  });
  it("does not render forbidden labels or debug", () => {
    const el = Form.PlanningLineFormStructure({ mode: "financial" });
    const html = JSON.stringify(el);
    expect(html).not.toMatch(/Approve|Run AI Recommendation|Import Invoice|Detect Overallocation|json|debug/i);
  });
});
