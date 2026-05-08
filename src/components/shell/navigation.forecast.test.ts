import { describe, it, expect } from "vitest";
import { atlasNavigation } from "./navigation";

const forecastNavItem = atlasNavigation.find(item => item.id === "forecasting");

describe("Forecast Management navigation readiness", () => {
  it("includes Forecasting nav item with correct metadata", () => {
    expect(forecastNavItem).toBeDefined();
    expect(forecastNavItem?.label).toBe("Forecasting");
    expect(forecastNavItem?.path).toBe("/forecasting");
    expect(forecastNavItem?.description).toMatch(/forecast/i);
  });

  it("does not reference unsupported workflow labels", () => {
    const forbidden = [
      "Edit Forecast",
      "Create Forecast Version",
      "Approve Forecast",
      "Run AI Explanation"
    ];
    forbidden.forEach(label => {
      expect(forecastNavItem?.label).not.toContain(label);
      expect(forecastNavItem?.description).not.toContain(label);
    });
  });
});
