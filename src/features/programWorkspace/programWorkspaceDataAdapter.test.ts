import { describe, it, expect, vi } from "vitest";
import * as adapter from "./programWorkspaceDataAdapter";

describe("programWorkspaceDataAdapter", () => {
  it("should export getProgramWorkspaceSummary", () => {
    expect(typeof adapter.getProgramWorkspaceSummary).toBe("function");
  });

  it("should return a defined view model using mock/default data", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: {} });
    expect(result).toBeDefined();
    expect(typeof result.programName).toBe("string");
  });

  it("should return finite numeric totals and variance values", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { totalBudget: 100, totalForecast: 80, totalActuals: 70, varianceAmount: 20, variancePercent: 20, activeProjectCount: 1, activeCarCount: 2, financialLineCount: 3, programName: "Test" } });
    expect(Number.isFinite(result.totalBudget)).toBe(true);
    expect(Number.isFinite(result.totalForecast)).toBe(true);
    expect(Number.isFinite(result.totalActuals)).toBe(true);
    expect(Number.isFinite(result.varianceAmount)).toBe(true);
    expect(Number.isFinite(result.variancePercent)).toBe(true);
  });

  it("should handle empty data safely", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: null });
    expect(result).toBeDefined();
    expect(result.programName).toBe("");
    expect(result.totalBudget).toBe(0);
    expect(result.totalForecast).toBe(0);
    expect(result.totalActuals).toBe(0);
    expect(result.varianceAmount).toBe(0);
    expect(result.variancePercent).toBe(0);
    expect(result.activeProjectCount).toBe(0);
    expect(result.activeCarCount).toBe(0);
    expect(result.financialLineCount).toBe(0);
  });

  it("should not trigger fetch/network calls in default mock mode", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await adapter.getProgramWorkspaceSummary({ summaryData: {} });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
