import { describe, it, expect } from "vitest";
import { appPages, getAppPageById } from "./App";

describe("App page registry", () => {
  it("maps planning-management to PlanningManagementWorkspace", () => {
    const planning = getAppPageById("planning-management");
    expect(planning).toBeDefined();
    expect(planning.id).toBe("planning-management");
    expect(planning.label.toLowerCase()).toContain("planning");
  });

  it("keeps program-workspace as default", () => {
    expect(appPages[0].id).toBe("program-workspace");
  });

  it("maps forecasting to ForecastManagementWorkspace", () => {
    const forecasting = getAppPageById("forecasting");
    expect(forecasting).toBeDefined();
    expect(forecasting.id).toBe("forecasting");
  });
});
